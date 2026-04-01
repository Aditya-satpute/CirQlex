import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Item from "../models/Item.js";
import { sendOTPEmail } from "../configs/email.js";
import imagekit from '../configs/imageKit.js';
import fs from 'fs';
import { WorkOS } from '@workos-inc/node';

let workos;
const getWorkOS = () => {
    if (!workos) {
        if (!process.env.WORKOS_API_KEY) {
            console.error('WORKOS_API_KEY is not defined in .env');
            return null;
        }
        try {
            workos = new WorkOS(process.env.WORKOS_API_KEY);
        } catch (error) {
            console.error('Failed to initialize WorkOS:', error.message);
            return null;
        }
    }
    return workos;
};

const clientID = process.env.WORKOS_CLIENT_ID;

const adminEmails = ['adityasat2004@gmail.com', 'adityasatpute402@gmail.com']; // Whitelist of admin accounts

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET)
}

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// const isIitpEmail = (email) => {
//     const normalized = email.trim().toLowerCase();
//     return /^[a-zA-Z0-9._%+-]+@iitp\.ac\.in$/.test(normalized);
// }

const isIitpEmail = (email) => {
    const normalized = email.trim().toLowerCase();

    return (
        /^[a-zA-Z0-9._%+-]+@iitp\.ac\.in$/.test(normalized) ||
        normalized === "adityasat2004@gmail.com" ||
        normalized === "adityasatpute402@gmail.com"
    );
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password || password.length < 8) {
            return res.json({ success: false, message: 'Fill all the fields and password must be at least 8 characters' })
        }

        if (!isIitpEmail(email)) {
            return res.json({ success: false, message: 'Only IITP webmail id is allowed' })
        }

        const userExists = await User.findOne({ email: email.toLowerCase() })
        if (userExists) {
            return res.json({ success: false, message: 'User already exists' })
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
            otpExpiry: expiry,
            role: 'student' // Default for registering students
        })

        try {
            await sendOTPEmail(user.email, otpPlain)
        } catch (emailError) {
            console.error('Email sending failed during registration:', emailError.message);
            // We still return success but notify that email might be delayed
            return res.json({ 
                success: true, 
                message: 'Registration successful, but we had trouble sending the verification email. Please try resending OTP in a few minutes.', 
                email: user.email 
            })
        }

        res.json({ success: true, message: 'Registration successful. Please verify your email with OTP.', email: user.email })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Login User 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (!user.isVerified) {
            return res.json({ success: false, message: "Please verify your IITP email address first." })
        }

        if (user.isRestricted) {
            return res.json({ success: false, message: `Your account has been restricted. Reason: ${user.restrictionReason || 'No reason provided'}. Please contact support.` })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(user._id.toString())
        res.json({ success: true, token })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) {
            return res.json({ success: false, message: 'Email and OTP are required' })
        }

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.isVerified) {
            return res.json({ success: true, message: 'User already verified' })
        }

        if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            return res.json({ success: false, message: 'OTP expired. Please request a new code.' })
        }

        const isOtpValid = await bcrypt.compare(otp, user.otp)
        if (!isOtpValid) {
            return res.json({ success: false, message: 'Invalid OTP' })
        }

        user.isVerified = true
        user.otp = ''
        user.otpExpiry = null
        await user.save()

        const token = generateToken(user._id.toString())
        res.json({ success: true, token, message: 'Email verified successfully' })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// Resend OTP
export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.json({ success: false, message: 'Email is required' })
        }

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.isVerified) {
            return res.json({ success: false, message: 'User already verified' })
        }

        const otpPlain = generateOTP()
        user.otp = await bcrypt.hash(otpPlain, 10)
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
        await user.save()

        try {
            await sendOTPEmail(user.email, otpPlain)
        } catch (emailError) {
            console.error('Email sending failed during OTP resend:', emailError.message);
            return res.json({ success: false, message: 'Failed to send email. Please check your SMTP settings or try again later.' })
        }

        res.json({ success: true, message: 'OTP resent to your email' })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
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

        try {
            await sendOTPEmail(user.email, otpPlain)
        } catch (emailError) {
            console.error('Email sending failed during forgot password:', emailError.message);
            return res.json({ success: false, message: 'Failed to send reset code. Please try again later.' })
        }

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

        if (password.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters long' })
        }

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) return res.json({ success: false, message: 'User not found' })

        if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
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
export const getUserData = async (req, res) => {
    try {
        const { user } = req;
        res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get All Items for the Frontend
export const getItems = async (req, res) => {
    try {
        const items = await Item.find({ isAvaliable: true }).populate('owner', 'name image email');
        res.json({ success: true, items })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const { _id } = req.user;
        const { name, location } = req.body;
        const imageFile = req.file;

        const user = await User.findById(_id);
        if (!user) return res.json({ success: false, message: 'User not found' });

        if (name) user.name = name;
        if (location) user.location = location;

        if (imageFile) {
            const fileBuffer = fs.readFileSync(imageFile.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: '/users'
            });
            user.image = imagekit.url({
                path: response.filePath,
                transformation: [{ width: '400' }, { height: '400' }, { quality: '90' }, { format: 'webp' }]
            });
        }

        await user.save();
        res.json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Restrict a user (admin/database operation)
export const restrictUser = async (req, res) => {
    try {
        const { userId, reason } = req.body

        if (!userId || !reason) {
            return res.json({ success: false, message: 'User ID and restriction reason are required' })
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isRestricted: true, restrictionReason: reason },
            { new: true }
        )

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        res.json({ success: true, message: `User ${user.email} has been restricted`, user })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Unrestrict a user
export const unrestrictUser = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.json({ success: false, message: 'User ID is required' })
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isRestricted: false, restrictionReason: '' },
            { new: true }
        )

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        res.json({ success: true, message: `User ${user.email} has been unrestricted`, user })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// WorkOS Microsoft Auth
export const getMicrosoftAuthUrl = async (req, res) => {
    try {
        const workosInstance = getWorkOS();
        if (!workosInstance) return res.json({ success: false, message: 'WorkOS is not configured' });

        if (!clientID) {
            return res.json({ success: false, message: 'WORKOS_CLIENT_ID is not configured' });
        }

        if (!process.env.WORKOS_CONNECTION_ID) {
            return res.json({ success: false, message: 'WORKOS_CONNECTION_ID is not configured' });
        }

        const redirectUri =
            process.env.WORKOS_REDIRECT_URI ||
            `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/user/auth/callback`;

        console.log('Generating WorkOS Auth URL with:', { clientID, connection: process.env.WORKOS_CONNECTION_ID, redirectUri });
        const authorizationUrl = workosInstance.sso.getAuthorizationUrl({
            // Use v8 SDK keys; keep legacy aliases for compatibility.
            clientId: clientID,
            clientID,
            redirectUri,
            redirectURI: redirectUri,
            connectionId: process.env.WORKOS_CONNECTION_ID,
            connection: process.env.WORKOS_CONNECTION_ID,
        });
        console.log('Generated URL:', authorizationUrl);
        res.json({ success: true, url: authorizationUrl });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const microsoftAuthCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) return res.status(400).send('No code provided');

        const workosInstance = getWorkOS();
        if (!workosInstance) return res.status(500).send('WorkOS is not configured');

        const { profile } = await workosInstance.sso.getProfileAndToken({
            code,
            clientId: clientID,
            clientID,
        });

        const { email, firstName, lastName } = profile;
        const normalizedEmail = email.trim().toLowerCase();

        // Gatekeeper check: Only @iitp.ac.in or whitelisted admins
        const isIitp = normalizedEmail.endsWith('@iitp.ac.in');
        const isAdmin = adminEmails.includes(normalizedEmail);

        if (!isIitp && !isAdmin) {
            // Redirect to unauthorized page on frontend
            return res.status(403).redirect(`${process.env.FRONTEND_URL}/unauthorized`);
        }

        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            user = await User.create({
                name: `${firstName || ''} ${lastName || ''}`.trim(),
                email: normalizedEmail,
                role: isAdmin ? 'admin' : 'student',
                isVerified: true
            });
        } else {
            // Update role based on new admin whitelist if necessary
            if (isAdmin && user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
            } else if (!isAdmin && user.role !== 'admin' && user.role !== 'student') {
                user.role = 'student';
                await user.save();
            }
        }

        const token = generateToken(user._id.toString());
        
        // Redirect back to frontend dashboard with token
        res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);

    } catch (error) {
        console.error('WorkOS Callback Error:', error.message);
        res.status(500).send('Authentication failed');
    }
}