import { useState } from 'react'
import './App.css'
// import { useState } from 'react'
import { Route, Routes } from "react-router-dom"
import Login from './Login'
import Info from './Info'
import Sketch from './Sketch'
import View from './View'

function App(){
  const [user, setUser]=useState(undefined)

  return(
    <div className='App' >
      <Routes>
        <Route exact path='/login' element={<Login user={user} setUser={setUser}/>}/>
        <Route exact path='/info' element={<Info user={user} setUser={setUser}/>}/>
        <Route exact path='/sketch' element={<Sketch user={user} setUser={setUser}/>}/>
        <Route exact path='/view' element={<View user={user} setUser={setUser}/>}/>
      </Routes>
    </div>
  )
}
export default App
