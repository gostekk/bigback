const express = require('express');
const cors = require('cors');
const router = express.Router();

// Models
const User = require("../../models/User");

// Passport
const passport = require('passport');
require('../../config/passport')(passport);

// CORS
const whitelist = ['http://localhost:3000', 'http://127.0.0.1:3031', 'http://npcs.gostekk.pl', 'http://lies.gostekk.pl']
// const whitelist = ['http://npcs.gostekk.pl', 'http://lies.gostekk.pl']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200,
}

// @route GET api/users/
// @desc Get users
router.options("/", cors(corsOptions))
router.get("/", cors(corsOptions), passport.authenticate('jwt', { session: false}), async (req, res, next) => {
  try {
    if (req.user.permissions.webStart.users) {
      const users = await User.find({}).select({ _id: 1, username: 1, active: 1 });
      res.status(200).json(users);
    } else {
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
    }
  } catch (e) {
    next(e);
  }
});

// @route GET api/users/:id
// @desc Get user by his id
router.options("/:id", cors(corsOptions))
router.get("/:id", cors(corsOptions), passport.authenticate('jwt', { session: false}), async (req, res, next) => {
  try {
    if (req.user.permissions.webStart.permissions) {
      const user = await User.findOne({ _id: req.params.id }).select({ _id: 1, username: 1, active: 1, permissions: 1 });
      res.status(200).json(user);
    } else {
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
    }
  } catch (e) {
    next(e);
  }
});

// @route POST api/auth/login
// @desc Login user and return JWT token
router.options("/active", cors(corsOptions))
router.post("/active", cors(corsOptions), passport.authenticate('jwt', { session: false}), async (req, res, next) => {
  // Find user by username
  try {
    if (req.user.permissions.webStart.users) {
      const user = await User.findOneAndUpdate(
        { _id: req.body._id },
        { 
          active: req.body.active
        },
        { new: false }
        );
      res.status(200).json(user);
    } else {
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
    }
  } catch (e) {
    res.status(404).json({ error: 'Brak użytkownika o podanej nazwie' });
    next(e);
  }
});

// @route POST api/auth/login
// @desc Login user and return JWT token
router.options("/perm", cors(corsOptions))
router.post("/perm", cors(corsOptions), passport.authenticate('jwt', { session: false}), async (req, res, next) => {
  // Find user by username
  try {
    if (req.user.permissions.webStart.permissions) {
      const user = await User.findOne({ _id: req.body._id })
      user.permissions[req.body.app][req.body.role] = req.body.check;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
    }
  } catch (e) {
    res.status(404).json({ error: 'Brak użytkownika o podanej nazwie' });
    next(e);
  }
});

module.exports = router;
