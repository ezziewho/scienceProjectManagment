import { DataTypes } from "sequelize";
import sequelize from "../../config/db_sequelize.js";

const ExternalServices = sequelize.define("ExternalServices", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    service_type: {
        type: DataTypes.ENUM(
            "research_analysis",
            "survey_research",
            "language_editing",
            "translation",
            "graphic_design",
            "transport",
            "venue_rental",
            "catering",
            "publication_support",
            "consultation",
            "survey_workers",
            "database_access",
            "specialized_literature",
            "other"
        ),
        allowNull: false,
    },
    provider: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    service_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    total_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true, // Może być NULL
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
    tableName: "externalservices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export default ExternalServices;
