import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function Login({user, setUser}){
    const nav=useNavigate()

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
        .then(()=>nav('/home'))
    };
    useEffect(()=>{
        fetch('api/info')
        .then(r=>r.json())
        .then(data=>{
            setUser(data['id'])
        })
    }, [])

    if(user){
        return nav('/home')
    }

    function onSecondSubmit(){
      console.log('second submit')
    }
    // function signup(){

    // }

    return(
    <div>
      <div className= "flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <h1 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">Welcome to Sketch to Img</h1>
      </div>
      <div className ="flex min-h-full flex-1 flex-col justify-center px-6 py-1 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://phase-5-images.s3.us-west-2.amazonaws.com/c5c8050f6ae14403b61f5645c846c075.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-pink-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                  {...register("email")}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-pink-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-pink-600 hover:text-pink-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Want to Try?{' '}
            {/* <a href="#" className="font-semibold leading-6 text-pink-600 hover:text-pink-500" onClick={()=>nav('/signup')}>
              Sign Up!
            </a> */}
          </p>
          <div className="relative">
            <button type="button" className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-pink-600 hover:text-pink-500" aria-expanded="false">
              <span>Sign Up!</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
              <div className="p-4">
                <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <svg className="h-6 w-6 text-gray-600 group-hover:text-pink-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                    </svg>
                  </div>
                  
                  <div>
                    {/* <a href="#" className="font-semibold text-pink-900">
                      Analytics
                      <span className="absolute inset-0"></span>
                    </a>
                    <p className="mt-1 text-gray-600">Get a better understanding of your traffic</p> */}
                    
                    <a href="#" className="font-semibold text-pink-900">
                      <form className="absolute inset-0" action="#" onSubmit={handleSubmit(onSecondSubmit)}>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium leading-6 text-pink-900">
                            Email address
                          </label>
                          <div className="mt-2">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                              {...register("email")}
                            />
                          </div>
                        </div>
                      </form>
                    </a>


                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  
  )
}
export default Login
