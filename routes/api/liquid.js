const express = require("express");
const router = express.Router();

// Input Validation
const validateLiquidInput = require("../../validation/liquid");

// Liquid model
const Liquid = require("../../models/Liquid");

// @route   GET api/liquid/test
// @desc    Test liquid route
router.get("/test", (req, res) => res.json({ msg: "Liquid api works" }));

// @route   GET api/liquid
// @desc    Get all records from database
router.get('/', (req, res) => {
  Liquid.find()
    .then(entries => {
      if(!entries) {
        return res.status(404).json({ errors: "No entries added yet"});
      }

      return res.status(200).json(entries);
    });
});

// @route   POST api/liquid
// @desc    Add new entry to database
router.post("/", (req, res) => {
  const { errors, isValid } = validateLiquidInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newLiquid = new Liquid({
    amount: req.body.amount,
    mileage: req.body.mileage,
    date: req.body.date,
    liquidType: req.body.liquidType
  });

  newLiquid.save().then(liquid => res.json(liquid));
});

// @route   POST api/liquid/delete
// @desc    Delete entries from database
router.post("/delete", (req, res) => {
  const entries = req.body;

  Liquid.deleteMany({ _id: { $in: entries }})
    .then(() => res.status(200).json({ msg: 'success' }))
    .catch(err => res.status(400).json({ msg: err }));
});

module.exports = router;