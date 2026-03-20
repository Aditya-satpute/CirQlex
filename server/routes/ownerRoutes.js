import express from "express";
import { protect } from "../middleware/auth.js";
import { addItem, changeRoleToOwner, deleteItem, getDashboardData, getOwnerItems, toggleItemAvailability, updateUserImage } from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner)
ownerRouter.post("/add-item", upload.single("image"), protect, addItem)
ownerRouter.get("/items", protect, getOwnerItems)
ownerRouter.post("/toggle-item", protect, toggleItemAvailability)
ownerRouter.post("/delete-item", protect, deleteItem)

ownerRouter.get('/dashboard', protect, getDashboardData)
ownerRouter.post('/update-image', upload.single("image"), protect, updateUserImage)

export default ownerRouter;