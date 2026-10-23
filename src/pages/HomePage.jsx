import Hero from '../components/Hero'
import MenuCategories from '../components/MenuCategories'
import HeroSlider from '../components/HeroSlider'
import HowToOrder from '../components/HowToOrder'
import Offers from '../components/Offers'
import About from '../components/About'

function HomePage() {
  return (
    <>
      <Hero />
      <MenuCategories />
      <HeroSlider />
      <HowToOrder />
      <Offers />
      <About />
    </>
  )
}

export default HomePage
