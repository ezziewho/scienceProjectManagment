import { DataTypes } from "sequelize";
import sequelize from "../../config/db_sequelize.js";

const TaskFile = sequelize.define(
  "TaskFile",
  {
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Tasks", // Zależność od tabeli 'Tasks'
        key: "id",
      },
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "task_files",
    timestamps: false, // ponieważ `created_at` jest zarządzane ręcznie
  }
);

export default TaskFile;
