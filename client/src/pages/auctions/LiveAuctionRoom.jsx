import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import AuctionDetailsModal from '../../components/auctions/AuctionDetailsModal';
import UserTag from '../../components/UserTag';

const backendUrl = import.meta.env.VITE_BASE_URL;

const LiveAuctionRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { axios, user, setShowLogin } = useAppContext();
    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [timeLeft, setTimeLeft] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [isPulsing, setIsPulsing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isPlacingBid, setIsPlacingBid] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    const socketRef = useRef(null);
    const auctionRef = useRef(null);
    const currentPriceRef = useRef(0);
    const bidsEndRef = useRef(null);

    // Keep refs in sync so socket callbacks always read fresh values
    useEffect(() => { auctionRef.current = auction; }, [auction]);
    useEffect(() => { currentPriceRef.current = currentPrice; }, [currentPrice]);

    // Auto-scroll bids list to bottom on new bid
    useEffect(() => {
        bidsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [bids]);

    const fetchAuction = useCallback(async () => {
        try {
            const { data } = await axios.get(`/api/auctions/${id}`);
            if (data.success) {
                setAuction(data.auction);
                setBids(data.auction.bids || []);
                setCurrentPrice(data.auction.currentHighestBid);
                if (data.auction.status !== 'Active') {
                    toast(`This auction is currently ${data.auction.status.toLowerCase()}.`);
                }
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to load auction');
        }
    }, [axios, id]);

    // Socket setup — only runs once per auction id
    useEffect(() => {
        fetchAuction();

        const socket = io(backendUrl, {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });
        socketRef.current = socket;

        const joinRoom = () => {
            socket.emit('join-auction', id);
            setSocketConnected(true);
        };

        socket.on('connect', joinRoom);
        socket.on('disconnect', () => setSocketConnected(false));

        socket.on('new-bid', (data) => {
            setCurrentPrice(data.currentHighestBid);
            setBids(prev => [...prev, data.newBid]);
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 1000);
            setActiveTab('bids');
        });

        socket.on('auctionStatusUpdated', (data) => {
            if (String(data.auctionId) === String(id)) {
                setAuction(prev => prev ? { ...prev, status: data.status } : null);
                if (data.status === 'Sold' || data.status === 'Expired') {
                    toast.success(`Auction ended! Status: ${data.status}`);
                }
            }
        });

        return () => socket.disconnect();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Countdown timer — separate effect so it doesn't touch socket
    useEffect(() => {
        if (!auction || auction.status !== 'Active') {
            setTimeLeft(auction?.status === 'Scheduled' ? 'Not Started' : 'Ended');
            return;
        }
        const endMs = new Date(auction.endTime).getTime();
        const interval = setInterval(() => {
            const distance = endMs - Date.now();
            if (distance < 0) {
                setTimeLeft('Ended');
                clearInterval(interval);
            } else {
                const h = Math.floor(distance / 3600000);
                const m = Math.floor((distance % 3600000) / 60000);
                const s = Math.floor((distance % 60000) / 1000);
                setTimeLeft(h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [auction?.status, auction?.endTime]); // only re-subscribe when status/endTime changes, NOT every render

    const handlePlaceBid = useCallback((e) => {
        e.preventDefault();
        if (!user) return setShowLogin(true);
        if (!auctionRef.current || auctionRef.current.status !== 'Active') {
            return toast.error('Auction not active');
        }

        const amount = Number(bidAmount);
        if (amount <= currentPriceRef.current) {
            return toast.error(`Bid must be higher than Rs. ${currentPriceRef.current}`);
        }

        const socket = socketRef.current;
        if (!socket || !socket.connected) {
            return toast.error('Connection lost. Reconnecting — please try again in a moment.');
        }

        setIsPlacingBid(true);
        socket.emit('place-bid', {
            auctionId: id,
            bidderId: user._id,
            bidderEmail: user.email,
            amount,
        }, (res) => {
            setIsPlacingBid(false);
            if (res?.success) {
                setBidAmount('');
                toast.success('Bid placed!');
            } else {
                toast.error(res?.message || 'Failed to place bid');
            }
        });
    }, [user, bidAmount, id, setShowLogin]);

    if (!auction) return (
        <div className="pt-32 flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm">Loading auction...</p>
        </div>
    );

    const isWarning = timeLeft && !timeLeft.includes('h') && !timeLeft.includes('Not') && !timeLeft.includes('Ended')
        && Number(timeLeft.split('m')[0]) === 0
        && Number((timeLeft.split('m ')[1] || '').replace('s', '') || 99) < 10;

    // ── Inline bid form JSX — NOT a nested component (prevents focus loss on re-render) ──
    const bidFormJSX = auction.status === 'Active' ? (
        <form onSubmit={handlePlaceBid} className="flex gap-2 mt-4">
            <input
                type="number"
                required
                min={currentPrice + 1}
                value={bidAmount}
                onChange={e => setBidAmount(e.target.value)}
                placeholder={`Min: Rs. ${currentPrice + 1}`}
                className="flex-1 min-w-0 bg-white border border-borderColor rounded-lg px-4 py-3 outline-none focus:border-primary transition-colors text-base"
            />
            <button
                type="submit"
                disabled={isPlacingBid}
                className="bg-primary hover:bg-primary-dull disabled:opacity-60 text-white px-5 py-3 rounded-lg font-medium shadow-sm transition-all text-sm whitespace-nowrap"
            >
                {isPlacingBid ? '...' : 'Place Bid'}
            </button>
        </form>
    ) : (
        <div className="mt-4 p-4 bg-light rounded-lg text-center text-gray-600 font-medium border border-borderColor text-sm">
            Bidding is {auction.status === 'Scheduled' ? 'not yet open' : 'closed'}.
        </div>
    );

    return (
        <div className="pt-20 px-4 md:px-12 lg:px-20 xl:px-28 bg-light min-h-screen pb-16">
            {/* Back + connection status */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => navigate('/auctions')}
                    className="text-primary hover:underline text-sm font-medium"
                >
                    ← Back to Auctions
                </button>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`}></span>
                    {socketConnected ? 'Live' : 'Reconnecting...'}
                </div>
            </div>

            {/* Mobile tab switcher */}
            <div className="md:hidden flex rounded-lg border border-borderColor overflow-hidden mb-4 text-sm font-medium">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-2.5 transition-colors ${activeTab === 'details' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                >
                    Item Details
                </button>
                <button
                    onClick={() => setActiveTab('bids')}
                    className={`flex-1 py-2.5 transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'bids' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                >
                    Live Bids
                    {bids.length > 0 && (
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${activeTab === 'bids' ? 'bg-white text-primary' : 'bg-green-500 text-white'}`}>
                            {bids.length > 99 ? '99+' : bids.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Main layout */}
            <div className="flex flex-col md:flex-row gap-6">

                {/* Left: Item Details */}
                <div className={`flex-1 ${activeTab === 'bids' ? 'hidden md:block' : ''}`}>
                    <div className="bg-white rounded-xl p-5 md:p-8 shadow-sm border border-borderColor">

                        {/* Title + Status + Timer */}
                        <div className="flex flex-wrap justify-between items-start gap-3 mb-5">
                            <div>
                                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 leading-tight">
                                    {auction.itemTitle}
                                </h1>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${auction.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                    {auction.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
                                    {auction.status}
                                </span>
                            </div>
                            {auction.status === 'Active' && (
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">Time Left</p>
                                    <motion.p
                                        className={`text-xl md:text-2xl font-bold ${isWarning ? 'text-red-500' : 'text-gray-800'}`}
                                        animate={isWarning ? { scale: [1, 1.08, 1] } : {}}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                    >
                                        {timeLeft}
                                    </motion.p>
                                </div>
                            )}
                        </div>

                        {/* Current bid + meta */}
                        <div className="bg-light rounded-xl p-4 border border-borderColor mb-5">
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Current Highest Bid</p>
                                    <motion.p
                                        className={`text-3xl md:text-4xl font-bold ${isPulsing ? 'text-green-500' : 'text-primary'}`}
                                        animate={isPulsing ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        Rs. {currentPrice}
                                    </motion.p>
                                </div>
                                <div className="text-sm text-gray-500 bg-white p-3 rounded-lg border border-borderColor">
                                    <p>Starts: {new Date(auction.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                    <p>Ends: {new Date(auction.endTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                    <div className="mt-2 text-xs uppercase font-bold text-gray-400">Owner</div>
                                    {auction.sellerId && <UserTag user={auction.sellerId} contact={auction.contact} />}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-500 mb-5 whitespace-pre-wrap leading-relaxed text-sm">
                            {auction.description}
                        </p>

                        {/* Bid form — details panel */}
                        {bidFormJSX}

                        <div className="mt-5 border-t border-borderColor pt-5">
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium shadow-sm transition-colors text-sm"
                            >
                                Read More Details
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Live Bids */}
                <div
                    className={`w-full md:w-96 bg-white rounded-xl shadow-sm border border-borderColor flex flex-col overflow-hidden ${activeTab === 'details' ? 'hidden md:flex' : ''}`}
                    style={{ height: 'calc(100vh - 160px)', minHeight: '400px', maxHeight: '700px' }}
                >
                    <div className="p-4 md:p-5 border-b border-borderColor bg-light flex items-center justify-between">
                        <h2 className="font-semibold text-base flex items-center gap-2 text-gray-800">
                            {auction.status === 'Active'
                                ? <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                : <span className="w-2 h-2 rounded-full bg-gray-400"></span>}
                            Live Bids
                        </h2>
                        <span className="text-xs text-gray-400">{bids.length} bid{bids.length !== 1 ? 's' : ''}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                        {bids.length === 0 && (
                            <p className="text-gray-400 text-center mt-10 text-sm">No bids yet. Be the first!</p>
                        )}
                        <AnimatePresence>
                            {bids.map((bid, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={bid._id || i}
                                    className="bg-white rounded-lg p-3 border border-borderColor flex justify-between items-center gap-2"
                                >
                                    <div className="min-w-0">
                                        {bid.bidderId ? (
                                            <div className="-ml-1 mb-0.5">
                                                <UserTag user={bid.bidderId} contact="Bidder" />
                                            </div>
                                        ) : (
                                            <p className="font-medium text-gray-800 text-sm truncate max-w-[140px]">
                                                {bid.bidderEmail || 'Anonymous'}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400">
                                            {new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className="font-bold text-primary bg-blue-50 px-3 py-1 rounded-full text-sm border border-blue-100 whitespace-nowrap shrink-0">
                                        Rs. {bid.amount}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={bidsEndRef} />
                    </div>

                    {/* Bid form inside bids panel — mobile only */}
                    <div className="md:hidden p-3 border-t border-borderColor bg-light shrink-0">
                        {bidFormJSX}
                    </div>
                </div>
            </div>

            {showModal && <AuctionDetailsModal auction={auction} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default LiveAuctionRoom;
