import { useState, useEffect } from 'react'
import { transactionAPI } from '../services/api'

function Transactions() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [editingId, setEditingId] = useState(null)

    const [formData, setFormData] = useState({
        type: '',
        amount: '',
        category: '',
        status: ''
    })

    // Fetch all transactions on mount
    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const res = await transactionAPI.getAll()
            setTransactions(res.data.Transactions)
        } catch (err) {
            setError('Failed to fetch transactions')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (editingId) {
                // Update existing
                await transactionAPI.update(editingId, formData)
                setEditingId(null)
            } else {
                // Create new
                await transactionAPI.create(formData)
            }
            setFormData({ type: '', amount: '', category: '', status: '' })
            fetchTransactions()  // refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed')
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = (transaction) => {
        setEditingId(transaction._id)
        setFormData({
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            status: transaction.status
        })
        // scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction?')) return
        try {
            await transactionAPI.delete(id)
            // optimistic update — remove from UI immediately
            setTransactions(prev => prev.filter(t => t._id !== id))
        } catch (err) {
            setError('Delete failed')
        }
    }

    const handleCancel = () => {
        setEditingId(null)
        setFormData({ type: '', amount: '', category: '', status: '' })
    }

    return (
        <div className="page-container">
            <h2>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>

            {error && <div className="error-banner">{error}</div>}

            {/* Form */}
            <form className="transaction-form" onSubmit={handleSubmit}>
                <select name="type" value={formData.type} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                </select>

                <input
                    type="number"
                    name="amount"
                    placeholder="Amount (₹)"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />

                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="marketing">Marketing</option>
                    <option value="development">Development</option>
                    <option value="testing">Testing</option>
                    <option value="legal">Legal</option>
                </select>

                <select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="">Select Status</option>
                    <option value="successful">Successful</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={submitting}>
                        {submitting ? 'Saving...' : editingId ? 'Update' : 'Add Transaction'}
                    </button>
                    {editingId && (
                        <button type="button" className="btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Table */}
            {loading ? (
                <div className="loading">Loading transactions...</div>
            ) : transactions.length === 0 ? (
                <div className="empty-state">No transactions yet. Add one above!</div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t._id}>
                                <td>
                                    <span className={`badge badge-${t.type}`}>
                                        {t.type}
                                    </span>
                                </td>
                                <td>₹{t.amount.toLocaleString()}</td>
                                <td>{t.category}</td>
                                <td>
                                    <span className={`badge badge-${t.status}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                                <td className="actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(t)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(t._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Transactions