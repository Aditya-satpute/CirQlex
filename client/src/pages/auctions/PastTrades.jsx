import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Title from '../../components/Title';
import AuctionDetailsModal from '../../components/auctions/AuctionDetailsModal';

const PastTrades = () => {
    const { axios } = useAppContext();
    const [past, setPast] = useState([]);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPast = async () => {
             try {
                 const res = await axios.get('/api/auctions?status=Past');
                 if(res.data.success) setPast(res.data.auctions);
             } catch (error) {
                 toast.error("Error fetching past trades.");
             }
        };
        fetchPast();
    }, [axios]);

    return (
        <div className="pt-24 px-6 md:px-16 lg:px-24 xl:px-32 bg-light min-h-screen pb-16">
            <button onClick={() => navigate('/auctions')} className="text-primary mb-6 block hover:underline text-sm font-medium">← Back to Auctions</button>
            <div className="mb-8">
                <Title title="Past Trades" subTitle="Browse completed auctions and final prices." align="left" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {past.length === 0 ? <p className="text-gray-500">No past trades available.</p> : past.map(auction => (
                    <div key={auction._id} className="bg-white rounded-md shadow-sm border border-borderColor overflow-hidden cursor-pointer flex flex-col" onClick={() => navigate(`/auctions/live/${auction._id}`)}>
                        <div className="p-5 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-medium text-lg text-gray-800 truncate pr-2">{auction.itemTitle}</h3>
                                <span className="px-2 py-1 text-xs font-medium rounded text-gray-500 border border-gray-200 whitespace-nowrap">
                                    {auction.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3 truncate">📍 {auction.location}</p>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{auction.description}</p>
                            
                            <div className="bg-light p-4 rounded border border-borderColor mt-auto">
                                <div className="flex justify-between text-sm mb-2">
                                     <span className="text-gray-500">Final Price:</span>
                                     <span className="font-bold text-gray-800">Rs. {auction.currentHighestBid}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                     <span className="text-gray-500">Total Bids:</span>
                                     <span className="font-semibold text-gray-700">{auction.bids?.length || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-4">
                                     <span className="text-gray-500">Ended On:</span>
                                     <span className="text-gray-700">{new Date(auction.endTime).toLocaleDateString()}</span>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); setSelectedAuction(auction); }} className="w-full px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded transition flex items-center justify-center">Read more</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AuctionDetailsModal auction={selectedAuction} onClose={() => setSelectedAuction(null)} />
        </div>
    );
};
export default PastTrades;
