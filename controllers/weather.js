const WeatherData = require('../models/WeatherData');
const WeatherDate = require('../models/WeatherDate');
const parseStr = require('../public/javascripts/validateAddr').validateAdr;
const checkPrecip = require('../public/javascripts/main').checkPrecip;
// const precip = require('../public/javascripts/main').precip;
// console.log(precip);
// Yep, it's not the most elegent code.  But it's 99% all my work!
// The learning will continue whether you likeit or not.  So, like it -- A LOT.
exports.getIndex = (req, res, next) => {
  // console.log(req.sessionID);
  WeatherData.getSavedWeatherList(list => {
    // console.log("list: ",list);
    res.render('weather/index', {
      title: 'Quoteable Weather',
      weather: list,
    });
  });
}

// /WEATHER - DISPLAY WEATHER BY CITY NAME AND STATE
exports.postWeatherByName = (req, res, next) => {
  console.log("input: ", req.body.city_state);
  if (req.body.city_state === '') {
    console.log("Nothing entered");
  } else {
    // Parse search query (sq) into a useable object
    let sq = parseStr(req.body.city_state);
    console.log(sq);
    if (sq === null) {
      res.write("<h1>Please provide a city, state/province, and/or country abbr<h1>");
      res.write("<h2>I'll have a better response in the future ;-)<h2>");
      res.end();
    } else {
      WeatherData.validateCity(sq, city => {
        // console.log(city);
        WeatherData.getWeather(city.coord.lat, city.coord.lon, w => {
          console.log("chance of precip: ", w.data.daily[0].pop);
          let cw = w.data.current;
          let c = cw.clouds;
          let getDate = WeatherDate.convertUTC(cw.dt, cw.sunrise, cw.sunset);
          let precip = checkPrecip(cw.rain, cw.snow);
          console.log(precip);
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
    }
  }
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