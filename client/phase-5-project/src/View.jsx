import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'


export default function View(){
  const [instances, setInstances] = useState([]);
  const [userid, setUserid]=useState(undefined)
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);
  const [allimagedata, setallimagedata]=useState({})
  const [hover,sethover]=useState(false)
  console.log(userid)

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
          height:'100%',
          borderRadius:'20px', 
          position:'relative'
        }}
      >
        <div style={{
          backgroundColor: 'rgba(139, 131, 120, 0.5)',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent:'space-evenly',
          width: '100vw',
          borderRadius:'20px', 
          position:'relative',
          height:'80px'
        }}>
        <button 
          onClick={()=>nav('/home')} 
          className="flex justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-lg font-regular leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          style={{}}
          >Home</button>
        <button
          className="flex justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-lg font-regular leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          onClick={handleLogout} 
        >Logout</button>
        <button
          className="flex justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-lg font-regular leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          onClick={()=>nav('/sketch')} 
        >Sketch</button>
        <img className="h-14 w-14 rounded-full border" src={`https://phase-5-images.s3.us-west-2.amazonaws.com/download.jpg`} />
        </div>

        <h1 className="mt-10 text-center text-9xl" style={{ color: 'grey' }}>
          Creations
        </h1>
        <div className="bg-white py-24 sm:py-32" style={{backgroundColor:'#e6bfb3'}}>
          <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
            <div className="max-w-2xl">
              <h2 className="text-3xl font tracking-tight text-gray-900 sm:text-4xl" style={{color:'white'}}>You made some sweet stuff</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600" style={{color:'white'}}>
              Click on a small icon to view the image generated by AI and the sketch you made to generate it.  Hover over the sketch to view details about the parameters you used.
              </p>
            </div>
          
        <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-3 sm:gap-y-16 xl:col-span-2">
        {instances.length > 0 ? (
          instances.map((instance) => (
          // <li>
          <div className='mt-5 text-center' key={instance.id} style={{display:'flex'}}>
            <div className="flex items-center gap-x-6">
            {/* <img className="h-16 w-16 rounded-full border" src="https://phase-5-images.s3.us-west-2.amazonaws.com/77846425c77144fbaf3bf99a1bb51eab.png" onClick={() => toggleInstanceVisibility(instance.id)} /> */}

            <img className="h-16 w-16 rounded-full border" src={`https://phase-5-images.s3.us-west-2.amazonaws.com/${instance.images.filename}`} onClick={() => toggleInstanceVisibility(instance.id)} />
            <div>
              <Popover className='Relative'>
                <Popover.Button > .Sketch and Image.
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-900"
                    enterFrom="opacity-50 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-900"
                    leaveFrom="opacity-50 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute z-10 mt-5 flex w-screen max-w-max px-4" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className="xl:grid-cols-3" style={{ display: 'flex', alignItems: 'center', flexDirection:'row', backgroundColor:'white', borderRadius: '10px', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                      <img
                        style={{
                          border: '4px solid #343a40',
                          borderRadius: '10px',
                          marginRight: '10px',
                        }}
                        // src="https://phase-5-images.s3.us-west-2.amazonaws.com/33bfbf4ef7c14fae9a39fbc0d6519bd1.png"
                        src={`https://phase-5-images.s3.us-west-2.amazonaws.com/${instance.images.filename}`}
                        alt="Instance Image"
                        // onMouseOver={displayImage}
                        // onMouseOut={()=>sethover(false)}
                        // onClick={()=>console.log(allimagedata)}
                      />
                      {instance.sketches != null ?(<img
                        style={{
                          border: '4px solid #343a40',
                          borderRadius: '10px',
                          marginRight: '10px',
                        }}
                        src={`https://phase-5-images.s3.us-west-2.amazonaws.com/${instance.sketches.filename}`}
                        alt="Instance Sketch"
                      />):(<h1>🧡</h1>)}
                    </div>
                  </Popover.Panel>
                </Transition>
                </Popover.Button>
              </Popover>
              <Popover className='relative' >
                    <Popover.Button onClick={()=>sethover(true)}>
                      .Parameters.
                    </Popover.Button>
                {hover ? (
                <>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-500"
                  enterFrom="opacity-50 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-500"
                  leaveFrom="opacity-50 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
              <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max px-4" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
              
              {/* <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5" style={{ backgroundColor: 'rgba(159, 151, 140, 0.25)'}}></div> */}
                  <div className="xl:grid-cols-3" style={{ display: 'flex', alignItems: 'center', flexDirection:'column', backgroundColor:'white', borderRadius: '10px', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
                  // style={{
                  //   display:'flex',
                  //   flexDirection:'column',
                  //   flexWrap:'wrap',
                  //   alignContent:'center',
                  //   aligbItems:'center',
                  //   position: "relative",
                  //   top: "35%",
                  //   left: "20%",
                  //   // transform: "translate(-50%, -50%)",
                  //   // background: 'rgba(139, 131, 120, 0.7)',
                  //   background:'rgba(250, 250, 255)',
                  //   borderRadius: '10px',
                  //   width:'600px' 
                  //   }}
                    > 
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                      <h1 className="mt-6 text-center text-4xl" style={{color:'#e6bfb3'}}>Prompt</h1>
                      <p className="mt-1 text-center text-2xl">{instance.images.text}</p>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                      <h1 className="mt-4 text-center text-4xl" style={{color:'#e6bfb3'}}>Style</h1>
                      <p className="mt-1 text-center text-2xl"> {instance.images.style}</p>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                      <h1 className="mt-4 text-center text-4xl" style={{color:'#e6bfb3'}}>CFG</h1>
                      <p className="mt-1 text-center text-2xl">{instance.images.cfg}</p>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                      <h1 className="mt-4 text-center text-4xl" style={{color:'#e6bfb3'}}>Clip</h1>
                      <p className="mt-1 text-center text-2xl">{instance.images.clip}</p>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                      <h1 className="mt-4 text-center text-4xl" style={{color:'#e6bfb3'}}>steps</h1>
                      <p className="mt-1 text-center text-2xl">{instance.images.steps}</p>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                      <h1 className="mt-4 text-center text-4xl" style={{color:'#e6bfb3'}}>start</h1>
                      <p className="mt-1 text-center text-2xl">{instance.images.start}</p>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end', paddingBottom:'20px'}}>
                      <h1 className="mt-4 text-center text-4xl" style={{color:'#e6bfb3'}}>end</h1>
                      <p className="mt-1 text-center text-2xl">{instance.images.end}</p>
                    </div>
                  </div>
                  </Popover.Panel>
                  </Transition>
                </>
                ):(
                <h1></h1>
                )}
                </Popover>
            </div>
            </div>
          </div>
          ))
      ) : (
        <h1>
          Hmm, looks like you have not made anything yet. Care to try?
        </h1>
        )}
        </ul>
        </div>
        </div>
      </div>
    )
  }
