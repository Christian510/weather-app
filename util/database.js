const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const db = process.env.DB;

const mongoConnect = cb => {
    MongoClient.connect(db,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    )
    .then(client => {
        console.log('Connected!');
        _db = client.db(); // To Connected locally insert dbName into db().
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