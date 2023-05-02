
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
        console.log(myblob.name);
        // console.log(user)
        const uniqueKey =`sketch-${Date.now()}.png`;
        const fileWithUniqueName = new File([myblob], uniqueKey, { type: myblob.type });
        console.log(fileWithUniqueName.name)
        dbPost(uniqueKey);
        // uploadFile(fileWithUniqueName, {...config, key: uniqueKey})
        uploadFile(fileWithUniqueName, config)
          .then((data) => console.log(data))
          .catch((err) => console.error(err));
      };
      const saveSketch=()=>{
        const canvas=canvasRef.current
        canvas.toBlob((myblob)=>{
            // (setBlob(myblob)), handleUpload(blob)}
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
          .then(nav('/home'))
    }
   
    return(
        <>
            <div>Sketch</div>
            <canvas 
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onDoubleClick={clearCanvas}
                ref={canvasRef}
            />
            {/* <button onClick={saveSketch}>Save Sketch</button> */}
            <div>
                <div>React S3 File Upload</div>
                <button onClick={saveSketch}>Save Sketch</button>
                {/* <input type="file" onChange={handleFileInput} /> */}
                {/* <button onClick={() => handleUpload(selectedFile)}> Upload to S3</button> */}
            </div>
        </>
    )
}