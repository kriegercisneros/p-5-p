import{ useRef, useEffect, useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadFile } from "react-s3"
import trial_1 from "../../../server/ai_images_download/trial_1.png"
import testing0 from "../../../server/ai_images_upload/testing0.png"
const S3_BUCKET = "phase-5-images";
const REGION = "us-west-2";
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

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
    const[negprompt, setnegprompt]=useState('')
    const [preset, setpreset]=useState('')
    const [clip, setclip]=useState('')
    const [strength, setstrength]=useState(0)
    const [end, setend]=useState(0)
    const [steps, setsteps]=useState(0)
    const [cfg, setcfg]=useState(0)
    const [open, setOpen]=useState(false)
    const [showGeneratedImage, setShowGeneratedImage] = useState(false);

    //this is the one for the button 
    const [showtextimg, setshowtextimg]=useState(false)
    //this is the one for the image display, like when the button is clicked
    const [showtextimgdisplay, setshowtextimgdisplay]=useState(false)

    const [showimageimg, setshowimageimg]=useState(false)


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

    const handleLogout = () => {
        fetch('api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(() => {
          nav('/login'); // Navigate to login page after logout
        })
        .catch(error => console.log(error)); // Handle any errors
      }

    //fetching the access keys for AWS
    fetch('/api/aws-keys')
        .then(resp=>resp.json())
        .then(data=>{
            setak(data.access_key); 
            setsak(data.secret_access_key)})
//getting the current name of the image sent to aws)
    // useEffect(()=>{
    //     fetch('/api/imagesession')
    //     .then(r=>r.json())
    //     .then(data=>{
    //         setimgfn(data['message'])
    //         })
    // }, [])
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
    
    const generateaiimage=()=>{
        fetch('/api/generateimgtoimg',{
            method:'POST'
        })
        .then(r=>r.json())
        .then(data=>{setimgfn(data.message); (setshowimageimg(true))})
    }

    const generateaitext = ()=>{
        const formData = new FormData();
        formData.append("text_prompts[0][text]", prompt);
        formData.append("style_preset", preset);
        formData.append("clip_guidance_preset", clip);
        // formData.append("steps", steps);
        // formData.append("cfg_scale", cfg);

        fetch('/api/generateaitext',{
            method:'POST',
            body:formData
        })
        .then(r=>r.json())
        .then((data)=>{setimgfn(data.message);(setshowtextimg(true))})
    }

    const saveSketch = async () => {
        const canvas = canvasRef.current;
        setimg(false);
        //taking the canvas image and converting it into a blob
        canvas.toBlob(async (myblob) => {
          const formData = new FormData();
          formData.append("name", myblob, "sketch.png");
          formData.append("text_prompts[0][text]", prompt);
          formData.append("text_prompts[1][text]", negprompt)
          formData.append("style_preset", preset);
          formData.append("clip_guidance_preset", clip);
        //   formData.append("image_strength", strength);
          formData.append("steps", steps);
          formData.append("cfg_scale", cfg);
          formData.append("step_schedule_start", strength);
          formData.append("step_schedule_end", end)

          handleUpload(myblob);
          //above, send blob to the f/n to upload to aws.  then
          //sends the blob to py to contact api to gen upload
          const response = await fetch("api/generate-ai", {
            method: "POST",
            body: formData,
          });
          if (response.ok) {
            console.log("saved sketch");
            fetch("/api/getimagesession")
              .then((r) => r.json())
              .then((data) => {
                setimgfn(data["message"]);
                setShowGeneratedImage(true)
              })
              .then(console.log("Image uploaded successfully"));
          } else {
            console.error("Image upload failed");
          }
          //sets the current image in state so i can display it
          setWorkingAiImg(trial_1);
        }, "image/png");
      };
      
    //uploads the sketch with a unique name to aws
    const handleUpload = async (myblob) => {
        // console.log(myblob);
        const uniqueKey =`sketch-${Date.now()}.png`;
      
        const fileWithUniqueName = new File([myblob], uniqueKey, { type: myblob.type });
       
        //this is the call to post the name to the database with unique key
        dbPost(uniqueKey);
        // console.log(uniqueKey)
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
                user_id:userid
            })
          })
          .then(r=>r.json())
          .then(data=>setsketchid(data.sketch_id))
    }
    //maybe add this in to change text prompt
    
    function showImage(e){
        e.preventDefault()
        setimg(true)
        console.log('show ai image')
    }

    function showtextimage(e){
        e.preventDefault()
        setshowtextimgdisplay(true)
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
                region:'us-west-2', 
                text:prompt, 
                // negtext:negprompt,
                preset:preset, 
                clip:clip,
                start:strength,
                end:end,
                steps:steps, 
                cfg:cfg
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
    // const negativeTextChange=(event) => {
    //     setnegprompt(event.target.value);
    // };
    const handlePresetChange = (event) => {
        setpreset(event.target.value);
    };
    const handleClipChange = (event) => {
        setclip(event.target.value);
    };
    const handleStrengthChange = (event) => {
        setstrength(event.target.value);
    };
    const handleendchange = (event) => {
        setend(event.target.value);
    };
    const handleStepChange = (event) => {
        setsteps(event.target.value);
    };
    const handlecfgChange = (event) => {
        setcfg(event.target.value);
    };

      

    return(
<>
    <div style={{
        background: 'rgba(139, 131, 120, 0.5)',
        // backgroundImage: `url("https://restoredecorandmore.com/wp-content/uploads/2022/05/aesthetic-boho-iPhone-wallpaper-43.jpg")`,
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'contain',
        height:'100%',
        width:'100vw',
        position: 'relative',
        borderRadius: '20px', 
        padding:'20px',
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
    }}>
        <div className='can_prompt_p_wrapper' style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        justifyContent: "center",
            // bottomMargin:'20px',
        }}>
        <div style={{
          backgroundColor: 'rgba(139, 131, 120, 0.5)',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent:'space-evenly',
          width: '100%',
          borderRadius:'20px', 
          position:'absolute',
          top:0,
          height:'80px'
        }}>
        <button 
          onClick={()=>nav('/view')} 
          className="flex justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-lg font-regular leading-6 text-grey shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          style={{}}
          >Creations</button>
        <button
          className="flex justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-lg font-regular leading-6 text-grey shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          onClick={handleLogout} 
        >Logout</button>
        <img className="h-14 w-14 rounded-full border" src={`https://phase-5-images.s3.us-west-2.amazonaws.com/download.jpg`} />
        </div>
        {/* <h1 className="mt-10 text-center text-9xl " style={{color:'#e6bfb3'}}>. . . Sketching . . .</h1> */}
        <div style={{ paddingTop: '90px', width: '100%' }}>
            {/* this is for the text to image model */}
            <button
                className="flex w-full justify-center rounded-md bg-yellow-600 py-1.5 text-lg font-regular leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                onClick={generateaitext}
            >
                Text to Text Model
            </button>
            {showtextimg? (
                    <button 
                    onClick={showtextimage}
                    className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                    >Show Me the Text Image!</button>):(<h1></h1>)}
            {showtextimgdisplay?(<div>
                <img src={testing0}/>
                <br></br>
                <button onClick={saveImage}>save image</button>
            </div>):(<h1></h1>)}
            {/* this is for the image to image model */}
            <button onClick={generateaiimage}>Image to Image</button>
            {showimageimg ? (
                <button
                onClick={showtextimage}
                >Show me the Image!</button>):(<h1></h1>)}
            {showtextimgdisplay?(<div>
                <img src={testing0}/>
                <br></br>
                <button onClick={saveImage}>save image</button>
                </div>):(<h1></h1>)}

        </div>
            <div className='mt-10' style={{
                display:'flex',
                width:'100%',
                justifyContent:'space-evenly',
                flexDirection:'row-reverse',
                // paddingTop:'0px'
                // bottomMargin:'20px',
            }}>
                {/* {!showGeneratedImage ? ( */}
                {img ? 
            (<div>
                <img src={trial_1}/>
                <br></br>
                <button onClick={saveImage}>save image</button>
            </div>):(<div className="canvas-wrapper">
                    <canvas
                        style={{ 
                            border: '6px solid #333',
                            position:'relative',
                            backgroundColor:'white',
                            borderRadius:'20px',
                            display:'inline-block' 
                        }}
                        onMouseDown={startDrawing}
                        onMouseUp={finishDrawing}
                        onMouseMove={draw}
                        onDoubleClick={clearCanvas}
                        ref={canvasRef}
                    />
                </div>)
            }
                
                <div className="params" style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <button 
                    onClick={() => setOpen(!open)} 
                    className="flex w-full justify-center rounded-md bg-yellow-600 px-10 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                    style={{backgroundColor:'#e6bfb3', borderRadius:'30px'}}
                    >
                What are these inputs for?
                </button>
                <label htmlFor="clip-dropdown">Text Prompt:</label>
                        
                    <input 
                        type="text" 
                        placeholder="prompt" 
                        onChange={textChange} 
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    ></input>
                {/* <label htmlFor="clip-dropdown">Negative Prompt:</label>
                        
                        <input 
                            type="text" 
                            placeholder="negative prompt" 
                            onChange={negativeTextChange} 
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                        ></input> */}
                    <div>
                        <label htmlFor="my-dropdown">Style Preset:</label>
                        <select 
                            id="my-dropdown" 
                            value={preset} 
                            onChange={handlePresetChange}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                            >
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
                        <select 
                            id="clip-dropdown" 
                            value={clip} 
                            onChange={handleClipChange}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                            >
                            <option value="none">none</option>
                            <option value="FAST_BLUE">FAST_BLUE</option>
                            <option value="FAST_GREEN">FAST_GREEN</option>
                            <option value="SIMPLE">SIMPLE</option>
                            <option value="SLOW">SLOW</option>
                            <option value="SLOWER">SLOWER</option>
                            <option value="SLOWEST">SLOWEST</option>
                        </select>
                    </div>
                    {/* <label htmlFor='strength'>Image Strength:</label>
                    <input 
                        id='strength' 
                        type="number" 
                        step="0.001" 
                        min="0" 
                        max="1" 
                        value={strength} 
                        onChange={handleStrengthChange} 
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                        
                        /> */}
                    <label htmlFor='start'>Step Schedule Start:</label>
                    <input 
                        id='start' 
                        type="number" 
                        step="0.05" 
                        min="0.05" 
                        max="1" 
                        value={strength} 
                        onChange={handleStrengthChange} 
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                        
                        />
                    <label htmlFor='end'>Step Schedule End:</label>
                    <input 
                        id='end' 
                        type="number" 
                        step="0.05" 
                        min=".05" 
                        max="1" 
                        value={end} 
                        onChange={handleendchange} 
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                        
                        />
                    <label htmlFor='step'>Steps:</label>
                    <input 
                        id='step' 
                        type="number" 
                        step="1" 
                        min="15" 
                        max="150" 
                        value={steps} 
                        onChange={handleStepChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                        />
                    <label htmlFor='cfg'>CFG Scale:</label>
                    <input 
                        id='cfg' 
                        type="number" 
                        step="1" 
                        min="1" 
                        max="35" 
                        value={cfg} 
                        onChange={handlecfgChange} 
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                        />
                    <button 
                        onClick={saveSketch}
                        className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                    >Generate Image</button>
                    {showGeneratedImage? (
                    <button 
                    onClick={showImage}
                    className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                    >Show Me the Image!</button>):(<h1></h1>)}
                </div>
            </div>


            <div style={{display:'flex'}}>
            <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-4xl leading-6 text-gray-700">
                        Parameter Descriptions
                      </Dialog.Title>
                    </div>
                    <div className="mt-4 relative flex-1 px-4 sm:px-6">
                    <div>
                        <h1 className="mt-10 text-left text-3xl leading-9 tracking-tight" style={{color:'#e6bfb3'}}>Text Prompts</h1> 
                            <p>Provides text prompts to the AI model. The AI will use these prompts to generate an image that is related to the provided text. </p>
                        <h1 className="mt-10 text-left text-3xl leading-9 tracking-tight" style={{color:'#e6bfb3'}}>Style Preset</h1> 
                            <p>Provides a pre-defined style to the generated image.</p> 
                        <h1 className="mt-10 text-left text-3xl leading-9 tracking-tight" style={{color:'#e6bfb3'}}>Clip Guidance</h1> 
                            <p>Provides additional guidance to the model. The CLIP model is a machine learning model that can understand the context of an image and provide additional guidance to the image generation process.</p> 
                        <h1 className="mt-4 text-left text-3xl leading-9 tracking-tight" style={{color:'#e6bfb3'}}>Image Strength</h1> 
                            <p>Controls the strength of the sketch on the AI model. Higher the value, stronger the influence.</p> 
                        {/* <h1 className="mt-10 text-left text-3xl leading-9 tracking-tight" style={{color:'#e6bfb3'}}>Init Image Mode</h1> 
                            <p>This parameter controls how the input image should be used to generate the output. Setting this to "IMAGE_STRENGTH" will result in a blending of the input image with the generated output. Setting it to "NOISE" will ignore the input image and generate an image purely from noise.</p>  */}
                        <h1 className="mt-10 text-left text-3xl leading-9 tracking-tight" style={{color:'#e6bfb3'}}>Steps</h1> 
                            <p>Increasing steps can result in a more accurate and detailed output, but may also require more computational resources.</p>
                        <h1 className="mt-10 text-left text-3xl leading-9 tracking-tight" style={{color:'#e6bfb3'}}>CFG Scale</h1> 
                            <p>The scale of the model configuration. A higher value will result in a more complex and detailed output, but may also require more computational resources (mo dollas).</p>
                    </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
                

            </div>
</div>
</div>
        </>
    )
}