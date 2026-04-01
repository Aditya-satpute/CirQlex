import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import ItemDetails from './pages/ItemDetails'
import Items from './pages/Items'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import MyProfile from './pages/owner/MyProfile'
import AddItem from './pages/owner/AddItem'
import AddAuction from './pages/owner/AddAuction'
import ManageItems from './pages/owner/ManageItems'
import ManageBookings from './pages/owner/ManageBookings'
import Login from './components/Login'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import AboutUs from './pages/AboutUs'
import HelpCenter from './pages/HelpCenter'
import AuctionsMenu from './pages/auctions/AuctionsMenu'
import LiveAuctionRoom from './pages/auctions/LiveAuctionRoom'
import PastTrades from './pages/auctions/PastTrades'

const App = () => {

  const { showLogin, setToken, navigate } = useAppContext()
  const location = useLocation()
  const isOwnerPath = location.pathname.startsWith('/owner')
  const isHomePage = location.pathname === '/'

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      setToken(token)
      localStorage.setItem('token', token)
      // Clean up the URL
      navigate(window.location.pathname, { replace: true })
    }
  }, [setToken, navigate])

  return (
    <>
      <Toaster />
      {showLogin && <Login />}

      {!isOwnerPath && <Navbar />}

      <main className={!isOwnerPath && !isHomePage ? "pb-16 md:pb-24" : ""}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/item-details/:id' element={<ItemDetails />} />
          <Route path='/items' element={<Items />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/owner' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="add-item" element={<AddItem />} />
            <Route path="add-auction" element={<AddAuction />} />
            <Route path="manage-items" element={<ManageItems />} />
            <Route path="manage-bookings" element={<ManageBookings />} />
          </Route>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/auctions" element={<AuctionsMenu />} />
          <Route path="/auctions/live/:id" element={<LiveAuctionRoom />} />
          <Route path="/auctions/past" element={<PastTrades />} />
        </Routes>
      </main>

      {!isOwnerPath && isHomePage && <Footer />}

    </>
  )
}

export default App
