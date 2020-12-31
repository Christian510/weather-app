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
        .then(result => {
            if (result === null) {
                cb(null);
            } else {
                cb(result);
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
        .then(result => {
            cb(result);
        })
        .catch(err => {
            console.log(err);
        });
}
// RETURNS ALL SAVED SEARCHES FROM DB
const getSavedData = cb => {
    const db = getDb();
    db
        .collection('sessions')
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
    // const key = process.env.TOKEN1;
    const key = process.env.TOKEN2;
    let units = ['imperial', 'metric', 'stadard'];
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${key}&units=imperial`)
        .then(function (response) {
            cb(response);
        })
        .catch(function (error) {
            console.log("API Error message: ");
            console.log(error);
            // console.log("url: ", error.config.url);
            // console.log("error code", error.response.data.cod);
            // console.log("error message", error.response.data.message);
            // cb(error);
        });
}

module.exports = class WeatherData {
    constructor(id, city, state, lat, lon) {
        this._id = id;
        this.city = city;
        this.state = state.toUpperCase();
        this.visibile = true;
        this.customName = null;
        this.lat = lat;
        this.lon = lon;
    }

    // SAVES WEATHER SEARCHES TO SESSION USER
    save() {
        const db = getDb();
        this.visibile = false;
        let weatherID = new mongodb.ObjectID();
        return db.collection("sessions").update(
            { "_id": this._id },
            {
                $push: {
                    "savedSearches": {
                        "id": weatherID,
                        "state": this.state,
                        "city": this.city,
                        "lat": this.lat,
                        "lon": this.lon,
                        "customName": this.customName,
                        "visible": this.visibile
                    }
                }
            })
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }
    // DELETES ONE SAVED WEATHER STATION IF EXISTS
    static delete(cityId, sessionId) {
        // console.log(id);
        const db = getDb();
        const query = { '_id': sessionId }
        const updateDoc = { $pull: { "savedSearches": { "id": ObjectID(cityId) } } };

        db.collection("sessions").updateOne(query, updateDoc)
            .then(result => {
                if (result.deletedCount === 1) {
                    console.log("Delete Successful!")
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    // EDITS THE NAME OF ONE SAVED WEATHER STATION
    static editName(cityId, sessionId, newName) {
        const db = getDb();
        const query = { _id: sessionId, "savedSearches.id": ObjectID(cityId) };
        const updateDoc = { $set: { "savedSearches.$.customName": newName } };
        return db.collection("sessions").updateOne(query, updateDoc)
            .then(result => {
                console.log(`Documents modified: ${result.modifiedCount}`);
            })
            .catch(err => {
                console.log(err);
            })
    }

    // FETCHES CURRENT WEATHER FORECAST FOR NAME SEARCH
    static validateCity(sq, cb) {
        // console.log("sq: ", sq);
        getCityData(sq, cb);
    }

    // GETS WEATHER USING LATITUDE and LONGITUDE
    static getWeather(lat, lon, cb) {
        getWeatherForecast(lat, lon, cb);
    }

    // RETURNS A CITY IF IT EXISTS ELSE NULL
    static getCityById(sq, cb) {
        // console.log(sq);
        getCityData(sq, city => {
            getSavedDataByID(city._id, cb);
        });
    }
    // RETURNS A LIST OF SAVED CITIES BY SESSION ID
    static getSavedSearchList(id, cb) {
        getSavedData(sessions => {
            let session = [];
            for (let i = 0; i < sessions.length; i++) {
                if (sessions[i]._id === id && typeof sessions[i].savedSearches != undefined) {
                    sessions[i].savedSearches.forEach(element => {
                        session.push(element);
                    });
                } else if (typeof sessions[i].savedSearches == undefined) {
                    i++
                }
            }
            cb(session);
        });
    };
}