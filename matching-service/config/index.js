require("dotenv/config");
const env = process.env.NODE_ENV || 'dev';

const config = {
  dev: {
    postgres: {
      options: {
        host: "localhost",
        port: process.env.DB_PORT,
        database: process.env.DB_LOCAL_NAME,
        dialect: "postgres",
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        logging: false,
      },
    },
  },
  prod: {
    postgres: {
      options: {
        host: process.env.DB_PROD_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_PROD_NAME,
        dialect: "postgres",
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        logging: false,
      },
    },
  },
};

module.exports = config[env];
