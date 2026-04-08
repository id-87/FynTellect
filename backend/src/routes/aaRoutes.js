const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const {
    createConsent,
    getConsentStatus,
    createDataSession,
    fetchFIData
} = require('../services/aaService')

router.post('/consent', authMiddleware, createConsent)
router.get('/consent/:consentId', authMiddleware, getConsentStatus)
router.post('/data-session/:consentId', authMiddleware, createDataSession)
router.get('/data/:sessionId', authMiddleware, fetchFIData)

module.exports = router