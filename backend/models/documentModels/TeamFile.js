import { DataTypes } from "sequelize";
import sequelize from "../../config/db_sequelize.js";

const TeamFile = sequelize.define(
  "TeamFile",
  {
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Odniesienie do tabeli 'Users'
        key: "id",
      },
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Odniesienie do tabeli 'Users'
        key: "id",
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "team_files",
    timestamps: false, // `created_at` jest zarządzane ręcznie
  }
);

export default TeamFile;
