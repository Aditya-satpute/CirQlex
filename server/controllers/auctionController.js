import imagekit from '../configs/imageKit.js';
import fs from 'fs';
import Auction from '../models/Auction.js';

export const createAuction = async (req, res) => {
    try {
        const itemBody = JSON.parse(req.body.itemData);
        const imageFile = req.file;

        let image = '';
        if (imageFile) {
             const fileBuffer = fs.readFileSync(imageFile.path);
             const response = await imagekit.upload({
                 file: fileBuffer,
                 fileName: imageFile.originalname,
                 folder: '/items'
             });
             image = imagekit.url({
                 path : response.filePath,
                 transformation : [{width: '1280'}, {quality: 'auto'}, { format: 'webp' }]
             });
        }

        const { itemTitle, description, basePrice, startTime, endTime, model, category, contact, condition, location } = itemBody;
        const newAuction = new Auction({
            sellerId: req.user._id,
            sellerEmail: req.user.email,
            itemTitle,
            model,
            category,
            contact,
            condition,
            location,
            description,
            image,
            basePrice,
            startTime,
            endTime
        });
        await newAuction.save();
        res.status(201).json({ success: true, auction: newAuction, message: "Auction created" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAuctions = async (req, res) => {
    try {
        const { status } = req.query; // e.g. 'Upcoming', 'Active', 'Past'
        let queryStat = [];
        if (status === 'Upcoming') queryStat = ['Scheduled'];
        else if (status === 'Active') queryStat = ['Active'];
        else if (status === 'Past') queryStat = ['Sold', 'Expired'];
        
        const filter = queryStat.length > 0 ? { status: { $in: queryStat } } : {};
        const auctions = await Auction.find(filter).populate('sellerId', 'name image email').sort({ startTime: 1 });
        res.status(200).json({ success: true, auctions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAuctionById = async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id)
            .populate('sellerId', 'name image email')
            .populate('bids.bidderId', 'name image email');
        if (!auction) return res.status(404).json({ success: false, message: 'Auction not found' });
        res.status(200).json({ success: true, auction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
