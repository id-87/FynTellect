import React from 'react';
import './Home.css';

export default function Home({ onNavigate }) {
  const mockData = [
    { month: 'Jan', balance: 4500 },
    { month: 'Feb', balance: 5200 },
    { month: 'Mar', balance: 4800 },
    { month: 'Apr', balance: 6100 },
    { month: 'May', balance: 5900 },
    { month: 'Jun', balance: 7200 },
  ];

  const recentTransactions = [
    { id: 1, description: 'Grocery Shopping', amount: -85.50, date: '2026-03-23', category: 'Food' },
    { id: 2, description: 'Salary Deposit', amount: 3500.00, date: '2026-03-22', category: 'Income' },
    { id: 3, description: 'Electric Bill', amount: -120.00, date: '2026-03-21', category: 'Utilities' },
    { id: 4, description: 'Restaurant', amount: -45.00, date: '2026-03-20', category: 'Food' },
  ];

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1>Welcome to FinTellect</h1>
          <p>Your intelligent financial management companion</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Total Balance</span>
              <span className="stat-icon">💵</span>
            </div>
            <div className="stat-value">$7,200.00</div>
            <div className="stat-change positive">
              <span>📈</span>
              <span>+12.5% from last month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Income (This Month)</span>
              <span className="stat-icon green">↗️</span>
            </div>
            <div className="stat-value green">$3,500.00</div>
            <p className="stat-subtitle">From 3 sources</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Expenses (This Month)</span>
              <span className="stat-icon red">↘️</span>
            </div>
            <div className="stat-value red">$1,250.50</div>
            <p className="stat-subtitle">Across 8 categories</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Budget Remaining</span>
              <span className="stat-icon">📊</span>
            </div>
            <div className="stat-value">$1,749.50</div>
            <p className="stat-subtitle">58% of monthly budget</p>
          </div>
        </div>

        <div className="content-grid">
          {/* Balance Trend Chart */}
          <div className="card chart-card">
            <div className="card-header">
              <h2>Balance Trend</h2>
              <p>Your account balance over the last 6 months</p>
            </div>
            <div className="chart-container">
              <div className="simple-chart">
                {mockData.map((item, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar" 
                      style={{ height: `${(item.balance / 8000) * 100}%` }}
                    ></div>
                    <span className="bar-label">{item.month}</span>
                    <span className="bar-value">${item.balance}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card transactions-card">
            <div className="card-header">
              <h2>Recent Transactions</h2>
              <p>Last 4 transactions</p>
            </div>
            <div className="transactions-list">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <p className="transaction-desc">{transaction.description}</p>
                    <p className="transaction-date">{transaction.date}</p>
                  </div>
                  <div className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn" onClick={() => onNavigate('transactions')}>
              View All Transactions
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="action-card" onClick={() => onNavigate('transactions')}>
            <div className="action-icon">💳</div>
            <h3>Add Transaction</h3>
            <p>Record a new income or expense</p>
          </div>

          <div className="action-card" onClick={() => onNavigate('budget')}>
            <div className="action-icon">📊</div>
            <h3>Set Budget</h3>
            <p>Configure budgets for categories</p>
          </div>

          <div className="action-card" onClick={() => onNavigate('agent-chat')}>
            <div className="action-icon">💬</div>
            <h3>Ask Agent</h3>
            <p>Get financial insights and advice</p>
          </div>
        </div>
      </div>
    </div>
  );
}
