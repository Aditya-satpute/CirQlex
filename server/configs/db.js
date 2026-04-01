import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        mongoose.connection.on('disconnected', () => console.warn("⚠️ MongoDB disconnected"));
        mongoose.connection.on('error', (err) => console.error("MongoDB error:", err.message));

        await mongoose.connect(`${process.env.MONGODB_URI}/cirqlex_V2`, {
            serverSelectionTimeoutMS: 5000, // fail fast on bad connection
            retryWrites: true,
        });
    } catch (error) {
        console.error("DB Connection Failed:", error.message);
    }
}


export default connectDB;