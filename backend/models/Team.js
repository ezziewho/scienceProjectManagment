import { DataTypes } from "sequelize";
import sequelize from "../config/db_sequelize.js";

const Team = sequelize.define(
  "Team",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    team_name: {
      type: DataTypes.STRING(255), // Dodane pole team_name zgodnie z bazą
      allowNull: false,
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt fields
    tableName: "teams",
  }
);

export default Team;
