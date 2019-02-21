const express = require("express");
const cors = require('cors');
const shortid = require('shortid');
const router = express.Router();

// Input Validation
const validateNPCInput = require("../../validation/npcs");

// CORS
const corsOptions = {
  origin: 'http://127.0.0.1:3031',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const characters = [{
  '_id': '5c603a58ab43d135508e2c5c',
  'name': 'Lirin Shonnu',
  'race': 'Pół-elf',
  'sex': 'Kobieta',
  'appearance': 'Niezwykły kolor oczu. Lewe zielone, prawe niebieskie.',
  'abilities': {
    'high': 'Charyzma',
    'low': 'Budowa'
  },
  'talent': 'Unbelievably lucky',
  'manners': 'Często spogląda w dal',
  'conversation': 'Przyjazne nastawienie dla wszystkich. Cicha gdy w pobliżu przebywa Fitz.',
  'ideal': 'Życie',
  'bond': 'Captivated by a romantic interest',
  'flaw': 'Forbidden love',
  'createdAt': '2019-02-10T14:51:04.556Z',
  '__v': 0,
  'abilityHigh': 'Charyzma',
  'abilityLow': 'Budowa',
  'job': '',
  'kin': 'Glem Shonnu, Isotta Shonnu, Fitz Shonnu',
  'profficiency': '',
  'specialSign': 'Różny kolor oczu (lewe zielone, prawe niebieskie)',
  'languages': 'Common, Elvish'
}, {
  '_id': '5c6056f2d262273bc841c8ab',
  'name': 'Glem Shonnu',
  'race': 'Człowiek',
  'sex': 'Mężczyzna',
  'job': 'Sołtys',
  'specialSign': 'Długa czarna broda',
  'appearance': 'Starsza osoba około ~68 roku życia, Ciemne długie włosy oraz okazała ciemna broda.',
  'abilityHigh': 'Charyzma',
  'abilityLow': 'Zręczność',
  'profficiency': 'Carpenter tools',
  'talent': 'Urodzony stolarz',
  'manners': 'Niecierpliwy często stuka palcami o wszystko co możliwe',
  'conversation': 'ciekawi go tylko jeden wybrany temat i chce krótkie szybkie odpowiedzi',
  'ideal': '',
  'bond': 'Ochrona rodaków',
  'flaw': 'Ma potężnego wroga w postaci wojsk goblinów/orków i innych niebezpiecznych stworzeń',
  'kin': 'Issotta Shonnu(żona), Lirin Shonnu (przybrana córka), Fitz Shonnu (przybrany syn)',
  'createdAt': '2019-02-10T16:53:06.745Z',
  '__v': 0,
  'languages': 'Common, Dwarvish'
}, {
  '_id': '5c60598cd262273bc841c8ac',
  'name': 'Isotta Shonnu',
  'race': 'Człowiek',
  'sex': 'Kobieta',
  'job': '',
  'specialSign': '',
  'appearance': '',
  'abilityHigh': 'Inteligencja',
  'abilityLow': 'Budowa',
  'profficiency': '',
  'talent': 'Ma talent do zajmowania się różnego rodzaju zwierzyną.',
  'manners': '',
  'conversation': 'Przyjazne nastawienie',
  'ideal': 'Samopoświecenie, marzenie męża ponad wszystko',
  'bond': 'Całkowicie lojalna względem Glema, jednak chroni własne sekrety',
  'flaw': 'Posiada wiedzę na tematy zakazane',
  'kin': 'Glem Shonnu (mąż), Lirin Shonnu (przybrana córka), Fitz Shonnu (przybrany syn)',
  'createdAt': '2019-02-10T17:04:12.735Z',
  '__v': 0,
  'languages': 'Common'
}, {
  '_id': '5c605d11d262273bc841c8ad',
  'name': 'Galnir Frostbeard',
  'race': 'Krasnolud',
  'sex': 'Mężczyzna',
  'job': 'Kowal',
  'specialSign': 'Łysy',
  'appearance': 'Łysy z krótką siwą brodą.',
  'abilityHigh': 'Siła',
  'abilityLow': 'Charyzma',
  'profficiency': `Smith's tools`,
  'talent': '',
  'manners': 'Często bawi się swoją brodą nawet podczas rozmowy',
  'conversation': 'Porywczy',
  'ideal': 'Tradycja, Cała moja rodzina była znakomitymi kowalami',
  'bond': 'Poświeca się realizacji osobistego celu życia jakim jest stać się godnym następcą ojca i pradziada.',
  'flaw': 'Shameful or scandalous history',
  'kin': 'Daerbera Frostbeard (żona), Jimmy Frostbeard (syn), Ean Shenov (dalsza rodzina)',
  'createdAt': '2019-02-10T17:19:13.365Z',
  '__v': 0,
  'languages': 'Common, Dwarvish'
}, {
  '_id': '5c605f27d262273bc841c8ae',
  'name': 'Daerbera Frostbeard',
  'race': 'Krasnolud',
  'sex': 'Kobieta',
  'job': 'Barmanka',
  'specialSign': 'Czerwone włosy',
  'appearance': 'Potężnie zbudowana, charakterystyczne czerwone włosy',
  'abilityHigh': 'Siła',
  'abilityLow': '',
  'profficiency': '',
  'talent': 'Dobra w podszywaniu się. Często naśladuje innych mieszkańców',
  'manners': 'Mówi strasznie głośno',
  'conversation': 'Jeżeli coś się jej nie podoba od razu to mówi. Lubi wytykać innym błędy',
  'ideal': 'Honor',
  'bond': 'Karczma wydaje się być jej idealnym miejscem jednak to na polu walki pokazuje swoją prawdziwą \'ja\' co potwierdza na każdym kroku jej mąż',
  'flaw': 'Arogancja',
  'kin': 'Galnir Frostbeard (mąż), Jimmy Frostbeard (syn), Ean Shemov (dalsza rodzina)',
  'createdAt': '2019-02-10T17:28:07.056Z',
  '__v': 0,
  'languages': 'Common, Dwarvish'
}, {
  '_id': '5c606698d180893e953154d5',
  'name': 'Negel Nusk',
  'race': 'Pół-ork',
  'sex': 'Mężczyzna',
  'job': 'Dozorca',
  'specialSign': '',
  'appearance': '',
  'abilityHigh': 'Budowa',
  'abilityLow': '',
  'profficiency': '',
  'languages': 'Common',
  'talent': '',
  'manners': '',
  'conversation': '',
  'ideal': '',
  'bond': '',
  'flaw': '',
  'kin': 'Darius Nusk (brat)',
  'createdAt': '2019-02-10T17:59:52.853Z',
  '__v': 0
}, {
  '_id': '5c606756d180893e953154d6',
  'name': 'Darius Nusk',
  'race': 'Pół-ork',
  'sex': 'Mężczyzna',
  'job': 'Leśniczy',
  'specialSign': 'Krótkie kły',
  'appearance': 'Dariusowi bliżej do człowieka niż orka. Karnacja jak u człowieka. Krótkie kły, Mocno zbudowany krótkie czarne włosy oraz szpiczaste uszy.',
  'abilityHigh': 'Budowa',
  'abilityLow': 'Inteligencja',
  'profficiency': '',
  'languages': 'Common',
  'talent': '',
  'manners': '',
  'conversation': '',
  'ideal': '',
  'bond': '',
  'flaw': '',
  'kin': 'Negel Nusk (brat)',
  'createdAt': '2019-02-10T18:03:02.229Z',
  '__v': 0
}, {
  '_id': '5c6069b4d180893e953154d7',
  'name': 'Calvert Dhukal',
  'race': 'Człowiek',
  'sex': 'Mężczyzna',
  'job': 'Myśliwy',
  'specialSign': 'Czerwone zęby',
  'appearance': 'Rude włosy, czerwone zęby to nie jedyne elementy które odstraszą niejedno dziecko. Przy sobie zawsze nosi topór oraz łuk. Przypomina wikinga.',
  'abilityHigh': 'Zręczność',
  'abilityLow': 'Inteligencja',
  'profficiency': 'Łuk',
  'languages': 'Common, Giant',
  'talent': 'Mógłby zabić z 10 metrów muche.',
  'manners': 'Zdarza mu się co jakiś czas przeklnąć bez powodu.',
  'conversation': 'Gorąca-głowa. Bardzo niecierpliwy.',
  'ideal': '',
  'bond': '',
  'flaw': '',
  'kin': 'Ilarris Zeleshi (żona)',
  'createdAt': '2019-02-10T18:13:08.204Z',
  '__v': 0
}, {
  '_id': '5c606ab4d180893e953154d8',
  'name': 'Ilarris Zeleshi',
  'race': 'Pół-elf',
  'sex': 'Kobieta',
  'job': 'Nauczycielka',
  'specialSign': 'Piękne długie ciemne włosy',
  'appearance': '',
  'abilityHigh': 'Zręczność',
  'abilityLow': '',
  'profficiency': 'Scimitar',
  'languages': 'Common, Elvish, Dwarvish, Giant, Celestial',
  'talent': 'Niesamowita pamieć',
  'manners': '',
  'conversation': '',
  'ideal': '',
  'bond': '',
  'flaw': '',
  'kin': 'Calvert Dhukal (mąż)',
  'createdAt': '2019-02-10T18:17:24.421Z',
  '__v': 0
}, {
  '_id': '5c606c01d180893e953154d9',
  'name': 'Lillith Daturai',
  'race': 'Diable',
  'sex': 'Kobieta',
  'job': 'Gospodarz w zajeździe',
  'specialSign': 'Czerwone oczy',
  'appearance': 'Ciemne długie włosy, krótkie rogi',
  'abilityHigh': 'Roztropność',
  'abilityLow': 'Siła',
  'profficiency': '',
  'languages': 'Common',
  'talent': '',
  'manners': '',
  'conversation': 'Szczera do bólu',
  'ideal': '',
  'bond': '',
  'flaw': '',
  'kin': 'Matka',
  'createdAt': '2019-02-10T18:22:57.871Z',
  '__v': 0
}, {
  '_id': '5c606c25d180893e953154da',
  'name': 'Heiben Neman',
  'race': 'Człowiek',
  'sex': 'Mężczyzna',
  'job': 'Handlarz',
  'specialSign': '',
  'appearance': '',
  'abilityHigh': '',
  'abilityLow': '',
  'profficiency': '',
  'languages': 'Common',
  'talent': '',
  'manners': '',
  'conversation': '',
  'ideal': '',
  'bond': '',
  'flaw': '',
  'kin': '',
  'createdAt': '2019-02-10T18:23:33.851Z',
  '__v': 0
}, {
  '_id': '5c606cf6d180893e953154db',
  'name': 'Tivoth Bohlo',
  'race': 'Człowiek',
  'sex': 'Mężczyzna',
  'job': 'Rybak',
  'specialSign': 'Opaska na oko',
  'appearance': 'Rude owłosienie, opaska na oko, bandama na głowie... urodzony pirat',
  'abilityHigh': '',
  'abilityLow': 'Charyzma',
  'profficiency': '',
  'languages': 'Common, Halfling',
  'talent': '',
  'manners': 'Używa \'kwiecistej\' mowy',
  'conversation': 'Niegrzeczne',
  'ideal': '',
  'bond': '',
  'flaw': '',
  'kin': '',
  'createdAt': '2019-02-10T18:27:02.855Z',
  '__v': 0
}, {
  '_id': '5c606da9d180893e953154dc',
  'name': 'Seoni',
  'race': 'Człowiek',
  'sex': 'Kobieta',
  'job': 'Znachorka',
  'specialSign': '',
  'appearance': '',
  'abilityHigh': '',
  'abilityLow': '',
  'profficiency': '',
  'languages': '',
  'talent': '',
  'manners': '',
  'conversation': '',
  'ideal': '',
  'bond': '',
  'flaw': '',
  'kin': '',
  'createdAt': '2019-02-10T18:30:01.842Z',
  '__v': 0
}, {
  '_id': '5c606df2d180893e953154dd',
  'name': 'Renato Vidz',
  'race': 'Człowiek',
  'sex': 'Mężczyzna',
  'job': 'Alchemik',
  'specialSign': 'Tatuaże na całej głowie',
  'appearance': 'Łysy, na głowie ma jakieś znaki z nieznanego nikogu języka',
  'abilityHigh': '',
  'abilityLow': '',
  'profficiency': '',
  'languages': '',
  'talent': '',
  'manners': '',
  'conversation': '',
  'ideal': '',
  'bond': '',
  'flaw': '',
  'kin': '',
  'createdAt': '2019-02-10T18:31:14.470Z',
  '__v': 0
}, {
  '_id': '5c606e4bd180893e953154de',
  'name': 'Skryba',
  'race': 'Człowiek',
  'sex': 'Mężczyzna',
  'job': 'Skryba',
  'specialSign': 'Czerwony nos',
  'appearance': 'Łysy, jasna karnacja skóry, często nosi swoje rękawiczki oraz okulary. Karczma to jego drugi dom',
  'abilityHigh': '',
  'abilityLow': '',
  'profficiency': '',
  'languages': 'Common,',
  'talent': '',
  'manners': '',
  'conversation': '',
  'ideal': '',
  'bond': '',
  'flaw': '',
  'kin': '',
  'createdAt': '2019-02-10T18:32:43.920Z',
  '__v': 0
}, {
  '_id': '5c606ecad180893e953154df',
  'name': 'Jimmy Frostbeard',
  'race': 'Krasnolud',
  'sex': 'Mężczyzna',
  'job': '',
  'specialSign': 'Czerwone włosy',
  'appearance': '',
  'abilityHigh': 'Siła',
  'abilityLow': 'Inteligencja',
  'profficiency': '',
  'languages': 'Common, Dwarvish',
  'talent': '',
  'manners': '',
  'conversation': '',
  'ideal': '',
  'bond': '',
  'flaw': '',
  'kin': 'Galnir Frostbeard (ojciec), Daerbera Frostbeard (matka), Ean Shemov (kuzyn)',
  'createdAt': '2019-02-10T18:34:50.216Z',
  '__v': 0
}, {
  '_id': '5c62057fd180893e953154e0',
  'name': 'Someone new',
  'race': 'Niziołek',
  'sex': '',
  'job': '',
  'specialSign': '',
  'appearance': '',
  'abilityHigh': '',
  'abilityLow': '',
  'profficiency': '',
  'languages': '',
  'talent': '',
  'manners': '',
  'conversation': '',
  'ideal': '',
  'bond': '',
  'flaw': '',
  'kin': '',
  'createdAt': '2019-02-11T23:30:07.443Z',
  '__v': 0
}];

// @route   GET api/npcs/test
// @desc    Test npcs route
router.get("/test", (req, res) => res.json({
  msg: "NPCS works"
}));


// @route   GET api/npcs
// @desc    Get all characters from database
router.get('/', cors(corsOptions), (req, res) => {
  return res.status(200).json(characters);
});

// @route   POST api/npcs
// @desc    Add new character to database
router.options("/", cors(corsOptions))
router.post("/", cors(corsOptions), (req, res) => {
  const { errors, isValid } = validateNPCInput(req.body);
  
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newNPC = new NPC({
    _id: shortid.generate(),
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
    imgFile: undefined,
  });

  console.log(newNPC);
  
  res.json(newNPC);

});

// @route   POST api/npcs/edit/:id
// @desc    Edit existing character
router.options("/edit/:id", cors(corsOptions))
router.post('/edit/:id', cors(corsOptions), (req, res) => {
  const { errors, isValid } = validateNPCInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  res.status(200).json(req.params.id);
});

module.exports = router;
