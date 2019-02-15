const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const NPCSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  imgFile: {
    type: String,
  },
  race: {
    type: String,
  },
  sex: {
    type: String,
  },
  job: {
    type: String,
  },
  specialSign: {
    type: String,
  },
  appearance: {
    type: String,
  },
  abilityHigh: {
    type: String,
  },
  abilityLow: {
    type: String,
  },
  profficiency: {
    type: String,
  },
  languages: {
    type: String,
  },
  talent: {
    type: String,
  },
  manners: {
    type: String,
  },
  conversation: {
    type: String,
  },
  ideal: {
    type: String,
  },
  bond: {
    type: String,
  },
  flaw: {
    type: String,
  },
  kin: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = NPC = mongoose.model("characters", NPCSchema);