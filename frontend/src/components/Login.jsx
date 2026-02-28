import React from 'react'
import { useState } from 'react'
import axios from 'axios'



const baseUrl=import.meta.env.VITE_Base_Url
const Login = () => {
  
  const [userName,setUserName]=useState("")
  const [password,setPassword]=useState("")

  const handleSubmit=async(e)=>{
    e.preventDefault()

    const resp=await axios.post(baseUrl+'/auth/login',{userName,password})
    console.log(resp)
    return resp


  }
  return (

    <div>
      <form onSubmit={handleSubmit} >
        <label >
          Username
          <input type="text"
          value={userName}
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
