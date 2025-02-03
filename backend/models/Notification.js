import { DataTypes } from "sequelize";
import sequelize from "../config/db_sequelize.js";
import User from "./User.js"; // Import modelu User, jeśli jest używany

const Notification = sequelize.define("Notification", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  type: {
    type: DataTypes.STRING, // np. "task_assigned", "grant_approved"
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "notifications", // Upewnij się, że nazwa tabeli jest poprawna
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

// Relacje
Notification.belongsTo(User, { foreignKey: "userId" });

export default Notification; // Eksport jako domyślny
