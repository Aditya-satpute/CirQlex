import express from 'express';
import { createAuction, getAuctions, getAuctionById } from '../controllers/auctionController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/', upload.single('image'), protect, createAuction);
router.get('/', getAuctions);
router.get('/:id', getAuctionById);

export default router;
