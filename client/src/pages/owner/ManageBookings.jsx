import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status)=>{
    try {
      const { data } = await axios.post('/api/bookings/change-status', {bookingId, status})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchOwnerBookings()
  },[])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      
      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."/>

      <div className='max-w-4xl w-full rounded-xl overflow-hidden border border-gray-200 mt-6 bg-white shadow-sm'>
        
        <div className="overflow-x-auto">
            <table className='w-full min-w-[750px] border-collapse text-left text-sm text-gray-600'>
              <thead className='text-gray-500 bg-gray-50/50 border-b border-gray-200'>
                <tr>
                  <th className="p-4 font-semibold whitespace-nowrap">Item</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Date Range</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Total</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Payment</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking, index)=>(
                  <tr key={index} className='hover:bg-gray-50/50 transition-colors text-gray-500'>

                    <td className='p-4 flex items-center gap-3 w-max'>
                      <img src={(booking.item || booking.car)?.image || ''} alt="" className='h-12 w-12 xl:h-14 xl:w-14 aspect-square rounded-lg object-cover shadow-sm'/>
                      <p className='font-bold text-gray-800 break-words max-w-[14rem]'>{(booking.item || booking.car)?.title || 'Unknown'} {(booking.item || booking.car)?.model || ''}</p>
                    </td>

                    <td className='p-4 whitespace-nowrap font-medium'>
                      {booking.pickupDate.split('T')[0]} {booking.pickupTime ? `at ${booking.pickupTime}` : ''}
                    </td>

                    <td className='p-4 whitespace-nowrap font-bold text-gray-900'>{currency}{booking.price}</td>

                    <td className='p-4 whitespace-nowrap'>
                      <span className='bg-gray-100/80 border border-gray-200 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-gray-600'>Offline</span>
                    </td>

                    <td className='p-4 whitespace-nowrap'>
                      {booking.status === 'pending' ? (
                        <select onChange={e=> changeBookingStatus(booking._id, e.target.value)} value={booking.status} className='px-3 py-1.5 min-w-[110px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-sm hover:border-gray-400'>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancel</option>
                          <option value="confirmed">Confirm</option>
                        </select>
                      ): (
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{booking.status}</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
        </div>

      </div>

    </div>
  )
}

export default ManageBookings
