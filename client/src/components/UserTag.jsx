import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { assets } from '../assets/assets';

const UserTag = ({ user, contact }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const toggleModal = (e) => {
        // Prevent click events from triggering routing on parent cards
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* The Tag Trigger */}
            <div 
                onClick={toggleModal}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full cursor-pointer transition-colors w-fit shadow-sm"
            >
                <img 
                    src={user.image || assets.profile_icon} 
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover border border-gray-200 bg-white"
                    onError={(e) => { e.target.onerror = null; e.target.src = assets.profile_icon; }}
                />
                <span className="text-xs font-semibold text-gray-700 pr-1 truncate max-w-[120px]">@{user.name?.split(' ')[0]}</span>
            </div>

            {/* The Central Dimmed Modal via React Portal to escape overflow-hidden containers */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div 
                            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                            }}
                        >
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.15 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-xl shadow-xl w-full max-w-xs overflow-hidden flex flex-col relative border border-gray-200"
                            >
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                                    className="absolute top-3 right-3 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
                                >
                                    <img src={assets.close_icon} alt="Close" className="w-3 h-3 invert brightness-0 opacity-60" />
                                </button>
                                
                                <div className="p-6 flex flex-col items-center">
                                    <img 
                                        src={user.image || assets.profile_icon} 
                                        alt={user.name}
                                        className="w-20 h-20 rounded-full object-cover border border-gray-200 bg-white mb-4"
                                        onError={(e) => { e.target.onerror = null; e.target.src = assets.profile_icon; }}
                                    />
                                    <h3 className="text-lg font-semibold text-gray-800 tracking-tight">{user.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium mb-6">Listed Owner</p>
                                    
                                    <div className="w-full space-y-4">
                                        <div className="pb-3 border-b border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Contact Number</p>
                                            <p className="text-sm text-gray-700 font-medium">{contact || 'Not Provided'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Registered Email</p>
                                            <p className="text-sm text-gray-700 font-medium truncate" title={user.email}>{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default UserTag;
