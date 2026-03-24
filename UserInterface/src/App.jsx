import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import BudgetConfig from './pages/BudgetConfig';
import Alerts from './pages/Alerts';
import AgentChat from './pages/AgentChat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  const renderPage = () => {
    if (!isLoggedIn && currentPage !== 'signup') {
      return <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'transactions':
        return <Transactions />;
      case 'budget':
        return <BudgetConfig />;
      case 'alerts':
        return <Alerts />;
      case 'agent-chat':
        return <AgentChat />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'signup':
        return <Signup onSignup={handleLogin} onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      {isLoggedIn && currentPage !== 'login' && currentPage !== 'signup' && (
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
      )}
      {renderPage()}
    </div>
  );
}
