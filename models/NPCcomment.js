const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const NPCcommentSchema = new Schema({
  comment: {
    type: String,
    required: true
  },
  npcId: {
    type: Schema.Types.ObjectId,
    ref: 'characters',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = NPCcomment = mongoose.model("npccomments", NPCcommentSchema);