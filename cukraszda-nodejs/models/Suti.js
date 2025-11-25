const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Suti = sequelize.define(
  "suti",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nev: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tipus: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    dijazott: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "suti",
    timestamps: false,
  }
);

module.exports = Suti;
