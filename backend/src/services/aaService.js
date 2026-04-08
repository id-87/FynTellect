const axios = require('axios')

const SETU_BASE_URL = 'https://fiu-sandbox.setu.co'
const CLIENT_ID = '3fe47df3-a44a-4e89-957b-0112dc6c3911'
const CLIENT_SECRET = 'Ej24BlCNSCYNkpUclIYf8ywJSnoUSCkS'
const PRODUCT_ID = '02648ca0-2d13-4341-b768-d194d6cfbe4c'

// Get auth token from Setu
async function getSetuToken() {
    const resp = await axios.post(
        'https://auth.setu.co/auth/realms/setu/protocol/openid-connect/token',
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    return resp.data.access_token
}

// Step 1: Create consent request
async function createConsent(req, res) {
    try {
        const { mobileNumber } = req.body
        if (!mobileNumber) return res.status(400).json({ message: 'Mobile number required' })

        const token = await getSetuToken()
        const now = new Date()
        const future = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours
        const dataStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) // 90 days ago

        const body = {
            consentDuration: { unit: 'MONTH', value: 1 },
            dataDateRange: {
                from: dataStart.toISOString(),
                to: now.toISOString()
            },
            dataFrequency: { unit: 'DAY', value: 1 },
            dataLife: { unit: 'MONTH', value: 1 },
            fetchType: 'ONETIME',
            fiTypes: ['DEPOSIT'],  // bank account data
            frequency: { unit: 'HOUR', value: 1 },
            purpose: {
                category: { type: 'string' },
                code: '101',
                refUri: 'https://api.rebit.org.in/aa/purpose/101.xml',
                text: 'Wealth management service'
            },
            redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/aa-callback`,
            vua: `${mobileNumber}@onemoney`  // sandbox AA handle
        }

        const resp = await axios.post(
            `${SETU_BASE_URL}/consents`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-product-instance-id': PRODUCT_ID,
                    'Content-Type': 'application/json'
                }
            }
        )

        return res.status(200).json({
            consentId: resp.data.id,
            redirectUrl: resp.data.url,
            status: resp.data.status
        })
    } catch (err) {
        console.error('Consent error:', err.response?.data || err.message)
        return res.status(500).json({ message: 'Failed to create consent', error: err.response?.data })
    }
}

// Step 2: Check consent status
async function getConsentStatus(req, res) {
    try {
        const { consentId } = req.params
        const token = await getSetuToken()

        const resp = await axios.get(
            `${SETU_BASE_URL}/consents/${consentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-product-instance-id': PRODUCT_ID
                }
            }
        )

        return res.status(200).json({
            consentId,
            status: resp.data.status,
            data: resp.data
        })
    } catch (err) {
        return res.status(500).json({ message: 'Failed to get consent status' })
    }
}

// Step 3: Create data session after consent approved
async function createDataSession(req, res) {
    try {
        const { consentId } = req.params
        const token = await getSetuToken()
        const now = new Date()
        const dataStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

        const resp = await axios.post(
            `${SETU_BASE_URL}/sessions`,
            {
                consentId,
                dataRange: {
                    from: dataStart.toISOString(),
                    to: now.toISOString()
                },
                format: { accept: 'json' }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-product-instance-id': PRODUCT_ID,
                    'Content-Type': 'application/json'
                }
            }
        )

        return res.status(200).json({
            sessionId: resp.data.id,
            status: resp.data.status
        })
    } catch (err) {
        console.error('Session error:', err.response?.data)
        return res.status(500).json({ message: 'Failed to create data session' })
    }
}

// Step 4: Fetch actual financial data
async function fetchFIData(req, res) {
    try {
        const { sessionId } = req.params
        const token = await getSetuToken()

        const resp = await axios.get(
            `${SETU_BASE_URL}/sessions/${sessionId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-product-instance-id': PRODUCT_ID
                }
            }
        )

        return res.status(200).json({
            status: resp.data.status,
            data: resp.data.data || [],
            sessionId
        })
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch FI data' })
    }
}

module.exports = { createConsent, getConsentStatus, createDataSession, fetchFIData }