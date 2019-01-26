const express = require("express");
const cors = require('cors');
const shortid = require('shortid');
const router = express.Router();

// Input Validation
const validateRecapInput = require("../../validation/recap");

// CORS
const corsOptions = {
  origin: 'http://show1.gostekk.pl',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const recaps = [
  {
    _id: '1',
    title: 'Arrival at Kraghammer',
    sessionDate: '2015-03-12',
    description: `The party had completed a large venture in saving the nearby city of Emon, one of the capitals of this human civilization of Tal'Dorei. They managed to halt a demonic insurrection within the throne and as such were greeted to a heroes' celebration and had a keep built in their honor.
    "Over the six month period of the keep being constructed, they went on their own ways and then returned to see its final creation. However, they did not have a chance to really enjoy it immediately, as one of their good friends and allies, Arcanist Allura Vysoren of the Tal'Dorei Council, came to them requesting their aid, saying that a long-time friend of hers, Lady Kima of Vord—who is a very well-known and very well-respected halfing paladin of Bahamut, the platinum dragon—had been gone on a pilgrimage for a while, essentially a vision quest as part of her own development as a paladin.
    "As part of this, she let the information go to Allura that a dark vision had come to her, saying that some sort of evil root is beginning to breed beneath Kraghammer and the mountains within. Kraghammer of which is the nearby dwarven civilization that [the party] had previously not been allowed entry to, because the dwarves weren't fans of anyone without any political means of entering. However, [Allura] managed to acquire the necessary documentation, offered [the party] a very substantial reward should [they] find the whereabouts of Lady Kima of Vord, and hopefully bring her back safely.
    "[The party] left. On the pathway to the dwarven citadel of Kraghammer, [they] were ambushed by a group of roaming barbarian goliaths, of which partway through the battle Grog managed to recognize one of them as a previous ally—and no-longer-ally at this time. The barbarian, for his first and only time so far, managed to avert battle through a social encounter and rolled pretty damn well on a persuasion check. [...] [He] managed to not turn it into complete bloodshed and [the party] continued on [their] way to Kraghammer, presented [their] paperwork, were given entry into the city, and that is where we begin this adventure.`
  },
  {
    _id: '2',
    title: 'Into the Greyspine Mines',
    sessionDate: '2015-03-19',
    description: `After the battle, Nostoc Greyspine invites them to continue their conversation.  He admits that these "intrusions" have been bad for business and begrudgingly accepts their help and offers a reward if they stop the source.  They seal the deal with a drink of the Thistle Branch Dark Blood Wine, and Vax'ildan again tries to steal some of it.  This time he manages it with the help of Scanlan playing some gnomish music that Nostoc does not like.
    The party leaves his office and looks for Foreman Herris to learn about what creatures they might encounter in the mines.  Scanlan sings a song of rest:  "Scanlan make you feel good.  Scanlan make you feel real goo-o-ood."
    Finding Foreman Herris, they learn of the nightmarish creatures he has seen—goblins stitched together, unstable mutated slimes and oozes, a swollen duergar with multiple mouths and sets of eyes, and creatures from the surface that don't normally wander down on their own.  Tiberius suggests this is the work of necromancy, but Herris believes that the creatures are still alive.
    Herris gives them a map of the mines before they leave.`,
  },
  {
    _id: '3',
    title: 'Back to House Thunderbrand',
    sessionDate: '2015-03-20',
    description: `Vox Machina heads back to House Thunderbrand to stock up.  This time Vax attempts to walk toward the door and gets blasted by blue energy.  Tiberius casts Dispel Magic but the spell has no effect.  Vex'ahlia wants to fly the magic carpet over to the door, but Scanlan casts Unseen Servant and commands it to knock on the door.  The door is answered by Lord Thunderbrand.  Tiberius tries to introduce the group but Lord Thunderbrand casts Silence on him, upset by his intrusion a few nights ago.  Tiberius tries to mime his way through a conversation while the rest of the group make excuses for his weirdness.  When Tiberius can be heard again he makes an impassioned speech about his respect for the arcane to persuade Lord Thunderbrand, but the dwarf turns away because Tiberius is not a dwarf himself.
    While Lord Thunderbrand's back is turned, Tiberius casts Alter Self on Keyleth, who had previously been a squirrel hiding in Vex's pocket, and turns her into a dwarf.  Lord Thunderbrand sees through the spell.  Before he can turn away again, Vax tries to make peace but fails.  Not even Vex's wink got them in the door.  Scanlan makes one last effort by offering him anything interesting they find in the mine and he replies, "When you bring them, then we'll talk!"`,
  },
  {
    _id: '4',
    title: 'The Value of Valor',
    sessionDate: '2015-03-21',
    description: `The party head to the Value of Valor, an elven establishment, for potions and enchanted arrows.  When paying, Vex does the math and intentionally gives a lower price but Grog corrects her.
    They head back to the Iron Hearth Tavern to rest.  The next morning they head into the mine.  They use Foreman Herris's map to get to the elevator and continue down.  Vex finds some tracks of dwarves dragging dwarves deeper into the mine but two sets of drag marks do not have accompanying tracks of their draggers.  They follow the tracks down the winding and descending tunnel for four hours until it finally widens into a cavern, through which runs a river that leads to a waterfall.`,
  },
  {
    _id: '5',
    title: 'Umber Hulks',
    sessionDate: '2015-03-22',
    description: `Ass at Percyts singing and briefly distracts it, but it still gets in one hit. Vex begins to nock an arrow, but a wave of confusion takes over her brain and she spaces out, unmoving. Scanlan goes to help Vex and sings, "Magic, magic go away, come again another day!", but it has no effect. Percy pulls his gun, fires, and hits. He takes a second shot but his gun jams. Keyleth, as a cave bear, claws at an umber hulk and carves out a chunk of its hide. The umber hulk retaliates and hits Keyleth with its claws and mandibles. The second umber hulk attacks Grog again, its mandibles crushing down on his body and piercing into his chest. Vax jumps onto one umber hulk's back, gaining purchase on one of its chitinous plates, and stabs its head before it shrugs him off. Grog rages, popping all the capillaries in his eyeballs. Grog feels the influence of the umber hulk's Confusing Gaze, and he swings with his axe and misses Tiberius's head by inches.`,
  },
  {
    _id: '6',
    title: 'Duergar ',
    sessionDate: '2015-03-23',
    description: `rog, still in a rage, runs to the light in the distance, followed by Vax and Keyleth.  They find an abandoned campfire.  Three crossbow bolts come flying out of nowhere—two hitting Grog.  They notice three duergar, with a strange, unfamiliar beast accompanying them:  a large brain with a set of claws
    Vax and Vex stealth.  Tiberius jumps off his pillar and saunters over to the commotion.  Scanlan casts Stinking Cloud, and the duergar start hacking and coughing.  Grog is drawn to the smell.  The brain-creature, called an intellect devourer, is unaffected by the cloud and intrudes on the mind of Grog, who immediately falls unconscious.  Tiberius fires Glacial Blast at the intellect devourer, freezing its entire body before shattering it into pieces.  Vex attacks a duergar with two arrows and kills it.
    Scared now, one duergar says to the other in Undercommon (which only Vex understands), "Quick, back to the master."  Scanlan casts Dispel Magic on a catatonic Grog, but it does not affect him.  Vex calls out, "Let one of them live so I can question them!"  Percy aims for the female duergar and incapacitates her.  Keyleth slams another bolt of lightning into the second duergar, part of its face now charred, and it reels from the cacophonous blast.  Vax runs into the cloud to try to capture the incapacitated duergar, but he is overcome by the smell.
    Tiberius casts Fire Bolt at the second duergar but misses.  Vex shoots at the same duergar, and it falls off the edge of the cliff onto the cavern floor below.  Vex yells, "Surrender!" in Undercommon to the last duergar, who is intimidated into putting down her weapons and surrendering. Keyleth runs over to try and heal Grog, but to no effect.`,
  },
]

// @route   GET show/lies/test
// @desc    Test lies route
router.get("/test", (req, res) => res.json({ msg: "Lies works" }));

// @route   GET show/lies
// @desc    Get all recap records from database
router.get('/', cors(corsOptions), (req, res) => {
  return res.status(200).json(recaps);
});

// @route   POST show/lies
// @desc    Add new recap to database
router.options("/", cors(corsOptions))
router.post("/", cors(corsOptions), (req, res) => {
  const { errors, isValid } = validateRecapInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newRecap = new Recap({
    _id: shortid.generate(),
    title: req.body.title,
    description: req.body.description,
    sessionDate: req.body.sessionDate
  });

  return res.json(newRecap);
});

// @route   POST show/lies/edit/:id
// @desc    Edit existing recap
router.options("/edit/:id", cors(corsOptions))
router.post('/edit/:id', cors(corsOptions), (req, res) => {
  const { errors, isValid } = validateRecapInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  res.status(200).json(req.params.id);
});

module.exports = router;