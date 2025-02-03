import { DataTypes } from "sequelize";
import sequelize from "../../config/db_sequelize.js";

const ExpenseDocuments = sequelize.define("ExpenseDocuments", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    expense_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM("equipment", "services", "travel", "salaries"),
        allowNull: false,
    },
    document_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "expensedocuments",
    timestamps: true,
    createdAt: "uploaded_at", // Zmieniamy domyślną nazwę pola na zgodną z tabelą
    updatedAt: false, // Brak pola updated_at w tabeli
});

export default ExpenseDocuments;
