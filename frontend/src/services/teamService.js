import axios from "axios";

const API_URL = "http://localhost:8081/team";

export const fetchTeamInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/getteam`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching team info:", error);
    throw error;
  }
};

export const changeProjectPhase = async () => {
  try {
    const response = await axios.get(`${API_URL}/updateteamphase`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating team phase:", error);
    throw error;
  }
};
