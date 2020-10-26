
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(process.mainModule.filename);

const p = path.join(
    path.dirname(appDir),
    'data',
    // 'city_list.json',
    'sample_list.json'
    );

const getCityData = cb => {
    fs.readFile(p, (err, fileContent) => {
        if(err){
            console.log(err);
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}

const getCurrentWeather = (id, cb) => {
    // console.log("id arg: ",id);
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

module.exports = class WeatherData {
    constructor(custom_title, city, state, time, temp, windDir, windSpeed, sunrise, sunset, clouds, rain, snow, icon) {
        this.custom_title = this.custom_title;
        this.city = city;
        this.state = state;
        this.time = time;
        this.description = this.description;
        this.temp = temp;
        this.humidity = this.humidity;
        
        this.windSpeed = windSpeed;
        this.windDir = windDir;
        this.sunrise = sunrise;
        this.sunset = this.sunset;
        this.clouds = clouds;
        this.rain = rain;
        this.snow = snow;
        this.icon = icon;
    }

    save() {

    }
    // Fetches current weather
    static getWeather(l, cb) {
        let city = l.city;
        let state = l.state;
        getCityData(function(cityData) {
            const cityID = cityData.find(d => d.name.toLowerCase() == city && d.state.toLowerCase() == state);
            let id = cityID.id

            getCurrentWeather(id, cb);
        }); 
    }
}