const WeatherData = require('../models/WeatherData');
const WeatherDate = require('../models/WeatherDate');
const validateAdr = require('../public/javascripts/validateAddr').validateAdr;
const checkPrecip = require('../public/javascripts/main').checkPrecip;

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

  WeatherData.getWeather(location, apiResp => {
    // console.log("response: ", apiResp);
    const weather = apiResp.data;
    let dt = weather.dt;
    let id = weather.id;
    let sunr = weather.sys.sunrise;
    let suns = weather.sys.sunset;
    const getDate = WeatherDate.convertUTC(dt, sunr, suns);

    // let c = weather.clouds;
    let precipitation = checkPrecip(weather.rain, weather.snow);

    WeatherData.validateById(validate => {
      let validated = validate.find(l => l.id == id);
      let isVisable = validated === undefined ? true : false;
      res.render('weather/current-weather', {
        title: "Weather Basics",
        visibile: isVisable,
        time: getDate.date,
        observation: weather.weather[0].main,
        typeOfPrecip: "rain",
        precip: precipitation,
        name: `${weather.name} ${location.state.toUpperCase()}`,
        city: weather.name,
        cityID: weather.id,
        state: location.state,
        temp: Math.round(weather.main.temp),
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        visibility: Math.round(weather.visibility / 1000),
        windSpeed: Math.round(weather.wind.speed),
        windDir: weather.wind.deg,
        sunrise: getDate.sunrise,
        sunset: getDate.sunset,
        clouds: weather.clouds.all,
        icon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
        main: weather.weather[0].main, // Basic description: "rain", "snow", etc.
      });
    });
  });
};

// DISPLAYS CURRENT WEATHER FOR SAVED WEATHER STATIONS
exports.getSavedWeatherById = (req, res, next) => {
  const id = req.query.id;

  WeatherData.getWeatherById(id, apiResp => {
    const weather = apiResp.data;

    let dt = weather.dt;
    let sunr = weather.sys.sunrise;
    let suns = weather.sys.sunset;
    const getDate = WeatherDate.convertUTC(dt, sunr, suns);

    let precipitation = checkPrecip(weather.rain, weather.snow);

    res.render('weather/current-weather', {
      visibile: false, // for display of save btn
      title: "Weather Basics",
      time: getDate.date,
      observation: weather.weather[0].main,
      city: weather.name,
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
  // console.log("SaveWeather: req.body", req.body);
  let { city, state, id } = req.body;
  let parsedID = parseInt(id);
  let saveSearch = new WeatherData(city, parsedID, state);
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