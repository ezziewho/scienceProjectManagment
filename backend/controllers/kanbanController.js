import db from "../db.js";


// Get all tasks for the logged-in user
export const getTasks = (req, res) => {
     console.log("Session data:", req.session); // Log the session
    const userId = req.session.userId; // Assuming userId is stored in the session
    const sql = "SELECT * FROM tasks WHERE user_id = ?";
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error fetching tasks");
        }
        res.json(results);
    });
};

// Create a new task
export const createTask = (req, res) => {
    console.log("Session data:", req.session); // Log the session
    const { title, description, stage } = req.body;
    const userId = req.session.userId;
    const sql = "INSERT INTO tasks (title, description, stage, user_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, description, stage, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error creating task");
        }
        res.json({ id: result.insertId, title, description, stage });
    });
};

// Update a task
export const updateTask = (req, res) => {
    const { title, description, stage } = req.body;
    const { id } = req.params;
    const sql = "UPDATE tasks SET title = ?, description = ?, stage = ? WHERE id = ?";
    db.query(sql, [title, description, stage, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error updating task");
        }
        res.json({ id, title, description, stage });
    });
};

// Delete a task
export const deleteTask = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM tasks WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error deleting task");
        }
        res.json({ id });
    });
};
