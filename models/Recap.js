const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RecapSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  sessionDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = Recap = mongoose.model("recap", RecapSchema);