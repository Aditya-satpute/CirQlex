import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets, dummyItemData } from '../assets/assets'
import ItemCard from '../components/ItemCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const Items = () => {

  // getting search params from url
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const pickupTime = searchParams.get('pickupTime')

  const {items, axios} = useAppContext()

  const searchQuery = searchParams.get('q')
  const [input, setInput] = useState(searchQuery || '')

  const isSearchData = pickupLocation && pickupDate && pickupTime
  const [filteredItems, setFilteredItems] = useState([])

  const sortNewestFirst = (list) => {
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const applyFilter = async ()=>{
     
    if(input === ''){
      setFilteredItems(sortNewestFirst(items))
      return null
    }

    const filtered = sortNewestFirst(items).filter((item)=>{
      const titleText = (item.title || `${item.brand} ${item.model}`).toLowerCase()
      return titleText.includes(input.toLowerCase())
      || item.brand?.toLowerCase().includes(input.toLowerCase())
      || item.model?.toLowerCase().includes(input.toLowerCase())  
      || item.category?.toLowerCase().includes(input.toLowerCase())  
      || item.transmission?.toLowerCase().includes(input.toLowerCase())
    })
    setFilteredItems(filtered)
  }

  const searchItemAvailablity = async () =>{
    const {data} = await axios.post('/api/bookings/check-availability', {location: pickupLocation, pickupDate, pickupTime})
    if (data.success) {
      const itemsWithSearch = sortNewestFirst(data.availableItems).filter(item => {
        const titleText = (item.title || `${item.brand} ${item.model}`).toLowerCase()
        return titleText.includes(input.toLowerCase())
          || item.brand?.toLowerCase().includes(input.toLowerCase())
          || item.model?.toLowerCase().includes(input.toLowerCase())
      })
      setFilteredItems(itemsWithSearch)
      if(itemsWithSearch.length === 0){
        toast('No items available for this search')
      }
      return null
    }
  }

  useEffect(()=>{
    if (isSearchData) {
      searchItemAvailablity()
    } else {
      applyFilter()
    }
  },[isSearchData])

  useEffect(()=>{
    items.length > 0 && !isSearchData && applyFilter()
  },[input, items])

  return (
    <div>

      <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}

      className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title='Available Items' subTitle='Browse our selection of premium vehicles available for your next adventure'/>

        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}

        className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>

          <input onChange={(e)=> setInput(e.target.value)} value={input} type="text" placeholder='Search by make, model, or features' className='w-full h-full outline-none text-gray-500'/>

          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2'/>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}

      className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing {filteredItems.length} Items</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredItems.map((item, index)=> (
            <motion.div key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <ItemCard item={item}/>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}

export default Items
