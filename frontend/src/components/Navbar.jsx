import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { token, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">
        <span className="navbar-brand-name">FinOS</span>
        <span className="navbar-brand-sub">AI FINANCIAL OS</span>
      </Link>

      {token && (
        <ul className="navbar-links">
          <li><Link to="/home" className={isActive('/home')}>Dashboard</Link></li>
          <li><Link to="/transactions" className={isActive('/transactions')}>Transactions</Link></li>
          <li><Link to="/agent" className={isActive('/agent')}>Advisor</Link></li>
          <li><Link to="/aa" className={isActive('/aa')}>Bank Connect</Link></li>
          <li><Link to="/config" className={isActive('/config')}>Settings</Link></li>
        </ul>
      )}

      <div className="navbar-right">
        {token ? (
          <>
            {user && <span className="navbar-user">👤 {user.username}</span>}
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"><button className="btn-secondary">Login</button></Link>
            <Link to="/signup"><button className="btn-primary" style={{width:'auto', padding:'6px 16px'}}>Sign Up</button></Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar