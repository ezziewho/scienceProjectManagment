import bcrypt from "bcrypt";
import db from "../config/db.js";
import { User } from "../models/index.js"; // Importuj model User
//import { User } from "../models/User.js"; // Zakładam, że model Sequelize znajduje się w models/User.js

const salt = 10;

/*
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
};*/

export const signup = async (req, res) => {
    try {
        // Pobranie hasła i innych danych z żądania
        const { name, email, password } = req.body;
        

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Haszowanie hasła
        console.log("UWAGA ",  req.body);
        const hashedPassword = await bcrypt.hash(password.toString(), salt);

        // Tworzenie nowego użytkownika w bazie danych za pomocą Sequelize
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        
        // Zwrócenie odpowiedzi sukcesu
        return res.json({ success: true, user: newUser });
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ error: "Error signing up user" });
    }
};

/*
hihi
export const login = (req, res) => {
    const sql = "SELECT * FROM login WHERE `email` = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error querying user");
        }
        if (data.length > 0) {
            const user = data[0];
            console.log(data);
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) {
                    console.error("Bcrypt comparison error:", err);
                    return res.status(500).json("Error comparing passwords");
                }
                if (response) {
                    req.session.userId = user.id; // Set userId in session
                    req.session.role = user.role //|| "user"; // Set role in session
                    //req.session.role = data[0].role;
                    console.log("Session data after login:", req.session);
                    
                    return res.json({ Login: true});
    
                }
                return res.status(401).json({ Login: false });
            });
        } else {
            return res.status(404).json("User not found");
        }
    });
};
*/
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Znalezienie użytkownika w bazie danych
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Porównanie hasła
        const isPasswordValid = await bcrypt.compare(password.toString(), user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Ustawienie sesji
        req.session.userId = user.id;
        req.session.role = user.role || "user"; // Przypisanie roli, jeśli istnieje

        console.log("Session data after login:", req.session);

        // Zwrócenie odpowiedzi sukcesu
        return res.json({ Login: true });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ error: "An error occurred during login" });
    }
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
