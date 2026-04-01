import express from 'express';
import { addNotification, getNotifications, markAsRead, deleteNotification } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const notificationRouter = express.Router();

notificationRouter.post('/add', protect, addNotification);
notificationRouter.get('/list', protect, getNotifications);
notificationRouter.put('/mark-read', protect, markAsRead);
notificationRouter.delete('/:id', protect, deleteNotification);

export default notificationRouter;
