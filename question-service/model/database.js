require("dotenv/config");
const { Sequelize } = require("sequelize");
const config = require("../config/config")[process.env.NODE_ENV || "dev"];

module.exports = new Sequelize(config);
