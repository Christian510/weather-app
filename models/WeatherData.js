
const axios = require('axios');
const getDb = require('../util/database').getDb;
const fs = require('fs');
const path = require('path');
const { listenerCount } = require('process');
const appDir = path.dirname(process.mainModule.filename);
const p = {
    "findCity": path.join(
        path.dirname(appDir),
        'data',
        // 'city_list.json',
        'sample_list.json'
    ),
    "savedSearches": path.join(
        path.dirname(appDir),
        'data',
        // 'city_list.json',
        'saved_searches.json'
    )
}

const getCityData = cb => {
    const db = getDb();
    db
        .find()
        .then(weather => {
            console.log("weather: ", weather);
        })
        .catch(err => {
            console.log("err message: ",err);
        });
}

const getSavedData = cb => {
    const db = getDb();
    db
        .collection('saved_searches')
        .find()
        .toArray()
        .then(locations => {
            console.log("locations: ", locations);
            cb(locations);
        })
        .catch(err => {
            console.log(err);
        });
}

const getCurrentWeather = (id, cb) => {
    const key = process.env.TOKEN;
    let cityID = id;
    axios.get(`http://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${key}&units=imperial`)
        .then(function (response) {
            cb(response);
        })
        .catch(function (error) {
            console.log(error)
        });
}

const writeFile = (locations) => {
    fs.writeFile(p.savedSearches, JSON.stringify(locations), err => {
        console.log("error msg: ", err);
    });
}

module.exports = class WeatherData {
    constructor(city, id, state) {
        this.city = city;
        this.state = state;
        this.id = id;
        this.visibility = true;
        this.customName = null;
    }

    save(name, id) {
        this.visibility = false;
        const db = getDb();
        return db.collection('saved_searches')
            .find({ city: this.city, id: this.id })
            .insertOne(this)
            .then(result => {
                console.log("save result: ", result);

            });
    }

    static delete(id) {
        getSavedData(locations => {
            for (let i = 0; i < locations.length; i++) {
                if (locations[i].id == id) {
                    locations.splice(i, 1);
                    writeFile(locations);
                }
            }
        });
    }

    static editName(id, name) {
        getSavedData(locations => {
            for (let i = 0; i < locations.length; i++) {
                if (locations[i].id == id) {
                    locations[i].customName = name;
                    writeFile(locations);
                }
            }
        });
    }
    // Fetches current weather
    static getWeatherByName(l, cb) {
        let city = l.city;
        let state = l.state;
        getCityData(function (cityData) {
            const data = cityData.find(d => d.name.toLowerCase() == city && d.state.toLowerCase() == state);
            // console.log(data);
            let id = data.id
            // let lat = data.
            getCurrentWeather(id, cb);
        });
    }

    static getWeatherById(arg, cb) {
        getCityData(function (cityData) {
            const cityID = cityData.find(city => city.id == arg);
            const id = cityID.id;
            getCurrentWeather(id, cb);
        });
    }

    static validateById(cb) {
        getSavedData(cb);
    }

    static getSavedLocations(cb) {
        getSavedData(cb);
    };
}