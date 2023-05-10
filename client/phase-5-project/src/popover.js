<Popover>
                <Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-500"
                    enterFrom="opacity-50 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-500"
                    leaveFrom="opacity-50 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel>
                    <h1>popover</h1>
                  </Popover.Panel>
                </Transition>
                </Popover.Button>
              </Popover>






<Popover className='relative'>
                    <Popover.Button onClick={()=>sethover(true)}>
                      More info...
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
              <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max px-4" >
              
              {/* <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5" style={{ backgroundColor: 'rgba(159, 151, 140, 0.25)'}}></div> */}
                  <div 
                  style={{
                    display:'flex',
                    flexDirection:'column',
                    flexWrap:'wrap',
                    alignContent:'center',
                    aligbItems:'center',
                    position: "relative",
                    top: "35%",
                    left: "20%",
                    // transform: "translate(-50%, -50%)",
                    // background: 'rgba(139, 131, 120, 0.7)',
                    background:'rgba(250, 250, 255, 0.6)',
                    borderRadius: '10px',
                    width:'600px' 
                    }}
                    > 
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                      <h1 className="mt-6 text-center text-4xl" style={{color:'#e6bfb3'}}>Prompt</h1>
                      <p className="mt-1 text-center text-2xl">{allimagedata.text}</p>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                      <h1 className="mt-4 text-center text-4xl" style={{color:'#e6bfb3'}}>Style</h1>
                      <p className="mt-1 text-center text-2xl"> {allimagedata.style}</p>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                      <h1 className="mt-4 text-center text-4xl" style={{color:'#e6bfb3'}}>CFG</h1>
                      <p className="mt-1 text-center text-2xl">{allimagedata.cfg}</p>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                      <h1 className="mt-4 text-center text-4xl" style={{color:'#e6bfb3'}}>Clip</h1>
                      <p className="mt-1 text-center text-2xl">{allimagedata.clip}</p>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                      <h1 className="mt-4 text-center text-4xl" style={{color:'#e6bfb3'}}>steps</h1>
                      <p className="mt-1 text-center text-2xl">{allimagedata.steps}</p>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end'}}>
                      <h1 className="mt-4 text-center text-4xl" style={{color:'#e6bfb3'}}>start</h1>
                      <p className="mt-1 text-center text-2xl">{allimagedata.start}</p>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'flex-end', paddingBottom:'20px'}}>
                      <h1 className="mt-4 text-center text-4xl" style={{color:'#e6bfb3'}}>end</h1>
                      <p className="mt-1 text-center text-2xl">{allimagedata.end}</p>
                    </div>
                  </div>
                  </Popover.Panel>
                  </Transition>
                </>
                ):(
                <h1></h1>
                )}
                </Popover>






            <div style={{ display: 'flex', alignItems: 'center', flexDirection:'column' }}>
                <img
                  style={{
                    border: '4px solid #343a40',
                    borderRadius: '10px',
                    marginRight: '10px',
                  }}
                  src={`https://phase-5-images.s3.us-west-2.amazonaws.com/${instance.images.filename}`}
                  alt="Instance Image"
                  // onMouseOver={displayImage}
                  // onMouseOut={()=>sethover(false)}
                  // onClick={()=>console.log(allimagedata)}
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