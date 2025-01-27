/*import db from "../config/db.js";


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
*/
import { Task, TaskUser, User } from "../models/index.js"; // Importuj modele zdefiniowane w Sequelize


export const getTasks = async (req, res) => {
    try {
        console.log("Session data:", req.session); // Log sesji
        const userId = req.session.userId; // Pobranie userId z sesji

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Pobierz zadania powiązane z zalogowanym użytkownikiem
        const tasks = await Task.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "name"], // Pobierz ID i nazwę użytkownika
                    through: { attributes: [] } // Pomijamy dodatkowe dane z tabeli pośredniej
                }
            ]
        });

        // Filtrowanie zadań, aby zachować tylko te, które dotyczą zalogowanego użytkownika
        const userTasks = tasks.filter((task) =>
            task.Users.some((user) => user.id === userId)
        );

        // Formatowanie danych
        const formattedTasks = userTasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            stage: task.stage,
            dueDate: task.dueDate,
            usersResponsible: task.Users.map((user) => user.name).join(", "),
        }));

        res.json(formattedTasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Error fetching tasks" });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        // Pobierz wszystkie zadania wraz z informacjami o przypisanych użytkownikach
        const tasks = await Task.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "name"], // Pobierz ID i nazwę użytkowników
                    through: { attributes: [] } // Pomijamy dodatkowe dane z tabeli pośredniej
                }
            ]
        });

        // Formatowanie danych
        const formattedTasks = tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            stage: task.stage,
            dueDate: task.dueDate,
            usersResponsible: task.Users.map((user) => user.name).join(", "),
        }));

        res.json(formattedTasks);
    } catch (error) {
        console.error("Error fetching all tasks:", error);
        res.status(500).json({ error: "Error fetching all tasks" });
    }
};





// Utwórz nowe zadanie
/*
export const createTask = async (req, res) => {
    try {
        console.log("Session data:", req.session); // Log sesji
        const { title, description, stage } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Tworzenie zadania
        const task = await Task.create({
            title,
            description,
            stage
        });

        // Powiązanie zadania z użytkownikiem w tabeli `task_users`
        await TaskUser.create({
            task_id: task.id,
            user_id: userId
        });

        res.json(task);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Error creating task" });
    }
};
*/
export const createTask = async (req, res) => {
    try {
        const { title, description, stage, dueDate, assignedUsers } = req.body; // Pobieramy dane z żądania
        const userId = req.session.userId; // Identyfikator aktualnie zalogowanego użytkownika

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Tworzymy zadanie
        const task = await Task.create({
            title,
            description,
            stage,
            dueDate,
        });

        // Znajdujemy użytkowników przypisanych do zadania
        if (assignedUsers && assignedUsers.length > 0) {
            const usersToAssign = await User.findAll({
                where: { name: assignedUsers }, // Znajdujemy użytkowników na podstawie nazw
            });

            // Dodajemy użytkowników do zadania
            await task.addUsers(usersToAssign);
        }

        // Pobieramy zadanie wraz z przypisanymi użytkownikami
        const createdTask = await Task.findOne({
            where: { id: task.id },
            include: [
                {
                    model: User,
                    attributes: ["name", "email"], // Pobieramy tylko nazwę i e-mail użytkowników
                    through: { attributes: [] }, // Nie pokazujemy szczegółów tabeli pośredniej
                },
            ],
        });

        res.json({
            id: createdTask.id,
            title: createdTask.title,
            description: createdTask.description,
            stage: createdTask.stage,
            dueDate: createdTask.dueDate,
            assignedUsers: createdTask.Users.map((user) => ({
                name: user.name,
                email: user.email,
            })),
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Error creating task" });
    }
};

// Zaktualizuj zadanie
export const updateTask = async (req, res) => {
    try {
        const { title, description, stage } = req.body;
        const { id } = req.params;

        // Aktualizacja zadania
        const [updatedRows] = await Task.update(
            { title, description, stage },
            { where: { id } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ id, title, description, stage });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Error updating task" });
    }
};

// Usuń zadanie
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Usunięcie zadania
        const deletedRows = await Task.destroy({ where: { id } });

        if (deletedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ id });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Error deleting task" });
    }
};

export const getStages = async (req, res) => {
    try {
        // Pobranie możliwych wartości dla pola `stage`
        const stages = Task.getAttributes().stage.values; // Pobieramy wartości ENUM
        res.status(200).json(stages); // Zwracamy je jako tablicę JSON
    } catch (error) {
        console.error("Error fetching task stages:", error);
        res.status(500).json({ error: "Error fetching task stages" });
    }
};