import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'


export default function View(){
    const user = 13
    const [instances, setInstances] = useState([]);
    const [imageData, setImageData]=useState('')
    const [sketchData, setSketchData] = useState('')

    useEffect(() => {
        fetch(`api/instances/${user}`)
            .then((response)=>response.json())
            .then((data)=>setInstances(data.instances))
  }, []);

  useEffect(() => {
    if (instances.length > 0) {
      const instance = instances[0]; // Use the first instance object
      fetch(`/api/images/${instance.image_id}`)
        .then((response) => response.json())
        .then((data) => setImageData(data));
    }
  }, [instances]);

  useEffect(() => {
    if (instances.length > 0) {
      const instance = instances[0]; // Use the first instance object
      fetch(`/api/sketches/${instance.sketch_id}`)
        .then((response) => response.json())
        .then((data) => setSketchData(data));
    }
  }, [instances]);

  return (
    <div>
      {imageData && (
        <div key={imageData.id}>
            <h1>Instance</h1>
          <img src={`https://phase-5-images.s3.us-west-2.amazonaws.com/${imageData.filename}`} alt="Image" />
          <img src={`https://phase-5-images.s3.us-west-2.amazonaws.com/${sketchData.filename}`} alt="Sketch" />
        </div>
      )}
    </div>
  );
}

//   return (
//     <div>
//       {instances.map((instance) => (
//         <div key={instance.id}>
//           {fetch(`/api/images/${instance.image_id}`)
//           .then(r => r.json())
//           .then(data => (setimgname(data.filename)))}
//             <img src={`https://phase-5-images.s3.us-west-2.amazonaws.com/${imgname}`} alt="Image" />
//         </div>
//       ))}
//     </div>
//   );
// }



// const imgname= 'c67c28b0497441c7af98021268ad38bc.png'
// const sketchname='	sketch-1683293040275.png'
// return(
//     <div>
//         <h1>Instance</h1>
//         <img src={`https://phase-5-images.s3.us-west-2.amazonaws.com/${imgname}`} />
//         <img src={`https://phase-5-images.s3.us-west-2.amazonaws.com/${sketchname}`} />
//     </div>
// )