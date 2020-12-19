const WeatherData = require('../models/WeatherData');
const WeatherDate = require('../models/WeatherDate');
const parseStr = require('../public/javascripts/validateAddr').validateAdr;
const checkPrecip = require('../public/javascripts/main').checkPrecip;
const { ObjectID } = require('mongodb');

exports.getIndex = (req, res, next) => {
  // console.log(req.sessionID);
  WeatherData.getSavedWeatherList(list => {
    // console.log("list: ",list);
    res.render('weather/index', {
      title: 'Basic Weather',
      weather: list,
    });
  });
}

// DISPLAY WEATHER BY CITY NAME AND STATE
exports.postWeatherByName = (req, res, next) => {
  // Parse search query (sq) into a useable object
  let sq = parseStr(req.body.city_state);
  console.log(sq);
  WeatherData.validateCity(sq, city => {
    console.log(city);
    WeatherData.getWeather(city.coord.lat, city.coord.lon, w => {
      let cw = w.data.current;
      let c = cw.clouds;
      let getDate = WeatherDate.convertUTC(cw.dt, cw.sunrise, cw.sunset);
      console.log(city.isVisable);
      let precipitation = checkPrecip(cw.rain, cw.snow);
      let isVisable = city.isVisable === undefined ? true : false;
      res.render('weather/current-weather', {
        title: "Weather Basics",
        visible: isVisable,
        time: getDate.date,
        observation: cw.weather[0].main,
        typeOfPrecip: "rain",
        precip: precipitation,
        city: sq.city,
        state: sq.abbr.toUpperCase(),
        customName: sq.custom_name,
        // cityID: savedCity._id,
        temp: Math.round(cw.temp),
        humidity: cw.humidity,
        pressure: cw.pressure,
        visibility: Math.round(cw.visibility / 1000),
        windSpeed: Math.round(cw.wind_speed),
        windDir: cw.wind_deg,
        sunrise: getDate.sunrise,
        sunset: getDate.sunset,
        clouds: cw.clouds,
        icon: `http://openweathermap.org/img/wn/${cw.weather[0].icon}@2x.png`,
        main: cw.weather[0].main, // Basic description: "rain", "snow", etc.
        lat: city.coord.lat,
        lon: city.coord.lon
      });
    });
  });
};

// DISPLAYS CURRENT WEATHER FOR SAVED WEATHER STATIONS
exports.getSavedWeatherById = (req, res, next) => {
  // console.log(req.query);
  WeatherData.getSavedWeather(req.query.lat, req.query.lon, apiResp => {
    const cw = apiResp.data.current;
    // console.log(cw);
    const getDate = WeatherDate.convertUTC(cw.dt, cw.sunrise, cw.sunset);

    let precipitation = checkPrecip(cw.rain, cw.snow);
    //  I have to get the correct coords from the saved
    res.render('weather/current-weather', {
      visible: false, // for display of save btn
      title: "Weather Basics",
      time: getDate.date,
      observation: cw.weather[0].main,
      city: req.query.city,
      cityID: cw.id,
      state: req.query.state,
      customName: req.query.custom_name,
      temp: Math.round(cw.temp),
      humidity: cw.humidity,
      pressure: cw.pressure,
      windSpeed: Math.round(cw.wind_speed),
      windDir: cw.wind_deg,
      sunrise: getDate.sunrise,
      sunset: getDate.sunset,
      clouds: cw.clouds.all,
      visibility: Math.round(cw.visibility / 1000),
      icon: `http://openweathermap.org/img/wn/${cw.weather[0].icon}@2x.png`,
      main: cw.weather[0].main, // Basic description of weather, i.e.; rain, snow, clouds, etc.
      precip: precipitation,
      lat: req.query.lat,
      lon: req.query.lon,
    });
  });
};

// SAVE CITY WEATHER SEARCH
exports.saveWeather = (req, res, next) => {
  console.log("SaveWeather: req.body", req.body);
  let { city, state, lat, lon } = req.body;
  console.log("saveWeather: ", lat, lon);
  let saveSearch = new WeatherData(city, state, lat, lon);
  saveSearch.save()
    .then(result => {
      // console.log(result);
      console.log("Search Saved");
      res.redirect('/');
    })
    .catch(err => {
      console.log("saved search err: ", err);
    });
  // saveSearch.saveNew();
}

// 5 DAY WEATHER FORCAST
exports.getFiveDayWeather = (req, res, next) => {
  res.render('weather/5-day-forecast', {
    title: '5 Day Forecast',
  });
}

// HOURLY WEATHER
exports.getHourlyWeather = (req, res, next) => {
  res.render('weather/hourly', {
    title: 'Hourly Forecast',
  });
}

// MAP SEARCH
exports.getMap = (req, res, next) => {
  res.render('weather/map', {
    title: 'Map Search',
  });
}