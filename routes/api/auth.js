const express = require('express');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../../config');

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Models
const User = require("../../models/User");
// Passport
const passport = require('passport');
require('../../config/passport')(passport);

// CORS
const whitelist = ['http://localhost:3000', 'http://127.0.0.1:3031', 'http://npcs.gostekk.pl', 'http://lies.gostekk.pl']
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

// @route POST api/auth/register
// @desc Register user
router.options("/register", cors(corsOptions))
router.post("/register", cors(corsOptions), (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      return res.status(400).json({ errors: { username: "User already exists" }});
    }

    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    });

    // Hash password before saving in database
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
  })
});

// @route POST api/auth/login
// @desc Login user and return JWT token
router.options("/login", cors(corsOptions))
router.post("/login", cors(corsOptions), (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json({errors});
  }

  const username = req.body.username;
  const password = req.body.password;

  // Find user by username
  User.findOne({ username }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ errors: { error: "Brak użytkownika o podanej nazwie" }});
    }
    // Check if user is active
    if (!user.active) {
      return res.status(401).json({ errors: { error: "Użytkownik nieaktywny" }});
    }
    // Permissions
    switch(req.headers.origin) {
      case 'http://localhost:3000':
        break;
      case 'http://127.0.0.1:3031':
        break;
      case 'http://start.gostekk.pl':
        if(!user.permissions.npcs.login)
        res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
        break;
      case 'http://npcs.gostekk.pl':
        if(!user.permissions.npcs.login)
        res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
        break;
      case 'http://lies.gostekk.pl':
        if(!user.permissions.lies.login)
        res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
        break;
      case 'http://villages.gostekk.pl':
        if(!user.permissions.villages.login)
        res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
        break;
      case 'http://quests.gostekk.pl':
        if(!user.permissions.quests.login)
        res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
        break;
      case 'http://carli.gostekk.pl':
        if(!user.permissions.carLi.login)
        res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
        break;
      case 'http://cookbook.gostekk.pl':
        if(!user.permissions.cookBook.login)
        res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
        break;
      default:
        res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
        break;
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          usernamename: user.username,
          permissions: user.permissions,
        };
        // Sign token
        jwt.sign(
          payload,
          config.secret,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ errors: { error: "Hasło nieprawidłowe" }});
      }
    });
  });
});

// @route POST api/auth/check
// @desc check JWT token
router.options("/check", cors(corsOptions))
router.post("/check", cors(corsOptions), passport.authenticate('jwt', { session: false}), (req, res) => {
  
  // Check if user is active
  if (!req.user.active) {
    return res.status(401).json({ errors: { error: "Użytkownik nieaktywny" }});
  }
  // Permissions
  switch(req.headers.origin) {
    case 'http://localhost:3000':
      break;
    case 'http://127.0.0.1:3031':
      break;
    case 'http://start.gostekk.pl':
      if(!req.user.permissions.npcs.login)
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
      break;
    case 'http://npcs.gostekk.pl':
      if(!req.user.permissions.npcs.login)
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
      break;
    case 'http://lies.gostekk.pl':
      if(!req.user.permissions.lies.login)
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
      break;
    case 'http://villages.gostekk.pl':
      if(!req.user.permissions.villages.login)
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
      break;
    case 'http://quests.gostekk.pl':
      if(!req.user.permissions.quests.login)
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
      break;
    case 'http://carli.gostekk.pl':
      if(!req.user.permissions.carLi.login)
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
      break;
    case 'http://cookbook.gostekk.pl':
      if(!req.user.permissions.cookBook.login)
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
      break;
    default:
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
      break;
  }
  res.status(200).json({ success: true });

});

module.exports = router;
