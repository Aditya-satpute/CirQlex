import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddItem = () => {

  const {axios, currency} = useAppContext()

  const [image, setImage] = useState(null)
  const [item, setItem] = useState({
    title: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    condition: '',
    fuel_type: '',
    contact: '',
    location: '',
    description: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const onSubmitHandler = async (e)=>{
    e.preventDefault()
    if(isLoading) return null

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('itemData', JSON.stringify(item))

      const {data} = await axios.post('/api/owner/add-item', formData)

      if(data.success){
        toast.success(data.message)
        setImage(null)
        setItem({
          title: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          condition: '',
          fuel_type: '',
          contact: 0,
          location: '',
          description: '',
        })
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>

      <Title title="Add New Item" subTitle="Fill in details to list a new item for booking, including pricing, availability, and item specifications."/>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        {/* Item Image */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor="item-image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" className='h-14 rounded cursor-pointer'/>
            <input type="file" id="item-image" accept="image/*" hidden onChange={e=> setImage(e.target.files[0])}/>
          </label>
          <p className='text-sm text-gray-500'>Upload a picture of your item</p>
        </div>

        {/* Item title & Model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Title</label>
            <input type="text" placeholder="e.g. Scientific Calculator" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={item.title} onChange={e=> setItem({...item, title: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Model</label>
            <input type="text" placeholder="e.g. Casio FX-991ES (NA if not applicable)" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={item.model} onChange={e=> setItem({...item, model: e.target.value})}/>
          </div>
          
        </div>

        {/* Item Year, Price, Category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {/* <div className='flex flex-col w-full'>
            <label>Year</label>
            <input type="number" placeholder="2025" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={item.year} onChange={e=> setItem({...item, year: e.target.value})}/>
          </div> */}
          <div className='flex flex-col w-full'>
            <label>Price ({currency})</label>
            <input type="number" placeholder="100" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={item.pricePerDay} onChange={e=> setItem({...item, pricePerDay: e.target.value})}/>
          </div>
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
            <select onChange={e=> setItem({...item, condition: e.target.value})} value={item.condition} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a condition</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </div>
        </div>

         {/* Item condition, Fuel Type, Seating Capacity */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          
          {/* <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select onChange={e=> setItem({...item, fuel_type: e.target.value})} value={item.fuel_type} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a fuel type</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div> */}
          <div className='flex flex-col w-full'>
            <label>Contact</label>
            <input type="tel" placeholder="Enter contact number" required maxLength={10} pattern="[0-9]{10}" className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'  value={item.contact} onChange={e=> {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
              setItem({...item, contact: digits})
            }}/>
          </div>

          <div className='flex flex-col w-full'>
            <label>Location</label>
            <select onChange={e=> setItem({...item, location: e.target.value})} value={item.location} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a location</option>
              <option value="Kalam">Kalam</option>
              <option value="Aryabhatta">Aryabhatta</option>
              <option value="Asima">Asima</option>
              <option value="CVR">CVR</option>
            </select>
         </div>
        </div>

         {/* Item Location */}
         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
         

         {/* <div className='flex flex-col w-full'>
          <label>Contact Number</label>
          <input type="tel" placeholder="9876543210" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'  
          onChange={e => setProduct({...product, contact: e.target.value})}/>
          </div> */}
         </div>
         
        {/* Item Description */}
         <div className='flex flex-col w-full'>
            <label>Description</label>
            <textarea rows={5} placeholder="e.g.: Used for 1 year, in good condition. Fully working with no issues." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={item.description} onChange={e=> setItem({...item, description: e.target.value})}></textarea>
          </div>

        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>
          <img src={assets.tick_icon} alt="" />
          {isLoading ? 'Listing...' : 'List Your Item'}
        </button>


      </form>

    </div>
  )
}

export default AddItem
