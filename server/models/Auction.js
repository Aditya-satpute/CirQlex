import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types;

const auctionSchema = new mongoose.Schema({
    sellerId: { type: ObjectId, ref: 'User', required: true },
    sellerEmail: { type: String, required: true },
    itemTitle: { type: String, required: true },
    model: { type: String, required: true },
    category: { type: String, required: true },
    contact: { type: String, required: true },
    condition: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    basePrice: { type: Number, required: true },
    currentHighestBid: { type: Number, default: function() { return this.basePrice; } },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['Scheduled', 'Active', 'Sold', 'Expired'], default: 'Scheduled' },
    winnerId: { type: ObjectId, ref: 'User', default: null },
    bids: [{
        bidderId: { type: ObjectId, ref: 'User' },
        bidderEmail: { type: String },
        amount: { type: Number },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Auction = mongoose.model('Auction', auctionSchema);

export default Auction;
