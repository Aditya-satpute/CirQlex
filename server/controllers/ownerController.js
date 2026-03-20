import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Item from "../models/Item.js";
import User from "../models/User.js";
import fs from "fs";


// API to Change Role of User
export const changeRoleToOwner = async (req, res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"})
        res.json({success: true, message: "Now you can list items"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Item

export const addItem = async (req, res)=>{
    try {
        const {_id} = req.user;
        let item = JSON.parse(req.body.itemData);
        const imageFile = req.file;

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/items'
        })

        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '1280'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                { format: 'webp' }  // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;
        await Item.create({...item, owner: _id, image})

        res.json({success: true, message: "Item Added"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Owner Items
export const getOwnerItems = async (req, res)=>{
    try {
        const {_id} = req.user;
        const items = await Item.find({owner: _id })
        res.json({success: true, items})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Toggle Item Availability
export const toggleItemAvailability = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {itemId} = req.body
        const item = await Item.findById(itemId)

        // Checking is item belongs to the user
        if(item.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        item.isAvaliable = !item.isAvaliable;
        await item.save()

        res.json({success: true, message: "Availability Toggled"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Api to delete an item
export const deleteItem = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {itemId} = req.body
        const item = await Item.findById(itemId)

        // Checking is item belongs to the user
        if(item.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        item.owner = null;
        item.isAvaliable = false;

        await item.save()

        res.json({success: true, message: "Item Removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Dashboard Data
export const getDashboardData = async (req, res) =>{
    try {
        const { _id, role } = req.user;

        if(role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" });
        }

        const items = await Item.find({owner: _id})
        const bookingsRaw = await Booking.find({ owner: _id }).populate('item').sort({ createdAt: -1 });

        const bookings = bookingsRaw.map(booking => ({
            ...booking.toObject(),
            item: booking.item || booking.car
        }))

        const pendingBookings = await Booking.find({owner: _id, status: "pending" })
        const completedBookings = await Booking.find({owner: _id, status: "confirmed" })

        // Calculate monthlyRevenue from bookings where status is confirmed
        const monthlyRevenue = bookings.filter(booking => booking.status === 'confirmed').reduce((acc, booking)=> acc + booking.price, 0)

        const dashboardData = {
            totalItems: items.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to update user image

export const updateUserImage = async (req, res)=>{
    try {
        const { _id } = req.user;

        const imageFile = req.file;

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        })

        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '400'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                { format: 'webp' }  // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;

        await User.findByIdAndUpdate(_id, {image});
        res.json({success: true, message: "Image Updated" })

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}   