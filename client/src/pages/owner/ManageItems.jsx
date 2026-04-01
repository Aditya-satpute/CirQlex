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

      <div className='max-w-4xl w-full rounded-xl overflow-hidden border border-gray-200 mt-6 bg-white shadow-sm'>

        <div className="overflow-x-auto">
            <table className='w-full min-w-[600px] border-collapse text-left text-sm text-gray-600'>
              <thead className='text-gray-500 bg-gray-50/50 border-b border-gray-200'>
                <tr>
                  <th className="p-4 font-semibold whitespace-nowrap">Item</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Category</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Price</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, index)=>(
                  <tr key={index} className='hover:bg-gray-50/50 transition-colors'>

                    <td className='p-4 flex items-center gap-3 w-max'>
                      <img src={item.image} alt="" className="h-12 w-12 xl:h-14 xl:w-14 aspect-square rounded-lg object-cover shadow-sm"/>
                      <div>
                        <p className='font-bold text-gray-800 break-words max-w-[14rem]'>{item.title} {item.model}</p>
                        <p className='text-xs text-gray-400 mt-0.5'>{item.contact} • {item.condition}</p>
                      </div>
                    </td>

                    <td className='p-4 whitespace-nowrap font-medium'>{item.category}</td>
                    <td className='p-4 whitespace-nowrap font-bold text-gray-900'>{currency}{item.pricePerDay}</td>

                    <td className='p-4 whitespace-nowrap'>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${item.isAvaliable ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        {item.isAvaliable ? "Available" : "Unavailable" }
                      </span>
                    </td>

                <td className='p-4 whitespace-nowrap min-w-[100px]'>
                  <div className="flex items-center gap-5">
                      <button onClick={()=> toggleAvailability(item._id)} className='p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group flex-shrink-0' title="Toggle Visibility">
                        <img src={item.isAvaliable ? assets.eye_close_icon : assets.eye_icon} alt="" className='w-6 h-6 md:w-7 md:h-7 opacity-75 group-hover:opacity-100 transition-opacity'/>
                      </button>

                      <button onClick={()=> deleteItem(item._id)} className='p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer group flex-shrink-0' title="Delete">
                        <img src={assets.delete_icon} alt="" className='w-6 h-6 md:w-7 md:h-7 opacity-75 group-hover:opacity-100 transition-opacity'/>
                      </button>
                  </div>
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

export default ManageItems
