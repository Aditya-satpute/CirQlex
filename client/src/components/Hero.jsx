import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import {motion} from 'motion/react'
import { toast } from 'react-hot-toast'

const Hero = () => {

    const [pickupLocation, setPickupLocation] = useState('')

    const {pickupDate, setPickupDate, pickupTime, setPickupTime, navigate, user, setShowLogin} = useAppContext()

    const handleSearch = (e)=>{
        e.preventDefault()
        navigate('/items?pickupLocation=' + pickupLocation + '&pickupDate=' + pickupDate + '&pickupTime=' + pickupTime)
    }

  return (
    // <motion.div 
    // initial={{ opacity: 0 }}
    // animate={{ opacity: 1 }}
    // transition={{ duration: 0.8 }}
    // className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>

    //     <motion.h1 initial={{ y: 50, opacity: 0 }}
    //         animate={{ y: 0, opacity: 1 }}
    //         transition={{ duration: 0.8, delay: 0.2 }}
    //     className='text-4xl md:text-5xl font-semibold'>Luxury items on Rent</motion.h1>
      
    //   <motion.form
    //   initial={{ scale: 0.95, opacity: 0, y: 50 }}
    //   animate={{ scale: 1, opacity: 1, y: 0 }}
    //   transition={{ duration: 0.6, delay: 0.4 }}

    //    onSubmit={handleSearch} className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>

    //     <div className='flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8'>
    //         <div className='flex flex-col items-start gap-2'>
    //             <select required value={pickupLocation} onChange={(e)=>setPickupLocation(e.target.value)}>
    //                 <option value="">Pickup Location</option>
    //                 {cityList.map((city)=> <option key={city} value={city}>{city}</option>)}
    //             </select>
    //             <p className='px-1 text-sm text-gray-500'>{pickupLocation ? pickupLocation : 'Please select location'}</p>
    //         </div>
    //         <div className='flex flex-col items-start gap-2'>
    //             <label htmlFor='pickup-date'>Pick-up Date</label>
    //             <input value={pickupDate} onChange={e=>setPickupDate(e.target.value)} type="date" id="pickup-date" min={new Date().toISOString().split('T')[0]} className='text-sm text-gray-500' required/>
    //         </div>
    //         <div className='flex flex-col items-start gap-2'>
    //             <label htmlFor='pickup-time'>Pickup Time</label>
    //             <input value={pickupTime} onChange={e=>setPickupTime(e.target.value)} type="time" id="pickup-time" className='text-sm text-gray-500' required/>
    //         </div>
            
    //     </div>
    //         <motion.button 
    //         whileHover={{ scale: 1.05 }}
    //         whileTap={{ scale: 0.95 }}
    //         className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer'>
    //             <img src={assets.search_icon} alt="search" className='brightness-300'/>
    //             Search
    //         </motion.button>
    //   </motion.form>

    //   <motion.img 
    //     initial={{ y: 100, opacity: 0 }}
    //    animate={{ y: 0, opacity: 1 }}
    //    transition={{ duration: 0.8, delay: 0.6 }}
    //   src={assets.hero_image} alt="item" className='max-h-150'/>
    // </motion.div>

    <motion.div 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
  className='h-screen w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-14 px-4 md:px-16 bg-light text-center'
>
  <div className='flex-1 min-w-0 flex flex-col items-center md:items-start justify-center gap-3 md:gap-4 text-center md:text-left'>
    <motion.h1 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className='text-4xl md:text-5xl font-semibold leading-tight max-w-xl break-words'
    >
      CirQlex 
      <p className='text-lg text-gray-600 mt-2'>
    - Circulate. Exchange. Save.
  </p>
    </motion.h1>

    <motion.p
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.35 }}
      className='text-lg md:text-xl text-gray-600 max-w-lg'
    >
    Buy and sell within IITP community while keeping useful items in continuous use.
    </motion.p>

    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className='mt-4 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-dull transition-all '
      onClick={() => {
        if (user) {
          navigate('/owner/add-item')
        } else {
          setShowLogin(true)
          toast('Please login to list an item', { icon: '🔒' })
        }
      }}
    >
      List item
    </motion.button>
  </div>

  <div className='flex-1 flex items-center justify-center min-w-0'>
    <motion.img 
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      src={assets.hero_image}
      alt='item'
      className='w-[85vw] sm:w-[70vw] md:w-full max-w-lg max-h-[65vh] sm:max-h-[70vh] object-contain'
    />
  </div>
</motion.div>
  )
}

export default Hero
