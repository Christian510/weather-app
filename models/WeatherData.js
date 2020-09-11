const axios = require('axios');
const fs = require('fs');
const path = require('path');

const mainMod = path.dirname(process.mainModule.filename);
const p = path.join(
    path.dirname(mainMod),
    'data',
    // 'city_list.json',
    'test'
);
console.log("p: ", p);
console.log("mainMod: ",path.dirname(mainMod));

const getCityData = (cb) => {
    fs.readFile(p,(err, fileContent) => {
        if(err){
            console.log(err);
            cb([]);
        } else {
            // console.log(JSON.parse(fileContent));
            cb(JSON.parse(fileContent));
        }
    });
}

const getCurrentWeather = cb => {
    const key = '483d4bdaf7c3a0f5ee0c0297e784ecb5';
    const cityID = '5586437';
    axios.get(`http://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${key}&units=imperial`)
        .then(function (response) {
            cb(response);
            // console.log(response);
        })
        .catch(function (error) {
            console.log(error)
        });
}

module.exports = class WeatherData {
    // Fetches current weather
    static fetchData(cb) {
        getCurrentWeather(cb);
    }

    // Fetch city, state, country for input lookup

    static locateCityState(cb) {
        getCityData(cb);
    }
}