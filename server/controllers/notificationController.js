import Notification from "../models/Notification.js";

export const addNotification = async (req, res) => {
    try {
        const { auctionId } = req.body;
        const userId = req.user._id;

        if (!auctionId) {
            return res.json({ success: false, message: "Auction ID is required" });
        }

        const exists = await Notification.findOne({ userId, auctionId });
        if (exists) {
            return res.json({ success: false, message: "Reminder already set for this auction" });
        }

        await Notification.create({ userId, auctionId });
        res.json({ success: true, message: "Reminder set successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ userId })
            .populate('auctionId')
            .sort({ createdAt: -1 });

        res.json({ success: true, notifications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.updateMany({ userId, isRead: false }, { isRead: true });
        res.json({ success: true, message: "Notifications marked as read" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOneAndDelete({ _id: id, userId });
        if (!notification) {
            return res.json({ success: false, message: "Notification not found" });
        }

        res.json({ success: true, message: "Notification deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
