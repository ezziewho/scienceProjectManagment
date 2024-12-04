import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/kanbanController.js";
import { isAdmin } from "./../middleware/authMiddleware.js";

const router = express.Router();


// Get all tasks for the logged-in user
router.get("/tasks", getTasks);

// Create a new task
router.post("/tasks", createTask);


// Update an existing task
router.put("/tasks/:id", updateTask);

// Delete a task
router.delete("/tasks/:id", deleteTask);

export default router;
