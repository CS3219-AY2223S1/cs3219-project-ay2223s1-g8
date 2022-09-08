const Sequelize = require('sequelize');

const config = require('../config')[process.env.NODE_ENV || 'development'];

const connectToPostgres = async () => {
    const sequelize = new Sequelize(config.postgres.options);
    try {
        await sequelize.authenticate();
        console.log('Connection to database has been established successfully');
        return sequelize;
    } catch (err) {
        console.log('Unable to connect to the database', err);
    }
};

module.exports = {
    connectToPostgres,
}
