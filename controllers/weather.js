const WeatherData = require('../models/WeatherData');
const WeatherDate = require('../models/WeatherDate');
const parseStr = require('../public/javascripts/util_functions').validateAdr;
const checkPrecip = require('../public/javascripts/util_functions').checkPrecip;
const findCitiesBySessionUser = require('../public/javascripts/util_functions').findCitiesBySessionUser;

// Yep, it's not the most elegent code.  But it's 99% all my work!
// The learning will continue whether you like it or not.  So, like it -- A LOT.

exports.getIndex = (req, res, next) => {
  // let id = req.sessionID;
  // console.log(req.sessionStore);
  // console.log(session);
  // console.log(id);
  // WeatherData.getSavedSearchList(id)
  // .then(sessions => {
  //   let cities = findCitiesBySessionUser(sessions);
    res.render('weather/index', {
      title: 'Quoteable Weather',
      // cities: cities,
      cities: [],
    });
  // })
  // .catch(err => {
  //   console.log("we have an error!")
  //   const error = new Error(err);
  //   error.httpStatusCode = 500;
  //   return next(error);
  // });
}

// /WEATHER - GETS WEATHER BY CITY NAME AND STATE
exports.postWeatherByName = (req, res, next) => {
  // Parse search query (sq) into a useable object
  let sq = parseStr(req.body.city_state);
  if (sq === null) {
    // Instead create an error message above the search box.
    res.write("<h1>Please provide a city, state/province, and/or country abbr<h1>");
    res.write("<h2>I'll have a better response in the future ;-)<h2>");
    res.end();
  } else {
    WeatherData.validateCity(sq, city => {
      if (city === null) {
        // Create a error message with a path then redirect
        // path: /500 status: 500;
        res.write("<h1>The city you are looking for may not be in our database!<h1>");
        res.write("<h2>It's just a test database unfortunately<h2>");
        res.write("<h2>Hit the back button and try again!<h2>");
        res.end();
      } else {
        WeatherData.getWeather(city.coord.lat, city.coord.lon, w => {
          let cw = w.data.current;
          let c = cw.clouds;
          let getDate = WeatherDate.convertUTC(cw.dt, cw.sunrise, cw.sunset);
          let precip = checkPrecip(cw.rain, cw.snow);
          let isVisable = city.isVisable === undefined ? true : false;
          res.render('weather/current-weather', {
            title: "Quoteable Weather",
            visible: isVisable,
            time: getDate.date,
            observation: cw.weather[0].main,
            typeOfPrecip: precip.type,
            precip: precip.precipitation,
            pop: w.data.daily[0].pop,
            city: sq.city,
            state: sq.abbr.toUpperCase(),
            customName: sq.custom_name,
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
      }
    });
  }
};

exports.postWeatherByName = (req, res, next) => {
  // Parse search query (sq) into a useable object
  let sq = parseStr(req.body.city_state);
  if (sq === null) {
    res.write("<h1>Please provide a city, state/province, and/or country abbr<h1>");
    res.write("<h2>I'll have a better response in the future ;-)<h2>");
    res.end();
  } else {
    WeatherData.validateCity(sq, city => {
      if (city === null) {
        // Create a error message with a path then redirect
        // path: /500 status: 500;
        res.write("<h1>The city you are looking for may not be in our database!<h1>");
        res.write("<h2>It's just a test database unfortunately<h2>");
        res.write("<h2>Hit the back button and try again!<h2>");
        res.end();
      } else {
        WeatherData.getWeather(city.coord.lat, city.coord.lon, w => {
          let cw = w.data.current;
          let c = cw.clouds;
          let getDate = WeatherDate.convertUTC(cw.dt, cw.sunrise, cw.sunset);
          let precip = checkPrecip(cw.rain, cw.snow);
          let isVisable = city.isVisable === undefined ? true : false;
          res.render('weather/current-weather', {
            title: "Quoteable Weather",
            visible: isVisable,
            time: getDate.date,
            observation: cw.weather[0].main,
            typeOfPrecip: precip.type,
            precip: precip.precipitation,
            pop: w.data.daily[0].pop,
            city: sq.city,
            state: sq.abbr.toUpperCase(),
            customName: sq.custom_name,
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
      }
    });
  }
};

// DISPLAYS CURRENT WEATHER FOR SAVED WEATHER STATIONS
exports.getSavedWeatherById = (req, res, next) => {
  WeatherData.getWeather(req.query.lat, req.query.lon, w => {
    const cw = w.data.current;
    const getDate = WeatherDate.convertUTC(cw.dt, cw.sunrise, cw.sunset);
    let precip = checkPrecip(cw.rain, cw.snow);
    //  I have to get the correct coords from the saved
    res.render('weather/current-weather', {
      visible: false, // for display of save btn
      title: "Quoteable Weather",
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
      precip: precip.precipitation,
      pop: w.data.daily[0].pop,
      typeOfPrecip: precip.type,
      lat: req.query.lat,
      lon: req.query.lon,
    });
  });
};

// SAVE CITY WEATHER SEARCH
exports.saveWeather = (req, res, next) => {
  let id = req.sessionID;
  let { city, state, lat, lon } = req.body;
  let saveSearch = new WeatherData(id, city, state, lat, lon);
  saveSearch.save()
    .then(() => {
      // console.log(result);
      res.redirect('/');
    })
    .catch(err => {
      console.log("we have an error!")
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

// 5 DAY HISTORICAL WEATHER DATA

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