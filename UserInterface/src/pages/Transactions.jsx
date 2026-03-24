import React, { useState } from 'react';
import './Transactions.css';

export default function Transactions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const mockTransactions = [
    { id: 1, date: '2026-03-23', description: 'Grocery Shopping', category: 'Food', amount: -85.50, type: 'expense' },
    { id: 2, date: '2026-03-22', description: 'Salary Deposit', category: 'Income', amount: 3500.00, type: 'income' },
    { id: 3, date: '2026-03-21', description: 'Electric Bill', category: 'Utilities', amount: -120.00, type: 'expense' },
    { id: 4, date: '2026-03-20', description: 'Restaurant', category: 'Food', amount: -45.00, type: 'expense' },
    { id: 5, date: '2026-03-19', description: 'Gas Station', category: 'Transportation', amount: -60.00, type: 'expense' },
    { id: 6, date: '2026-03-18', description: 'Freelance Project', category: 'Income', amount: 500.00, type: 'income' },
    { id: 7, date: '2026-03-17', description: 'Internet Bill', category: 'Utilities', amount: -79.99, type: 'expense' },
    { id: 8, date: '2026-03-16', description: 'Coffee Shop', category: 'Food', amount: -12.50, type: 'expense' },
  ];

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    console.log('Delete transaction:', id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit transaction:', editingTransaction);
    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  const openAddDialog = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="transactions-page">
      <div className="transactions-container">
        <div className="page-header">
          <div>
            <h1>Transactions</h1>
            <p>Manage your income and expenses</p>
          </div>
          <button className="add-btn" onClick={openAddDialog}>
            <span>➕</span> Add Transaction
          </button>
        </div>

        <div className="card">
          <div className="card-header-row">
            <div>
              <h2>All Transactions</h2>
              <p>View and manage all your transactions</p>
            </div>
            <div className="filter-controls">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td className="font-medium">{transaction.description}</td>
                    <td>{transaction.category}</td>
                    <td>
                      <span className={`badge ${transaction.type}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`text-right amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button className="icon-btn" onClick={() => handleEdit(transaction)}>✏️</button>
                        <button className="icon-btn delete" onClick={() => handleDelete(transaction.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
              <button className="close-btn" onClick={() => setIsDialogOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Description</label>
                <input type="text" placeholder="e.g., Grocery Shopping" defaultValue={editingTransaction?.description} required />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" step="0.01" placeholder="0.00" defaultValue={editingTransaction ? Math.abs(editingTransaction.amount) : ''} required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select defaultValue={editingTransaction?.type || 'expense'}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select defaultValue={editingTransaction?.category || ''}>
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Income">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" defaultValue={editingTransaction?.date} required />
              </div>
              <div className="dialog-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsDialogOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn">{editingTransaction ? 'Update' : 'Add'} Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
