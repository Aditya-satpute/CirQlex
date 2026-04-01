import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import ItemCard from './ItemCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const {items} = useAppContext()

    const newestItems = [...items]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)

  return (
    <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
    className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>

        <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        >
            <Title title='Featured Items' subTitle='Explore our selection of premium items available for your best use.'/>
        </motion.div>

        <motion.div 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
        {
            newestItems.map((item, index)=> (
                <motion.div key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut"  }}
                className={index >= 2 ? 'hidden sm:block' : ''}
                >
                    <ItemCard item={item}/>
                </motion.div>
            ))
        }
        </motion.div>

        <motion.button 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        onClick={()=> {
            navigate('/items'); scrollTo(0,0)
        }}
         className='flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer'>
            Explore all items <img src={assets.arrow_icon} alt="arrow" />
        </motion.button>
      
    </motion.div>
  )
}

export default FeaturedSection
