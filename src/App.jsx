import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatbotWidget from './components/ChatbotWidget'
import CartButton from './components/CartButton'
import ScrollManager from './components/ScrollManager'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import { CartProvider } from './context/CartProvider'

function App() {
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
        <ChatbotWidget />
        <CartButton />
      </div>
    </CartProvider>
  )
}

export default App
