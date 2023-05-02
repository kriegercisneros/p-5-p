 // import { Buffer } from "buffer"
// import { saveAs } from 'react-filesaver'

// const s3= new AWS.S3({
//     accessKeyId:'AKIAWKWXAVRXTZRUPG3T',
//     secretAccessKey:'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',
//     region:'us-west-2'
// })


    //   const handleFileInput = (e) => {
    //     setSelectedFile(e.target.files[0]);
    //     handleUpload(selectedFile)
    //   };
    
    
    //   const saveSketch =()=>{
    //     //convert the canvas element to a blob
    //     const canvas=canvasRef.current
    //     canvas.toBlob((myblob)=>{
    //         // saveAs(myblob, './flies.blob.png'
    //         // (setBlob(myblob))
    //         const params={
    //             Bucket:'phase-5-images', 
    //             Key:'testsketch.png',
    //             Body: myblob
    //         }
    //         s3.upload(params, (err, data)=>{
    //             if(err){
    //                 console.error(err)
    //             }else{
    //                 console.log('upload successful', data.Location)
    //             }
    //         })
    //     }, 'image/png')
        // const dataURL=canvas.toDataURL('image/png')
        
        ///////// This code below will save the image as a file on my desktop///////////
        // const link =document.createElement('a')
        // link.href=dataURL
        // link.download='./files/blob.png'
        // document.body.appendChild(link);
        // link.click();
    // }
    // const myFile=new File([blob], 'blob.png',{
    //     type:blob.type
    // })
    // console.log(myFile)