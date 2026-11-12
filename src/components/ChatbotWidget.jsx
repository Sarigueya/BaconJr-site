import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { PRODUCTS, CATEGORIES } from '../data/products'
import { OFFERS } from '../data/offers'
import { NEARBY_STORES } from '../data/stores'
import { BUSINESS } from '../data/business'
import { FULFILLMENT_OPTIONS, PAYMENT_METHODS } from '../data/checkout'
import { createChatbot } from '../utils/chatbotEngine'
import { formatPrice } from '../utils/formatPrice'

const reply = createChatbot({
  products: PRODUCTS,
  categories: CATEGORIES,
  offers: OFFERS,
  stores: NEARBY_STORES,
  business: BUSINESS,
  fulfillment: FULFILLMENT_OPTIONS,
  payments: PAYMENT_METHODS,
})

const WELCOME = {
  id: 1,
  sender: 'bot',
  text: '¡Hola! Soy el asistente de BACON JR. Puedo mostrarte el menú y precios, contarte las ofertas del día o tomar tu pedido. ¿Qué se te antoja?',
  actions: [
    { type: 'reply', label: 'Ver el menú' },
    { type: 'reply', label: 'Ofertas de hoy' },
    { type: 'reply', label: '¿Cuál es el horario?' },
    { type: 'reply', label: '¿Qué me recomiendas?' },
  ],
}

const TYPING_DELAY_MS = 550

function ProductChip({ product, onAdd }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-arena bg-white p-2">
      {product.image && (
        <img src={product.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-carbon">{product.name}</p>
        <p className="text-xs font-bold text-fuego-oscuro">{formatPrice(product.price)}</p>
      </div>
      <button
        type="button"
        onClick={() => onAdd(product)}
        className="shrink-0 cursor-pointer rounded-lg bg-fuego-oscuro px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-fuego-profundo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
        aria-label={`Agregar ${product.name} al carrito`}
      >
        Agregar
      </button>
    </div>
  )
}

function ChatbotWidget({ isOpen, onToggle, onOpenCart }) {
  const [messages, setMessages] = useState([WELCOME])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const nextMessageId = useRef(2)
  const lastProductRef = useRef(null)
  const replyTimeoutRef = useRef(null)
  const navigate = useNavigate()
  const { items, addItem } = useCart()

  // Solo las acciones del último mensaje del bot quedan activas.
  const lastBotId = useMemo(
    () => [...messages].reverse().find((message) => message.sender === 'bot')?.id,
    [messages]
  )

  const pushMessage = (message) =>
    setMessages((prev) => [...prev, { id: nextMessageId.current++, ...message }])

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    pushMessage({ sender: 'user', text: trimmed })
    setInputValue('')
    setIsTyping(true)

    replyTimeoutRef.current = setTimeout(() => {
      const response = reply(trimmed, { lastProduct: lastProductRef.current, cartItems: items })
      if ('lastProduct' in response) lastProductRef.current = response.lastProduct
      if (response.addToCart) {
        addItem(response.addToCart.product, { quantity: response.addToCart.quantity })
      }
      setIsTyping(false)
      pushMessage({
        sender: 'bot',
        text: response.text,
        products: response.products,
        actions: response.actions,
      })
    }, TYPING_DELAY_MS)
  }

  const handleAddProduct = (product) => {
    addItem(product, { quantity: 1 })
    lastProductRef.current = product
    pushMessage({
      sender: 'bot',
      text: `¡Listo! Agregué ${product.name} a tu carrito.`,
      actions: [
        { type: 'cart', label: 'Ver carrito' },
        { type: 'reply', label: 'Bebidas' },
        { type: 'reply', label: 'Postres' },
      ],
    })
  }

  const handleAction = (action) => {
    if (action.type === 'reply') {
      sendMessage(action.label)
    } else if (action.type === 'link') {
      navigate(action.to)
      onToggle()
    } else if (action.type === 'external') {
      window.open(action.href, '_blank', 'noopener,noreferrer')
    } else if (action.type === 'cart') {
      onOpenCart?.()
    }
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
  }, [messages, isTyping, isOpen])

  useEffect(
    () => () => {
      if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current)
    },
    []
  )

  return (
    <>
      {/* Panel de chat */}
      {isOpen && (
        <div
          className="fixed bottom-44 right-6 z-50 flex h-[70vh] max-h-[min(560px,calc(100vh-13rem))] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-arena bg-white shadow-2xl"
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
          <div className="flex-1 overflow-y-auto bg-crema px-4 py-4">
            <div
              role="log"
              aria-live="polite"
              aria-label="Mensajes del asistente"
              className="flex flex-col gap-3"
            >
              {messages.map((message) => {
                const isUser = message.sender === 'user'
                const isLatest = message.id === lastBotId

                return (
                  <div key={message.id} className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm leading-snug ${
                        isUser
                          ? 'rounded-br-sm bg-fuego text-carbon'
                          : 'rounded-bl-sm border border-arena bg-white text-carbon'
                      }`}
                    >
                      {message.text}
                    </div>

                    {message.products?.length > 0 && (
                      <div className="flex w-[85%] flex-col gap-1.5">
                        {message.products.slice(0, 4).map((product) => (
                          <ProductChip key={product.id} product={product} onAdd={handleAddProduct} />
                        ))}
                      </div>
                    )}

                    {isLatest && message.actions?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.actions.map((action) => (
                          <button
                            key={action.label}
                            type="button"
                            onClick={() => handleAction(action)}
                            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                              action.type === 'reply'
                                ? 'border-arena bg-white text-carbon hover:border-fuego hover:text-fuego-oscuro'
                                : 'border-fuego-oscuro bg-fuego-oscuro text-white hover:bg-fuego-profundo'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {isTyping && (
                <div className="flex items-start">
                  <div
                    className="flex gap-1 rounded-2xl rounded-bl-sm border border-arena bg-white px-3 py-3"
                    aria-label="El asistente está escribiendo"
                  >
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-humo"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
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
              placeholder='Ej: "quiero 2 costillas"'
              className="w-full rounded-full border border-arena px-3 py-2 text-sm text-carbon placeholder-humo focus:border-fuego focus:outline-none focus:ring-2 focus:ring-fuego/30"
            />
            <button
              type="submit"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuego text-white transition-colors hover:bg-fuego-oscuro disabled:opacity-40"
              aria-label="Enviar mensaje"
              disabled={!inputValue.trim() || isTyping}
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
        onClick={onToggle}
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
