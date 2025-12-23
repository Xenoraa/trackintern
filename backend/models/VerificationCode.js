import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const VerificationCode = sequelize.define("VerificationCode", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  isUsed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export default VerificationCode;

