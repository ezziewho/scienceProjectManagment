import bcrypt from "bcrypt";
import crypto from "crypto";
import db from "../config/db.js";
import nodemailer from "nodemailer";
import { User } from "../models/index.js"; // Importuj model User
//import { User } from "../models/User.js"; // Zakładam, że model Sequelize znajduje się w models/User.js
import "dotenv/config"; // This automatically runs dotenv's config method
import { sendEmail } from '../utils/email.js';
const salt = 10;


export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Generate a random password if not provided (for admin-initiated creation)
        const tempPassword = password || crypto.randomBytes(8).toString("hex");

        // Hash the password
        const hashedPassword = await bcrypt.hash(tempPassword, salt);

        // Create the user in the database
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user", // Default role to "user" if not provided
        });

           if (!password) {
    await sendEmail(
        email,
        'Your New Account Password',
        `Hello ${name},\n\nYour SCIMAN account has been created successfully. Here is your temporary password:\n\n${tempPassword}\n\nPlease log in and change your password as soon as possible.\n\nThank you!`
    );
}
        // Return success response
        return res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ error: "Error signing up user" });
    }
};



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
