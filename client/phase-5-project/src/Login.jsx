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
        <h1>Sketch to Image</h1>
        <p>A simple react and python script that allows a user to sketch in react, submit the drawing, and generate an AI image. </p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input defaultValue="test" {...register("email")} />
            <input {...register("password_hash", { required: true })} />
            {errors.password && <span>This field is required</span>}
            <input type="submit" />
        </form>
        <h1>Want to try?  Sign up!</h1>
        <p>this will pull down a popout menu for which people can sign up from there</p>
        {/* <button onClick={signup}>Sign Up</button> */}
        </>
    )
}
export default Login
