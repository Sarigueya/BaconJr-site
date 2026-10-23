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

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)
  const nextMessageId = useRef(2)

  const toggleChat = () => setIsOpen((prev) => !prev)

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
    setTimeout(() => {
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
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      {/* Panel de chat */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[520px] bg-white border border-arena rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Asistente de BACON JR."
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-fuego text-carbon">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <h2 className="text-sm font-bold tracking-wide">
                ASISTENTE BACON JR.
              </h2>
            </div>
            <button
              type="button"
              onClick={toggleChat}
              className="p-1 text-carbon/80 hover:text-carbon transition-colors"
              aria-label="Cerrar chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-crema">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                    message.sender === 'user'
                      ? 'bg-fuego text-carbon rounded-br-sm'
                      : 'bg-white text-carbon border border-arena rounded-bl-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />

            {/* Respuestas rápidas sugeridas (solo visuales) */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => sendMessage(reply)}
                    className="px-3 py-1.5 text-xs font-medium border border-arena rounded-full text-carbon hover:bg-fuego-oscuro hover:text-white transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-3 border-t border-arena bg-white"
          >
            <label htmlFor="chatbot-input" className="sr-only">
              Escribe tu mensaje
            </label>
            <input
              id="chatbot-input"
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-3 py-2 text-sm border border-arena rounded-full text-carbon placeholder-humo focus:outline-none focus:ring-2 focus:ring-fuego"
            />
            <button
              type="submit"
              className="w-9 h-9 flex items-center justify-center bg-fuego text-white rounded-full hover:bg-fuego-oscuro transition-colors disabled:opacity-40"
              aria-label="Enviar mensaje"
              disabled={!inputValue.trim()}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-fuego text-white rounded-full shadow-lg flex items-center justify-center hover:bg-fuego-oscuro transition-colors"
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat de ayuda'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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