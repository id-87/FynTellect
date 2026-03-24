import React, { useState } from 'react';
import './Signup.css';

export default function Signup({ onSignup, onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup submitted');
    onSignup();
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-icon">💰</div>
          <h1>FinTellect</h1>
          <p>Start your financial journey today</p>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Sign up to start managing your finances</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-with-icon">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <label className="checkbox-label terms-label">
              <input type="checkbox" required />
              <span>
                I agree to the{' '}
                <a href="#" className="inline-link">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="inline-link">Privacy Policy</a>
              </span>
            </label>

            <button type="submit" className="auth-submit-btn">
              Create Account
            </button>
          </form>

          <div className="auth-divider">
            <span>Or sign up with</span>
          </div>

          <div className="social-btns">
            <button type="button" className="social-btn">
              <span className="social-icon">🔵</span>
              Google
            </button>
            <button type="button" className="social-btn">
              <span className="social-icon">⚫</span>
              GitHub
            </button>
          </div>

          <div className="auth-footer">
            <span>Already have an account? </span>
            <button 
              type="button" 
              className="link-btn" 
              onClick={() => onNavigate('login')}
            >
              Sign in
            </button>
          </div>
        </div>

        <p className="auth-terms">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
