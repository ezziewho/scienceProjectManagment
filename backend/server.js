import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import sessionConfig from "./config/session.js";
import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/team.js";

import userRoutes from "./routes/user.js";
import kanbanRoutes from "./routes/kanban.js";

import notificationRoutes from "./routes/notification.js";
import budgetRoutes from "./routes/budget.js";
import { sequelize } from "./models/index.js"; // Import Sequelize setup
import leaveRoutes from "./routes/leave.js";
import documentRoutes from "./routes/document.js";
import "dotenv/config"; // This automatically runs dotenv's config method

const app = express();

// Middleware setup
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session(sessionConfig));

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/kanban", kanbanRoutes);

app.use("/notifications", notificationRoutes);
app.use("/leave", leaveRoutes);
app.use("/budget", budgetRoutes);
app.use("/document", documentRoutes);
app.use("/team", teamRoutes);
// Synchronize Sequelize models
const syncSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected to the database");

    await sequelize.sync({ alter: false });
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
