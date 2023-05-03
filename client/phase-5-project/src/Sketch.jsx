
import React from 'react'
import{ useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadFile } from "react-s3"


const S3_BUCKET = "phase-5-images";
const REGION = "us-west-2";


export default function Sketch({user}){
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
        const fileWithUniqueName = new File([myblob], uniqueKey, { type: myblob.type });
        console.log(fileWithUniqueName)
        dbPost(uniqueKey);
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

        canvas.toBlob((myblob)=>{
            // (setBlob(myblob)), handleUpload(blob)}
            const formData = new FormData();
            formData.append('name', myblob, 'sketch.png');
            // console.log(formData.entries())
            for (var key of formData.entries()) {
                console.log(key[0] + ', ' + key[1]);
            }
            const response = fetch('api/generate-ai', {
              method: 'POST',
              body: formData,
            });
          
            if (response.ok) {
              console.log('Image uploaded successfully');
            } else {
              console.error('Image upload failed');
            }
            handleUpload(myblob)}
      ), 'image/png'}

      //do i have a current user id??  
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
    }
   function textChange(e){
    console.log(e.target.value)
   }

   function showImage(e){
    e.preventDefault()
    console.log('generating ai')
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
                <form onSubmit={showImage}>
                    <button type="submit" >Show Me the Image!</button>
                </form>
            </div>
            <div>
                <p>the s3 bucket image goes here</p>
            </div>
        </>
    )
}