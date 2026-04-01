import React, { useState, useEffect, useRef } from 'react'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'
import { motion, AnimatePresence } from 'motion/react'
import AuctionDetailsModal from '../../components/auctions/AuctionDetailsModal'

const MyProfile = () => {

    const { axios, user, setUser, notifications, fetchNotifications } = useAppContext()

    // Form states
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [location, setLocation] = useState('Kalam')
    const [image, setImage] = useState(false)
    const [currentImage, setCurrentImage] = useState('')
    const [selectedAuction, setSelectedAuction] = useState(null)
    const [showNotifications, setShowNotifications] = useState(false)
    const notificationRef = useRef(null)

    const hasUnread = notifications.some(n => !n.isRead)

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    // Pre-populate data securely
    useEffect(() => {
        if (user) {
            setName(user.name || '')
            setEmail(user.email || '')
            setLocation(user.location || 'Kalam')
            if (user.image && user.image !== '') {
                setCurrentImage(user.image)
            }
        }
    }, [user])

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()

            formData.append('name', name)
            formData.append('location', location)

            if (image) {
                formData.append('image', image)
            }

            const { data } = await axios.put('/api/user/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (data.success) {
                toast.success(data.message)
                if (data.user) {
                    setUser(data.user)
                    if (data.user.image) {
                        setCurrentImage(data.user.image)
                    }
                }
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteNotification = async (id) => {
        try {
            const { data } = await axios.delete(`/api/notifications/${id}`)
            if (data.success) {
                toast.success(data.message)
                fetchNotifications()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const markAllRead = async () => {
        if (!hasUnread) return;
        try {
            await axios.put('/api/notifications/mark-read')
            fetchNotifications()
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}

            className='p-4 sm:p-10 max-w-4xl min-h-screen'>

            <div className='flex justify-between items-center mb-8'>
                <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                
                <div className='relative' ref={notificationRef}>
                    <button 
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            if(!showNotifications) markAllRead();
                        }}
                        className='p-2.5 bg-white border border-borderColor rounded-full hover:shadow-md transition-all cursor-pointer relative group'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover:text-primary transition-colors">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                        </svg>
                        {hasUnread && (
                            <span className='absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse'></span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className='absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-borderColor shadow-xl rounded-2xl z-50 overflow-hidden'
                            >
                                <div className='p-4 border-b border-borderColor bg-gray-50/50 flex justify-between items-center'>
                                    <h3 className='font-bold text-gray-800'>Auction Reminders</h3>
                                    <span className='text-[10px] uppercase font-bold text-gray-400 tracking-widest'>{notifications.length} Total</span>
                                </div>
                                <div className='max-h-[400px] overflow-y-auto p-2 space-y-2'>
                                    {notifications.length === 0 ? (
                                        <div className='py-12 text-center'>
                                            <p className='text-gray-400 text-sm'>No reminders set yet.</p>
                                        </div>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div key={notif._id} className={`p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/80 transition-all group relative ${!notif.isRead ? 'bg-blue-50/30' : ''}`}>
                                                <div className='flex items-start gap-3'>
                                                    <div className='w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100'>
                                                        <img src={notif.auctionId?.image} alt="" className='w-full h-full object-cover' />
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <p className='text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5'>{notif.type}</p>
                                                        <h4 className='font-bold text-gray-800 text-sm truncate'>{notif.auctionId?.itemTitle}</h4>
                                                        <p className='text-xs text-gray-500 mt-1'>
                                                            Starts: <span className='font-medium text-gray-700'>{new Date(notif.auctionId?.startTime).toLocaleDateString([], {month:'short', day:'numeric'})} at {new Date(notif.auctionId?.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                                        </p>
                                                        <p className='text-xs font-bold text-gray-900 mt-1'>Rs. {notif.auctionId?.basePrice}</p>
                                                        
                                                        <button 
                                                            onClick={() => setSelectedAuction(notif.auctionId)}
                                                            className='mt-2 text-[11px] font-bold text-primary hover:underline cursor-pointer'
                                                        >
                                                            Read More
                                                        </button>
                                                    </div>
                                                    <button 
                                                        onClick={() => deleteNotification(notif._id)}
                                                        className='p-2 hover:bg-red-50 rounded-lg transition-all cursor-pointer flex-shrink-0 active:scale-90 md:opacity-0 md:group-hover:opacity-100'
                                                        title="Remove Reminder"
                                                    >
                                                        <img src={assets.delete_icon} alt="" className='w-5 h-5 opacity-70' />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <form onSubmit={onSubmitHandler} className='flex flex-col gap-6 items-start bg-white p-6 sm:p-8 rounded-2xl border border-borderColor shadow-sm'>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Account Settings</h3>

                {/* <div className='flex items-center gap-6 mb-4'>
                    <label htmlFor="image" className='cursor-pointer relative group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-full w-32 h-32 overflow-hidden hover:border-primary transition duration-300'>
                        <img
                            src={image ? URL.createObjectURL(image) : (currentImage ? currentImage : assets.user_profile)}
                            alt="Profile"
                            className={`w-full h-full object-cover ${!image && !currentImage ? 'p-4 opacity-50' : ''}`}
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <img src={assets.upload_icon} alt="Upload" className='w-6 h-6 invert brightness-0 mb-1' />
                            <span className="text-xs text-white font-medium">Update</span>
                        </div>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden accept="image/*" />
                    </label>
                    <div className="text-sm text-gray-500">
                        <p className="font-medium text-gray-700 mb-1">Upload Avatar</p>
                        <p>Recommended: 400x400px</p>
                    </div>
                </div>*/}

                <div className='flex flex-col gap-2 w-full max-w-md'>
                    <p className="font-medium text-gray-700">Username</p>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className='px-4 py-2 border border-borderColor rounded-md outline-none focus:border-primary transition-colors'
                        type="text"
                        placeholder='Type here'
                        required
                    />
                </div>

                <div className='flex flex-col gap-2 w-full max-w-md'>
                    <p className="font-medium text-gray-700 flex justify-between items-center">
                        Registered Email Address <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-500 rounded">Read-Only</span>
                    </p>
                    <input
                        value={email}
                        className='px-4 py-2 border border-transparent bg-gray-50 text-gray-500 rounded-md outline-none cursor-not-allowed'
                        type="email"
                        readOnly
                        title="You cannot edit your registered email address"
                    />
                </div>

                <div className='flex flex-col gap-2 w-full max-w-md'>
                    <p className="font-medium text-gray-700">Hostel Location</p>
                    <select
                        onChange={(e) => setLocation(e.target.value)}
                        value={location}
                        className='px-4 py-2 border border-borderColor rounded-md outline-none focus:border-primary transition-colors'
                    >
                        <option value="Kalam">Kalam</option>
                        <option value="Aryabhatta">Aryabhatta</option>
                        <option value="Asima">Asima</option>
                        <option value="CVR">CVR</option>
                    </select>
                </div>

                <button type='submit' className='bg-primary text-white px-8 py-2.5 rounded-lg mt-4 hover:bg-primary-dull transition-colors font-medium shadow-sm active:scale-95'>
                    Save Profile Changes
                </button>

            </form>

            <AuctionDetailsModal auction={selectedAuction} onClose={() => setSelectedAuction(null)} />
        </motion.div>
    )
}

export default MyProfile
