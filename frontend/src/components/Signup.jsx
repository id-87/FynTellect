import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'

function Signup() {
    const [formData, setFormData] = useState({
        name: '', username: '', password: '',
        confirmPassword: '', role: '', organisation: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        setLoading(true)
        try {
            await authAPI.signup({
                name: formData.name,
                username: formData.username,
                password: formData.password,
                role: formData.role,
                organisation: formData.organisation
            })
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="auth-logo-name">Fyntellect</div>
                    <div className="auth-logo-sub">AI FINANCIAL ECOSYSTEM</div>
                </div>
                <h2>Create account</h2>
                <p className="auth-subtitle">Start managing your finances</p>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input name="username" value={formData.username} onChange={handleChange} placeholder="johndoe" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Organisation</label>
                        <input name="organisation" value={formData.organisation} onChange={handleChange} placeholder="Acme Corp" required />
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} required>
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 chars" required />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" required />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup