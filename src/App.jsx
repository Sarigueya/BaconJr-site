import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatbotWidget from './components/ChatbotWidget'
import CartButton from './components/CartButton'
import DailyOfferModal from './components/DailyOfferModal'
import ScrollManager from './components/ScrollManager'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import { CartProvider } from './context/CartProvider'

function App() {
  // Panel flotante abierto actualmente ('cart' | 'chat' | null): solo uno a la vez.
  const [activePanel, setActivePanel] = useState(null)

  return (
    <CartProvider>
      <div className="min-h-screen bg-white text-carbon">
        <ScrollManager />
        <Navbar />
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
        />
        <CartButton
          isOpen={activePanel === 'cart'}
          onOpenChange={(open) => setActivePanel(open ? 'cart' : null)}
        />
        <DailyOfferModal />
      </div>
    </CartProvider>
  )
}

export default App
