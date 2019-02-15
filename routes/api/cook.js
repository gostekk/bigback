const express = require("express");
const cors = require('cors');
const router = express.Router();

// Input Validation
const validateRecipeInput = require("../../validation/recipe");

// Recipe model
const Recipe = require("../../models/Recipe");

// CORS
const corsOptions = {
  origin: 'http://cook.gostekk.pl',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// @route   GET api/cook/test
// @desc    Test cook route
router.get("/test", (req, res) => res.json({ msg: "Cook works" }));


// @route   GET api/cook
// @desc    Get all recipes records from database
router.get('/', cors(corsOptions), (req, res) => {
  Recipe.find()
    .sort({ sessionDate: -1 })
    .then(recipe => {
      if(!recipe) {
        return res.status(404).json({ errors: "No recipe in database added yet"});
      }

      return res.status(200).json(recipe);
    });
});

// @route   GET api/cook/:id
// @desc    Get recipe record from database
router.get('/:id', cors(corsOptions), (req, res) => {
  Recipe.findOne({ _id: req.params.id})
    .then(recipe => {
      if(!recipe) {
        return res.status(404).json({ errors: "No recipe with that id"});
      }

      return res.status(200).json(recipe);
    });
});

// @route   POST api/cook
// @desc    Add new recipe to database
router.options("/", cors(corsOptions))
router.post("/", cors(corsOptions), (req, res) => {
  const { errors, isValid } = validateRecipeInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newRecipe = new Recipe({
    title: req.body.title,
    description: req.body.description,
    sessionDate: req.body.sessionDate
  });

  newRecipe.save().then(recipe => res.json(recipe));
});

// @route   POST api/cook/edit/:id
// @desc    Edit existing recipe
router.options("/edit/:id", cors(corsOptions))
router.post('/edit/:id', cors(corsOptions), (req, res) => {
  const { errors, isValid } = validateRecipeInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Recipe.findOne({ _id: req.params.id })
    .then(recipe => {
        if(recipe) {
        Recipe.findOneAndUpdate(
          { _id: req.params.id },
          { 
            title: req.body.title,
            description: req.body.description,
            sessionDate: req.body.sessionDate
          },
          { new: false }
          )
          .then((recipe1 => res.status(200).json(recipe1)))
          .catch(err => res.status(400).json(err));
      } else {
        res.status(404).json({ error: 'Brak podsumowania o podanym id'});
      }
    }).catch(err => res.status(400).json(err));
});

// @route   POST api/cook/delete
// @desc    Delete recipe from database
router.options("/delete", cors(corsOptions))
router.post("/delete", cors(corsOptions), (req, res) => {
  const recipeId = req.body._id;

  console.log(recipeId);
  Recipe.deleteOne({ _id: recipeId })
    .then(() => res.status(200).json({ msg: 'success' }))
    .catch(err => res.status(400).json({ msg: err }));
});

module.exports = router;