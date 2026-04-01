import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Title from '../../components/Title';
import AuctionDetailsModal from '../../components/auctions/AuctionDetailsModal';
import UserTag from '../../components/UserTag';

const AuctionsMenu = () => {
    const { axios, user, fetchNotifications } = useAppContext();
    const [upcoming, setUpcoming] = useState([]);
    const [active, setActive] = useState([]);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const upRes = await axios.get('/api/auctions?status=Upcoming');
                if(upRes.data.success) setUpcoming(upRes.data.auctions);
                
                const actRes = await axios.get('/api/auctions?status=Active');
                if(actRes.data.success) setActive(actRes.data.auctions);
            } catch (error) {
                toast.error("Error fetching auctions.");
            }
        };
        fetchAuctions();
        
        // Polling to keep queue updated
        const interval = setInterval(fetchAuctions, 10000);
        return () => clearInterval(interval);
    }, [axios]);

    const formatTime = (dateString) => new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric' });

    const handleRemindMe = async (e, auction) => {
        e.stopPropagation();
        if(!user) return toast.error("Please login to set reminders.");
        try {
            const { data } = await axios.post('/api/notifications/add', { auctionId: auction._id });
            if(data.success){
                toast.success(data.message);
                if(fetchNotifications) fetchNotifications();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleReadMore = (e, auction) => {
        e.stopPropagation();
        setSelectedAuction(auction);
    };

    return (
        <div className="pt-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-light min-h-screen pb-16">
            <div className="mb-8">
                <Title title="Real-Time Auctions" subTitle="Bid on exclusive items in real-time or browse the upcoming schedule." align="left" />
            </div>
            
            <div className="flex flex-wrap gap-3 mb-10 text-sm">
                 <button onClick={() => navigate('/auctions/past')} className="px-5 py-2.5 hover:bg-gray-300 bg-gray-200 text-gray-700 transition-all rounded-lg font-medium shadow-sm">View Past Trades</button>
                 <button onClick={() => navigate('/owner/add-auction')} className="px-5 py-2.5 bg-primary text-white hover:bg-primary-dull transition-all rounded-lg font-medium shadow-sm flex items-center gap-2">
                     <span className="text-lg leading-none">+</span> Add Auction
                 </button>
            </div>

            {/* Active Auctions */}
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live Now
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {active.length === 0 ? <p className="text-gray-500 text-sm col-span-full">No active auctions right now.</p> : active.map(auction => (
                    <div key={auction._id} className="bg-white rounded-xl shadow-sm border border-borderColor cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden" onClick={() => navigate(`/auctions/live/${auction._id}`)}>
                        {/* Interactive Image Container */}
                        <div className="w-full h-48 sm:h-52 bg-gray-100 flex items-center justify-center overflow-hidden relative border-b border-borderColor">
                            {auction.image ? (
                                <img src={auction.image} alt={auction.itemTitle} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <span className="text-gray-400 text-sm font-medium">No Image</span>
                            )}
                            <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur text-[10px] uppercase font-bold tracking-wider rounded border border-gray-100 text-green-600 shadow-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Live Now
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="font-semibold text-lg mb-1 truncate text-gray-900">{auction.itemTitle}</h3>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-gray-500 truncate font-medium mt-1">📍 {auction.location}</p>
                                {auction.sellerId && <UserTag user={auction.sellerId} contact={auction.contact} />}
                            </div>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">{auction.description}</p>
                            
                            <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-4 mb-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Current Bid</span>
                                    <span className="text-primary font-bold text-base">Rs. {auction.currentHighestBid}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Ends</span>
                                    <span className="text-xs font-semibold text-gray-600">{formatDate(auction.endTime)} • {formatTime(auction.endTime)}</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button onClick={(e) => handleReadMore(e, auction)} className="flex-1 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors flex items-center justify-center">Read more</button>
                                <button onClick={(e) => handleRemindMe(e, auction)} className="flex-1 px-3 py-2 text-xs font-semibold text-primary border border-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center justify-center">Remind me</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upcoming Auctions */}
            <h2 className="text-xl font-medium mb-4 text-gray-600">Upcoming Auctions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {upcoming.length === 0 ? <p className="text-gray-500 text-sm col-span-full">No upcoming auctions scheduled.</p> : upcoming.map(auction => (
                    <div key={auction._id} className="bg-white rounded-xl shadow-sm border border-borderColor hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
                        {/* Interactive Image Container */}
                        <div className="w-full h-48 sm:h-52 bg-gray-100 flex items-center justify-center overflow-hidden relative border-b border-borderColor">
                            {auction.image ? (
                                <img src={auction.image} alt={auction.itemTitle} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <span className="text-gray-400 text-sm font-medium">No Image</span>
                            )}
                            <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur text-[10px] uppercase font-bold tracking-wider rounded border border-gray-100 text-gray-500 shadow-sm flex items-center gap-1.5">
                                Scheduled
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="font-semibold text-lg mb-1 truncate text-gray-900">{auction.itemTitle}</h3>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-gray-500 truncate font-medium mt-1">📍 {auction.location}</p>
                                {auction.sellerId && <UserTag user={auction.sellerId} contact={auction.contact} />}
                            </div>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">{auction.description}</p>
                            
                            <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-4 mb-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Base Price</span>
                                    <span className="text-gray-900 font-bold text-base">Rs. {auction.basePrice}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider mb-0.5">Starts</span>
                                    <span className="text-xs font-semibold text-gray-600">{formatDate(auction.startTime)} • {formatTime(auction.startTime)}</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button onClick={(e) => handleReadMore(e, auction)} className="flex-1 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors flex items-center justify-center">Read more</button>
                                <button onClick={(e) => handleRemindMe(e, auction)} className="flex-1 px-3 py-2 text-xs font-semibold text-primary border border-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center justify-center">Remind me</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <AuctionDetailsModal auction={selectedAuction} onClose={() => setSelectedAuction(null)} />
        </div>
    );
};
export default AuctionsMenu;
