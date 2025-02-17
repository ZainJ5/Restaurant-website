import Navbar from '../app/components/NavBar'
import Hero from '../app/components/Hero'
import MenuTabs from '../app/components/MenuTabs'
import SuperDeals from '../app/components/SuperDeals'
import Footer from '../app/components/Footer'
import Banner from '../app/components/Banner'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Navbar />
      <MenuTabs />
      <Banner />
      <SuperDeals />
      <Footer />
    </main>
  )
}