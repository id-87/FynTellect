import React, { useState } from 'react';
import './BudgetConfig.css';

export default function BudgetConfig() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const mockBudgets = [
    { id: 1, category: 'Food', budget: 500, spent: 143, period: 'monthly' },
    { id: 2, category: 'Transportation', budget: 200, spent: 60, period: 'monthly' },
    { id: 3, category: 'Utilities', budget: 300, spent: 200, period: 'monthly' },
    { id: 4, category: 'Entertainment', budget: 150, spent: 95, period: 'monthly' },
    { id: 5, category: 'Healthcare', budget: 200, spent: 0, period: 'monthly' },
    { id: 6, category: 'Shopping', budget: 250, spent: 180, period: 'monthly' },
  ];

  const getPercentage = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const totalBudget = mockBudgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = mockBudgets.reduce((sum, b) => sum + b.spent, 0);
  const totalPercentage = getPercentage(totalSpent, totalBudget);

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    console.log('Delete budget:', id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit budget:', editingBudget);
    setIsDialogOpen(false);
    setEditingBudget(null);
  };

  const openAddDialog = () => {
    setEditingBudget(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="budget-page">
      <div className="budget-container">
        <div className="page-header">
          <div>
            <h1>Budget Configuration</h1>
            <p>Set and manage budgets for different categories</p>
          </div>
          <button className="add-btn" onClick={openAddDialog}>
            <span>➕</span> Add Budget
          </button>
        </div>

        {/* Overall Summary */}
        <div className="card summary-card">
          <div className="card-header">
            <h2>Overall Budget Summary</h2>
            <p>Total budget across all categories</p>
          </div>
          <div className="summary-stats">
            <div className="summary-stat">
              <p className="summary-label">Total Budget</p>
              <p className="summary-value">${totalBudget.toFixed(2)}</p>
            </div>
            <div className="summary-stat">
              <p className="summary-label">Total Spent</p>
              <p className={`summary-value ${getStatusColor(totalPercentage)}`}>
                ${totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="summary-stat">
              <p className="summary-label">Remaining</p>
              <p className="summary-value success">
                ${(totalBudget - totalSpent).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${getStatusColor(totalPercentage)}`}
              style={{ width: `${totalPercentage}%` }}
            ></div>
          </div>
          <p className="summary-text">
            {totalPercentage.toFixed(1)}% of total budget used
          </p>
        </div>

        {/* Budget Cards */}
        <div className="budget-grid">
          {mockBudgets.map((budget) => {
            const percentage = getPercentage(budget.spent, budget.budget);
            const remaining = budget.budget - budget.spent;
            const statusColor = getStatusColor(percentage);
            
            return (
              <div key={budget.id} className="budget-card">
                <div className="budget-card-header">
                  <div>
                    <h3>{budget.category}</h3>
                    <p className="period">{budget.period}</p>
                  </div>
                  <div className="budget-actions">
                    <button className="icon-btn" onClick={() => handleEdit(budget)}>✏️</button>
                    <button className="icon-btn" onClick={() => handleDelete(budget.id)}>🗑️</button>
                  </div>
                </div>
                <div className="budget-card-content">
                  <div className="budget-row">
                    <span className="budget-label">Spent</span>
                    <span className={`budget-amount ${statusColor}`}>
                      ${budget.spent.toFixed(2)}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${statusColor}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="budget-row">
                    <span className="budget-label">Budget</span>
                    <span className="budget-amount">${budget.budget.toFixed(2)}</span>
                  </div>
                  <div className="budget-footer">
                    <div className="remaining-box">
                      <span className="budget-label">Remaining</span>
                      <div className="remaining-amount">
                        <span className="trend-icon">{remaining > 0 ? '📈' : '📉'}</span>
                        <span className={`amount ${remaining > 0 ? 'success' : 'danger'}`}>
                          ${Math.abs(remaining).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <p className="usage-text">{percentage.toFixed(1)}% used</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>{editingBudget ? 'Edit Budget' : 'Add New Budget'}</h2>
              <button className="close-btn" onClick={() => setIsDialogOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category</label>
                <select defaultValue={editingBudget?.category || ''}>
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Budget Amount</label>
                <input type="number" step="0.01" placeholder="0.00" defaultValue={editingBudget?.budget} required />
              </div>
              <div className="form-group">
                <label>Period</label>
                <select defaultValue={editingBudget?.period || 'monthly'}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="dialog-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsDialogOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn">{editingBudget ? 'Update' : 'Add'} Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
