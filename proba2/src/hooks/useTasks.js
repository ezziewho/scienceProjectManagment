import { useState, useEffect } from "react";
import { fetchTasks, updateTask, createTask } from "../services/taskService";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllTasks, setShowAllTasks] = useState(false); // Toggle state

  // Fetch tasks dynamically based on the toggle
  useEffect(() => {
    const fetchDynamicTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchTasks(showAllTasks);
        setTasks(response.data);
      } catch (err) {
        setError("Error fetching tasks.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicTasks();
  }, [showAllTasks]); // Re-fetch tasks when the toggle changes

  const addTask = async (task) => {
    try {
      const response = await createTask(task);
      setTasks((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const updateTaskInState = async (updatedTask) => {
    try {
      await updateTask(updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return { tasks, addTask, updateTask: updateTaskInState, loading, error, showAllTasks, setShowAllTasks };
};
