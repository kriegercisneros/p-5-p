import{ useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadFile } from "react-s3"
import trial_1 from "../../../server/ai_images_download/trial_1.png"
const S3_BUCKET = "phase-5-images";
const REGION = "us-west-2";

export default function Sketch({user}){
    const [img, setimg]=useState(false)
    const [imgfn,setimgfn]=useState('')
    const [workingAiImg, setWorkingAiImg]=useState(trial_1)
    //not sure if i even need this state above or the state below
    //sketchid=state of the sketch id that was just posted
    const [sketchid, setsketchid]=useState (undefined)
    //imgid=state of the image id that was just posted
    //this one captures the state that i need so user id can persist
    //between refreshes
    const [userid, setUserid]=useState(undefined)
    const[updatedimg, setupdatedimg]=useState(false)
    const [ak, setak]=useState(null)
    const[sak, setsak]=useState(null)
    const[isDrawing, setIsDrawing]=useState(false)
    const[prompt, setprompt]=useState('')
    const [preset, setpreset]=useState('')
    const [clip, setclip]=useState('')
    const [strength, setstrength]=useState(0)
    const [steps, setsteps]=useState(0)
    const [cfg, setcfg]=useState(0)

    const canvasRef=useRef(null)
    const contextRef=useRef(null)

    console.log(userid)
    console.log(imgfn)
    console.log(sketchid)
    
    const config = {
        bucketName: S3_BUCKET,
        region: REGION, 
        accessKeyId:ak,
        secretAccessKey:sak,
    };
    const nav=useNavigate()

    //fetching the access keys for AWS
    fetch('/api/aws-keys')
        .then(resp=>resp.json())
        .then(data=>{
            setak(data.access_key); 
            setsak(data.secret_access_key)})
//getting the current name of the image sent to aws)
    useEffect(()=>{
        fetch('/api/imagesession')
        .then(r=>r.json())
        .then(data=>{
            setimgfn(data['message'])
            })
    }, [])
//setting the current state of the userid
    useEffect(()=>{
        fetch('api/info')
        .then(r=>r.json())
        .then(data=>{
            setUserid(data['id'])
        })
    }, [])

    useEffect(()=>{
        const canvas = canvasRef.current;
        canvas.width=512;
        canvas.height=512;
        canvas.style.width='512px' ;
        canvas.style.height='512px' ;

        // canvas.width = window.innerWidth *2;
        // canvas.height = window.innerHeight *2;
        // canvas.style.width = `${window.innerWidth}px`;
        // canvas.style.height = `${window.innerHeight}px`;

        const context=canvas.getContext('2d')
        context.scale(1,1)
        context.lineCap = 'round'
        context.strokeStyle = 'black'
        context.lineWidth = 2
        contextRef.current = context
    }, [])
    const startDrawing=({nativeEvent})=>{
        const {offsetX, offsetY}=nativeEvent
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
        setIsDrawing(true)
    }
    const finishDrawing=()=>{
        contextRef.current.beginPath()
        setIsDrawing(false)
    }
    const draw = ({nativeEvent})=>{
        if(!isDrawing){
            return
        }
        const{offsetX, offsetY} = nativeEvent 
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    const saveSketch=()=>{
        const canvas=canvasRef.current
        setimg(false)
        //taking the canvas image and converting it into a blob
        canvas.toBlob((myblob)=>{
            const formData = new FormData();
            formData.append('name', myblob, 'sketch.png');
            formData.append('text_prompts[0][text]', prompt);
            formData.append('style_preset', preset);
            formData.append('clip_guidance_preset', clip)
            formData.append('image_strength', strength)
            formData.append('steps', steps)
            formData.append('cfg_scale', cfg)
            handleUpload(myblob);
            //above, send blob to the f/n to upload to aws.  then 
            //sends the blob to py to contact api to gen upload
            const response = fetch('api/generate-ai', {
                method: 'POST',
                body: formData,
            });
            if(response.ok){
                console.log('saved sketch')
                fetch('/api/imagesession')
                .then(r=>r.json())
                .then(data=>{setimgfn(data['message'])})
                .then(console.log('Image uploaded successfully'));
            } else {
                console.error('Image upload failed');
            }
            //sets the current image in state so i can display it
            setWorkingAiImg(trial_1)}
            ), 'image/png'}
    //uploads the sketch with a unique name to aws
    const handleUpload = async (myblob) => {
        // console.log(myblob);
        const uniqueKey =`sketch-${Date.now()}.png`;
        const fileWithUniqueName = new File([myblob], uniqueKey, { type: myblob.type });
        console.log(fileWithUniqueName)
        //this is the call to post the name to the database with unique key
        dbPost(uniqueKey);
        //this is the f/n to upload to aws with the unique name and the configuration file
        uploadFile(fileWithUniqueName, config)
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
    };

    const dbPost = (uniqueKey) =>{
        fetch('api/posting_sketches', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                filename:uniqueKey, 
                user_id:user
            })
          })
          .then(r=>r.json())
          .then(data=>{setsketchid(data.sketch_id)})
    }
    //maybe add this in to change text prompt
    
    function showImage(e){
        e.preventDefault()
        setimg(true)
        console.log('show ai image')
    }
    //function that saves the ai image name to the database
    function saveImage(){
        console.log(userid)
        fetch('api/saveimage', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                user_id:userid,
                original_filename:'ofn',
                filename:imgfn,
                bucket:'phase-5-images',
                region:'us-west-2'
            })
        })
        .then(r=>r.json())
        .then(data=>{saveInstance(data.image_id); setupdatedimg(true); if(updatedimg){nav("/view")}})
    }
    //saves the sketch id and image id to the table images
    function saveInstance(imgid){
        fetch('api/saveinstance', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                user_id:userid,
                images_id: imgid,
                sketches_id:sketchid,
                test:"stringtest"
            })
        })
        .then(r=>r.json())
        .then(data=>console.log(data))
    }

//listeners for the form data
    const textChange=(event) => {
        setprompt(event.target.value);
    };
    const handlePresetChange = (event) => {
        setpreset(event.target.value);
    };
    const handleClipChange = (event) => {
        setclip(event.target.value);
    };
    const handleStrengthChange = (event) => {
        setstrength(event.target.value);
    };
    const handleStepChange = (event) => {
        setsteps(event.target.value);
    };
    const handlecfgChange = (event) => {
        setcfg(event.target.value);
    };

    return(
        <>
            <div>Sketch</div>
            <canvas
                style={{ border: '6px solid magenta' }}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onDoubleClick={clearCanvas}
                ref={canvasRef}
            />
            {/* <button onClick={saveSketch}>Save Sketch</button> */}
            <div>
                <div></div>
                <input type="text" placeholder="prompt" onChange={textChange}></input>
                <div>
                    <label htmlFor="my-dropdown">Style Preset:</label>
                    <select id="my-dropdown" value={preset} onChange={handlePresetChange}>
                        <option>select...</option>
                        <option value="enhance">enhance</option>
                        <option value="anime">anime</option>
                        <option value="photographic">photographic</option>
                        <option value="digital-art">digital-art</option>
                        <option value="comic-book">comic-book</option>
                        <option value="fantasy-art">fantasy-art</option>
                        <option value="line-art">line-art</option>
                        <option value="analog-film">analog-film</option>
                        <option value="neon-punk">neon-punk</option>
                        <option value="isometric">isometric</option>
                        <option value="low-poly">low-poly</option>
                        <option value="origami">origami</option>
                        <option value="modeling-compound">modeling-compound</option>
                        <option value="cinematic">cinematic</option>
                        <option value="3d-model">3d-model</option>
                        <option value="pixel-art">pixel-art</option>
                        <option value="tile-texture">tile-texture</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="clip-dropdown">Clip Preset:</label>
                    <select id="clip-dropdown" value={clip} onChange={handleClipChange}>
                        <option value="none">none</option>
                        <option value="FAST_BLUE">FAST_BLUE</option>
                        <option value="FAST_GREEN">FAST_GREEN</option>
                        <option value="SIMPLE">SIMPLE</option>
                        <option value="SLOW">SLOW</option>
                        <option value="SLOWER">SLOWER</option>
                        <option value="SLOWEST">SLOWEST</option>
                    </select>
                </div>
                <label htmlFor='strength'>Image Strength</label>
                <input id='strength' type="number" step="0.001" min="0" max="1" value={strength} onChange={handleStrengthChange} />
                <label htmlFor='step'>Steps</label>
                <input id='step' type="number" step="1" min="0" max="150" value={steps} onChange={handleStepChange} />
                <label htmlFor='cfg'>CFG Scale</label>
                <input id='cfg' type="number" step="1" min="0" max="35" value={cfg} onChange={handlecfgChange} />
                <button onClick={saveSketch}>Save Sketch</button>
                <button onClick={showImage}>Show Me the Image!</button>
            </div>
            {img ? 
            (<div>
                <img src={trial_1}/>
                <br></br>
                <button onClick={saveImage}>save image</button>
            </div>):(<p>show image</p>)
            }
            <p>1. `image_strength`: This parameter controls the strength of the input image in the final output. Setting this to a higher value will result in a stronger influence of the input image in the final output. 

2. `init_image_mode`: This parameter controls how the input image should be used to generate the output. Setting this to "IMAGE_STRENGTH" will result in a blending of the input image with the generated output. Setting it to "NOISE" will ignore the input image and generate an image purely from noise. 

3. `text_prompts`: This parameter is used to provide text prompts to the AI model. The AI will use these prompts to generate an image that is related to the provided text. 

4. `cfg_scale`: This parameter controls the scale of the model configuration. A higher value will result in a more complex and detailed output, but may also require more computational resources. 

5. `clip_guidance_preset`: This parameter is used to provide additional guidance to the model using the CLIP model. The CLIP model is a machine learning model that can understand the context of an image and provide additional guidance to the image generation process. 

6. `style_preset`: This parameter is used to provide a pre-defined style to the generated image. Setting this to a specific style will result in an image that has characteristics of that style. 

7. `samples`: This parameter controls the number of samples the model generates to arrive at the final image. Increasing this number can result in a more accurate and detailed output, but may also require more computational resources. 

8. `steps`: This parameter controls the number of steps the model takes to generate the final image. Increasing this number can result in a more accurate and detailed output, but may also require more computational resources.</p>
        </>
    )
}