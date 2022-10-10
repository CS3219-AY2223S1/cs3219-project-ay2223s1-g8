require("dotenv/config");

module.exports = {
  dev: {
    database: {
      uri: process.env.DB_MONGO_URI || "mongodb://localhost:27017/history-db",
    },
  },
  test: {
    database: {
      uri: process.env.DB_MONGO_URI_TEST || "mongodb://localhost:27017/history-db-test",
    },
  },
  prod: {},
};
