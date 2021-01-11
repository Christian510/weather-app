const axios = require('axios');
const getDb = require('../util/database');

// GETS DATA FOR ONE CITY
const getCityData = (sq, cb) => {

}
// LOOKS FOR A CITY BY ID IF EXISTS ELSE NULL
const getSavedDataByID = (id, cb) => {

}

// GET THE CURRENT WEATHER FORECAST FROM API
const getWeatherForecast = (lat, lon, cb) => {
    // const key = process.env.TOKEN1;
    const key = process.env.TOKEN2;
    // let units = ['imperial', 'metric', 'stadard'];
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${key}&units=imperial`)
        .then(function (response) {
            cb(response);
        })
        .catch(function (error) {
            console.log("API Error message: ");
            console.log(error);
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

    }
    // DELETES ONE SAVED WEATHER STATION IF EXISTS
    static delete(cityId, sessionId) {
    }

    // EDITS THE NAME OF ONE SAVED WEATHER STATION
    static editName(cityId, sessionId, newName) {
    }

    // CHECKS TO MAKE SURE THE CITY EXISTS IN DB
    static validateCity(sq, cb) {
        getCityData(sq, cb);
    }

    // GETS WEATHER USING LATITUDE and LONGITUDE
    static getWeather(lat, lon, cb) {
        getWeatherForecast(lat, lon, cb);
    }

    // RETURNS A CITY IF IT EXISTS ELSE NULL
    static getCityById(sq, cb) {
        getCityData(sq, city => {
            getSavedDataByID(city._id, cb);
        });
    }
    // RETURNS A LIST OF SAVED CITIES BY SESSION ID
    static getSavedSearchList(id) {
    };
}