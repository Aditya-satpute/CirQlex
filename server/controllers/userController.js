import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Item from "../models/Item.js";
import { sendOTPEmail } from "../configs/email.js";
const generateToken = (userId)=>{
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

const generateOTP = ()=>{
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const isIitpEmail = (email) => {
    const normalized = email.trim().toLowerCase();
    return /^[a-zA-Z0-9._%+-]+@iitp\.ac\.in$/.test(normalized);
}

// Register User
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password || password.length < 8){
            return res.json({success: false, message: 'Fill all the fields and password must be at least 8 characters'})
        }

        if(!isIitpEmail(email)){
            return res.json({success: false, message: 'Only @iitp.ac.in email addresses are allowed'})
        }

        const userExists = await User.findOne({email: email.toLowerCase()})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const otpPlain = generateOTP()
        const hashedOtp = await bcrypt.hash(otpPlain, 10)
        const expiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            isVerified: false,
            otp: hashedOtp,
            otpExpiry: expiry
        })

        await sendOTPEmail(user.email, otpPlain)

        res.json({success: true, message: 'Registration successful. Please verify your email with OTP.', email: user.email})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Login User 
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email: email.toLowerCase()})
        if(!user){
            return res.json({success: false, message: "User not found" })
        }

        if(!user.isVerified){
            return res.json({success: false, message: "Please verify your IITP email address first."})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(user._id.toString())
        res.json({success: true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Verify OTP
export const verifyOtp = async (req, res)=>{
    try {
        const {email, otp} = req.body
        if(!email || !otp){
            return res.json({success: false, message: 'Email and OTP are required'})
        }

        const user = await User.findOne({email: email.toLowerCase()})
        if(!user){
            return res.json({success: false, message: 'User not found'})
        }

        if(user.isVerified){
            return res.json({success: true, message: 'User already verified'})
        }

        if(!user.otp || !user.otpExpiry || user.otpExpiry < new Date()){
            return res.json({success: false, message: 'OTP expired. Please request a new code.'})
        }

        const isOtpValid = await bcrypt.compare(otp, user.otp)
        if(!isOtpValid){
            return res.json({success: false, message: 'Invalid OTP'})
        }

        user.isVerified = true
        user.otp = ''
        user.otpExpiry = null
        await user.save()

        const token = generateToken(user._id.toString())
        res.json({success: true, token, message: 'Email verified successfully'})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// Resend OTP
export const resendOtp = async (req, res)=>{
    try {
        const {email} = req.body
        if(!email){
            return res.json({success: false, message: 'Email is required'})
        }

        const user = await User.findOne({email: email.toLowerCase()})
        if(!user){
            return res.json({success: false, message: 'User not found'})
        }

        if(user.isVerified){
            return res.json({success: false, message: 'User already verified'})
        }

        const otpPlain = generateOTP()
        user.otp = await bcrypt.hash(otpPlain, 10)
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
        await user.save()

        await sendOTPEmail(user.email, otpPlain)

        res.json({success: true, message: 'OTP resent to your email'})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// Forgot password (send OTP)
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.json({ success: false, message: 'Email is required' })
        }

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) return res.json({ success: false, message: 'User not found' })

        const otpPlain = generateOTP()
        user.otp = await bcrypt.hash(otpPlain, 10)
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
        await user.save()

        await sendOTPEmail(user.email, otpPlain)

        res.json({ success: true, message: 'OTP sent to your email. Use it to reset your password.' })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Reset password using OTP
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body
        if (!email || !otp || !password) {
            return res.json({ success: false, message: 'Email, OTP and new password are required' })
        }

        if(password.length < 8){
            return res.json({ success: false, message: 'Password must be at least 8 characters long' })
        }

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) return res.json({ success: false, message: 'User not found' })

        if(!user.otp || !user.otpExpiry || user.otpExpiry < new Date()){
            return res.json({ success: false, message: 'OTP is invalid or has expired, please request a new one' })
        }

        const isOtpValid = await bcrypt.compare(otp, user.otp)
        if (!isOtpValid) return res.json({ success: false, message: 'Invalid OTP' })

        user.password = await bcrypt.hash(password, 10)
        user.otp = ''
        user.otpExpiry = null
        await user.save()

        res.json({ success: true, message: 'Password reset successful. You can now log in.' })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Get User data using Token (JWT)
export const getUserData = async (req, res) =>{
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get All Items for the Frontend
export const getItems = async (req, res) =>{
    try {
        const items = await Item.find({isAvaliable: true})
        res.json({success: true, items})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}