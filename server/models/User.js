import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    password: {type: String }, // Made optional for SSO
    role: {type: String, enum: ["owner", "user", "admin", "student"], default: 'student' },
    image: {type: String, default: ''},
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: '' },
    otpExpiry: { type: Date },
    isRestricted: { type: Boolean, default: false },
    restrictionReason: { type: String, default: '' },
    location: { type: String, default: '' }
},{timestamps: true})

const User = mongoose.model('User', userSchema)

export default User