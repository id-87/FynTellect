import { useState, useEffect } from 'react'
import { transactionAPI } from '../services/api'
import { agentAPI } from '../services/api'
import {
    PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis,
    Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { useAuth } from '../context/AuthContext'

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#7c3aed', '#dc2626', '#0891b2']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function Home() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [predicted, setPredicted] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await transactionAPI.getAll()
            setTransactions(res.data.Transactions || [])
        } catch (err) {
            console.error('Failed to fetch transactions', err)
        } finally {
            setLoading(false)
        }
    }

    // ─── Analytics Calculations ───
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const thisMonthTxns = transactions.filter(t => {
        const d = new Date(t.createdAt)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const successfulDebits = transactions.filter(t => t.status === 'successful' && t.type === 'debit')

    const totalSpent = successfulDebits
        .filter(t => {
            const d = new Date(t.createdAt)
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear
        })
        .reduce((sum, t) => sum + t.amount, 0)

    const avgSpend = successfulDebits.length > 0
        ? Math.round(successfulDebits.reduce((sum, t) => sum + t.amount, 0) / successfulDebits.length)
        : 0

    const mostExpensive = successfulDebits.length > 0
        ? successfulDebits.reduce((max, t) => t.amount > max.amount ? t : max, successfulDebits[0])
        : null

    // Category breakdown for pie chart
    const categoryMap = {}
    successfulDebits.forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
    })
    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

    // Monthly trend for line chart
    const monthlyMap = {}
    successfulDebits.forEach(t => {
        const month = MONTHS[new Date(t.createdAt).getMonth()]
        monthlyMap[month] = (monthlyMap[month] || 0) + t.amount
    })
    const monthlyData = MONTHS
        .filter(m => monthlyMap[m])
        .map(m => ({ month: m, amount: monthlyMap[m] }))

    // Predicted spend = average of last 3 months
    const last3 = monthlyData.slice(-3)
    const predictedSpend = last3.length > 0
        ? Math.round(last3.reduce((sum, m) => sum + m.amount, 0) / last3.length)
        : 0

    if (loading) return <div className="loading">Loading dashboard...</div>

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome back{user?.username ? `, ${user.username}` : ''}. Here's your financial overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Total Spent This Month</span>
                    <span className="stat-value">₹{totalSpent.toLocaleString()}</span>
                </div>
                <div className="stat-card green">
                    <span className="stat-label">Avg Spend / Transaction</span>
                    <span className="stat-value">₹{avgSpend.toLocaleString()}</span>
                </div>
                <div className="stat-card amber">
                    <span className="stat-label">Predicted Next Month</span>
                    <span className="stat-value">₹{predictedSpend.toLocaleString()}</span>
                </div>
                <div className="stat-card purple">
                    <span className="stat-label">Transactions This Month</span>
                    <span className="stat-value">{thisMonthTxns.length}</span>
                </div>
            </div>

            {/* Most Expensive */}
            {mostExpensive && (
                <div className="alert-card">
                    <span className="alert-label">💸 Most Expensive Transaction</span>
                    <span className="alert-value">
                        ₹{mostExpensive.amount.toLocaleString()} — {mostExpensive.category} ({mostExpensive.status})
                    </span>
                </div>
            )}

            {/* Charts Grid */}
            <div className="dashboard-grid">

                {/* Spending by Category — Pie */}
                <div className="card">
                    <div className="card-header">
                        <h3>Spending by Category</h3>
                    </div>
                    <div className="card-body">
                        {categoryData.length === 0 ? (
                            <div className="empty-state">No data yet</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {categoryData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Monthly Trend — Line */}
                <div className="card">
                    <div className="card-header">
                        <h3>Monthly Spending Trend</h3>
                    </div>
                    <div className="card-body">
                        {monthlyData.length === 0 ? (
                            <div className="empty-state">No data yet</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={monthlyData}>
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#2563eb"
                                        strokeWidth={2.5}
                                        dot={{ fill: '#2563eb', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Category Bar Chart */}
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h3>Category Breakdown</h3>
                    </div>
                    <div className="card-body">
                        {categoryData.length === 0 ? (
                            <div className="empty-state">No data yet</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={categoryData}>
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {categoryData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Home