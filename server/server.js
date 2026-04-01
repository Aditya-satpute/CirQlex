import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import auctionRouter from "./routes/auctionRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";

import { createServer } from "http";
import { Server } from "socket.io";
import startAuctionScheduler from "./utils/auctionScheduler.js";
import Auction from "./models/Auction.js";

// Initialize Express App
const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Or specific allowed origins
    methods: ["GET", "POST"]
  }
});

// Connect Database
await connectDB()

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)
app.use('/api/auctions', auctionRouter)
app.use('/api/notifications', notificationRouter)

// Socket.io Setup
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-auction", (auctionId) => {
    socket.join(auctionId);
    console.log(`Socket ${socket.id} joined auction ${auctionId}`);
  });

  socket.on("place-bid", async (data, callback) => {
    try {
      const { auctionId, bidderId, bidderEmail, amount } = data;
      
      // Atomic concurrency check
      const updatedAuction = await Auction.findOneAndUpdate(
        { 
          _id: auctionId, 
          status: 'Active', 
          currentHighestBid: { $lt: amount } 
        },
        { 
          $set: { currentHighestBid: amount },
          $push: { bids: { bidderId, bidderEmail, amount, timestamp: new Date() } }
        },
        { new: true }
      );

      if (!updatedAuction) {
        const auction = await Auction.findById(auctionId);
        if(!auction) return callback({ success: false, message: "Auction not found." });
        if(auction.status !== 'Active') return callback({ success: false, message: "Auction is not active." });
        if(amount <= auction.currentHighestBid) return callback({ success: false, message: "Bid must be higher than current price." });
        return callback({ success: false, message: "Bid failed." });
      }
      await updatedAuction.populate('bids.bidderId', 'name image email');
      const newBid = updatedAuction.bids[updatedAuction.bids.length - 1];
      
      io.to(auctionId).emit("new-bid", {
        currentHighestBid: updatedAuction.currentHighestBid,
        newBid
      });

      callback({ success: true, message: "Bid accepted." });
    } catch (error) {
        console.error("Bid error:", error);
        callback({ success: false, message: "Server error placing bid." });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start Scheduler
try {
    startAuctionScheduler(io);
} catch (schedulerError) {
    console.error("Failed to start Auction Scheduler:", schedulerError.message);
}

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, (err)=> {
    if(err) {
        if(err.code === 'EADDRINUSE') {
            console.error(`❌ ERROR: Port ${PORT} is already in use. Please close existing server processes.`);
        } else {
            console.error(`❌ ERROR: Failed to listen on port ${PORT}:`, err.message);
        }
    } else {
        console.log(`✅ Server running on port ${PORT}`);
    }
});