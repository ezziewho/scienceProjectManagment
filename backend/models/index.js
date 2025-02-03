import sequelize from "../config/db_sequelize.js"; // Sequelize instance
import User from "./User.js"; // User model
import Task from "./Task.js"; // Task model
import TaskUser from "./TaskUser.js"; // TaskUser model
import Notification from "./Notification.js";
import Leave from "./Leave.js";
import PlannedBudget from "./budgetModels/PlannedBudget.js";

// Import modeli budżetu
import EquipmentAndSoftware from "./budgetModels/EquipmentAndSoftware.js";
import ExternalServices from "./budgetModels/ExternalServices.js";
import IndirectCosts from "./budgetModels/IndirectCosts.js";
import OpenAccess from "./budgetModels/OpenAccess.js";
import Salaries from "./budgetModels/Salaries.js";
import TravelCosts from "./budgetModels/TravelCosts.js";
import Others from "./budgetModels/Others.js";
import ExpenseDocuments from "./documentModels/ExpenseDocuments.js";

// Export models and Sequelize instance
export {
    sequelize,
    User,
    Task,
    TaskUser,
    Notification,
    Leave,
    EquipmentAndSoftware,
    ExternalServices,
    IndirectCosts,
    OpenAccess,
    Salaries,
    TravelCosts,
    Others,
    ExpenseDocuments,
    PlannedBudget
};
