import { DataTypes } from "sequelize";
import sequelize from "../../config/db_sequelize.js";

const PlannedBudget = sequelize.define("PlannedBudget", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    category: {
        type: DataTypes.ENUM("equipment", "services", "indirect_costs", "open_access", "salaries", "travel", "others"),
        allowNull: false,
    },
    planned_costs: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    actual_costs: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    difference: {
        type: DataTypes.VIRTUAL, // Obliczana w Sequelize, ale nie przechowywana w bazie
        get() {
            return parseFloat(this.planned_costs) - parseFloat(this.actual_costs);
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: true,
});

export default PlannedBudget;
