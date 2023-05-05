import { useNavigate } from 'react-router-dom'
// import { useForm } from 'react-hook-form'
import { useEffect } from 'react'


function Home({user, setUser}){
    const nav=useNavigate()
    
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
            setUser(data['id'])
        })
    }, [])

    return (
        <div>
        <h1>Home, {user}</h1>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={()=>nav('/sketch')}>Sketch</button>
        <button onClick={()=>nav('/view')}>View Past Instances</button>
        </div>
      );
}
export default Home