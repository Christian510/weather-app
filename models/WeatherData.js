
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
const getSavedData = cb => {
    fs.readFile(p.savedSearches, (err, fileContent) => {
        if(err){
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
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
        console.log("error msg: ",err);
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

    save() {
        getSavedData(locations => {
            this.visibility = false;
            locations.push(this);
            writeFile(locations);
        });
    }

    static delete(id) {
        getSavedData(locations => {
            for(let i = 0; i < locations.length; i++) {
                if(locations[i].id == id) {
                    locations.splice(i, 1);
                    writeFile(locations);
                }
            }
        });
    }

    static editName(id, name) {
        getSavedData(locations => {
            for(let i = 0; i < locations.length; i++) {
                if(locations[i].id == id) {
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
        getCityData(function(cityData) {
            const data = cityData.find(d => d.name.toLowerCase() == city && d.state.toLowerCase() == state);
            // console.log(data);
            let id = data.id
            // let lat = data.
            getCurrentWeather(id, cb);
        }); 
    }

    static getWeatherById(arg, cb) {
        getCityData( function(cityData) {
            const cityID = cityData.find(city => city.id == arg);
            const id = cityID.id;
            getCurrentWeather(id, cb);
        });
    }

    static validateById(cb){
        getSavedData(cb);
    }

    static getSavedLocations(cb) {
        getSavedData(cb);
    };
}