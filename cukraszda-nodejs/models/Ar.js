const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ar = sequelize.define(
  "ar",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sutiid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "suti",
        key: "id",
      },
    },
    ertek: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    egyseg: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "ar",
    timestamps: false,
  }
);

module.exports = Ar;
