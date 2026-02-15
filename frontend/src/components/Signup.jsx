import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const Signup = () => {
  const [name,setName]=useState("")
  const [username,setusername]=useState("")
  const [password,setPassword]=useState("")
  const [confirmPass,setConfirmPass]=useState("")
  const [role,setRole]=useState("")

  const handleSubmit=async()=>{

  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label >
          Full Name
          <input type="text"
          value={name}
          onChange={(e)=>setName(e.target.value)
          }
           />
        </label>
        <label >
          Username
          <input type="text"
          value={username}
          onChange={(e)=>setusername(e.target.value)
          }
           />
        </label>
        <label >
          Password
          <input type="text"
          value={password}
          onChange={(e)=>setPassword(e.target.value)
          }
           />
        </label>
        <label >
          Confirm Password
          <input type="text"
          value={confirmPass}
          onChange={(e)=>setConfirmPass(e.target.value)
          }
           />
        </label>
        <label >
          Role
          <input type="text"
          value={role}
          onChange={(e)=>setRole(e.target.value)
          }
           />
        </label>
      </form>
      
    </div>
  )
}

export default Signup
