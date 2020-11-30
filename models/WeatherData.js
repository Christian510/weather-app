const axios = require('axios');
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const { ObjectID } = require('mongodb');
const { listenerCount } = require('process');

const getCityData = (c, s, cb) => {
    let state = s.toUpperCase();
    let city = c.charAt(0).toUpperCase() + c.slice(1);

    const db = getDb();
    db
        .collection('city_list')
        .find({ "name": city, "state": state }) // need both city and state values
        .toArray()
        .then(weather => {
            cb(weather);
            // console.log("weather: ", weather);
        })
        .catch(err => {
            console.log("err message: ", err);
        });
}

const getSavedData = cb => {
    const db = getDb();
    db
        .collection('saved_searches')
        .find()
        .toArray()
        .then(locations => {
            // console.log("locations: ", locations);
            cb(locations);
        })
        .catch(err => {
            console.log(err);
        });
}

const getCurrentWeather = (id, cb) => {
    // console.log(process.env);
    const key = process.env.TOKEN;
    let cityID = id;
    axios.get(`http://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${key}&units=imperial`)
        .then(function (response) {
            cb(response);
        })
        .catch(function (error) {
            console.log("API Error message: ");
            // console.log(error);
            console.log("url: ", error.config.url);
            console.log("error code", error.response.data.cod);
            console.log("error message", error.response.data.message);
        });
}

module.exports = class WeatherData {
    constructor(city, id, state) {
        this.city = city;
        this.state = state.toUpperCase();
        this.id = id;
        this.visibility = true;
        this.customName = null;
        this._id = new mongodb.ObjectID(id);
    }

    save() {
        this.visibility = false;
        const db = getDb();
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
        let mongoId = { _id: new mongodb.ObjectID(id)}
        let updateDoc = {
            $set: { customName: name}
        }
        return db.collection("saved_searches").updateOne(mongoId, updateDoc)
        .then(result => {
            console.log(`Documents modified: ${result.modifiedCount}`);
        })
        .catch(err => {
            console.log(err);
        })
    }
    // Fetches current weather
    static getWeatherByName(l, cb) {
        console.log(l);
        getCityData(l.city, l.state, cityInfo => {
            let id = cityInfo[0].id;
            getCurrentWeather(id, cb);
        });
    }
    // Gets weather using an id
    static getWeatherById(cityId, cb) {
        // converts id string to number
        let id = Number(cityId);
        getCurrentWeather(id, cb);
    }

    static validateById(cb) {
        getSavedData(cb);
    }

    static getSavedLocations(cb) {
        getSavedData(cb);
    };
}