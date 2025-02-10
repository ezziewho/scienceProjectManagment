import axios from "axios";

const API_URL = "http://localhost:8081/leave"; // Base API endpoint

/**
 * Fetch all leave requests of the logged-in user
 */
export const fetchUserLeaves = async () => {
    try {
        const response = await axios.get(`${API_URL}/mine`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching user leaves:", error);
        throw error;
    }
};

/**
 * Submit a new leave request
 */
export const requestLeave = async (startDate, endDate) => {
    try {
        const response = await axios.post(
            API_URL,
            { start_date: startDate, end_date: endDate },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Error requesting leave:", error);
        throw error;
    }
};

/**
 * Delete a pending leave request
 */
export const deleteLeave = async (leaveId) => {
    try {
        await axios.delete(`${API_URL}/${leaveId}`, { withCredentials: true });
    } catch (error) {
        console.error("Error deleting leave request:", error);
        throw error;
    }
};

/**
 * Update the status of a leave request (Admin Only)
 */
export const updateLeaveStatus = async (leaveId, status) => {
    try {
        const response = await axios.put(
            `${API_URL}/${leaveId}/status`,
            { status },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating leave status:", error);
        throw error;
    }
};
