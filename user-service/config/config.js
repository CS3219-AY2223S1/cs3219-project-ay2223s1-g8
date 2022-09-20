require("dotenv/config");

module.exports = {
  dev: {
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DEV_DB,
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: "postgres",
    logging: true,
  },
  test: {
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.TEST_DB,
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: "postgres",
    logging: true,
  },
  production: {},
};
