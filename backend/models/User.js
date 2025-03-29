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
      type: DataTypes.ENUM("admin", "user", "manager"),
      defaultValue: "user", // Domyślna rola
    },
    position: {
      type: DataTypes.ENUM(
        "PI",
        "post_doc",
        "senior_researcher",
        "student",
        "technical_staff",
        "phd_student"
      ),
      defaultValue: "user", // Domyślna rola
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Może być NULL, jeśli użytkownik nie jest przypisany do zespołu
    },
  },
  {
    tableName: "login", // Mapa do tabeli `login`
    timestamps: true,
  }
);

export default User;
