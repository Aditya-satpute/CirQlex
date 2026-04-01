import React from 'react';
import { motion } from 'motion/react';
import { assets } from '../../assets/assets';

const AuctionDetailsModal = ({ auction, onClose }) => {
    if (!auction) return null;

    // Formatting date helper if needed strictly internally
    const formattedDate = new Date(auction.startTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = new Date(auction.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Auction Details</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <img src={assets.close_icon} alt="Close" className="w-4 h-4" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto p-6 flex-grow">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Image Section */}
                        <div className="w-full md:w-2/5 flex-shrink-0">
                            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 aspect-square flex items-center justify-center">
                                {auction.image ? (
                                    <img src={auction.image} alt={auction.itemTitle} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400 text-sm">No Image</span>
                                )}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-3/5 flex flex-col gap-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{auction.itemTitle}</h3>
                                {auction.model && auction.model.toLowerCase() !== 'na' && (
                                    <p className="text-sm font-medium text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded">Model: {auction.model}</p>
                                )}
                            </div>

                            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Base Price</p>
                                    <p className="text-xl font-bold text-primary">Rs. {auction.basePrice}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-1">Starts At</p>
                                    <p className="text-sm font-semibold text-gray-800">{formattedDate}</p>
                                    <p className="text-xs text-gray-600 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 inline-block mt-1">{formattedTime}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Category</p>
                                    <p className="font-medium text-gray-800">{auction.category}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Location</p>
                                    <p className="font-medium text-gray-800 flex items-center gap-1">📍 {auction.location}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Condition</p>
                                    <p className="font-medium text-gray-800">{auction.condition || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Seller Contact</p>
                                    <p className="font-medium text-gray-800">{auction.contact || 'Hidden'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-500 text-xs mb-2">Description</p>
                                <div className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-md border border-gray-100 overflow-y-auto max-h-32">
                                    {auction.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer Actions */}
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                     <button onClick={onClose} className="px-5 py-2 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium">
                        Close
                    </button>
                    {auction.status === 'Scheduled' && (
                        <button onClick={() => { /* Reminder logic natively handles outside or toast */ onClose(); }} className="px-5 py-2 rounded-md bg-primary text-white hover:bg-primary-dull transition-colors text-sm font-medium tracking-wide">
                           Done
                        </button>
                    )}
                </div>

            </motion.div>
        </div>
    );
};

export default AuctionDetailsModal;
