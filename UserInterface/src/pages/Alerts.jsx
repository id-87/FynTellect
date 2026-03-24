import React from 'react';
import './Alerts.css';

export default function Alerts() {
  const mockAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Budget Alert: Food Category',
      message: "You've spent 85% of your food budget for this month. Consider reducing expenses.",
      timestamp: '2026-03-24T10:30:00',
      read: false,
    },
    {
      id: 2,
      type: 'success',
      title: 'Savings Goal Achieved',
      message: "Congratulations! You've reached your monthly savings goal of $500.",
      timestamp: '2026-03-23T15:45:00',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'Bill Reminder',
      message: 'Your internet bill of $79.99 is due in 3 days.',
      timestamp: '2026-03-23T09:00:00',
      read: true,
    },
    {
      id: 4,
      type: 'warning',
      title: 'Unusual Spending Detected',
      message: 'Your spending on transportation is 40% higher than usual this week.',
      timestamp: '2026-03-22T18:20:00',
      read: true,
    },
    {
      id: 5,
      type: 'info',
      title: 'Income Received',
      message: 'Your salary of $3,500 has been deposited to your account.',
      timestamp: '2026-03-22T08:00:00',
      read: true,
    },
    {
      id: 6,
      type: 'error',
      title: 'Budget Exceeded: Utilities',
      message: "You've exceeded your utilities budget by $20. Review your expenses.",
      timestamp: '2026-03-21T14:30:00',
      read: true,
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const handleDelete = (id) => {
    console.log('Delete alert:', id);
  };

  const handleMarkAsRead = (id) => {
    console.log('Mark as read:', id);
  };

  const unreadCount = mockAlerts.filter(alert => !alert.read).length;

  return (
    <div className="alerts-page">
      <div className="alerts-container">
        <div className="page-header">
          <div>
            <h1>Alerts & Notifications</h1>
            <p>Stay updated with your financial activities</p>
          </div>
          <div className="header-actions">
            <div className="unread-badge">{unreadCount} Unread</div>
            <button className="outline-btn">Mark All as Read</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Total Alerts</span>
              <span className="stat-icon">🔔</span>
            </div>
            <div className="stat-value">{mockAlerts.length}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Unread</span>
              <span className="stat-icon blue">🔔</span>
            </div>
            <div className="stat-value blue">{unreadCount}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Warnings</span>
              <span className="stat-icon">⚠️</span>
            </div>
            <div className="stat-value yellow">
              {mockAlerts.filter(a => a.type === 'warning').length}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Important</span>
              <span className="stat-icon">❌</span>
            </div>
            <div className="stat-value red">
              {mockAlerts.filter(a => a.type === 'error').length}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>All Notifications</h2>
            <p>Your recent alerts and updates from the system</p>
          </div>
          
          <div className="alerts-list">
            {mockAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`alert-item ${alert.type} ${!alert.read ? 'unread' : ''}`}
              >
                <div className="alert-icon">{getIcon(alert.type)}</div>
                <div className="alert-content">
                  <div className="alert-header-row">
                    <div className="alert-title">
                      {alert.title}
                      {!alert.read && <span className="new-badge">New</span>}
                    </div>
                    <div className="alert-actions">
                      {!alert.read && (
                        <button 
                          className="icon-btn"
                          onClick={() => handleMarkAsRead(alert.id)}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button 
                        className="icon-btn delete"
                        onClick={() => handleDelete(alert.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p className="alert-message">{alert.message}</p>
                  <div className="alert-footer">
                    <span className="alert-time">{formatTimestamp(alert.timestamp)}</span>
                    <span className={`alert-type-badge ${alert.type}`}>{alert.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card preferences-card">
          <div className="card-header">
            <h2>Notification Preferences</h2>
            <p>Customize what alerts you want to receive</p>
          </div>
          
          <div className="preferences-grid">
            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">💵</span>
                <div>
                  <p className="preference-title">Budget Alerts</p>
                  <p className="preference-desc">Get notified about budget usage</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            
            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">📈</span>
                <div>
                  <p className="preference-title">Savings Tips</p>
                  <p className="preference-desc">Receive personalized saving suggestions</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked />
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">🔔</span>
                <div>
                  <p className="preference-title">Bill Reminders</p>
                  <p className="preference-desc">Reminders for upcoming bills</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked />
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">ℹ️</span>
                <div>
                  <p className="preference-title">Transaction Updates</p>
                  <p className="preference-desc">Alerts for new transactions</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
