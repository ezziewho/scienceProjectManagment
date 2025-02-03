import { DataTypes } from "sequelize";
import sequelize from "../../config/db_sequelize.js";

const Salaries = sequelize.define("Salaries", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    salary_type: {
        type: DataTypes.ENUM("full_time", "additional", "scholarship"),
        allowNull: false,
    },
    annual_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true, // Może być NULL, jeśli nie dotyczy
    },
    monthly_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true, // Może być NULL, jeśli nie dotyczy
    },
    duration_months: {
        type: DataTypes.INTEGER,
        allowNull: true, // Może być NULL, jeśli nie dotyczy
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true, // Może być NULL, jeśli umowa jest na czas nieokreślony
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true, // Może być NULL
    },
}, {
    tableName: "salaries",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export default Salaries;
