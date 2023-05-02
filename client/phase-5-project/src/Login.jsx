// import React from 'react'
import { useEffect, useState } from 'react'
// import { Formik, Form, Field, ErrorMessage } from 'formik';
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
        .then(data=>console.log(data))
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
    return(
            /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
            <input defaultValue="test" {...register("email")} />
      {/* include validation with required or other standard HTML validation rules */}
            <input {...register("password_hash", { required: true })} />
      {/* errors will return when field validation fails  */}
            {errors.password && <span>This field is required</span>}
            <input type="submit" />
        </form>
    )
}
export default Login
