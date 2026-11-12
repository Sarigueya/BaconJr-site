import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatbotWidget from './components/ChatbotWidget'
import CartButton from './components/CartButton'
import DailyOfferModal from './components/DailyOfferModal'
import ScrollManager from './components/ScrollManager'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import { CartProvider } from './context/CartProvider'
import { AuthProvider, useAuth } from './context/AuthProvider'

function AppContent() {
  const [activePanel, setActivePanel] = useState(null)
  const {
    isAuthModalOpen,
    closeAuthModal,
    handleAuthSuccess,
    fromCheckout,
    authToast,
    dismissToast,
  } = useAuth()

  return (
    <div className="min-h-screen bg-white text-carbon">
      <ScrollManager />
      <Navbar />

      {authToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 z-[90] flex w-[92vw] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border border-dorado/60 bg-carbon px-4 py-3 text-sm font-semibold text-crema shadow-2xl"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dorado text-carbon">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>{authToast}</span>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            className="rounded-lg p-1 text-crema/70 hover:text-dorado"
            aria-label="Cerrar notificación"
          >
            ✕
          </button>
        </div>
      )}

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ChatbotWidget
        isOpen={activePanel === 'chat'}
        onToggle={() => setActivePanel((prev) => (prev === 'chat' ? null : 'chat'))}
        onOpenCart={() => setActivePanel('cart')}
      />
      <CartButton
        isOpen={activePanel === 'cart'}
        onOpenChange={(open) => setActivePanel(open ? 'cart' : null)}
      />
      <DailyOfferModal />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onAuthSuccess={handleAuthSuccess}
        fromCheckout={fromCheckout}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  )
}

export default App