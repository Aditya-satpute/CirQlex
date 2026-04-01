import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import UserTag from '../components/UserTag'

const MyBookings = () => {

  const { axios, user, currency } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [descExpanded, setDescExpanded] = useState({})

  const toggleDesc = (id) => setDescExpanded(prev => ({...prev, [id]: !prev[id]}))

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    user && fetchMyBookings()
  }, [user])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}

      className='px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 pt-24 pb-16 min-h-screen text-sm max-w-7xl mx-auto'>

      <Title title='My Bookings'
        subTitle='View and manage your all item bookings'
        align="left" />

      <div>
        {bookings.map((booking, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}

            key={booking._id} className='bg-white flex flex-col lg:grid lg:grid-cols-4 gap-6 p-5 sm:p-7 border border-gray-200 rounded-2xl mb-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all'>
            {/* Item Image + Info */}

            <div className='lg:col-span-1 flex flex-col'>
              <div className='rounded-xl overflow-hidden mb-4 shadow-sm relative pt-[65%] sm:pt-[56.25%]'>
                <img src={(booking.item || booking.car)?.image || ''} alt="" className='absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500' />
              </div>
              <p className='text-lg font-bold text-gray-900 leading-tight'>{(booking.item || booking.car)?.title || 'Unknown'} {(booking.item || booking.car)?.model || ''}</p>
              <p className='text-gray-500 mt-1 font-medium'>{(booking.item || booking.car)?.year || 'N/A'} • {(booking.item || booking.car)?.category || 'N/A'}</p>
            </div>

            <div className='lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 bg-gray-50/50 p-5 rounded-xl border border-gray-100 h-fit'>
              <div className='flex items-start gap-2'>
                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500'>Pickup Schedule</p>
                  <p>{booking.pickupDate.split('T')[0]} {booking.pickupTime ? `at ${booking.pickupTime}` : ''}</p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500'>Pick-up Location</p>
                  <p>{(booking.item || booking.car)?.location || 'Unknown'}</p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <img src={assets.users_icon} alt="" className='w-4 h-4 mt-1 opacity-70' />
                <div>
                  <p className='text-gray-500 mb-0.5'>Owner</p>
                  <div className="-ml-2">
                      <UserTag 
                         user={(booking.item || booking.car)?.owner} 
                         contact={(booking.item || booking.car)?.contact} 
                      />
                  </div>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <img src={assets.tick_icon} alt="" className='w-4 h-4 mt-1 opacity-70' />
                <div>
                  <p className='text-gray-500'>Item Condition</p>
                  <p>{(booking.item || booking.car)?.condition || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className='lg:col-span-1 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-5 lg:pt-0 lg:pl-6'>
              <div className='text-sm text-gray-500 flex flex-row lg:flex-col justify-between items-center lg:items-end w-full'>
                <p className="font-medium uppercase tracking-wider text-[10px] text-gray-400 mb-1">Total Price</p>
                <div className="text-right">
                    <h1 className='text-2xl font-extrabold text-primary'>{currency}{booking.price}</h1>
                    <p className="text-xs font-semibold text-gray-400 mt-1">Booked: {booking.createdAt.split('T')[0]}</p>
                </div>
              </div>
            </div>
            
            <div className='lg:col-span-4 pt-4 border-t border-gray-100'>
               <p className='text-gray-600 leading-relaxed'>
                  <span className='text-gray-500 font-medium'>Description: </span>
                  {(() => {
                     const desc = (booking.item || booking.car)?.description || 'No description provided.';
                     const isLong = desc.length > 120;
                     const isExpanded = descExpanded[booking._id];

                     if (!isLong || isExpanded) {
                        return (
                           <>
                             {desc}
                             {isLong && <button onClick={() => toggleDesc(booking._id)} className='text-primary hover:underline ml-2 font-medium'>Read less</button>}
                           </>
                        );
                     }
                     return (
                        <>
                          {desc.substring(0, 120)}...
                          <button onClick={() => toggleDesc(booking._id)} className='text-primary hover:underline ml-1 font-medium'>Read more</button>
                        </>
                     );
                  })()}
               </p>
            </div>

          </motion.div>
        ))}
      </div>

    </motion.div>
  )
}

export default MyBookings
