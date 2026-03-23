import React from 'react'
import { Link } from 'react-router-dom'
import '../global.css'

const Navbar = () => {
  return (
    <div className='container'>
      <nav>
      <ul>
        <li><Link to='/home'>Home</Link></li>
        <li><Link to='/transactions'>Transactions</Link></li>
        <li><Link to='/config'>Configuration</Link></li>
        <li><Link to='/alert'>Alerts</Link></li>
        <li><Link to='/login'>Login</Link></li>
        <li><Link to='/signup'>Signup</Link></li>
        <li><Link to='/agent'>Agent</Link></li>

      </ul>
      </nav>
    </div>
  )
}

export default Navbar
