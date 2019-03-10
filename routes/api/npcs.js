const express = require("express");
const cors = require('cors');
const multer = require('multer');

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
const NPCcomment = require("../../models/NPCcomment");

// Passport
const passport = require('passport');
require('../../config/passport')(passport);

// CORS
const corsOptions = {
  origin: 'http://127.0.0.1:3031',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// @route   GET api/npcs/test
// @desc    Test npcs route
router.get("/test", (req, res) => res.json({ msg: "NPCS works" }));

// @route   GET api/npcs
// @desc    Get all characters from database
router.options('/', cors(corsOptions))
router.get('/', cors(corsOptions), passport.authenticate('jwt', { session: false}), async (req, res, next) => {
  try {
    if (req.user.permissions.npcs.admin) {
      const characters = await NPC.find().sort({ sessionDate: -1 })
      res.status(200).json(characters);
    } else if (req.user.permissions.npcs.login) {
      const characters = await NPC.find({ owner: req.user._id }).sort({ sessionDate: -1 })
      res.status(200).json(characters);
    } else {
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
    }
  } catch(e) {
    next(e)
  }
});

// @route   GET api/npcs/:id
// @desc    Get character from database
router.options('/:id', cors(corsOptions))
router.get('/:id', cors(corsOptions), passport.authenticate('jwt', { session: false}), async (req, res, next) => {
  try {
    if (req.user.permissions.npcs.login) {
      const character = await NPC.findOne({ _id: req.params.id })
      res.status(200).json(character);
    } else {
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
    }
  } catch(e) {
    next(e)
  }
});

// @route   POST api/npcs
// @desc    Add new character to database
router.options('/', cors(corsOptions))
router.post('/', cors(corsOptions), passport.authenticate('jwt', { session: false}), (req, res) => {
  if (req.user.permissions.npcs.login) {
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
        owner: req.user._id,
      });
    
      const characters = newNPC.save();
      res.json(characters);
    });
  } else {
    res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
  }
});

// @route   POST api/npcs/edit/:id
// @desc    Edit existing character
router.options('/edit/:id', cors(corsOptions))
router.post('/edit/:id', cors(corsOptions), passport.authenticate('jwt', { session: false}), (req, res) => {
  if (req.user.permissions.npcs.login) {
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
        const result = await NPC.findOne({ _id: req.params.id });
        if(result.owner.equals(req.user._id) || req.user.permissions.npcs.admin) {
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
          res.status(200).json(character);
        } else {
          res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
        }
      } catch (e) {
        console.log(e);
        res.status(404).json({ error: 'Nie znaleziono postaci o podanym numerze id' });
      }
    });
  } else {
    res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
  }
});

// @route   POST api/npcs/delete
// @desc    Delete character from database
router.options('/delete', cors(corsOptions))
router.post('/delete', cors(corsOptions), passport.authenticate('jwt', { session: false}), async (req, res, next) => {
  try {
    if (req.user.permissions.npcs.login) {
      const result = await NPC.findOne({ _id: req.body._id });
      if(result.owner.equals(req.user._id) || req.user.permissions.npcs.admin) {
        result.remove();
        res.status(200).json({ result })
      } else {
        res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
      }
    } else {
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
    }
  } catch (e) {
    next(e);
  }
});

// @route   POST api/npcs/owner
// @desc    Change owner of the character
router.options('/owner', cors(corsOptions))
router.post('/owner', cors(corsOptions), passport.authenticate('jwt', { session: false}), async (req, res, next) => {
  if (req.user.permissions.npcs.admin) {
    try {
      const character = await NPC.findOneAndUpdate(
        { _id: req.body.npcId },
        {
          owner: req.user._id,
        },
        { new: false }
      );
      character.owner = req.user._id;
      res.status(200).json(character);
    } catch (e) {
      res.status(404).json({ error: 'Nie znaleziono postaci o podanym numerze id' });
      next(e);
    }
  } else {
    res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
  }
});

// @route   GET api/npcs/comment
// @desc    Get comment from database
router.options('/comment/:id', cors(corsOptions))
router.get('/comment/:id', cors(corsOptions), passport.authenticate('jwt', { session: false}), async (req, res, next) => {
  try {
    if (req.user.permissions.npcs.login) {
      const comment = await NPCcomment.findOne({ npcId: req.params.id, userId: req.user._id }).sort({ createdAt: -1 })
      res.status(200).json(comment);
    } else {
      res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
    }
  } catch(e) {
    next(e)
  }
});

// @route   POST api/npcs/comment
// @desc    Delete character from database
router.options('/comment', cors(corsOptions))
router.post('/comment', cors(corsOptions), passport.authenticate('jwt', { session: false}), async (req, res, next) => {
  if (req.user.permissions.npcs.login) {
    const newNPCcomment = new NPCcomment({
      comment: req.body.comment,
      userId: req.body.userId,
      npcId: req.body.npcId,
    });
  
    const comment = newNPCcomment.save();
    res.status(200).json(comment);
    } else {
    res.status(401).json({ errors: { error: 'Brak uprawnień!' }});
  }
});

module.exports = router;
