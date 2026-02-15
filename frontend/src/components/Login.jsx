import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const Login = () => {
  const baseUrl=""
  const [userName,setUserName]=useState("")
  const [password,setPassword]=useState("")

  const handleSubmit=async()=>{

    const resp=await axios.post(baseUrl+'/login',{userName,password})
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
          <input type="text"
          value={password}
          onChange={(e)=>setPassword(e.target.value)} />
        </label>
        <button type='submit'>Login</button>
      </form>
      
    </div>
  )
}

export default Login
