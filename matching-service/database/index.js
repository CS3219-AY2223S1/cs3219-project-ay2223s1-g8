const Sequelize = require('sequelize');

const config = require('../config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.postgres.options);
const connectToPostgres = () => {
    sequelize.authenticate().then(() => {
        console.log('Connection to database has been established successfully');
    }).catch((err) => {
        console.log('Unable to connect to the database', err);
    });
    
    return sequelize;
};

module.exports = {
    connectToPostgres,
}
