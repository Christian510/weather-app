const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = cb => {
    MongoClient.connect('mongodb+srv://Christian:jZA1v0npOVPRECCy@weatherappdb.cq3qr.mongodb.net/WeatherAppDB?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected!');
        _db = client.db();
        cb();
    }).catch(err => {
        console.log("Mongo err msg: ",err);
        throw err;
    });
}


const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database found!";
}



exports.mongoConnect = mongoConnect;
exports.getDb = getDb;