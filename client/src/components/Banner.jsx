import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Banner = () => {
  const { user, setShowLogin } = useAppContext()
  const navigate = useNavigate()

  const handleCTA = () => {
    if (user) {
      navigate('/owner/add-item')
    } else {
      setShowLogin(true)
      toast('Please login to list your item', { icon: '🔒' })
    }
  }

  return (
    <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 min-md:pl-14 pt-10 pb-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden shadow-xl border border-blue-200' >

        <div className='text-white max-w-xl'>
            <h2 className='text-3xl md:text-4xl font-bold leading-tight'>Have Items You No Longer Need?</h2>
            <p className='mt-3 text-lg md:text-xl opacity-95'>List them on CirQlex and help fellow students get what they need at lower prices.</p>
            <p className='max-w-130 mt-3 text-sm md:text-base opacity-90'>No listing fees, no middleman — just connect directly with IITP students and sell with ease.</p>

            <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCTA}
            className='px-6 py-3 bg-white text-primary font-semibold hover:bg-slate-100 transition-all rounded-lg text-sm md:text-base mt-6 cursor-pointer shadow-md'>
              List your item
            </motion.button>
        </div>

        <motion.img 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        src={assets.favicon} alt="item" className='max-h-45 mt-10'/>
      
    </motion.div>
  )
}

export default Banner
