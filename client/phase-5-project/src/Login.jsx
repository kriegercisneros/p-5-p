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

    // function signup(){

    // }

    return(
        <>
    
        <div flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8>
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
            <a href="#" className="font-semibold leading-6 text-pink-600 hover:text-pink-500">
              Sign Up!
            </a>
          </p>
        </div>
{/* 
        <h1>Sketch to Image</h1>
        <p>A simple react and python script that allows a user to sketch in react, submit the drawing, and generate an AI image. </p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input defaultValue="test" {...register("email")} />
            <input {...register("password_hash", { required: true })} />
            {errors.password && <span>This field is required</span>}
            <input type="submit" />
        </form>
        <h1>Want to try?  Sign up!</h1>
        <p>this will pull down a popout menu for which people can sign up from there</p> */}
        {/* <button onClick={signup}>Sign Up</button> */}
        </div>
        </>
    )
}
export default Login
