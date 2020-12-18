const axios = require('axios');
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const { ObjectID } = require('mongodb');
const { listenerCount } = require('process');
// const cropDecimal = require('../util/util').cropDecimal;

// GETS DATA FOR ONE CITY
const getCityData = (sq, cb) => {
    // console.log("sq: ", sq);
    const db = getDb();
    db
        .collection('city_list')
        .findOne({
            $or: [{
                $and: [{ "name": sq.city }, { $or: [{ "state": sq.abbr }, { "country": sq.abbr }] }]
            },
            {
                $and: [{ "name": sq.city }, { "state": sq.state }, { "country": sq.country }]
            }]
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
// LOOKS FOR A CITY BY ID IF EXISTS ELSE NULL
const getSavedDataByID = (id, cb) => {
    // console.log(id);
    const db = getDb();
    db
        .collection('saved_searches')
        .findOne({ _id: ObjectID(id) })
        .then(city => {
            cb(city);
        })
        .catch(err => {
            console.log(err);
        });
}
// RETURNS ALL SAVED SEARCHES FROM DB
const getSavedData = cb => {
    const db = getDb();
    db
        .collection('saved_searches')
        .find()
        .toArray()
        .then(cities => {
            cb(cities);
        })
        .catch(err => {
            console.log(err);
        });
}
// GET THE CURRENT WEATHER FORECAST FROM API
const getWeatherForecast = (lat, lon, cb) => {
    console.log("line 63 WeatherData: ", lat,lon);
    const key = process.env.TOKEN;
    let units = ['imperial', 'metric', 'stadard'];
    console.log(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${key}&units=imperial`)
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
        });
}

// const findSessionID = (id, cb) => {
//     const db = getDb();
//     db
//         .collection('sessions')
//         .findOne(id)
//         .then(sessionUser => {
//             console.log(sessionUser);
//             cb(sessionUser);
//         })
//         .catch(err => {
//             console.log(err);
//         });
// }

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
    // SAVES A NEW SEARCH TO DB
    save() {
        const db = getDb();
        this.visibility = false;
        this._id = new mongodb.ObjectID();
        return db.collection('saved_searches')
            .insertOne(this)
            .then(result => {
                // console.log("save result: ", result);
                console.log("save result: ", result.ops[0]);
            })
            .catch(err => {
                console.log("error msg: ", err);
            });
    }
    // Save Session User and Collection
    // saveNew(id) {
        // const db = getDb();
        // this.ivsibility = false;
        // this._id = new mongodb.ObjectID();
        // discover is sessionID exists. If so save search to db associated with sessionID
        // findSessionID((id, user => {
        //     console.log(user);
        // }))
        // if db save search. if no db exists for sessionID create one.
    // }
    // DELETES ONE SAVED WEATHER STATION IF EXISTS
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
    // EDITS THE NAME OF ONE SAVED WEATHER STATION
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

    // FETCHES CURRENT WEATHER FORECAST FOR NAME SEARCH
    static getForecast(sq, cb) {
        // console.log("sq: ", sq);
        getCityData(sq, city => {
            let lat = city.coord.lat;
            let lon = city.coord.lon;
            console.log("getForecast-line 165: ",lat, lon);
            getWeatherForecast(lat, lon, cb);
        });
    }

    // GETS WEATHER USING LATITUDE and LONGITUDE
    // Invoked at weather.js line 72
    static getSavedWeather(lat, lon, cb) {
        console.log("line 177: ",lat, lon)
        getWeatherForecast(lat, lon, cb);
    }
    // RETURNS A CITY IF IT EXISTS ELSE NULL
    static getCityById(sq, cb) {
        // console.log(sq);
        getCityData(sq, city => {
            // console.log(city._id);
            getSavedDataByID(city._id, cb);
        });
    }
    // RETURNS A LIST OF SAVED CITIES ELSE NULL
    static getSavedWeatherList(cb) {
        getSavedData(cb);
    };

}