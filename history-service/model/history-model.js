const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  attempts: [{
    qid: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attemptDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
  }],
});

module.exports = mongoose.model("History", historySchema);
