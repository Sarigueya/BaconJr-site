import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Menu from './components/Menu'
import HeroSlider from './components/HeroSlider'
import Offers from './components/Offers'
import About from './components/About'
import HowToOrder from './components/HowToOrder'
import Footer from './components/Footer'
import ChatbotWidget from './components/ChatbotWidget'
import CartButton from './components/CartButton'
import { CartProvider } from './context/CartProvider'

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white text-carbon">
        <Navbar />
        <main>
          <Hero />
          <Menu />
          <HeroSlider />
          <HowToOrder />
          <Offers />
          <About />
        </main>
        <Footer />
        <ChatbotWidget />
        <CartButton />
      </div>
    </CartProvider>
  )
}

export default App