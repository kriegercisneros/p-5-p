// import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile]=('')

  const handleFileChange = (event) => {
    console.log(event.target.files[0])
    setFile(event.target.files);
  };

  function handleSubmit(e){
    e.preventDefault()
    const formData= new FormData()
    formData.append('image', file)
    console.log(formData)
    fetch('/api/upload', {
      method: 'POST', 
      body:formData
    })
    // .then((resp)=>resp.json())
    // .then((data)=>console.log(data))
  }
  return (
    <>
      <form encType='multipart/form-data' onSubmit={handleSubmit}>
        <input type='file' name='pic' onChange={handleFileChange}></input>
        <button>submit</button>
      </form>
    </>
  )
}
export default App
