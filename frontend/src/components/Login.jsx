import React from 'react'
import { useState } from 'react'

const Login = () => {
  const [userName,setUserName]=useState("")
  const [password,setPassword]=useState("")

  const handleSubmit=()=>{

  }
  return (

    <div>
      <form >
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
      </form>
      
    </div>
  )
}

export default Login
