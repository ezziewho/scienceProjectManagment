import { DataTypes } from "sequelize";
import sequelize from "../../config/db_sequelize.js";

const Others = sequelize.define("Others", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true, // Może być NULL
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
    tableName: "others",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export default Others;
