import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategoryFilters from './components/CategoryFilters'
import HeroSlider from './components/HeroSlider'
import Offers from './components/Offers'
import About from './components/About'
import MapLocation from './components/MapLocation'
import Footer from './components/Footer'
import HelpButton from './components/HelpButton'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <CategoryFilters />
        <HeroSlider />
        <Offers />
        <About />
        <MapLocation />
      </main>
      <Footer />
      <HelpButton />
    </div>
  )
}

export default App
