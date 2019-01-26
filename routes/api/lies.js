const express = require("express");
const cors = require('cors');
const router = express.Router();

// Input Validation
const validateRecapInput = require("../../validation/recap");

// Recap model
const Recap = require("../../models/Recap");

// CORS
const corsOptions = {
  origin: 'http://lies.gostekk.pl',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// @route   GET api/lies/test
// @desc    Test lies route
router.get("/test", (req, res) => res.json({ msg: "Lies works" }));


// @route   GET api/lies
// @desc    Get all recap records from database
router.get('/', cors(corsOptions), (req, res) => {
  Recap.find()
    .sort({ sessionDate: -1 })
    .then(recap => {
      if(!recap) {
        return res.status(404).json({ errors: "No recap in database added yet"});
      }

      return res.status(200).json(recap);
    });
});

// @route   GET api/lies/:id
// @desc    Get recap record from database
router.get('/:id', cors(corsOptions), (req, res) => {
  Recap.findOne({ _id: req.params.id})
    .then(recap => {
      if(!recap) {
        return res.status(404).json({ errors: "No recap with that id"});
      }

      return res.status(200).json(recap);
    });
});

// @route   POST api/lies
// @desc    Add new recap to database
router.options("/", cors(corsOptions))
router.post("/", cors(corsOptions), (req, res) => {
  const { errors, isValid } = validateRecapInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newRecap = new Recap({
    title: req.body.title,
    description: req.body.description,
    sessionDate: req.body.sessionDate
  });

  newRecap.save().then(recap => res.json(recap));
});

// @route   POST api/lies/edit/:id
// @desc    Edit existing recap
router.options("/edit/:id", cors(corsOptions))
router.post('/edit/:id', cors(corsOptions), (req, res) => {
  const { errors, isValid } = validateRecapInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Recap.findOne({ _id: req.params.id })
    .then(recap => {
        if(recap) {
        Recap.findOneAndUpdate(
          { _id: req.params.id },
          { 
            title: req.body.title,
            description: req.body.description,
            sessionDate: req.body.sessionDate
          },
          { new: false }
          )
          .then((recap1 => res.status(200).json(recap1)))
          .catch(err => res.status(400).json(err));
      } else {
        res.status(404).json({ error: 'Brak podsumowania o podanym id'});
      }
    }).catch(err => res.status(400).json(err));
});

// @route   POST api/lies/delete
// @desc    Delete recap from database
router.options("/delete", cors(corsOptions))
router.post("/delete", cors(corsOptions), (req, res) => {
  const recapId = req.body._id;

  console.log(recapId);
  Recap.deleteOne({ _id: recapId })
    .then(() => res.status(200).json({ msg: 'success' }))
    .catch(err => res.status(400).json({ msg: err }));
});

module.exports = router;