const axios = require('axios');
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const { ObjectID } = require('mongodb');
const { listenerCount } = require('process');

const getCityData = (sq, cb) => {
    console.log("sq: ", sq);
    const db = getDb();
    db
        .collection('city_list')
        .findOne({
            $or: [{
                $and: [{ "name": sq.city }, { $or: [{ "state": sq.abbr }, { "country": sq.abbr }] }]
            },
            {
                $and: [{ "name": sq.city }, { "state": sq.state }, { "country": sq.country }]
            }
            ]
        })
        .then(city => {
            if (Object.keys(city).length === 0) {
                console.log("Can't find a city based on query.");
            } else {
                cb(city);
            }
        })
        .catch(err => {
            console.log("err message: ", err);
        });
}

const getSavedData = (id, cb) => {
    id = "5fd2a15c22f71c20ff4a5594"
    const db = getDb();
    db
        .collection('saved_searches')
        .findOne({_id: ObjectID(id)})
        .then(city => {
            return city
            // cb(city);
        })
        .catch(err => {
            console.log(err);
        });
}

const getWeatherForecast = (coord, cb) => {
    console.log(coord);
    const key = process.env.TOKEN;
    let units = ['imperial', 'metric', 'stadard'];
    let lat = coord.lat;
    let lon = coord.lon;
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${key}&units=imperial`)
        .then(function (response) {
            cb(response);
        })
        .catch(function (error) {
            console.log("API Error message: ");
            // console.log(error);
            console.log("url: ", error.config.url);
            console.log("error code", error.response.data.cod);
            console.log("error message", error.response.data.message);
            // cb(error);
        })
}

module.exports = class WeatherData {
    constructor(city, state, lat, lon) {
        this._id = '';
        this.city = city;
        this.state = state.toUpperCase();
        this.visibility = true;
        this.customName = null;
        this.lat = lat;
        this.lon = lon;
    }

    save() {
        const db = getDb();
        this.visibility = false;
        this._id = new mongodb.ObjectID();
        return db.collection('saved_searches')
            .insertOne(this)
            .then(result => {
                console.log("save result: ", result);
            })
            .catch(err => {
                console.log("error msg: ", err);
            });
    }

    static delete(id) {
        const db = getDb();
        return db.collection("saved_searches").deleteOne({ _id: new mongodb.ObjectID(id) })
            .then(result => {
                if (result.deletedCount === 1) {
                    console.log("Delete Successful!")
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    static editName(id, name) {
        //  Update One Document by ID
        const db = getDb();
        let mongoId = { _id: new mongodb.ObjectID(id) }
        let updateDoc = {
            $set: { customName: name }
        }
        return db.collection("saved_searches").updateOne(mongoId, updateDoc)
            .then(result => {
                console.log(`Documents modified: ${result.modifiedCount}`);
            })
            .catch(err => {
                console.log(err);
            })
    }

    // Fetches current Weather Forecast for Name search
    static getForecast(sq, cb) {
        console.log("sq: ",sq);
        getCityData(sq, city => {
            getWeatherForecast(city.coord, cb);
        });
    }

    // Gets weather using an id
    static getWeatherById(cityId, cb) {
        // converts id string to number
        let id = Number(cityId);
        getCurrentWeather(id, cb);
    }
    // returns a city if it exists ELSE null
    static getCityById(sq, cb) {
        console.log(sq);
        // getCityData(sq, city => {
        //     getSavedData(city._id, cb);
        // });
    }
    // returns a list of saved cities else null
    static getSavedLocations(cb) {
        getSavedData(cb);
    };

    static findCity(l) {
        // console.log(l);
       getCityData(l);
    }
}