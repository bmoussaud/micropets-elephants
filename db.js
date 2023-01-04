var mongoose = require('mongoose');
var statsd = require('./statsd');
var os = require("os");
const { options } = require('mongoose');

var csb = require('./config-service-binding');

var PetSchema = mongoose.Schema({
    Name: String,
    Kind: String,
    Age: Number,
    URL: String,
    From: String
});
var Pet = mongoose.model('Pet', PetSchema);

function bindingsToMongoDbUrl(binding) {
    if ("connectionString" in binding) {
        return binding.connectionString
    }
    else {
        return ['mongodb', '://', `${binding.username}`, ':', `${binding.password}`, '@', `${binding.host}`, `:${binding.port}`].join('');
    }
}

module.exports = {
    connectDB: function () {
        console.log("->>>connectDB")
        if (!process.env.MONGODB_ADDON_URI === undefined) {
            console.log('Connecting using MONGODB_ADDON_URI env: ');
            mongoose.connect(process.env.MONGODB_ADDON_URI, { useNewUrlParser: true });
        } else {
            console.log('Connecting Using Service Binding (mongodb)....');            
            const mongoDbBindings = csb.bindings("mongodb")
            console.log(mongoDbBindings)
            const uri = bindingsToMongoDbUrl(mongoDbBindings)
            console.log(uri)
            mongoose.set('strictQuery', true)
            //TODO:mage ssl:false when using the local mongodatabase and :true when using the azure mongodatabase
            mongoose.connect(uri, { ssl: false, useNewUrlParser: true })
                .then(() => {
                    console.log('Connected to the database !')
                })
                .catch((err) => {
                    console.error(`Error connecting to the database. \n${err}`);
                    process.exit(1);
                })
        }
    },

    getPets: function (res) {
        return Pet.find(function (err, result) {
            console.log("getPets.....")
            if (err) {
                console.log(err);
                res.send('database error');
                return
            }
            var pets = []
            var from = process.env.ENV || 'AKS/4'
            for (var i in result) {
                var val = result[i];
                pets.push({
                    Index: val['_id'],
                    Name: val['Name'],
                    Kind: val['Kind'],
                    Age: val['Age'],
                    URL: val['URL'],
                    From: from,
                    URI: "/elephants/v1/data/" + val['_id']
                })
            }
            res.status(201).send(JSON.stringify({ Total: pets.length, Hostname: os.hostname(), Pets: pets }));

        });
    },

    getPet: function (res, uuid) {
        return Pet.findById(uuid, function (err, result) {
            if (err) {
                console.log(err);
                res.send('database error');
                return
            }
            var val = result
            var from = process.env.ENV || 'AKS/4'
            res.status(201).send(JSON.stringify({
                Index: val['_id'],
                Name: val['Name'],
                Kind: val['Kind'],
                Age: val['Age'],
                URL: val['URL'],
                From: from,

                URI: "/elephants/v1/data/" + val['_id']
            }));
        });
    },

    sendPet: function (name, kind, age, url) {
        console.log("sendPet:" + name)
        var pet = new Pet({
            Name: name,
            Kind: kind,
            Age: age,
            URL: url,
            From: ""
        });
        return pet.save()
            .then(pet => console.log('The pet ' + pet.Name + ' has been added.'))
            .catch(err => console.log("Error:" + err))
    },

    deleteAllPets: function () {
        Pet.deleteMany().then(function () {
            console.log("PetsData deleted"); // Success
        })
        statsd.increment('deletionPets');
    }

};
