import { DataTypes } from "sequelize";
import sequelize from "../config/db_sequelize.js";

const Task = sequelize.define("Task", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    stage: {
        type: DataTypes.ENUM("Planning", "In Progress", "Review", "Done"),
        defaultValue: "Planning",
    },
    dueDate: {
        type: DataTypes.DATE,
    },
}, {
    tableName: "tasks",
    timestamps: true,  // Włącz `createdAt` i `updatedAt`
    createdAt: "createdAt", // Nazwa kolumny w bazie
    updatedAt: "updatedAt", // Nazwa kolumny w bazie
});

export default Task;
