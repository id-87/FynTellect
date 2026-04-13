import { useState, useRef, useEffect } from 'react'
import { agentAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function Chat() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I am Fyntellect, your AI financial assistant. I have full context of your transactions and budgets. Ask me anything!'
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setLoading(true)

        try {
            const res = await agentAPI.chat(userMessage)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: res.data.response
            }])
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                error: true
            }])
        } finally {
            setLoading(false)
        }
    }

    const clearHistory = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(
                `${import.meta.env.VITE_AGENT_URL}/chat/history`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMessages([{
                role: 'assistant',
                content: 'Conversation cleared! How can I help you?'
            }])
        } catch (err) {
            console.error('Failed to clear history')
        }
    }

    return (
        <div className="chat-page">
            <div className="chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Fyntellect AI</h2>
                    <p>Your personal financial assistant — knows your transactions & budgets</p>
                </div>
                <button className="btn-secondary" onClick={clearHistory} style={{ fontSize: 12 }}>
                    Clear Chat
                </button>
            </div>

            <div className="messages-container">
                {messages.map((msg, i) => (
                    <div key={i} className={`message message-${msg.role} ${msg.error ? 'message-error' : ''}`}>
                        <div className="message-bubble">{msg.content}</div>
                    </div>
                ))}
                {loading && (
                    <div className="message message-assistant">
                        <div className="message-bubble loading-bubble">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask about your finances..."
                    disabled={loading}
                    className="chat-input"
                />
                <button type="submit" disabled={loading || !input.trim()} className="btn-send">
                    Send
                </button>
            </form>
        </div>
    )
}

export default Chat