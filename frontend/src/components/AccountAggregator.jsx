import { useState, useEffect, useRef } from 'react'
import { aaAPI } from '../services/api'
import { agentAPI } from '../services/api'

const STEPS = ['enter_mobile', 'consent_pending', 'consent_approved', 'fetching', 'done']

function AccountAggregator() {
    const [step, setStep] = useState('enter_mobile')
    const [mobile, setMobile] = useState('')
    const [consentId, setConsentId] = useState(null)
    const [sessionId, setSessionId] = useState(null)
    const [consentUrl, setConsentUrl] = useState(null)
    const [bankData, setBankData] = useState(null)
    const [analysis, setAnalysis] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const pollingRef = useRef(null)

    // Step 1: Create consent
    const handleCreateConsent = async (e) => {
        e.preventDefault()
        if (!mobile || mobile.length !== 10) {
            setError('Enter valid 10-digit mobile number')
            return
        }
        setLoading(true)
        setError('')
        try {
            const res = await aaAPI.createConsent(mobile)
            setConsentId(res.data.consentId)
            setConsentUrl(res.data.redirectUrl)
            setStep('consent_pending')
            startPolling(res.data.consentId)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create consent')
        } finally {
            setLoading(false)
        }
    }

    // Poll consent status every 5 seconds
    const startPolling = (id) => {
        pollingRef.current = setInterval(async () => {
            try {
                const res = await aaAPI.getConsentStatus(id)
                if (res.data.status === 'ACTIVE') {
                    clearInterval(pollingRef.current)
                    setStep('consent_approved')
                    await handleCreateSession(id)
                } else if (res.data.status === 'REJECTED') {
                    clearInterval(pollingRef.current)
                    setError('Consent was rejected. Please try again.')
                    setStep('enter_mobile')
                }
            } catch (err) {
                console.error('Polling error:', err)
            }
        }, 5000)
    }

    // Step 3: Create data session
    const handleCreateSession = async (id) => {
        setStep('fetching')
        try {
            const res = await aaAPI.createDataSession(id)
            setSessionId(res.data.sessionId)
            await handleFetchData(res.data.sessionId)
        } catch (err) {
            setError('Failed to create data session')
        }
    }

    // Step 4: Fetch bank data
    const handleFetchData = async (sid) => {
        try {
            const res = await aaAPI.fetchData(sid)
            setBankData(res.data.data)
            setStep('done')
            // Auto-analyze with AI agent
            await analyzeWithAgent(res.data.data)
        } catch (err) {
            setError('Failed to fetch bank data')
        }
    }

    // Step 5: AI analysis
    const analyzeWithAgent = async (data) => {
        try {
            const summary = JSON.stringify(data).slice(0, 2000)
            const res = await agentAPI.chat(
                `Analyze this bank statement data and give me key insights about spending patterns, income, and financial health: ${summary}`
            )
            setAnalysis(res.data.response)
        } catch (err) {
            console.error('Agent analysis failed:', err)
        }
    }

    useEffect(() => {
        return () => clearInterval(pollingRef.current)
    }, [])

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Account Aggregator</h1>
                <p>Fetch your bank statements securely with RBI-compliant consent</p>
            </div>

            {/* Progress Steps */}
            <div className="aa-steps">
                {['Mobile', 'Consent', 'Approved', 'Fetching', 'Done'].map((s, i) => (
                    <div key={i} className={`aa-step ${STEPS.indexOf(step) >= i ? 'active' : ''}`}>
                        <div className="aa-step-circle">{i + 1}</div>
                        <span>{s}</span>
                    </div>
                ))}
            </div>

            {error && <div className="error-banner">{error}</div>}

            {/* Step 1: Enter Mobile */}
            {step === 'enter_mobile' && (
                <div className="card" style={{ maxWidth: 480, margin: '32px auto' }}>
                    <div className="card-header"><h3>Enter Mobile Number</h3></div>
                    <div className="card-body">
                        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
                            We'll send a consent request to your Account Aggregator app linked to this number.
                        </p>
                        <form onSubmit={handleCreateConsent}>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    maxLength={10}
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Creating consent...' : 'Fetch Bank Statements'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Step 2: Consent Pending */}
            {step === 'consent_pending' && (
                <div className="card" style={{ maxWidth: 480, margin: '32px auto' }}>
                    <div className="card-header"><h3>Approve Consent</h3></div>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📱</div>
                        <p style={{ marginBottom: 20, color: 'var(--text-muted)', fontSize: 14 }}>
                            A consent request has been sent. Please approve it on your AA app or click the link below.
                        </p>
                        {consentUrl && (
                            <a href={consentUrl} target="_blank" rel="noopener noreferrer">
                                <button className="btn-primary" style={{ marginBottom: 16 }}>
                                    Open Consent Page →
                                </button>
                            </a>
                        )}
                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            Waiting for approval... <span className="polling-dot">●</span>
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 8 }}>
                            Consent ID: {consentId}
                        </p>
                    </div>
                </div>
            )}

            {/* Step 3: Fetching */}
            {(step === 'consent_approved' || step === 'fetching') && (
                <div className="card" style={{ maxWidth: 480, margin: '32px auto' }}>
                    <div className="card-header"><h3>Fetching Bank Data</h3></div>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🏦</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                            Consent approved! Fetching your bank statements securely...
                        </p>
                        <div className="loading-bubble" style={{ justifyContent: 'center', marginTop: 16 }}>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 5: Done — Show Data + AI Analysis */}
            {step === 'done' && (
                <div>
                    {/* AI Analysis */}
                    {analysis && (
                        <div className="card" style={{ marginBottom: 24 }}>
                            <div className="card-header">
                                <h3>🤖 AI Financial Analysis</h3>
                            </div>
                            <div className="card-body">
                                <p style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                    {analysis}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Raw Bank Data */}
                    {bankData && bankData.length > 0 && (
                        <div className="card">
                            <div className="card-header">
                                <h3>Bank Statement Data</h3>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                    {bankData.length} account(s) fetched
                                </span>
                            </div>
                            <div className="card-body">
                                <pre style={{
                                    fontSize: 12,
                                    background: 'var(--bg)',
                                    padding: 16,
                                    borderRadius: 8,
                                    overflow: 'auto',
                                    maxHeight: 400
                                }}>
                                    {JSON.stringify(bankData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    <button
                        className="btn-secondary"
                        style={{ marginTop: 16 }}
                        onClick={() => { setStep('enter_mobile'); setBankData(null); setAnalysis(null) }}
                    >
                        Fetch Another Account
                    </button>
                </div>
            )}
        </div>
    )
}

export default AccountAggregator