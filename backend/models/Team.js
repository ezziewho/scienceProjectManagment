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
    isApplicationApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt fields
    tableName: "team",
  }
);

export default Team;
