import axios from "axios";

const API_URL = "http://localhost:8081/kanban/tasks";

/*
export const fetchTasks = (filters = {}, showAllTasks = false) => {
  const endpoint = showAllTasks ? `${API_URL}/all` : `${API_URL}`;
  return axios.get(endpoint, {
    params: filters,
    withCredentials: true,
  });
};
*/

export const fetchTasks = async (filters = {}, showAllTasks = false) => {
  const endpoint = showAllTasks ? `${API_URL}/all` : `${API_URL}`;
  console.log(`Fetching tasks from: ${endpoint} with filters:`, filters);

  try {
    const response = await axios.get(endpoint, {
      params: filters,
      withCredentials: true,
    });
    console.log("Tasks fetched successfully:", response.data);

    // // Ensure response.data.tasks exists and is an array
    // if (!response.data || !Array.isArray(response.data.tasks)) {
    //   console.error("❌ API response is not an array:", response.data);
    //   return { data: { tasks: [] } }; // Return empty array to prevent crashes
    // }

    return response;
  } catch (error) {
    console.error(
      "Error fetching tasks:",
      error.response?.data || error.message
    );
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

/*
export const fetchTasks = (filters) => {
  return axios.get(`${API_URL}/all`, {
    params: filters, 
    withCredentials: true,
  });
};

export const fetchTasks2 = (showAllTasks) => {
  const endpoint = showAllTasks
    ? `${API_URL}/all` // Fetch all tasks
    : `${API_URL}`; // Fetch only user's tasks
  return axios.get(endpoint, { withCredentials: true });
};*/

export const updateTask = (task) =>
  axios.put(`${API_URL}/${task.id}`, task, { withCredentials: true });

export const createTask = (task) =>
  axios.post(API_URL, task, { withCredentials: true });
