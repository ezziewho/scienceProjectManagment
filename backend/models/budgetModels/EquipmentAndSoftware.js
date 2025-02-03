import { DataTypes } from "sequelize";
import sequelize from "../../config/db_sequelize.js";

const EquipmentAndSoftware = sequelize.define(
  "EquipmentAndSoftware",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("scientific_apparatus", "measurement_devices"),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Domyślna wartość, zgodnie z bazą
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_cost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true, // Zgodnie z bazą, może być NULL
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    supplier: {
      type: DataTypes.STRING(255),
      allowNull: true, // Może być NULL
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true, // Może być NULL, dopóki nie zostanie zatwierdzone
    },
  },
  {
    tableName: "equipmentandsoftware",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default EquipmentAndSoftware;
