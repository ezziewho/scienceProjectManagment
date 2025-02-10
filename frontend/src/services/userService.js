import axios from "axios";

export const fetchUserById = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8081/user/profile/${userId}`, {
            withCredentials: true, // Wysyłanie ciasteczek sesji, jeśli wymagane
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};
