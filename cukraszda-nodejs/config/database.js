const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    define: {
      timestamps: false,
      freezeTableName: true,
    },
  }
);

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Adatbázis kapcsolat sikeresen létrejött.");
  })
  .catch((err) => {
    console.error("Nem sikerült csatlakozni az adatbázishoz:", err);
  });

module.exports = sequelize;
