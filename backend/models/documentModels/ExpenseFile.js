import { DataTypes } from "sequelize";
import sequelize from "../../config/db_sequelize.js";

const ExpenseFile = sequelize.define(
  "ExpenseFile",
  {
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expense_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expense_category: {
      type: DataTypes.ENUM(
        "equipment",
        "services",
        "indirect_costs",
        "open_access",
        "travel",
        "others",
        "salaries"
      ),
      allowNull: false,
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "expense_files",
    timestamps: false,
    //createdAt: "uploaded_at", // Zmieniamy domyślną nazwę pola na zgodną z tabelą
  }
);

export default ExpenseFile;
