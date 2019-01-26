const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// amount - Ilość dolanych płynów (L)
// milegae - Aktualny przebied
// date - Data dolania
// liquidType - Typ płynów
const LiquidSchema = new Schema({
  amount: {
    type: String,
    required: true
  },
  mileage: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  liquidType: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = Liquid = mongoose.model("liquid", LiquidSchema);