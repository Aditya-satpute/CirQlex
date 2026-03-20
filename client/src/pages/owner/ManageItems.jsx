import React, { useEffect, useState } from 'react'
import { assets} from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const ManageItems = () => {

  const {isOwner, axios, currency} = useAppContext()
  const navigate = useNavigate()

  const [items, setItems] = useState([])

  const fetchOwnerItems = async ()=>{
    try {
      const {data} = await axios.get('/api/owner/items')
      if(data.success){
        setItems(data.items)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleAvailability = async (itemId)=>{
    try {
      const {data} = await axios.post('/api/owner/toggle-item', {itemId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerItems()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteItem = async (itemId)=>{
    try {

      const confirm = window.confirm('Are you sure you want to delete this item?')

      if(!confirm) return null

      const {data} = await axios.post('/api/owner/delete-item', {itemId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerItems()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    isOwner && fetchOwnerItems()
  },[isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='min-w-0'>
          <Title title="Manage Items" subTitle="View all listed items, update their details, or remove them from the booking platform."/>
        </div>
        <button onClick={()=> navigate('/owner/add-item')} className='whitespace-nowrap px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dull transition'>
          + Add New Item
        </button>
      </div>

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className="p-3 font-medium">Item</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index)=>(
              <tr key={index} className='border-t border-borderColor'>

                <td className='p-3 flex items-center gap-3'>
                  <img src={item.image} alt="" className="h-12 w-12 aspect-square rounded-md object-cover"/>
                  <div className='max-md:hidden'>
                    <p className='font-medium break-words max-w-[12rem]'>{item.title} {item.model}</p>
                    <p className='text-xs text-gray-500 break-words max-w-[12rem]'>{item.contact} • {item.condition}</p>
                  </div>
                </td>

                <td className='p-3 max-md:hidden'>{item.category}</td>
                <td className='p-3'>{currency}{item.pricePerDay}</td>

                <td className='p-3 max-md:hidden'>
                  <span className={`px-3 py-1 rounded-full text-xs ${item.isAvaliable ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                    {item.isAvaliable ? "Available" : "Unavailable" }
                  </span>
                </td>

                <td className='flex items-center p-3'>

                  <img onClick={()=> toggleAvailability(item._id)} src={item.isAvaliable ? assets.eye_close_icon : assets.eye_icon} alt="" className='cursor-pointer'/>

                  <img onClick={()=> deleteItem(item._id)} src={assets.delete_icon} alt="" className='cursor-pointer'/>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  )
}

export default ManageItems
