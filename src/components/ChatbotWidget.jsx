import { useEffect, useRef, useState } from 'react'

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: '¡Hola! Soy el asistente virtual de BACON JR. ¿En qué puedo ayudarte hoy?',
  },
]

const QUICK_REPLIES = [
  '¿Cuál es el horario?',
  '¿Dónde están ubicados?',
  'Ver el menú',
]

// Respuesta genérica de mockup: por ahora el bot no tiene lógica real,
// solo confirma que el mensaje fue recibido.
const MOCK_BOT_REPLY =
  'Gracias por tu mensaje. Esta es una vista previa del chat, muy pronto podré ayudarte con respuestas reales.'

function ChatbotWidget({ isOpen, onToggle }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const nextMessageId = useRef(2)
  const replyTimeoutRef = useRef(null)

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMessage = {
      id: nextMessageId.current++,
      sender: 'user',
      text: trimmed,
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Simulamos la "respuesta" del bot tras un breve instante.
    replyTimeoutRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextMessageId.current++, sender: 'bot', text: MOCK_BOT_REPLY },
      ])
    }, 500)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage(inputValue)
  }

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onToggle()
    }

    document.addEventListener('keydown', onKeyDown)
    inputRef.current?.focus()

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onToggle])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  useEffect(
    () => () => {
      if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current)
    },
    []
  )

  const toggleChat = () => onToggle()

  return (
    <>
      {/* Panel de chat */}
      {isOpen && (
        <div
          className="fixed bottom-44 right-6 z-50 flex h-[70vh] max-h-[min(520px,calc(100vh-13rem))] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-arena bg-white shadow-2xl"
          role="dialog"
          aria-modal="false"
          aria-labelledby="chatbot-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-carbon px-4 py-3 text-crema">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-fuego" />
              <h2 id="chatbot-title" className="text-sm font-bold tracking-[0.2em] text-dorado uppercase">
                ASISTENTE BACON JR.
              </h2>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="rounded-full p-1 text-crema/70 transition-colors hover:text-dorado focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
              aria-label="Cerrar chat"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-crema px-4 py-4">
            <div
              role="log"
              aria-live="polite"
              aria-label="Mensajes del asistente"
              className="flex flex-col gap-3"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-snug ${
                      message.sender === 'user'
                        ? 'rounded-br-sm bg-fuego text-carbon'
                        : 'rounded-bl-sm border border-arena bg-white text-carbon'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />

            {/* Respuestas rápidas sugeridas (solo visuales) */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => sendMessage(reply)}
                    className="rounded-full border border-arena px-3 py-1.5 text-xs font-medium text-carbon transition-colors hover:bg-fuego-oscuro hover:text-white"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-arena bg-white px-3 py-3">
            <label htmlFor="chatbot-input" className="sr-only">
              Escribe tu mensaje
            </label>
            <input
              ref={inputRef}
              id="chatbot-input"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              maxLength={280}
              autoComplete="off"
              placeholder="Escribe tu mensaje..."
              className="w-full rounded-full border border-arena px-3 py-2 text-sm text-carbon placeholder-humo focus:border-fuego focus:outline-none focus:ring-2 focus:ring-fuego/30"
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-fuego text-white transition-colors hover:bg-fuego-oscuro disabled:opacity-40"
              aria-label="Enviar mensaje"
              disabled={!inputValue.trim()}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-6 6m6-6l6 6" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Botón flotante */}
      <button
        type="button"
        onClick={toggleChat}
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-fuego text-white shadow-lg transition-colors hover:bg-fuego-oscuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat de ayuda'}
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-xl font-bold">?</span>
        )}
      </button>
    </>
  )
}

export default ChatbotWidget
