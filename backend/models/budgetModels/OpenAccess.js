import { DataTypes } from "sequelize";
import sequelize from "../../config/db_sequelize.js";

const OpenAccess = sequelize.define("OpenAccess", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    publication_title: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    journal: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    submission_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    publication_date: {
        type: DataTypes.DATE,
        allowNull: true, // Może być NULL do czasu publikacji
    },
    total_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
    },
    approved_by: {
        type: DataTypes.INTEGER,
        allowNull: true, // Może być NULL, jeśli jeszcze niezatwierdzone
    },
}, {
    tableName: "openaccess",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export default OpenAccess;
