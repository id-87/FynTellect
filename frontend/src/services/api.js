import axios from 'axios'

// Two axios instances — one for Express, one for FastAPI
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL  // Express :4000
})

const agentApi = axios.create({
    baseURL: import.meta.env.VITE_AGENT_URL  // FastAPI :8001
})

// Request interceptor — attaches token automatically
const attachToken = (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
}




// Response interceptor — handles 401 globally
const handleError = (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
    }
    return Promise.reject(error)
}

api.interceptors.request.use(attachToken)
api.interceptors.response.use(res => res, handleError)

agentApi.interceptors.request.use(attachToken)
agentApi.interceptors.response.use(res => res, handleError)

// Auth API
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    signup: (data) => api.post('/auth/signup', data)
}

// Transaction API
export const transactionAPI = {
    getAll: () => api.get('/transaction/get'),
    getById: (id) => api.get(`/transaction/get/${id}`),
    create: (data) => api.post('/transaction/post', data),
    update: (id, data) => api.put(`/transaction/update/${id}`, data),
    delete: (id) => api.delete(`/transaction/delete/${id}`)
}

// Agent API
export const agentAPI = {
    chat: (message) => agentApi.post('/chat', { message })
}


export const aaAPI = {
    createConsent: (mobileNumber) => api.post('/aa/consent', { mobileNumber }),
    getConsentStatus: (consentId) => api.get(`/aa/consent/${consentId}`),
    createDataSession: (consentId) => api.post(`/aa/data-session/${consentId}`),
    fetchData: (sessionId) => api.get(`/aa/data/${sessionId}`)
}