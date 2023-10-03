var mongoose = require("mongoose");
var statsd = require("./statsd");
var os = require("os");
const { options } = require("mongoose");

var csb = require("./config-service-binding");

var PetSchema = mongoose.Schema({
  Name: String,
  Kind: String,
  Age: Number,
  URL: String,
  From: String,
});
var Pet = mongoose.model("Pet", PetSchema);

function bindingsToMongoDbUrl(binding) { 
  if ("connectionString" in binding) {
    return binding.connectionString;
  } else {
    return [
      "mongodb",
      "://",
      `${binding.username}`,
      ":",
      `${binding.password}`,
      "@",
      `${binding.host}`,
      `:${binding.port}`,
      `/${binding.database}`,
    ].join("");
  }
}

function sendPet(name, kind, age, url) {
  console.log("sendPet:" + name);
  var pet = new Pet({
    Name: name,
    Kind: kind,
    Age: age,
    URL: url,
    From: "",
  });
  return pet
    .save()
    .then((pet) => console.log("The pet " + pet.Name + " has been added."))
    .catch((err) => console.log("Error:" + err));
}

function deleteAllPets() {
  Pet.deleteMany().then(function () {
    console.log("PetsData deleted"); // Success
  });
}

function countPets() {
  return Pet.count()
    .catch((err) => console.log("countPets catch:" + err))
    .then((result) => {
      return result;
    });
}

module.exports = {
  connectDB: function () {
    console.log("->>>connectDB");
    if (!process.env.MONGODB_ADDON_URI === undefined) {
      console.log("Connecting using MONGODB_ADDON_URI env: ");
      url = process.env.MONGODB_ADDON_URI;
      mongoose.connect(process.env.MONGODB_ADDON_URI, {
        useNewUrlParser: true,
      });
    } else {
      console.log("Connecting Using Service Binding (mongodb)....");
      const mongoDbBindings = csb.bindings("mongodb");
      console.log(mongoDbBindings);
      const uri = bindingsToMongoDbUrl(mongoDbBindings);
      console.log(uri);

      mongoose.set("strictQuery", true);
      //TODO:mage ssl:false when using the local mongodatabase and :true when using the azure mongodatabase
      mongoose
        .connect(uri, { useNewUrlParser: true })
        .then(() => {
          console.log("Connected to the database !");
          Pet.count().then((total) => {
            if (total == 0) {
              sendPet(
                "Surus",
                "King Elephant",
                12,
                "https://upload.wikimedia.org/wikipedia/commons/1/1c/Wildlife_Elephant.jpg"
              );
              sendPet(
                "Tristram",
                "Black Elephant",
                34,
                "https://upload.wikimedia.org/wikipedia/commons/c/cd/Adult_elephant.jpg"
              );
              sendPet(
                "Naoned",
                "Nantes Elephant",
                14,
                "https://live.staticflickr.com/8297/7936097148_7a67233cab_b.jpg"
              );
              sendPet(
                "WetWetWet",
                "Lake Elephant",
                8,
                "https://www.publicdomainpictures.net/pictures/280000/velka/african-elephant-in-water.jpg"
              );
              console.log("Data initialized!");
            }
          });
        })
        .catch((err) => {
          console.error(
            `Error connecting to the database. Try again later....\n${err}`
          );
          //process.exit(1);
        });
    }
  },

  getPets: function () {
    return Pet.find()
      .catch((err) => console.log("getPets catch:" + err))
      .then((result) => {
        console.log("getPets then :");
        var pets = [];
        var from = process.env.ENV || "AKS/4";
        for (var i in result) {
          var val = result[i];
          pets.push({
            Index: val["_id"],
            Name: val["Name"],
            Kind: val["Kind"],
            Age: val["Age"],
            URL: val["URL"],
            From: from,
            URI: "/elephants/v1/data/" + val["_id"],
          });
        }
        return { Total: pets.length, Hostname: os.hostname(), Pets: pets };
      });
  },

  getPet: function (res, uuid) {
    return Pet.findById(uuid)
      .catch((err) => console.log("single getPet catch:" + err))
      .then((result) => {
        console.log(result);
        var val = result;
        var from = process.env.ENV || "AKS/4";
        res.status(201).send(
          JSON.stringify({
            Index: val["_id"],
            Name: val["Name"],
            Kind: val["Kind"],
            Age: val["Age"],
            URL: val["URL"],
            From: from,
            URI: "/elephants/v1/data/" + val["_id"],
          })
        );
      });
  },

  countPets: countPets,
  sendPet: sendPet,
  deleteAllPets: deleteAllPets,
  getInfo: function () {
    console.log("->>>getInfo");
    const mongoDbBindings = csb.bindings("mongodb");
    console.log("b" + mongoDbBindings);
    const uri = bindingsToMongoDbUrl(mongoDbBindings);
    driver = [`${mongoDbBindings.type}`, "/", `${mongoDbBindings.provider}`].join("");

    return { url: uri, driver: driver, kind: "elephants" };
  },
};
