import Booking from "../models/Booking.js"
import Item from "../models/Item.js";


// Function to Check Availability of Item for a given Date
const checkAvailability = async (item, pickupDate, pickupTime)=>{
    const nowDate = new Date(pickupDate)
    const dayStart = new Date(nowDate.setHours(0,0,0,0))
    const dayEnd = new Date(nowDate.setHours(23,59,59,999))

    const bookings = await Booking.find({
        item,
        pickupDate: {$gte: dayStart, $lte: dayEnd},
        pickupTime
    })
    return bookings.length === 0;
}

// API to Check Availability of Items for the given Date and location
export const checkAvailabilityOfItem = async (req, res)=>{
    try {
        const {location, pickupDate, pickupTime} = req.body

        // fetch all available items for the given location
        const items = await Item.find({location, isAvaliable: true})

        // check item availability for the given date/time using promise
        const availableItemsPromises = items.map(async (item)=>{
           const isAvailable = await checkAvailability(item._id, pickupDate, pickupTime)
           return {...item._doc, isAvailable: isAvailable}
        })

        let availableItems = await Promise.all(availableItemsPromises);
        availableItems = availableItems.filter(item => item.isAvailable === true)

        res.json({success: true, availableItems})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Create Booking
export const createBooking = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {item, pickupDate, pickupTime} = req.body;

        const isAvailable = await checkAvailability(item, pickupDate, pickupTime)
        if(!isAvailable){
            return res.json({success: false, message: "Item is not available at the selected date/time"})
        }

        const itemData = await Item.findById(item)

        // Keep pricing as item price per day for compatibility
        const price = itemData.pricePerDay;

        await Booking.create({item, owner: itemData.owner, user: _id, pickupDate, pickupTime, price})

        res.json({success: true, message: "Booking Created"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List User Bookings 
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookingsRaw = await Booking.find({ user: _id }).populate({ path: 'item', populate: { path: 'owner', select: 'name image email' } }).sort({createdAt: -1})
        const bookings = bookingsRaw.map(booking => ({
            ...booking.toObject(),
            item: booking.item || booking.car,
            pickupTime: booking.pickupTime || booking.returnDate || ''
        }))
        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Owner Bookings

export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" })
        }
        const bookingsRaw = await Booking.find({owner: req.user._id}).populate('item user').select("-user.password").sort({createdAt: -1 })
        const bookings = bookingsRaw.map(booking => ({
            ...booking.toObject(),
            item: booking.item || booking.car,
            pickupTime: booking.pickupTime || booking.returnDate || ''
        }))
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body

        const booking = await Booking.findById(bookingId)

        if(booking.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized"})
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}