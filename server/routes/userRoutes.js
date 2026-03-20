import express from "express";
import { getItems, getUserData, loginUser, registerUser, verifyOtp, resendOtp, forgotPassword, resetPassword } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/verify-otp', verifyOtp)
userRouter.post('/resend-otp', resendOtp)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/data', protect, getUserData)
userRouter.get('/items', getItems)

export default userRouter;