import { useState, useEffect } from "react";
import { fetchTasks, updateTask, createTask } from "../services/taskService";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks()
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const addTask = (task) =>
    createTask(task).then((res) => setTasks((prev) => [...prev, res.data]));

  const updateTaskInState = (updatedTask) =>
    updateTask(updatedTask).then(() =>
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
    );

  return { tasks, addTask, updateTask: updateTaskInState };
};
