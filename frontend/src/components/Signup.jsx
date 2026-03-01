import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import '../global.css'
const Signup = () => {
  const baseUrl=import.meta.env.VITE_BASE_URL
  const [name,setName]=useState("")
  const [username,setusername]=useState("")
  const [password,setPassword]=useState("")
  const [confirmPass,setConfirmPass]=useState("")
  const [role,setRole]=useState("")
  const [organisation,setOrg]=useState("")

  const handleSubmit=async(e)=>{
    e.preventDefault()
    if(password !== confirmPass){
      alert("Passwords do not match")
      return
    }

    const resp=await axios.post(baseUrl+'/auth/signup',{name,username,password,role,organisation})
    console.log(resp)
    return resp

  }
  return (
    <div className='container'>
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
          Organisation
          <input type="text"
          value={organisation}
          onChange={(e)=>setOrg(e.target.value)
          }
           />
        </label>
        <label >
          Role
          <select value={role} onChange={(e)=>setRole(e.target.value)}>
            <option value='user'>User</option>
            <option value='admin'>Admin</option>
          </select>
        </label>
        <button type='submit'>Signup</button>
      </form>
      
    </div>
  )
}

export default Signup
