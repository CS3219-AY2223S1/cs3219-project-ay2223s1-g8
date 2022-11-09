const mongoose = require("mongoose");
const config = require("../config")[process.env.NODE_ENV || "dev"];

const connectDB = () => {
  try {
    mongoose.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = connectDB; 
