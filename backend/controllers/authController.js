import "dotenv/config"; // This automatically runs dotenv's config method
import bcrypt from "bcrypt";
import crypto from "crypto";
import db from "../config/db.js";
import nodemailer from "nodemailer";
import { User } from "../models/index.js"; // Importuj model User
//import { User } from "../models/User.js"; // Zakładam, że model Sequelize znajduje się w models/User.js

import { sendEmail } from "../utils/email.js";
import { Team } from "../models/index.js"; // Importuj model Team
const salt = 10;

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, team_id, team_name } = req.body;

    console.log("Received signup request with data:", req.body); // Log the incoming request data

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log("User already exists:", email); // Log if user already exists
      return res.status(400).json({ error: "User already exists" });
    }

    // Generate a random password if not provided (for admin-initiated creation)
    const tempPassword = password || crypto.randomBytes(8).toString("hex");

    // Hash the password
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    let assignedTeamId = null;

    if (team_id) {
      // User is joining an existing team
      console.log("User is joining an existing team with ID:", team_id); // Log team_id
      const team = await Team.findOne({ where: { id: team_id } });
      if (!team) {
        console.log("Team not found with ID:", team_id); // Log if team not found
        return res.status(400).json({ error: "Team not found" });
      }
      assignedTeamId = team.id;
    } else if (team_name) {
      // User is creating a new team
      console.log("User is creating a new team with name:", team_name); // Log team_name
      const newTeam = await Team.create({ name: team_name });
      assignedTeamId = newTeam.id;
    } else {
      console.log("Must join or create a team"); // Log if neither team_id nor team_name is provided
      return res.status(400).json({ error: "Must join or create a team" });
    }

    // Create the user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default role to "user" if not provided
      position: role === "manager" ? "PI" : null, // Conditionally set position
      team_id: assignedTeamId,
    });

    console.log("New user created:", newUser); // Log the new user

    if (!password) {
      await sendEmail(
        email,
        "Your New Account Password",
        `Hello ${name},\n\nYour SCIMAN account has been created successfully. Here is your temporary password:\n\n${tempPassword}\n\nPlease log in and change your password as soon as possible.\n\nThank you!`
      );
    }

    // Return success response
    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error in signup:", error); // Log any errors
    return res.status(500).json({ error: "Error signing up user" });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const newTeam = await Team.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default role to "user" if not provided
    });
    return res.status(201).json({ success: true, team });
  } catch (error) {
    console.error("Error creating team:", error);
    return res.status(500).json({ error: "Error creating team" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log("Received login request with data:", req.body);

    // Znalezienie użytkownika w bazie danych
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Porównanie hasła
    const isPasswordValid = await bcrypt.compare(
      password.toString(),
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Ustawienie sesji
    req.session.userId = user.id;
    req.session.teamId = user.team_id;
    req.session.role = user.role || "user";

    return res.json({ Login: true });
  } catch (error) {
    //console.error("Error in login:", error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    return res.json({ success: true, message: "Logged out successfully" });
  });
};
