import { useEffect, useState } from 'react'


function Info({user, setUser}){
    useEffect(()=>{
        fetch('api/info')
        .then(r=>r.json())
        .then(data=>{
            setUser(data['id'])
        })
    }, [])
    return(
        <div>
            <h1>user_id:{user}</h1>
        </div>
    )
}

export default Info