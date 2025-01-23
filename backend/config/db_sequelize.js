import { Sequelize } from "sequelize";

// Initialize Sequelize instance
const sequelize = new Sequelize("projectsmanager", "root", "", {
    host: "localhost",
    dialect: "mysql", // Database type
    logging: false,   // Disable query logging in the console
});

export default sequelize;
