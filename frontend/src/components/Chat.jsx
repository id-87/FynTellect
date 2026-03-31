import { useState, useRef, useEffect } from 'react'
import { agentAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'


function Chat() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I am FinOS, your AI financial assistant. Ask me about your spending, budget, or stock news!'
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const { user } = useAuth()

    // Auto scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage = input.trim()
        setInput('')

        // Add user message immediately
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

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>FinOS AI Assistant</h2>
                <p>Ask about your spending, forecasts, budgets, or stocks</p>
            </div>

            {/* Messages */}
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message message-${msg.role} ${msg.error ? 'message-error' : ''}`}
                    >
                        <div className="message-bubble">
                            {msg.content}
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
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

            {/* Input */}
            <form className="chat-input-form" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your finances..."
                    disabled={loading}
                    className="chat-input"
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="btn-send"
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default Chat