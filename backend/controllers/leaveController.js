import Leave from "../models/Leave.js";
import User from "../models/User.js";
import { addNotification } from "../controllers/notificationController.js";
/**
 * Get all leave requests (for admins)
 * GET /leaves
 */
export const getAllLeaves = async (req, res) => {
    try {
        console.log("Admin trying to fetch all leave requests"); // Debugging log

        const leaves = await Leave.findAll({
            order: [["start_date", "ASC"]],
        });

        console.log("Leaves fetched successfully:", leaves); // Debugging log

        res.status(200).json(leaves);
    } catch (error) {
        console.error("Error fetching all leave requests:", error); // Shows actual error
        res.status(500).json({ error: "Failed to fetch leave requests.", details: error.message });
    }
};


/**
 * Get leave requests of the logged-in user
 * GET /leaves/mine
 */
export const getUserLeaves = async (req, res) => {
    try {
        console.log("Session data in getUserLeaves:", req.session); // Debugging session

        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized. Please log in." });
        }

        console.log("Fetching leaves for user ID:", userId); // Debugging

        const leaves = await Leave.findAll({
            where: { user_id: userId },
            order: [["start_date", "ASC"]],
        });

        res.status(200).json(leaves);
    } catch (error) {
        console.error("Error fetching user leave requests:", error); // Show actual error
        res.status(500).json({ error: "Error fetching user leave requests.", details: error.message });
    }
};


/**
 * Create a new leave request
 * POST /leaves
 */
export const createLeave = async (req, res) => {
    try {
        console.log("Session in createLeave:", req.session); // Debug session data

        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized. Please log in." });
        }

        console.log("Request body:", req.body); // Debug request data

        const { start_date, end_date } = req.body;
        if (!start_date || !end_date) {
            return res.status(400).json({ error: "Start date and end date are required." });
        }

        const leave = await Leave.create({
            user_id: userId,
            start_date,
            end_date,
            status: "pending",
        });

        console.log("Leave created:", leave); // Debug successful insertion

        res.status(201).json(leave);
    } catch (error) {
        console.error("Error creating leave request:", error);
        res.status(500).json({ error: "Failed to create leave request.", details: error.message });
    }
};


/**
 * Update an existing leave request (only if status is 'pending')
 * PUT /leaves/:id
 */
export const updateLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { start_date, end_date } = req.body;

        const leave = await Leave.findByPk(id);
        if (!leave) return res.status(404).json({ error: "Leave request not found." });

        if (leave.user_id !== req.user.id || leave.status !== "pending") {
            return res.status(403).json({ error: "You can only edit pending leave requests." });
        }

        await leave.update({ start_date, end_date });
        res.status(200).json(leave);
    } catch (error) {
        res.status(500).json({ error: "Error updating leave request." });
    }
};

/**
 * Delete a leave request (only if status is 'pending')
 * DELETE /leaves/:id
 */
export const deleteLeave = async (req, res) => {
    try {
        console.log("Delete request received for leave ID:", req.params.id); // Debugging

        const leave = await Leave.findByPk(req.params.id);
        if (!leave) {
            return res.status(404).json({ error: "Leave request not found." });
        }

        await leave.destroy();
        res.status(200).json({ message: "Leave request deleted successfully." });

    } catch (error) {
        console.error("Error deleting leave request:", error);
        res.status(500).json({ error: "Failed to delete leave request.", details: error.message });
    }
};


/**
 * Approve or reject a leave request (for admins)
 * PUT /leaves/:id/status
 */
export const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`Updating leave request ${id} with status: ${status}`);

        if (!["approved", "rejected"].includes(status)) {
            console.error("Invalid status value received:", status);
            return res.status(400).json({ error: "Invalid status value." });
        }

        const leave = await Leave.findByPk(id);
        if (!leave) {
            console.error(`Leave request with ID ${id} not found.`);
            return res.status(404).json({ error: "Leave request not found." });
        }

        await leave.update({ status });
        console.log(`Leave request ${id} updated successfully.`);

        // ✅ Send notification
        const message = `Your leave request from ${leave.start_date} to ${leave.end_date} has been ${status}.`;
        await addNotification(leave.user_id, `leave_${status}`, message);
        console.log(`Notification sent to user ${leave.user_id}`);

        res.status(200).json({ message: `Leave request ${status} and notification sent.` });

    } catch (error) {
        console.error("Error updating leave status:", error);
        res.status(500).json({ error: "Failed to update leave status." });
    }
};
