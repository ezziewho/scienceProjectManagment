import { DataTypes } from "sequelize";
import sequelize from "../config/db_sequelize.js";

const Leave = sequelize.define("Leave", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
    },
}, {
    tableName: "leaves",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
});

export default Leave;
