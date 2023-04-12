var express = require('express');
var mongodb = require('../db');

var router = express.Router();

router.get('/', function (req, res) {
  mongodb.connectDB();
  mongodb.getPets().then(function (pets) {
    res.setHeader('Content-Type', 'application/json');
    res.status(201).send(JSON.stringify(pets));
  })
})

router.get('/count', function (req, res) {
  mongodb.connectDB();
  mongodb.countPets().then(function (pets) {
    res.setHeader('Content-Type', 'application/json');
    res.status(201).send({ count: pets });
  })
})

router.get('/elephants/v1/data', function (req, res) {
  mongodb.connectDB();
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>GET all the elephants")
  mongodb.getPets().then(function (pets) {
    res.setHeader('Content-Type', 'application/json');
    res.status(201).send(JSON.stringify(pets));
  })
})

router.get('/elephants/v1/data/:petid', function (req, res) {
  console.log("lll!!???!! Get one elephant ")
  mongodb.connectDB();
  res.setHeader('Content-Type', 'application/json');

  var uuid = req.params.petid;
  console.log(" 2 Get one elephants" + uuid)
  mongodb.getPet(res, uuid);
})

router.get('/elephants/v1/load', function (req, res) {
  mongodb.connectDB();
  res.setHeader('Content-Type', 'application/json');
  console.log("Load all the elephants")
  mongodb.deleteAllPets()
  mongodb.sendPet("Surus", "King Elephant", 12, "https://upload.wikimedia.org/wikipedia/commons/1/1c/Wildlife_Elephant.jpg");
  mongodb.sendPet("Tristram", "Black Elephant", 34, "https://upload.wikimedia.org/wikipedia/commons/c/cd/Adult_elephant.jpg");
  mongodb.sendPet("Naoned", "Nantes Elephant", 14, "https://live.staticflickr.com/8297/7936097148_7a67233cab_b.jpg");
  mongodb.sendPet("WetWetWet", "Lake Elephant", 8, "https://www.publicdomainpictures.net/pictures/280000/velka/african-elephant-in-water.jpg");
  res.status(201).send(JSON.stringify({ status: "ok" }))
})

router.get('/elephants/v1/delete', function (req, res) {
  mongodb.connectDB();
  res.setHeader('Content-Type', 'application/json');
  mongodb.deleteAllPets()
  res.status(201).send(JSON.stringify({ status: "ok" }))
})

module.exports = router;
