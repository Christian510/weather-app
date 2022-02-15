'use strict';
const WeatherData = require('../models/WeatherData');
const WeatherDate = require('../models/WeatherDate');
const parseStr = require('../public/javascripts/util_functions').validateAdr;
const checkPrecip = require('../public/javascripts/util_functions').checkPrecip;

exports.getIndex = (req, res, next) => {
  let id = req.sessionID;
  let values = {
    title: 'Elements Weather',
    cities: [],
  }
  WeatherData.getSessionById(id)
  .then(session => {
        if (!session) {
          res.render('weather/index', values );
        } else if (!session.hasOwnProperty('savedSearches')) {
          res.render('weather/index', values);
        } else {
          res.render('weather/index', {
            title: 'Elements Weather',
            cities: session.savedSearches,
          });
        }
      })
      .catch(err => {
        console.log("we have an error!")
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
}

// /WEATHER - GETS WEATHER BY CITY NAME AND STATE
exports.postWeatherByName = (req, res, next) => {
  // Parse search query (sq) into a useable object
  let sq = parseStr(req.body.city_state);
  WeatherData.validateCity(sq, city => {
    if (city === null) {
      res.render('error/noCityFound', {
        title: 'City Not Found'
      });
    } else {
      WeatherData.getWeather(city.coord.lat, city.coord.lon, w => {
        let cw = w.data.current;
				// console.log(w.data);
        let offset = w.data.timezone_offset;
        let timezone = w.data.timezone;
        let getDate = WeatherDate.convertUTC(cw.dt, cw.sunrise, cw.sunset, offset, timezone);
        let precip = checkPrecip(cw.weather[0].main.rain, cw.weather[0].main.snow);

        res.render('weather/current-weather', {
          forecast: w.data,
          title: "Elements Weather",
          visible: city.isVisable === undefined ? true : false,
          time: getDate.date,
          observation: cw.weather[0].main,
          typeOfPrecip: precip.type,
          precip: precip.precipitation,
          precipType: precip.type,
          feelsLikeTemp: cw.feels_like,
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
          icon: cw.weather[0].icon,
          main: cw.weather[0].main, // Basic description: "rain", "snow", etc.
          lat: city.coord.lat,
          lon: city.coord.lon,
          deg: `${cw.wind_deg}deg`,
        });
      });
    }
  });
};

// DISPLAYS CURRENT WEATHER FOR SAVED WEATHER STATIONS
exports.getSavedWeatherById = (req, res, next) => {
	// console.log(res.httpStatusCode);
  WeatherData.getWeather(req.query.lat, req.query.lon, w => {
    // console.log("req: ", req.query)
    let cw = w.data.current;
    // console.log(cw.id)
    let offset = w.data.timezone_offset;
    let timezone = w.data.timezone;
    let getDate = WeatherDate.convertUTC(cw.dt, cw.sunrise, cw.sunset, offset, timezone);
    let precip = checkPrecip(cw.rain, cw.snow);
    //  I have to get the correct coords from the saved
    res.render('weather/current-weather', {
			forecast: w.data,
      visible: false, // for display of save btn
      title: "Elements Weather",
      time: getDate.date,
      observation: cw.weather[0].main,
      city: req.query.city,
      // cityID: cw.id,
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
      icon: cw.weather[0].icon,
      main: cw.weather[0].main, // Basic description of weather, i.e.; rain, snow, clouds, etc.
      precip: precip.precipitation,
      precipType: precip.type,
      feelsLikeTemp: cw.feels_like,
      typeOfPrecip: precip.type,
      lat: req.query.lat,
      lon: req.query.lon,
      deg: `${cw.wind_deg}deg`,
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

exports.getAboutPage = (req, res, next) => {
  res.render('weather/about', {
    title: 'About Page',
  })
}
