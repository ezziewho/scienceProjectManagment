import User from "../models/User.js";

export const checkAuth = (req, res) => {
    //console.log("CHUJEK Session data:", req.session); // Debug session data
    if (req.session.userId) {
        // User is logged in, return role and userId
        return res.json({
            valid: true,
            role: req.session.role || "visitor", // Default role to "visitor" if undefined
            userId: req.session.userId
        });
    } else {
        // User is not logged in
        return res.json({ valid: false });
    }
};

export const getUsers = async (req, res) => {
    try {
        console.log("Session data:", req.session); // Log sesji dla debugowania
        const userId = req.session.userId; // Pobranie userId z sesji
        const userRole = req.session.role; // Pobranie roli użytkownika z sesji

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Pobierz użytkowników
        const users = await User.findAll({
            attributes: ["id", "name", "email", "role"], // Pobieramy wyłącznie potrzebne pola
        });

        // Jeśli chcesz, możesz wyróżnić użytkownika w odpowiedzi
        const formattedUsers = users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }));
        // Zwróć listę użytkowników
        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users" });
    }
};

export const addUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        console.log("Incoming request body:", req.body);
        // Walidacja danych wejściowych
        if (!name || !email || !role) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Dodanie użytkownika
        const newUser = await User.create({ name, email, role });
        res.status(201).json(newUser); // Zwracamy nowo utworzonego użytkownika
    } catch (error) {
        console.error("Error adding user:", error);
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ error: "Email already exists." });
        }
        res.status(500).json({ error: "Failed to add user." });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        // Znajdź użytkownika po ID
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Aktualizacja danych użytkownika
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        await user.save();

        res.status(200).json(user); // Zwracamy zaktualizowanego użytkownika
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user." });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Znajdź użytkownika po ID
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Usuń użytkownika
        await user.destroy();
        res.status(204).send(); // Zwracamy status 204 bez treści
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user." });
    }
};
