'use client'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { CartProvider } from '../app/context/CartContext'
import Navbar from '../app/components/NavBar'
import Hero from '../app/components/Hero'
import MenuTabs from '../app/components/MenuTabs'
import SuperDeals from '../app/components/SuperDeals'
import Footer from '../app/components/Footer'
import Banner from '../app/components/Banner'
import SearchBar from './components/SearchBar'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <CartProvider>
      <main className="min-h-screen bg-white text-black">
        <Hero />
        <Navbar />
        <MenuTabs />
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <Banner />
        <SuperDeals searchQuery={searchQuery} />
        <Footer />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </CartProvider>
  )
}
