import { Notification } from "../models/index.js";

export const createNotification = async (userId, type, message) => {
  try {
    if (!userId || !type || !message) {
      throw new Error("All fields are required (userId, type, message).");
    }

    const newNotification = await Notification.create({
      userId,
      type,
      message,
      isRead: false, // Notifications start as unread
    });

    console.log("✅ Notification created successfully:", newNotification);
    return newNotification;
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};
