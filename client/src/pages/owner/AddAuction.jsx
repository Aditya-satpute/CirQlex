import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddAuction = () => {
  const {axios, currency} = useAppContext()
  const [image, setImage] = useState(null)
  const [item, setItem] = useState({
    itemTitle: '',
    model: '',
    category: '',
    condition: '',
    contact: '',
    location: '',
    description: '',
    basePrice: 0,
    startTime: '',
    endTime: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const onSubmitHandler = async (e)=>{
    e.preventDefault()
    if(isLoading) return null
    setIsLoading(true)

    try {
      if(!image) return toast.error("Please upload an image for the auction")

      // Convert datetime-local values (which are in local time, no timezone) to UTC ISO strings
      // so the server stores the correct intended time regardless of server timezone.
      const itemToSend = {
        ...item,
        startTime: item.startTime ? new Date(item.startTime).toISOString() : '',
        endTime: item.endTime ? new Date(item.endTime).toISOString() : '',
      }

      const formData = new FormData()
      formData.append('image', image)
      formData.append('itemData', JSON.stringify(itemToSend))

      // Using the auction endpoint directly
      const {data} = await axios.post('/api/auctions', formData)

      if(data.success){
        toast.success(data.message || "Auction created")
        setImage(null)
        setItem({
          itemTitle: '',
          model: '',
          category: '',
          condition: '',
          contact: '',
          location: '',
          description: '',
          basePrice: 0,
          startTime: '',
          endTime: ''
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>

      <Title title="Add New Auction" subTitle="Schedule a real-time auction for an item."/>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        <div className='flex items-center gap-2 w-full'>
          <label htmlFor="auction-image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" className='h-14 rounded cursor-pointer'/>
            <input type="file" id="auction-image" accept="image/*" hidden onChange={e=> setImage(e.target.files[0])}/>
          </label>
          <p className='text-sm text-gray-500'>Upload a picture of your item</p>
        </div>

        <div className='flex flex-col w-full'>
          <label>Item Title</label>
          <input type="text" placeholder="e.g. Vintage Camera" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={item.itemTitle} onChange={e=> setItem({...item, itemTitle: e.target.value})}/>
        </div>

        <div className='flex flex-col w-full'>
          <label>Model</label>
          <input type="text" placeholder="e.g. Nikon F3 (NA if not applicable)" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={item.model} onChange={e=> setItem({...item, model: e.target.value})}/>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select required onChange={e=> setItem({...item, category: e.target.value})} value={item.category} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a category</option>
              <option value="Stationery">Stationery</option>
              <option value="Electronics">Electronics</option>
              <option value="Cycle">Cycle</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Condition</label>
            <select required onChange={e=> setItem({...item, condition: e.target.value})} value={item.condition} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a condition</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Contact</label>
            <input type="tel" placeholder="Enter contact number" required maxLength={10} pattern="[0-9]{10}" className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'  value={item.contact} onChange={e=> {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
              setItem({...item, contact: digits})
            }}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Location</label>
            <select required onChange={e=> setItem({...item, location: e.target.value})} value={item.location} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a location</option>
              <option value="Kalam">Kalam</option>
              <option value="Aryabhatta">Aryabhatta</option>
              <option value="Asima">Asima</option>
              <option value="CVR">CVR</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Base Price ({currency})</label>
            <input type="number" placeholder="100" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={item.basePrice} onChange={e=> setItem({...item, basePrice: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Start Time</label>
            <input type="datetime-local" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={item.startTime} onChange={e=> setItem({...item, startTime: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>End Time</label>
            <input type="datetime-local" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={item.endTime} onChange={e=> setItem({...item, endTime: e.target.value})}/>
          </div>
        </div>
         
        <div className='flex flex-col w-full'>
          <label>Description</label>
          <textarea rows={5} placeholder="Very neat Vintage Camera..." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={item.description} onChange={e=> setItem({...item, description: e.target.value})}></textarea>
        </div>

        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>
          <img src={assets.tick_icon} alt="" />
          {isLoading ? 'Creating...' : 'Create Auction'}
        </button>

      </form>

    </div>
  )
}

export default AddAuction
