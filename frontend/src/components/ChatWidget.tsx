import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { aiChat } from '../services/api'

interface Message {
  id: string
  role: 'bot' | 'user'
  text: string
  time: string
}

const WELCOME: Message = {
  id: '0', role: 'bot',
  text: "Hey there! 👋 I'm your NeonRide AI assistant. I can help with pricing, ride tracking, cancellations, and anything else about your trip. How can I help?",
  time: now(),
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getUser() {
  try { return JSON.parse(localStorage.getItem('neonride_user') ?? 'null') } catch { return null }
}

export default function ChatWidget() {
  const params = useParams<{ rideId?: string }>()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  async function sendMessage() {
    const text = input.trim()
    if (!text || typing) return
    setInput('')

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, time: now() }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)

    try {
      const user = getUser()
      const data = await aiChat({
        message: text,
        currentRideId: params.rideId,
        isGuest: !user,
      })
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', text: data.reply, time: now() }
      setMessages(prev => [...prev, botMsg])
    } catch {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'bot',
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        time: now(),
      }
      setMessages(prev => [...prev, botMsg])
    } finally {
      setTyping(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <>
      {/* Chat drawer */}
      <div className={`chat-drawer ${open ? 'open' : 'closed'}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">🤖</div>
            <div>
              <div className="chat-name">NeonRide AI</div>
              <div className="chat-status-dot">
                <div className="chat-online-dot" />
                Online · Always here
              </div>
            </div>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-msg ${msg.role}`}>
              {msg.role === 'bot' && (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', flexShrink: 0, alignSelf: 'flex-start' }}>
                  🤖
                </div>
              )}
              <div>
                <div className="msg-bubble">{msg.text}</div>
                <div className="msg-time">{msg.time}</div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="chat-msg bot">
              <div style={{ width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', flexShrink: 0 }}>🤖</div>
              <div className="msg-bubble" style={{ padding: '8px 14px' }}>
                <div className="typing-indicator">
                  <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length === 1 && (
          <div style={{ padding: '0 14px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['💰 Price estimate', '📦 Luggage policy', '🐾 Pet-friendly?', '🚨 Safety info'].map(q => (
              <button key={q}
                style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                  borderRadius: '12px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer',
                  transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--cyan)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border)' }}
                onClick={() => { setInput(q.replace(/^[^ ]+ /, '')); setTimeout(() => inputRef.current?.focus(), 50) }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="chat-input-area">
          <input
            ref={inputRef}
            className="chat-input"
            placeholder="Ask me anything…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="chat-send" onClick={sendMessage} disabled={!input.trim() || typing}>
            ➤
          </button>
        </div>
      </div>

      {/* Trigger button */}
      <button className="chat-trigger" onClick={() => setOpen(o => !o)} title="AI Assistant">
        {open ? '✕' : '💬'}
      </button>
    </>
  )
}
