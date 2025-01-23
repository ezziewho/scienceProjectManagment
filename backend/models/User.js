import { DataTypes } from "sequelize";
import sequelize from "../config/db_sequelize.js";

const User = sequelize.define(
    "User",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("admin", "user"),
            defaultValue: "user", // Domyślna rola
        },
    },
    {
        tableName: "login", // Mapa do tabeli `login`
        timestamps: true,
    }
);

export default User;
