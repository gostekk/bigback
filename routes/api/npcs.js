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
router.options("/auth", cors(corsOptions))
router.post("/auth", cors(corsOptions), async (req, res, next) => {
  try {
    const password = req.body.password || '';
    const check = bcrypt.compareSync(password, passwd);
    if (check) {
      res.status(200).send(true);
    } else {
      res.status(401).json({ error: 'Nieprawidłowe hasło!'})
    }
  } catch (e) {
    next(e);
  }
});

// @route   GET api/npcs
// @desc    Get all characters from database
router.get('/', cors(corsOptions), async (req, res, next) => {
  try {
    const characters = await NPC.find().sort({ sessionDate: -1 })
    res.json(characters);
  } catch(e) {
    next(e)
  }
});

// @route   GET api/npcs/:id
// @desc    Get character from database
router.get('/:id', cors(corsOptions), async (req, res, next) => {
  try {
    console.log(req.params.id);
    const character = await NPC.findOne({ _id: req.params.id })
    res.json(character);
  } catch(e) {
    next(e)
  }
});


// @route   POST api/npcs
// @desc    Add new character to database
router.options("/", cors(corsOptions))
router.post("/", cors(corsOptions), (req, res) => {
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
    console.log(req.file)

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
  
    const characters = newNPC.save();
    res.json(characters);
  });
});

// @route   POST api/npcs/edit/:id
// @desc    Edit existing character
router.options("/edit/:id", cors(corsOptions))
router.post('/edit/:id', cors(corsOptions), (req, res) => {
  upload(req, res, async function (err) {
    console.log('req', req.params.id);
    if (err instanceof multer.MulterError) {
      console.log(err);
    } else if (err) {
      console.log(err);
    }

    const { errors, isValid } = validateNPCInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    try {
      const character = await NPC.findOneAndUpdate(
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
          imgFile: req.file ? req.file.filename : undefined,
        },
        { new: false }
        );
      console.log(character);
      res.status(200).json(character);
    } catch (e) {
      console.log(e);
      res.status(404).json({ error: 'Nie znaleziono postaci o podanym numerze id' });
    }
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
