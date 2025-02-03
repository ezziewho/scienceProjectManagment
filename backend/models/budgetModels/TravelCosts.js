import { DataTypes } from "sequelize";
import sequelize from "../../config/db_sequelize.js";

const TravelCosts = sequelize.define("TravelCosts", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    trip_type: {
        type: DataTypes.ENUM("conference", "field_research", "workshop"),
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    departure_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    transport_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    accommodation_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    daily_allowance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    total_cost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true, // Może być NULL (generowane dynamicznie)
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
    tableName: "travelcosts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export default TravelCosts;
