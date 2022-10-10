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

historySchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  obj.attempts.forEach((attempt) => {
    delete attempt._id;
  });
  return obj;
}

module.exports = mongoose.model("History", historySchema);
