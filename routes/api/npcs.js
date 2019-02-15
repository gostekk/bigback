const express = require("express");
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const passwd = '$2a$10$lIzPVqTbNMflAYHb1mNtpeasYA9fPQy.IA7BVKwAyASuy4fv7Rlyi';

const storage = multer.diskStorage({
  destination: '../public/npcs/',
  filename(req, file, cb) {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, `${Date.now()}-${file.originalname}`);
    } else if(file.mimetype !== 'image/jpg' || file.mimetype !== 'image/jpeg' || file.mimetype !== 'image/png' ){
      return false;
  }
  },
});

const upload = multer({ storage }).single('file');

const router = express.Router();

// Input Validation
const validateNPCInput = require("../../validation/npcs");

// NPC model
const NPC = require("../../models/NPC");

// CORS
const corsOptions = {
  origin: 'http://127.0.0.1:3031',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// @route   GET api/npcs/test
// @desc    Test npcs route
router.get("/test", (req, res) => res.json({ msg: "NPCS works" }));

// @route   POST api/npcs
// @desc    Add new character to database
router.options("/passwd", cors(corsOptions))
router.post("/passwd", cors(corsOptions), async (req, res) => {
  const check = bcrypt.compare(req.body.password, passwd);
  if (check) {
    res.status(200);
  } else {
    res.status(401).json({ error: 'Nieprawidłowe hasło!'})
  }
});

// @route   GET api/npcs
// @desc    Get all characters from database
router.get('/', cors(corsOptions), (req, res) => {
  NPC.find()
    .sort({ sessionDate: -1 })
    .then(characters => {
      if(!characters) {
        return res.status(404).json({ errors: "No characters in database added yet"});
      }

      return res.status(200).json(characters);
    });
});

// @route   GET api/npcs/:id
// @desc    Get character from database
router.get('/:id', cors(corsOptions), (req, res) => {
  NPC.findOne({ _id: req.params.id})
    .then(character => {
      if(!character) {
        return res.status(404).json({ errors: "No character with that id"});
      }

      return res.status(200).json(character);
    });
});


// @route   POST api/npcs
// @desc    Add new character to database
router.options("/", cors(corsOptions))
router.post("/", cors(corsOptions), (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
    } else if (err) {
      console.log(err);
    }
    const { errors, isValid } = validateNPCInput(req.body);
    
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newNPC = new NPC({
      name: req.body.name,
      race: req.body.race,
      sex: req.body.sex,
      job: req.body.job,
      specialSign: req.body.specialSign,
      appearance: req.body.appearance,
      abilityHigh: req.body.abilityHigh,
      abilityLow: req.body.abilityLow,
      profficiency: req.body.profficiency,
      languages: req.body.languages,
      talent: req.body.talent,
      manners: req.body.manners,
      conversation: req.body.conversation,
      ideal: req.body.ideal,
      bond: req.body.bond,
      flaw: req.body.flaw,
      kin: req.body.kin,
      imgFile: req.file ? req.file.filename : undefined,
    });
  
    const characters = await newNPC.save();
    res.json(characters);
  });
});

// @route   POST api/npcs/edit/:id
// @desc    Edit existing character
router.options("/edit/:id", cors(corsOptions))
router.post('/edit/:id', cors(corsOptions), (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
    } else if (err) {
      console.log(err);
    }
    const { errors, isValid } = validateNPCInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    NPC.findOne({ _id: req.params.id })
      .then(characters => {
          if(characters) {
          NPC.findOneAndUpdate(
            { _id: req.params.id },
            { 
              name: req.body.name,
              race: req.body.race,
              sex: req.body.sex,
              job: req.body.job,
              specialSign: req.body.specialSign,
              appearance: req.body.appearance,
              abilityHigh: req.body.abilityHigh,
              abilityLow: req.body.abilityLow,
              profficiency: req.body.profficiency,
              languages: req.body.languages,
              talent: req.body.talent,
              manners: req.body.manners,
              conversation: req.body.conversation,
              ideal: req.body.ideal,
              bond: req.body.bond,
              flaw: req.body.flaw,
              kin: req.body.kin,
              imgFile: req.file.filename ? req.file.filename : undefined,
            },
            { new: false }
            )
            .then((character1 => res.status(200).json(character1)))
            .catch(err => res.status(400).json(err));
        } else {
          res.status(404).json({ error: 'Brak postaci o podanym id'});
        }
      })
      .catch(err => res.status(400).json(err));
  });
});

// @route   POST api/npcs/delete
// @desc    Delete character from database
router.options("/delete", cors(corsOptions))
router.post("/delete", cors(corsOptions), (req, res) => {
  const characterId = req.body._id;
  // res.status(401).json({ msg: 'Brak odpowiednich uprawnień '})
  NPC.deleteOne({ _id: characterId })
    .then(() => res.status(200).json({ msg: 'success' }))
    .catch(err => res.status(400).json({ msg: err }));
});

module.exports = router;
