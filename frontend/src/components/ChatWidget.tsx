import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { X, ArrowUp, ArrowRight } from 'lucide-react'
import type { ChatMessage } from '../types'

const API_URL = import.meta.env.PROD
  ? 'https://workwave-amplify-backend.onrender.com/api/chat'
  : 'http://localhost:10000/api/chat'

const WAIVE_PURPLE = '#6310D1'

const NUDGE_MESSAGES = [
  'Need help picking sessions? I know all 100+.',
  "Curious what's new this year? Ask me.",
  'I can help you build your perfect agenda.',
  'First time at AMPLIFY? I have tips.',
  'Ask me about New Orleans travel tips.',
]

export default function ChatWidget() {
  const location = useLocation()
  const shouldAnimate = location.pathname === '/faq' || location.pathname === '/'
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [nudgeText, setNudgeText] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('open-chat', handler)
    return () => window.removeEventListener('open-chat', handler)
  }, [])

  // Idle nudge: show a bubble after 25s if chat hasn't been opened this session
  useEffect(() => {
    if (sessionStorage.getItem('amplify-nudge-shown')) return
    const timer = setTimeout(() => {
      if (!isOpen) {
        const msg = NUDGE_MESSAGES[Math.floor(Math.random() * NUDGE_MESSAGES.length)]
        setNudgeText(msg)
        sessionStorage.setItem('amplify-nudge-shown', '1')
        // Auto-dismiss after 8s
        setTimeout(() => setNudgeText(null), 8000)
      }
    }, 25000)
    return () => clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen && inputRef.current && window.innerWidth >= 640) {
      inputRef.current.focus()
    }
    if (isOpen) {
      const healthUrl = API_URL.replace('/api/chat', '/health')
      fetch(healthUrl).catch(() => {})
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    if (window.innerWidth >= 640) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || window.innerWidth >= 640) return
    function onFocusIn() {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 350)
    }
    const el = inputRef.current
    el?.addEventListener('focus', onFocusIn)
    return () => el?.removeEventListener('focus', onFocusIn)
  }, [isOpen])

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim()
    if (!text || isLoading) return

    const userMessage: ChatMessage = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Something went wrong')
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      let buffer = ''

      setMessages([...updatedMessages, { role: 'assistant', content: '' }])
      setIsLoading(false)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const event = JSON.parse(data)
            if (event.text) {
              assistantContent += event.text
              setMessages([...updatedMessages, { role: 'assistant', content: assistantContent }])
            }
          } catch {}
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: errorMessage },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .amp-chat-panel {
          position: fixed;
          z-index: 9999;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 0;
          animation: amp-slideUp 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @media (min-width: 640px) {
          .amp-chat-panel {
            top: auto;
            left: auto;
            bottom: 6rem;
            right: 1.25rem;
            width: 380px;
            height: min(580px, calc(100vh - 8rem));
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            animation: amp-scaleUp 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            transform-origin: bottom right;
          }
        }
        @keyframes amp-slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes amp-scaleUp {
          from { opacity: 0; transform: scale(0.5) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .amp-launcher {
          position: fixed;
          z-index: 9999;
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .amp-launcher:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }
        .amp-launcher-attention {
          animation: amp-attention 2s ease-in-out infinite;
        }
        @keyframes amp-attention {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
          15% { transform: scale(1.15) rotate(-5deg); box-shadow: 0 6px 24px rgba(99,16,209,0.4); }
          30% { transform: scale(1.1) rotate(3deg); box-shadow: 0 6px 24px rgba(99,16,209,0.3); }
          45% { transform: scale(1.05) rotate(0deg); box-shadow: 0 4px 16px rgba(99,16,209,0.2); }
        }
        .amp-nudge {
          position: fixed;
          z-index: 9998;
          bottom: 84px;
          right: 20px;
          max-width: 220px;
          background: white;
          border-radius: 12px 12px 4px 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          padding: 10px 14px;
          font-size: 13px;
          color: #374151;
          line-height: 1.4;
          animation: amp-nudgeIn 300ms ease-out forwards;
          cursor: pointer;
        }
        .amp-nudge::after {
          content: '';
          position: absolute;
          bottom: -6px;
          right: 16px;
          width: 12px;
          height: 12px;
          background: white;
          transform: rotate(45deg);
          box-shadow: 2px 2px 4px rgba(0,0,0,0.06);
        }
        @keyframes amp-nudgeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {!isOpen && nudgeText && (
        <div className="amp-nudge" onClick={() => { setNudgeText(null); setIsOpen(true) }}>
          {nudgeText}
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => { setNudgeText(null); setIsOpen(true) }}
          className={`amp-launcher text-white flex items-center justify-center ${shouldAnimate ? 'amp-launcher-attention' : ''}`}
          style={{ backgroundColor: WAIVE_PURPLE }}
          aria-label="Ask WAIve"
        >
          <img src="/logos/waive-mark-white.svg" alt="Ask WAIve" className="w-7 h-7" />
        </button>
      )}

      {isOpen && (
        <div className="amp-chat-panel flex flex-col overflow-hidden bg-white border border-gray-200">
          {/* Header - white bg matching official WAIve widget */}
          <div
            className="bg-white shrink-0 flex items-center justify-between border-b border-gray-200"
            style={{ minHeight: '56px', padding: '0 12px 0 16px' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: WAIVE_PURPLE }}
              >
                <img src="/logos/waive-mark-white.svg" alt="WAIve" className="w-5 h-5" />
              </div>
              <span className="text-gray-900 text-base font-bold">WAIve<sup className="text-[10px] ml-0.5">®</sup></span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
              style={{ width: '44px', height: '44px' }}
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div style={{ padding: '16px' }}>
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center mx-auto mb-5">
                    <img src="/logos/waive-mark-gradient.svg" alt="WAIve" className="w-16 h-16" />
                  </div>
                  <p className="text-base text-gray-900 font-bold mb-1">Ask WAIve anything about</p>
                  <p className="text-base text-gray-900 font-bold mb-2">AMPLIFY</p>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    Sessions, speakers, travel, registration, New Orleans tips.<br />
                    I've got you covered.
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      'What sessions should I attend?',
                      'Tell me about New Orleans',
                      'How much does it cost?',
                      "What's new this year?",
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="w-full text-left text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 transition-colors cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {messages.map((msg, i) => {
                  const hasRegister = msg.role === 'assistant' && msg.content.includes('[REGISTER_NOW]')
                  const textContent = hasRegister ? msg.content.replace('[REGISTER_NOW]', '').trim() : msg.content

                  return (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        style={{
                          maxWidth: '80%',
                          padding: '10px 16px',
                          borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          fontSize: '14px',
                          lineHeight: '1.45',
                          ...(msg.role === 'user' ? { backgroundColor: WAIVE_PURPLE } : {}),
                        }}
                      >
                        {textContent}
                        {hasRegister && (
                          <a
                            href="https://workwaveconference.cventevents.com/9AWddk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 w-full flex items-center justify-center gap-2 bg-magenta hover:bg-magenta-dark text-white font-semibold transition-colors"
                            style={{
                              padding: '10px 16px',
                              borderRadius: '10px',
                              fontSize: '14px',
                              textDecoration: 'none',
                              display: 'flex',
                            }}
                          >
                            Register Now
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}

                {isLoading && (
                  <div className="flex justify-start">
                    <div
                      className="bg-gray-100"
                      style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px' }}
                    >
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div ref={messagesEndRef} />
            </div>

            <div
              className="sticky bottom-0 bg-white border-t border-gray-100"
              style={{ padding: '8px 12px', paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))' }}
            >
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage() }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about AMPLIFY..."
                  className="flex-1 border border-gray-300 bg-white focus:outline-none focus:border-gray-400 transition-colors"
                  style={{
                    fontSize: '16px',
                    height: '44px',
                    borderRadius: '12px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                  }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="text-white disabled:text-gray-400 flex items-center justify-center transition-colors shrink-0"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: !input.trim() || isLoading ? '#e5e7eb' : WAIVE_PURPLE,
                  }}
                  aria-label="Send message"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
