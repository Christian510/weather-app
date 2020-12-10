const WeatherData = require('../models/WeatherData');
const WeatherDate = require('../models/WeatherDate');
const validateAdr = require('../public/javascripts/validateAddr').validateAdr;
const checkPrecip = require('../public/javascripts/main').checkPrecip;
const { ObjectID } = require('mongodb');

exports.getIndex = (req, res, next) => {
  WeatherData.getSavedLocations(locations => {
    // console.log(locations);
    res.render('weather/index', {
      title: 'Basic Weather',
      searches: locations,
    });
  });
}

// DISPLAY WEATHER BY CITY NAME AND STATE
exports.postWeatherByName = (req, res, next) => {
  // Parse string into a useable object
  let location = validateAdr(req.body.city_state);
  // console.log(location);
  let city;
  WeatherData.findCity(location, data => {
    city = data;
  });
  // console.log("obj: ", validate_city);
  WeatherData.getForecast(location, apiResp => {
    // console.log("response: ", apiResp.data);
    const cw = apiResp.data.current;
    // const h = apiResp.data.hourly;
    // const d = apiResp.data.hourly;
    let dt = cw.dt;
    // let id = cw.id;
    let sunr = cw.sunrise;
    let suns = cw.sunset;
    const getDate = WeatherDate.convertUTC(dt, sunr, suns);
    // let c = cw.weather.clouds;
    let precipitation = checkPrecip(cw.rain, cw.snow);
    WeatherData.validateById(validate => {
      console.log("validate: ", validate);
      let validated = validate.find(l => l._id == city._id);
      // console.log(validated);
      let isVisable = validated === undefined ? true : false;
      res.render('weather/current-weather', {
        title: "Weather Basics",
        visibile: isVisable,
        time: getDate.date,
        observation: cw.weather[0].main,
        typeOfPrecip: "rain",
        precip: precipitation,
        name: `${location.city} ${location.abbr.toUpperCase()}`,
        city: location.custom_name,
        // cityID: cw.weather.id,
        state: location.abbr,
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
        lat: cw.lat,
        lon: cw.lon
      });
    });
  });
};

// DISPLAYS CURRENT WEATHER FOR SAVED WEATHER STATIONS
exports.getSavedWeatherById = (req, res, next) => {
  const id = req.query.id;
  console.log(req.query);

  WeatherData.getWeatherById(id, apiResp => {
    const cw = apiResp.data;
    let dt = cw.dt;
    let sunr = cw.sunrise;
    let suns = cw.sunset;
    const getDate = WeatherDate.convertUTC(dt, sunr, suns);

    let precipitation = checkPrecip(cw.rain, cw.snow);

    res.render('weather/current-weather', {
      visibile: false, // for display of save btn
      title: "Weather Basics",
      time: getDate.date,
      observation: weather.weather[0].main,
      city: location.city,
      cityID: weather.id,
      state: req.query.state,
      name: req.query.custom_name,
      temp: Math.round(weather.main.temp),
      humidity: weather.main.humidity,
      pressure: weather.main.pressure,
      windSpeed: Math.round(weather.wind.speed),
      windDir: weather.wind.deg,
      sunrise: getDate.sunrise,
      sunset: getDate.sunset,
      clouds: weather.clouds.all,
      visibility: Math.round(weather.visibility / 1000),
      icon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
      main: weather.weather[0].main, // Basic description of weather, i.e.; rain, snow, clouds, etc.
      precip: precipitation,
    });
  });
};

// SAVE CITY WEATHER SEARCH
exports.saveWeather = (req, res, next) => {
  console.log("SaveWeather: req.body", req.body);
  let { city, state, lat, lon} = req.body;
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