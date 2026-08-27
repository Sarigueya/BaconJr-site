import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategoryFilters from './components/CategoryFilters'
import HeroSlider from './components/HeroSlider'
import Offers from './components/Offers'
import About from './components/About'
import HowToOrder from './components/HowToOrder'
import Footer from './components/Footer'
import ChatbotWidget from './components/ChatbotWidget'
import CartButton from './components/CartButton'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <CategoryFilters />
        <HeroSlider />
        <HowToOrder />
        <Offers />
        <About />
      </main>
      <Footer />
      <ChatbotWidget />
      <CartButton />
    </div>
  )
}

export default App
