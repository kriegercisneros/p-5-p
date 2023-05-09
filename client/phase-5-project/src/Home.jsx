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
        <div style={{
        backgroundImage:`url("https://restoredecorandmore.com/wp-content/uploads/2022/05/aesthetic-boho-iPhone-wallpaper-18.jpg")`,         
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height:'130vh',
        width:'60vw',
        position: 'relative',
        borderRadius: '20px', 
        padding:'20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
        }}>
          <div className="flex flex-col items-center justify-center">
          <div className= "flex min-h-full flex-1 flex-col justify-center px-15 py-20 lg:px-8">
        <h1 className="mt-10 text-center text-4xl text-bold leading-9 tracking-tight" 
            style={{
              color:'#e6bfb3',
              }}>Home</h1>
              </div>
        <button onClick={()=>nav('/sketch')}
          className="mt-6 flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
        >Sketch</button>
        <button onClick={handleLogout}
          className="mt-6 flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
        >Logout</button>
        <button 
          onClick={()=>nav('/view')}
          className="mt-6 flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >View Past Instances</button>
        </div>
        </div>
      );
}
export default Home