require("dotenv/config");
const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: "postgres",
    logging: false,
  }
);
