const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo = null;

/**
 * Connect to the in-memory database.
 */
module.exports.connectDatabase = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  mongoose.connect(uri, mongooseOpts);
}

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
  if (mongo) {
    await mongoose.connection.close();
    await mongo.stop();
  }
}

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
  if (mongo && mongoose.connection.db) {
    mongoose.connection.db.dropDatabase();
  }
}