import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.json({success: false, message: "not authorized"})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded || !decoded.id){
            return res.json({success: false, message: "not authorized"})
        }
        req.user = await User.findById(decoded.id).select("-password")
        
        if(!req.user){
            return res.json({success: false, message: "User no longer exists"})
        }

        if(req.user.isRestricted){
            return res.json({success: false, message: "Your account has been restricted and you cannot access this resource."})
        }
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.json({success: false, message: "session expired or invalid token"})
    }
}