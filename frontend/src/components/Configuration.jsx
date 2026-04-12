import { useState, useEffect } from 'react'
import { budgetAPI } from '../services/api'

const CATEGORIES = ['marketing', 'development', 'testing', 'legal']
const COLORS = {
    marketing: '#2563eb',
    development: '#16a34a',
    testing: '#d97706',
    legal: '#7c3aed'
}

function Configuration() {
    const [budgets, setBudgets] = useState([])
    const [formData, setFormData] = useState({ category: '', amount: '' })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchBudgets()
    }, [])

    const fetchBudgets = async () => {
        setLoading(true)
        try {
            const res = await budgetAPI.getAll()
            setBudgets(res.data.budgets || [])
        } catch (err) {
            setError('Failed to load budgets')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.category || !formData.amount) {
            setError('Please fill all fields')
            return
        }
        setSaving(true)
        setError('')
        try {
            await budgetAPI.set({
                category: formData.category,
                amount: parseFloat(formData.amount)
            })
            setSuccess(`Budget set for ${formData.category}!`)
            setFormData({ category: '', amount: '' })
            fetchBudgets()
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            setError('Failed to save budget')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (category) => {
        if (!window.confirm(`Delete budget for ${category}?`)) return
        try {
            await budgetAPI.delete(category)
            fetchBudgets()
        } catch (err) {
            setError('Failed to delete budget')
        }
    }

    const getBudgetForCategory = (cat) =>
        budgets.find(b => b.category === cat)

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Settings</h1>
                <p>Configure monthly budgets per category — stored in your AI agent's memory</p>
            </div>

            {error && <div className="error-banner">{error}</div>}
            {success && <div className="success-banner">✅ {success}</div>}

            {/* Budget Overview Cards */}
            <div className="stats-grid" style={{ marginBottom: 32 }}>
                {CATEGORIES.map(cat => {
                    const budget = getBudgetForCategory(cat)
                    return (
                        <div key={cat} className="stat-card" style={{ borderLeftColor: COLORS[cat] }}>
                            <span className="stat-label">{cat}</span>
                            {budget ? (
                                <span className="stat-value">₹{Number(budget.amount).toLocaleString()}</span>
                            ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Not set</span>
                            )}
                            {budget && (
                                <button
                                    className="btn-sm btn-delete"
                                    onClick={() => handleDelete(cat)}
                                    style={{ marginTop: 8, alignSelf: 'flex-start' }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Set Budget Form */}
            <div className="card" style={{ maxWidth: 520 }}>
                <div className="card-header">
                    <h3>Set Monthly Budget</h3>
                </div>
                <div className="card-body">
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                        Budgets are stored in Fyntellect's AI memory. Your agent will automatically
                        compare actual spending against these limits and alert you.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Monthly Limit (₹)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 50000"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    min="1"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? 'Saving to AI memory...' : 'Save Budget'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Agent Memory Info */}
            <div style={{
                marginTop: 24,
                padding: '16px 20px',
                background: 'var(--primary-light)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #bfdbfe',
                maxWidth: 520
            }}>
                <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>
                    🧠 How this works
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
                    Budgets are stored as vectors in Pinecone. When you ask Fyntellect about your spending,
                    it automatically retrieves your budgets and compares them against actual transactions
                    to give you personalized insights.
                </p>
            </div>
        </div>
    )
}

export default Configuration