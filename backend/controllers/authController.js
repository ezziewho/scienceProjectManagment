import bcrypt from "bcrypt";
import db from "../db.js";

const salt = 10;

export const signup = (req, res) => {
    const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
    const password = req.body.password;

    bcrypt.hash(password.toString(), salt, (err, hash) => {
        if (err) {
            console.error("Bcrypt error:", err);
            return res.status(500).json("Error hashing password");
        }
        const values = [req.body.name, req.body.email, hash];
        db.query(sql, [values], (err, data) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json("Error inserting user");
            }
            return res.json({ success: true });
        });
    });
};

export const login = (req, res) => {
    const sql = "SELECT * FROM login WHERE `email` = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error querying user");
        }
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) {
                    console.error("Bcrypt comparison error:", err);
                    return res.status(500).json("Error comparing passwords");
                }
                if (response) {
                    req.session.role = data[0].role;
                    return res.json({ Login: true });
                }
                return res.status(401).json({ Login: false });
            });
        } else {
            return res.status(404).json("User not found");
        }
    });
};

export const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ success: false, message: "Failed to log out" });
        }
        res.clearCookie('connect.sid');
        return res.json({ success: true, message: "Logged out successfully" });
    });
};
