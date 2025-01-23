/*import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import sessionConfig from "./config/session.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import kanbanRoutes from "./routes/kanban.js";

// Import Sequelize setup
import "./config/db_sequelize.js"; // Synchronizes models on app startup

const app = express();

// Middleware setup
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session(sessionConfig));

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/kanban", kanbanRoutes);

console.log("Auth routes registered under /auth");

// Start server
app.listen(8081, () => {
    console.log("Listening on port 8081");
});*/
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import sessionConfig from "./config/session.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import kanbanRoutes from "./routes/kanban.js";
import { sequelize } from "./models/index.js"; // Import Sequelize setup

const app = express();

// Middleware setup
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session(sessionConfig));

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/kanban", kanbanRoutes);

// Synchronize Sequelize models
const syncSequelize = async () => {
    try {
        await sequelize.authenticate();
        console.log("Sequelize connected to the database");

        await sequelize.sync({ alter: true });
        console.log("Sequelize models synchronized");
    } catch (err) {
        console.error("Error synchronizing Sequelize models:", err);
    }
};

syncSequelize();

// Start server
app.listen(8081, () => {
    console.log("Listening on port 8081");
});

