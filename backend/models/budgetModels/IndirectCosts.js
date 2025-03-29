import { DataTypes } from "sequelize";
import sequelize from "../../config/db_sequelize.js";

const IndirectCosts = sequelize.define(
  "IndirectCosts",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(
        "administration",
        "infrastructure",
        "cleaning",
        "others"
      ),
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
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Może być NULL, jeśli użytkownik nie jest przypisany do zespołu
    },
    phase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "indirectcosts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default IndirectCosts;
