const axios = require('axios');
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const { ObjectID } = require('mongodb');
const { listenerCount } = require('process');

const getCityData = (l, cb) => {
    // console.log("l: ", l);
    const db = getDb();
    db
        .collection('city_list')
        .findOne({
            $or: [{
                $and: [{ "name": l.city }, { $or: [{ "state": l.abbr }, { "country": l.abbr }] }]
            },
            {
                $and: [{ "name": l.city }, { "state": l.state }, { "country": l.country }]
            }
            ]
        })
        .then(weather => {
            if (Object.keys(weather).length === 0) {
                console.log("Can't find an Id for this location.");
            } else {
                cb(weather);
            }
        })
        .catch(err => {
            console.log("err message: ", err);
        });
}

const getSavedData = (id, cb) => {
    const db = getDb();
    db
        .collection('saved_searches')
        .findOne({_id: ObjectID(id)})
        .then(city => {
            cb(city);
        })
        .catch(err => {
            console.log(err);
        });
}
// const getCurrentWeather = (id, cb) => {
//     const key = process.env.TOKEN;
//     let cityID = id;
//     let units = ['imperial', 'metric', 'stadard'];
//     axios.get(`http://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${key}&units=imperial`)
//         .then(function (response) {
//             cb(response);
//         })
//         .catch(function (error) {
//             console.log("API Error message: ");
//             // console.log(error);
//             console.log("url: ", error.config.url);
//             console.log("error code", error.response.data.cod);
//             console.log("error message", error.response.data.message);
//         });
// }

const getWeatherForecast = (coord, cb) => {
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

    // Fetches hourly, 7 day Weather Forecast
    static getForecast(coord, cb) {
        // this will return lat and lon then...
        // getCityData(l, data => {
            // console.log(data);
            // returns weather data from api
            getWeatherForecast(coord, cb);
        // });
    }

    // Gets weather using an id
    static getWeatherById(cityId, cb) {
        // converts id string to number
        let id = Number(cityId);
        getCurrentWeather(id, cb);
    }

    static getCityById(id, cb) {
        getSavedData(id, cb);
    }

    static getSavedLocations(cb) {
        getSavedData(cb);
    };

    static findCity(l, cb) {
       getCityData(l, cb);
    }
}