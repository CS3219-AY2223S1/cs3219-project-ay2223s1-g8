require("dotenv/config");

module.exports = {
    development: {
        postgres: {
            options: {
                host: 'localhost',
                port: process.env.DB_PORT,
                database: process.env.DB_LOCAL_NAME,
                dialect: 'postgres',
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                logging: console.log,
            },
        },
    },
    production: {},
};