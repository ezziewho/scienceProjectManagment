import express from "express";
import {
    getAllLeaves,
    getUserLeaves,
    createLeave,
    updateLeave,
    deleteLeave,
    updateLeaveStatus
} from "../controllers/leaveController.js";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all leave requests (admin only)
router.get("/", isAuthenticated, isAdmin, getAllLeaves);

// Get logged-in user's leave requests
router.get("/mine", isAuthenticated, getUserLeaves);

// Create a new leave request
router.post("/", isAuthenticated, createLeave);

// Update a leave request (only if pending)
router.put("/:id", isAuthenticated, updateLeave);

// Delete a leave request (only if pending)
router.delete("/:id", isAuthenticated, deleteLeave);

// Approve or reject a leave request (admin only)
router.put("/:id/status", isAuthenticated, isAdmin, updateLeaveStatus);

export default router;
