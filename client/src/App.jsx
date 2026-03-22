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
import AddItem from './pages/owner/AddItem'
import ManageItems from './pages/owner/ManageItems'
import ManageBookings from './pages/owner/ManageBookings'
import Login from './components/Login'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import AboutUs from './pages/AboutUs'
import HelpCenter from './pages/HelpCenter'

const App = () => {

  const {showLogin} = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <>
     <Toaster />
      {showLogin && <Login/>}

      {!isOwnerPath && <Navbar/>}

    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/item-details/:id' element={<ItemDetails/>}/>
      <Route path='/items' element={<Items/>}/>
      <Route path='/my-bookings' element={<MyBookings/>}/>
      <Route path='/owner' element={<Layout />}>
        <Route index element={<Dashboard />}/>
        <Route path="add-item" element={<AddItem />}/>
        <Route path="manage-items" element={<ManageItems />}/>
        <Route path="manage-bookings" element={<ManageBookings />}/>
      </Route>
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/help-center" element={<HelpCenter />} />
    </Routes>

    {!isOwnerPath && <Footer />}
    
    </>
  )
}

export default App
