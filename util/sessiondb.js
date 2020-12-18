const mongodb = require('mongodb');
const { mongoConnect } = require('./database');
const MongoClient = mongodb.MongoClient;

let _db;

const remote = 'mongodb+srv://Christian:ewv7KxfQ@weatherappdb.cq3qr.mongodb.net/WeatherAppDB?retryWrites=true&w=majority';
const localHost = "mongodb://127.0.0.1:27017";
const dbName = "WeatherApp";

const mongoSessionClient = cb => {
    MongoClient.connect(remote,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    )
    .then(client => {
        console.log('Connected!');
        _db = client.db(); // To Connected locally insert dbName into db()
        return _db;
    }).catch(err => {
        console.log("Mongo err msg: ",err);
        throw err;
    });
}

exports.mongoSessionClient = mongoSessionClient;