import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline'

// function isValidEmail(email) {
//   return /\S+@\S+\.\S+/.test(email);
// }

function Login({user, setUser}){
  const nav=useNavigate()
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isValidForm, setIsValidForm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => {
      fetch('api/login',{
          method:'POST',
          headers: {
              'Content-Type':'application/json'
          },
          body:JSON.stringify(data)
      })
      .then(r=>r.json())
      .then(()=>nav('/sketch'))
  };

  useEffect(()=>{
      fetch('api/info')
      .then(r=>r.json())
      .then(data=>{
          setUser(data['id'])
      })
  }, [])

  if(user){
      return nav('/sketch')
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  // function handlePasswordConfirmChange(event) {
  //   setPasswordConfirm(event.target.value);
  // }

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleSecSubmit(event) {
    event.preventDefault();
    const data = {
      email: email,
      password_hash: password,
      username: username
    }

    fetch('api/users',{
      method:'POST',
      headers: {
          'Content-Type':'application/json'
      },
      body:JSON.stringify(data)
  })
  .then(r=>r.json())
  .then(data=>console.log(data))
  }

  // function validateForm() {
  //   setIsValidForm(
  //     isValidEmail(email) && password === passwordConfirm && username.trim().length > 0
  //   );
  // }
    return(
      <div style={{
        // background: 'rgba(139, 131, 120, 0.5)',
        backgroundImage: `url("https://restoredecorandmore.com/wp-content/uploads/2022/05/aesthetic-boho-iPhone-wallpaper-18.jpg")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height:'130vh',
        width:'80vw',
        position: 'relative',
        borderRadius: '20px', 
        padding:'20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
      }}>
      <div style={{
        position: "absolute",
        top: "35%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: 'rgba(139, 131, 120, 0.5)',
        borderRadius: '20px', 

      }}>
        <div className="flex flex-col items-center justify-center">
      <div className= "flex min-h-full flex-1 flex-col justify-center px-15 py-20 lg:px-8">
        {/* <div style={{
        // position: "absolute",
        top: "35%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(54, 57, 63, 0.5)",
        borderRadius: '20px', 
        paddingBottom:'20px',
      }}> */}
        <h1 className="mt-10 text-center text-6xl font-semibold leading-9 tracking-tight" style={{color:'#e6bfb3'}}>Simple Sketch</h1>
        {/* </div> */}
        <h3 className="mt-10 text-center font-semibold text-3xl leading-9 tracking-tight text-gray-900">AKA, Making Blobs (whoa!) and Passing them around the Internet, with a little bit of fun ai image generation thrown in.</h3>
      </div>
      <div className ="flex min-h-full flex-1 flex-col justify-center px-6 py-1 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <img
            className="mx-auto h-30 w-auto"
            src="https://www.google.com/aclk?sa=l&ai=DChcSEwju2dyhi-b-AhXtB60GHT1nAfkYABAJGgJwdg&sig=AOD64_14QdsPxNJyM0aFJb0-LaZF7w2DKA&adurl&ctype=5&ved=2ahUKEwjri8yhi-b-AhULKN4AHVB9BZcQvhd6BQgBEIkB"
            alt="Your Company"
            style={{borderRadius: '140px', height:'30vh'}}
          /> */}
          <h2 className="mt-2 text-center font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" onSubmit={handleSubmit(onSubmit)}>
            <div>
              {/* <label htmlFor="email" className="block text-sm font-medium leading-6 text-yellow-900">
                Email address
              </label> */}
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                  {...register("email")}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}
                />
              </div>
            </div>

            <div>
              {/* <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-yellow-900">
                  Password
                </label> */}
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-yellow-600 hover:text-yellow-500">
                    Forgot password?
                  </a>
                </div> */}
              {/* </div> */}
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                  {...register("password_hash", { required: true })}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}
                  // {errors.password && <span>This field is required</span>}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">Want to Try?</p>

          <Popover className="relative">
            <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              <span>Sign Up!</span>
              {/* <ChevronDownIcon className="h-5 w-5" aria-hidden="true" /> */}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-500"
              enterFrom="opacity-50 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-500"
              leaveFrom="opacity-50 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4" >
                <form onSubmit={handleSecSubmit} className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5" style={{ backgroundColor: 'rgba(159, 151, 140, 0.25)' }}>
                  <div className="p-4">
                    <div className="mb-4">
                      {/* <label htmlFor="email" className="block font-semibold text-gray-900 ">Email</label> */}
                      <input placeholder="email" type="email" id="email" name="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6" value={email} onChange={handleEmailChange}/>
                    </div>
                    <div className="mb-4">
                      {/* <label htmlFor="password" className="block font-semibold text-gray-900">Password</label> */}
                      <input placeholder="password" type="password" id="password" name="password" minLength="8" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6" value={password} onChange={handlePasswordChange}/>
                    </div>
                    <div className="mb-4">
                      {/* <label htmlFor="username" className="block font-semibold text-gray-900">Username</label> */}
                      <input placeholder="username" type="text" id="username" name="username" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6" value={username} onChange={handleUsernameChange}/>
                    </div>
                    <button type="submit" className="bg-yellow-600 text-white rounded-lg py-2 px-4 hover:bg-yellow-700 transition-colors duration-300">Sign Up</button>
                  </div>
                </form>
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
        </div>
      </div>
      </div>
    </div>
  )
}
export default Login
