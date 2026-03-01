import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      <ul>
        <li><Link to='/home'>Home</Link></li>
        <li><Link to='/transactions'>Transactions</Link></li>
        <li><Link to='/config'>Configuration</Link></li>
        <li><Link to='/alert'>Alerts</Link></li>
        <li><Link to='/login'>Login</Link></li>
        <li><Link to='/signup'>Signup</Link></li>

      </ul>
    </div>
  )
}

export default Navbar
