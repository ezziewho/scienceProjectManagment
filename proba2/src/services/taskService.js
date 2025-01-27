import axios from "axios";

const API_URL = "http://localhost:8081/kanban/tasks";

export const fetchTasks = (showAllTasks) => {
  const endpoint = showAllTasks
    ? `${API_URL}/all` // Fetch all tasks
    : `${API_URL}`; // Fetch only user's tasks
  return axios.get(endpoint, { withCredentials: true });
};

export const updateTask = (task) =>
  axios.put(`${API_URL}/${task.id}`, task, { withCredentials: true });

export const createTask = (task) =>
  axios.post(API_URL, task, { withCredentials: true });
