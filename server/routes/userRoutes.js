import express from "express";
import { getItems, getUserData, loginUser, registerUser, verifyOtp, resendOtp, forgotPassword, resetPassword, restrictUser, unrestrictUser, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/verify-otp', verifyOtp)
userRouter.post('/resend-otp', resendOtp)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/data', protect, getUserData)
userRouter.put('/profile', protect, upload.single('image'), updateUserProfile)
userRouter.get('/items', getItems)
userRouter.post('/restrict-user', restrictUser)
userRouter.post('/unrestrict-user', unrestrictUser)

export default userRouter;