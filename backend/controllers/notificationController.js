import { Notification } from "../models/index.js";

// Pobiera powiadomienia użytkownika
export const getNotifications = async (req, res) => {
    try {
        console.log("Session data:", req.session); // Log sesji
        console.log("Session userId:", req.session.userId); // Sprawdzenie sesji
        
        if (!req.session.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const notifications = await Notification.findAll({
            where: { userId: req.session.userId },
            order: [["createdAt", "DESC"]],
        });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Oznacza powiadomienie jako przeczytane
export const markAsRead = async (req, res) => {
    try {
        await Notification.update(
            { isRead: true },
            { where: { id: req.params.id, userId: req.session.userId } }
        );
        res.json({ message: "Marked as read" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



export const addNotification = async (req, res) => {
    try {
        const { userId, type, message } = req.body;
        console.log("Incoming notification request:", req.body); // Debug log

        // Validate input
        if (!userId || !type || !message) {
            console.error("❌ Missing required fields:", { userId, type, message });
            return res.status(400).json({ error: "All fields are required (userId, type, message)." });
        }

        // Create notification with `isRead: false`
        const newNotification = await Notification.create({
            userId,
            type,
            message,
            isRead: false, // ✅ Ensuring notifications start as unread
        });

        console.log("✅ Notification added successfully:", newNotification);
        res.status(201).json(newNotification); // Return the created notification
    } catch (error) {
        console.error("❌ Error adding notification:", error);
        res.status(500).json({ error: "Failed to add notification.", details: error.message });
    }
};