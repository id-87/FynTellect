import React from 'react';
import './Navbar.css';

export default function Navbar({ currentPage, onNavigate, onLogout }) {
  const navItems = [
    { path: 'home', label: 'Home', icon: '🏠' },
    { path: 'transactions', label: 'Transactions', icon: '💳' },
    { path: 'budget', label: 'Budget', icon: '💰' },
    { path: 'alerts', label: 'Alerts', icon: '🔔' },
    { path: 'agent-chat', label: 'Agent Chat', icon: '💬' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => onNavigate('home')}>
          <span className="navbar-logo">💰</span>
          <span className="navbar-title">FinTellect</span>
        </div>
        
        <div className="navbar-menu">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${currentPage === item.path ? 'active' : ''}`}
              onClick={() => onNavigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <span>🚪</span> Logout
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`mobile-nav-item ${currentPage === item.path ? 'active' : ''}`}
            onClick={() => onNavigate(item.path)}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
