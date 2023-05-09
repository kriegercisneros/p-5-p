import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'


export default function View(){
  const [instances, setInstances] = useState([]);
  const [userid, setUserid]=useState(undefined)

  const [selectedInstanceId, setSelectedInstanceId] = useState(null);
  const nav=useNavigate()
  const toggleInstanceVisibility = (instanceId) => {
    setSelectedInstanceId(selectedInstanceId === instanceId ? null : instanceId);
  };

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

    useEffect(()=>{
        fetch('api/info')
        .then(r=>r.json())
        .then(data=>{
            setUserid(data['id'])
        })
    }, [])
    console.log(userid)
    useEffect(() => {
        fetch(`api/instances/${userid}`)
            .then((response)=>response.json())
            .then((data)=>setInstances(data.instances))
    }, [userid]);

    return (
      
      <div
        style={{
          backgroundColor: 'rgba(139, 131, 120, 0.5)',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          width: '100vw',
          borderRadius:'20px', 
          position:'relative'
        }}
      >
        <img 
          onClick={()=>nav('/home')} 
          style={{
            height:'5vh', 
            borderRadius:'5px',
            position:'absolute',
            left:'10px',
            top:'10px'
          }} 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTixkKdh2YPXsBCpj4FI8wv52meCbA61G3MRw&usqp=CAU"></img>
        <img 
          onClick={handleLogout} 
          style={{
            height:'5vh', 
            borderRadius:'5px',
            position:'absolute',
            left:'60px',
            top:'10px'
          }} 
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAATlBMVEX///+EhIR6enp+fn7Dw8OOjo7w8PD4+PjHx8eBgYHAwMC0tLSzs7Pg4OCXl5fj4+PV1dWrq6vOzs7t7e2dnZ2JiYnX19dzc3Otra2kpKRP/JnrAAAEKElEQVR4nO3c61bbMBCFUUuKYzuQi5NQyPu/aDG4C1/UyniG6Jx0vv+wsivJMlSoKCzLsizLsizLsgirg5NVXp/O29yKfyUWuqYJ/lBXuSF/TS78UAa3QzXqCN8LL6fclnhqQud8mxsTTVHowgFxpmoKMYmqwndibs88XaELb7lBs5SFLvzKLZqmLWxKtKWoLXRhl5s0SV3oHNggbl69rNBMB/Gc2zSuErbdt35sbAB3DGGXckz0YNNUoWpMxNsw5F38SIj2NNWoHQ5ic8v9cX6g03DPecBHzWSaNmXuj/MDbUcL0YSMmZA/E/JnQv5MyJ8J+TMhfybkz4T8mZA/E/JnQv5MyJ8J+TMhfybMmc7hF2Dhs3/S+Da4wrfgwrPC94EVtt0BAw0iqrD9PEER5BMVVNj+OSIiJ2IKb19nYMRESOFteMhHSkQU3sYnZ4VEPGF1nR4NlhHxhGfvpomIeMJiNz/eLSECCoud6igiCqOjuPrtBlKoSsQUaq5FUKHiWkQV6o0irFCNiCvUmqjAQqUnKrJQZ6JCC1WI2EKNtQguVBhFdKH8cQMvFE9UfKGUSCAUrkUGoYxIIRRNVA6h5IlKIhQQWYTr1yKNcPVa5BGuHUUiYYzo039fzyQsNtObPN6J+9QXaQnrzR2qy5kw/efnWsKXcI9mwAUXsmgJ5/+6dyp5SwK90IXLwwsT0/QBhIk9kV/YJC59fABh4sqZBxA+/Bg+/jr8D56lidue6YXNNfHJuN5L5z9bpG9g4/rZ4jYjpi/vovr58Dgfw9RbKZdwH/kBOH2en0gYA27SX8YjPEZ+11Yv+Doa4T7ya6glQBphZIqGBVO0oBEeIyO4DEgi3K9cg10UwthTdCmQQrhym+gjEEbW4MKHzEf4wtXbRB+8cP020YcujLxsf2MNdoEL176qDcIWiraJPmiheA12IQsFr2qDgIWRbeK7a7ALVyh7k/kKVqgFhBXGXtVWTNECVih9VRuEKVTZJvoghfJXtUGIQoVXtUGAQo1XtUF4wsv8/19Wr8EuPOH8gJ4IiCicEgVrsAtROD4sKxtBUOGQuH6b6MMUfk1U4RQtYIXF5vNzSbaJPlTh5yhK12AXrLAbRfEa7MIVFrXCFC2ghUXykPqikIU6mZA/E/JnQv5MyJ8J+TMhfybkz4T8mZA/E/JnQv5MyJ8J+TMhfybkz4T8XYbC9MVZhJ2GJ6zSf75PWDs8CJi6zIax0SR1IX1HH1tVOTrLmbxFg67LGOh8lfsTjaqEbfetHwPRHjSbVy9rdto4eQXhnatj9yTKwpqk+kK4J6m2sCnBhlBdiLdVKAvDW27QLF1hANspulSF4YC2CAtdISRQU+gT10dmSk0YXk65LfF0hE1wO8QZ2iUXNk3whxrVpyAsr0/nxM2YlmVZlmVZlmVZ6v0Gplc8RLrMIFQAAAAASUVORK5CYII="></img>
        
        <h1 className="mt-10 text-center text-9xl" style={{ color: '#e6bfb3' }}>
          Creations
        </h1>
        {instances.length > 0 ? (
        instances.map((instance) => (
          <div className='mt-5 text-left' key={instance.id}>
            <h1
              onClick={() => toggleInstanceVisibility(instance.id)}
              style={{ cursor: 'pointer' }}
              className="mt-5 text-left text-2xl leading-9 tracking-tight text-gray-500"
            >
              {instance.id}
            </h1>
            {selectedInstanceId === instance.id && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  style={{
                    border: '4px solid #343a40',
                    borderRadius: '10px',
                    marginRight: '10px',
                  }}
                  src={`https://phase-5-images.s3.us-west-2.amazonaws.com/${instance.images.filename}`}
                  alt="Instance Image"
                />
                <img
                  style={{
                    border: '4px solid #343a40',
                    borderRadius: '10px',
                    marginRight: '10px',
                  }}
                  src={`https://phase-5-images.s3.us-west-2.amazonaws.com/${instance.sketches.filename}`}
                  alt="Instance Sketch"
                />
              </div>
            )}
          </div>
          ))
      ) : (
        <h1>
          Hmm, looks like you have not made anything yet. Care to try?
        </h1>
        )}
      </div>
    )
  }
