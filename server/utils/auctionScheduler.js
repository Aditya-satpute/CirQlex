import mongoose from 'mongoose';
import Auction from '../models/Auction.js';
import Item from '../models/Item.js';
import Booking from '../models/Booking.js';

const startAuctionScheduler = (io) => {
    // Run every 10 seconds
    setInterval(async () => {
        // Skip tick if mongoose is not connected (avoids ETIMEDOUT spam)
        if (mongoose.connection.readyState !== 1) {
            console.warn('Auction Scheduler: DB not ready, skipping tick.');
            return;
        }

        try {
            const now = new Date();
            
            // 1. Scheduled -> Active
            const readyToStart = await Auction.find({
                status: 'Scheduled',
                startTime: { $lte: now }
            });
            for(let auction of readyToStart) {
                auction.status = 'Active';
                await auction.save();
                io.emit('auctionStatusUpdated', { auctionId: auction._id, status: 'Active' });
                console.log(`Auction ${auction._id} started.`);
            }

            // 2. Active -> Sold / Expired
            const readyToEnd = await Auction.find({
                status: 'Active',
                endTime: { $lte: now }
            });
            for(let auction of readyToEnd) {
                let newItemStatus = true; // default available
                let finalPrice = auction.basePrice;

                if(auction.bids && auction.bids.length > 0) {
                    auction.status = 'Sold';
                    const highestBid = auction.bids[auction.bids.length - 1];
                    auction.winnerId = highestBid.bidderId;
                    newItemStatus = false;
                    finalPrice = highestBid.amount;
                } else {
                    auction.status = 'Expired';
                }
                
                await auction.save();

                // Abstract logic: Automatically construct Item when auction terminates
                const newItem = new Item({
                    owner: auction.sellerId,
                    title: auction.itemTitle,
                    model: auction.get('model') || 'N/A',
                    image: auction.image || '',
                    category: auction.get('category') || 'Miscellaneous',
                    contact: auction.get('contact') || '0000000000',
                    condition: auction.get('condition') || 'Good',
                    pricePerDay: finalPrice,
                    location: auction.get('location') || 'N/A',
                    description: auction.description || 'Auction item',
                    isAvaliable: newItemStatus
                });
                await newItem.save();

                // If Sold, instantly bind to a confirmed Booking for the winner
                if(auction.status === 'Sold') {
                    // Default pickup: 24h later
                    const nextDay = new Date(now);
                    nextDay.setDate(nextDay.getDate() + 1);

                    const newBooking = new Booking({
                        item: newItem._id,
                        user: auction.winnerId,
                        owner: auction.sellerId,
                        pickupDate: nextDay,
                        pickupTime: "10:00",
                        status: "confirmed",
                        price: finalPrice
                    });
                    await newBooking.save();
                }

                io.emit('auctionStatusUpdated', { auctionId: auction._id, status: auction.status, winnerId: auction.winnerId });
                console.log(`Auction ${auction._id} ended with status: ${auction.status}. Transferred to Item ${newItem._id}`);
            }
        } catch (error) {
            // Only log message to avoid wall-of-text stack traces on transient network blips
            console.error('Auction Scheduler Error:', error.message);
        }
    }, 10000);
};

export default startAuctionScheduler;
