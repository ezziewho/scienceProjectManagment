import { DataTypes } from "sequelize";
import sequelize from "../config/db_sequelize.js";
import User from "./User.js";
import Task from "./Task.js";

const TaskUser = sequelize.define(
    "TaskUser",
    {
        assignedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "task_users",
        timestamps: false,
    }
);

// Relacje
Task.belongsToMany(User, { through: TaskUser, foreignKey: "task_id" });
User.belongsToMany(Task, { through: TaskUser, foreignKey: "user_id" });

export default TaskUser;
