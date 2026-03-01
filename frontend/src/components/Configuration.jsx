import React from 'react'
import '../global.css'
const Configuration = () => {
    const handleSubmit=()=>{

    }
  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <p>This is the config form</p>
      </form>
    </div>
  )
}

export default Configuration
