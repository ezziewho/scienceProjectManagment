import axios from "axios";

const API_URL = "http://localhost:8081/budget"; // Endpoint backendu

// Funkcja pobierająca podsumowanie budżetu
export const fetchBudgetSummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/summary`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching budget summary:", error);
    throw error;
  }
};

export const editPlannedBudget = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData, {
      withCredentials: true, // Jeśli korzystasz z autoryzacji sesyjnej
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error updating planned budget entry:", error);
    throw error;
  }
};

export const fetchExpensesByCategory = async (expense_category) => {
  try {
    const response = await axios.get(`${API_URL}/${expense_category}`);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching expenses for category:",
      expense_category,
      error
    );
    throw error;
  }
};

// Pobiera planowany budżet z backendu
export const fetchPlannedBudget = async () => {
  const response = await axios.get(`${API_URL}/planned`);
  return response.data;
};
