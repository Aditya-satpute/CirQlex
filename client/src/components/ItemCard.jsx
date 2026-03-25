import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ItemCard = ({item}) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

  return (
    <div onClick={()=> {navigate(`/item-details/${item._id}`); scrollTo(0,0)}} className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer'>
      
      <div className='relative h-48 overflow-hidden'> 
        <img src={item.image} alt="Item Image" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'/>

        {item.isAvaliable && <p className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'>Available Now</p>}

        <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
            <span className='font-semibold'>{currency}{item.pricePerDay}</span>
            <span className='text-sm text-white/80'>/-</span>
        </div>
      </div>

      <div className='p-4 sm:p-5'>
        <div className='flex justify-between items-start mb-2'>
            <div className='min-w-0'>
                <h3 className='text-lg font-medium truncate max-w-full'>{item.title}</h3>
                <h2 className='text-sm font-bold text-gray-800 truncate max-w-full'>{item.model}</h2>
                <p className='text-muted-foreground text-sm truncate max-w-full'>{item.category}</p>
            </div>
        </div>

        <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.users_icon} alt="" className='h-4 mr-2'/>
                <span>{item.contact}</span>
            </div>
            
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.tick_icon} alt="" className='h-4 mr-2'/>
                <span>| {item.condition}</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.location_icon} alt="" className='h-4 mr-2'/>
                <span>{item.location}</span>
            </div>
        </div>

      </div>

    </div>
  )
}

export default ItemCard
