
const axios = require('axios');
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
    fs.readFile(p.findCity, (err, fileContent) => {
        if(err){
            console.log(err);
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}
const getSavedSearches = cb => {
    fs.readFile(p.savedSearches, (err, fileContent) => {
        if(err){
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
    constructor(city, id, state) {
        this.city = city;
        this.state = state;
        this.id = id;
    }

    save() {
        getSavedSearches(locations => {
            console.log("this: ",this);
            locations.push(this);
            fs.writeFile(p.savedSearches, JSON.stringify(locations), err => {
                console.log(err);
            });
        });

    }
    // Fetches current weather
    static getWeatherByName(l, cb) {
        let city = l.city;
        let state = l.state;
        getCityData(function(cityData) {
            const cityID = cityData.find(d => d.name.toLowerCase() == city && d.state.toLowerCase() == state);
            let id = cityID.id

            getCurrentWeather(id, cb);
        }); 
    }

    static getWeatherById(arg, cb) {
        console.log("ID: ",arg);
        getCityData( function(cityData) {
            // console.log("cityData: ", cityData);
            const cityID = cityData.find(city => city.id == arg);
            // console.log("id = ", cityID.id);
            const id = cityID.id;
            getCurrentWeather(id, cb);
        });
    }

    static getSavedLocations(cb) {
        getSavedSearches(cb);
    };
}