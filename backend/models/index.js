import sequelize from "../config/db_sequelize.js"; // Sequelize instance
import User from "./User.js"; // User model
import Task from "./Task.js"; // Task model
import TaskUser from "./TaskUser.js"; // Task model

// Define associations if needed (example below)
// User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
// Task.belongsTo(User, { foreignKey: 'userId' });

// Export models and Sequelize instance
export { sequelize, User, Task, TaskUser };
