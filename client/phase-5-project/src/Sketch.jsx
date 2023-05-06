
import React from 'react'
import{ useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadFile } from "react-s3"
// import image from "../../server/ai_images_download/trial_1.png"
import trial_1 from "../../../server/ai_images_download/trial_1.png"
const S3_BUCKET = "phase-5-images";
const REGION = "us-west-2";


export default function Sketch({user}){
    const [img, setimg]=useState(false)
    const [imgfn,setimgfn]=useState('')
    const [workingAiImg, setWorkingAiImg]=useState(trial_1)
    //not sure if i even need this state above or the state below
    const [sketch, setSketch]=useState('')
    //sketchid=state of the sketch id that was just posted
    const [sketchid, setsketchid]=useState (undefined)
    //imgid=state of the image id that was just posted
    // const [imgid, setimgid]=useState(undefined)
    //this one captures the state that i need so user id can persist
    //between refreshes
    const [userid, setUserid]=useState(undefined)

    const[updatedimg, setupdatedimg]=useState(false)

    console.log(userid)
    console.log(imgfn)
    // console.log(imgid)
    console.log(sketchid)
    const nav=useNavigate()
    fetch('/api/aws-keys')
        .then(resp=>resp.json())
        .then(data=>{
            setak(data.access_key); 
            setsak(data.secret_access_key)})
    const [ak, setak]=useState(null)
    const[sak, setsak]=useState(null)

    const config = {
        bucketName: S3_BUCKET,
        region: REGION, 
        accessKeyId:ak,
        secretAccessKey:sak,
    };

    const canvasRef=useRef(null)
    const contextRef=useRef(null)
    const[isDrawing, setIsDrawing]=useState(false)

    useEffect(()=>{
        fetch('/api/imagesession')
        .then(r=>r.json())
        .then(data=>{
            setimgfn(data['message'])
            })
    }, [])

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
          // Set the canvas width and height to the window width and height
        // canvas.width = window.innerWidth *2;
        // canvas.height = window.innerHeight *2;

        // Set the canvas style width and height to the window width and height
        // canvas.style.width = `${window.innerWidth}px`;
        // canvas.style.height = `${window.innerHeight}px`;

        const context=canvas.getContext('2d')
        context.scale(2,2)
        context.lineCap = 'round'
        context.strokeStyle = 'black'
        context.lineWidth = 5
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
    
    const handleUpload = async (myblob) => {
        console.log(myblob);
        // console.log(user)
        const uniqueKey =`sketch-${Date.now()}.png`;
        // setSketch(uniqueKey)
        const fileWithUniqueName = new File([myblob], uniqueKey, { type: myblob.type });
        console.log(fileWithUniqueName)
        dbPost(uniqueKey);
        // getsketchid()
        // uploadFile(fileWithUniqueName, {...config, key: uniqueKey})
        uploadFile(fileWithUniqueName, config)
          .then((data) => console.log(data))
          .catch((err) => console.error(err));

        // fetch('/generate-upload-url', {
        //     method: 'PUT',
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //       filename: fileWithUniqueName.name,
        //       type: 'image/png'
        //     })
        //   })
        //     .then(response => response.json())
        //     .then(data => console.log(data)) // This is your presigned URL
            
        //     .catch(error => console.error(error));
          
        // function getS3Url() {
        //     return fetch('api/s3Url')
        //       .then(res => res.json())
        //       .then(data => {
        //         const url = data.url;
        //         console.log(url);
        //         return url;
        //       })
        //       .catch(error => console.error(error));
        //   }
          
        //   getS3Url().then(url => fetch(url, {
        //     method:'PUT', 
        //     headers:{
        //         "Content-Type": "multipart/form-data"
        //     },
        //     body: {fileWithUniqueName}
        //   }));
        
    };
    const saveSketch=()=>{
        const canvas=canvasRef.current
        setimg(false)
        //taking the canvas image and converting it into a blob
        canvas.toBlob((myblob)=>{
            const formData = new FormData();
            formData.append('name', myblob, 'sketch.png');
            //i need to handle upload of the sketch image to the db and aws
            handleUpload(myblob);
            const response = fetch('api/generate-ai', {
                method: 'POST',
                body: formData,
            });
            if(response){
                console.log('saved sketch')
                fetch('/api/imagesession')
                    .then(r=>r.json())
                    .then(data=>{setimgfn(data['message'])})
                    .then(console.log('Image uploaded successfully'));
            } else {
                console.error('Image upload failed');
            }
            //this needs to execute AFTER the ai image is generated and stored in the local
            //file. 
            setWorkingAiImg(trial_1)}
        ), 'image/png'}


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
    //this calls from within handle up load in order to get the current
    //sketch id so that i can post to the instances table
    // function getsketchid(){
    //     fetch('api/fetchsketchid', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         }, 
    //         body: JSON.stringify({
    //             filename:sketch
    //         })
    //       })
    //       .then(r=>r.json())
    //       .then(data=>setsketchid(data.sketch_id))
    // }

    function textChange(e){
        console.log(e.target.value)
    }

    function showImage(e){
        e.preventDefault()
        setimg(true)
        console.log('show ai image')
    }
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
        .then(data=>{saveInstance(data.image_id); setupdatedimg(true)})
    }
    if(updatedimg){nav("/view")}

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
                <div>React S3 File Upload</div>
                <input type="text" placeholder="prompt" onChange={textChange}></input>
                <button onClick={saveSketch}>Save Sketch</button>
                {/* <input type="file" onChange={handleFileInput} /> */}
                {/* <button onClick={() => handleUpload(selectedFile)}> Upload to S3</button> */}
                <button onClick={showImage}>Show Me the Image!</button>
            </div>
            {img ? 
            (<div>
                <img src={trial_1}/>
                <br></br>
                <button onClick={saveImage}>save image</button>
            </div>):(<p>show image</p>)
            }
        </>
    )
}