import React, { useState, useRef, useEffect } from 'react';
import './AgentChat.css';

export default function AgentChat() {
  const initialMessages = [
    {
      id: 1,
      sender: 'agent',
      text: "Hello! I'm your FinTellect AI assistant. I'm here to help you manage your finances better. How can I assist you today?",
      timestamp: new Date(),
    },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const sampleResponses = [
    "Based on your spending patterns, I notice you're doing great with staying within your budget! Your food expenses are well-controlled.",
    "Let me analyze your transactions... I see you've spent $250.50 this week. That's 15% less than last week - excellent progress!",
    "Your current savings rate is impressive at 28% of income. To reach your goal faster, consider reducing entertainment expenses by 10%.",
    "I've reviewed your budget. You have $1,749.50 remaining this month. At your current spending rate, you'll finish the month with a surplus!",
    "Good question! I recommend setting aside an emergency fund of 3-6 months of expenses. Based on your spending, that would be around $9,000-$18,000.",
    "Your utilities spending is higher than average this month. Would you like some tips on reducing these costs?",
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      const agentMessage = {
        id: messages.length + 2,
        sender: 'agent',
        text: randomResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: '📈', text: 'Show spending trends', color: 'blue' },
    { icon: '💵', text: 'Budget analysis', color: 'green' },
    { icon: '📊', text: 'Category breakdown', color: 'purple' },
  ];

  return (
    <div className="agent-chat-page">
      <div className="agent-chat-container">
        <div className="page-header">
          <div>
            <h1>AI Financial Agent</h1>
            <p>Chat with your personal finance assistant</p>
          </div>
        </div>

        <div className="chat-layout">
          <div className="chat-main">
            <div className="chat-card">
              <div className="chat-header">
                <div className="agent-avatar">🤖</div>
                <div>
                  <h3>FinTellect Agent</h3>
                  <p className="status">Online • Always here to help</p>
                </div>
              </div>

              <div className="messages-area" ref={scrollRef}>
                <div className="messages-list">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.sender}`}
                    >
                      {message.sender === 'agent' && (
                        <div className="message-avatar">🤖</div>
                      )}
                      <div className="message-bubble">
                        <p className="message-text">{message.text}</p>
                        <p className="message-time">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <div className="message-avatar user">👤</div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="message agent">
                      <div className="message-avatar">🤖</div>
                      <div className="message-bubble typing">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="chat-input-area">
                <input
                  type="text"
                  placeholder="Ask me anything about your finances..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="chat-input"
                />
                <button 
                  className="send-btn" 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>

          <div className="chat-sidebar">
            <div className="card">
              <div className="card-header">
                <h3>Quick Actions</h3>
                <p>Common questions to ask</p>
              </div>
              <div className="quick-actions-list">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="quick-action-btn"
                    onClick={() => setInputValue(action.text)}
                  >
                    <span className="action-icon">{action.icon}</span>
                    {action.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>What I Can Help With</h3>
              </div>
              <ul className="help-list">
                <li>Analyze your spending patterns and trends</li>
                <li>Provide personalized budget recommendations</li>
                <li>Answer questions about your transactions</li>
                <li>Offer saving tips and financial advice</li>
                <li>Help you achieve your financial goals</li>
                <li>Identify unusual spending activities</li>
              </ul>
            </div>

            <div className="card tip-card">
              <div className="card-header">
                <h3>💡 Pro Tip</h3>
              </div>
              <p className="tip-text">
                Ask me specific questions about your finances for better insights. For example: "How much did I spend on food last month?" or "Am I on track with my budget?"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
