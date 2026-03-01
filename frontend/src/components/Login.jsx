import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import '../global.css'


const baseUrl=import.meta.env.VITE_BASE_URL
const Login = () => {
  
  const [username,setUserName]=useState("")
  const [password,setPassword]=useState("")

  const handleSubmit=async(e)=>{
    e.preventDefault()

    const resp=await axios.post(baseUrl+'/auth/login',{username,password})
    console.log(resp.data)
    localStorage.setItem("token", resp.data.token)


  }
  return (

    <div className='container'>
      <form onSubmit={handleSubmit} >
        <label >
          Username
          <input type="text"
          value={username}
          onChange={(e)=>setUserName(e.target.value)} />
        </label>

        <label >
          Password
          <input type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)} />
        </label>
        <button type='submit'>Login</button>
      </form>
      
    </div>
  )
}

export default Login
