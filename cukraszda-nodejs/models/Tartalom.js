const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Tartalom = sequelize.define(
  "tartalom",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sutiid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mentes: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "tartalom",
    timestamps: false,
  }
);

module.exports = Tartalom;
