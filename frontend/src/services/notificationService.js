import axios from "axios";

const API_URL = "http://localhost:8081/notifications";

/**
 * Pobiera powiadomienia użytkownika.
 * @returns {Promise<Array>} Lista powiadomień użytkownika.
 */
export const fetchNotifications = async () => {
  try {
    const response = await axios.get(API_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Oznacza powiadomienie jako przeczytane.
 * @param {number} notificationId - ID powiadomienia do oznaczenia jako przeczytane.
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    await axios.put(
      `${API_URL}/${notificationId}/read`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    throw error;
  }
};
