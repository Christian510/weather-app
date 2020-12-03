const WeatherData = require('../models/WeatherData');
const WeatherDate = require('../models/WeatherDate');
const validateAdr = require('../public/javascripts/validateAddr').validateAdr;

function checkPrecip(rain, snow) {
  let precipitation;
  if (rain !== undefined) {
    return precipitation = rain['1h'];
  }
  if (snow !== undefined) {
    return precipitation = snow['1h'];
  } else {
    return precipitation = '0';
  }
}

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
  // Organize string into a name string, state, country
  let location = validateAdr(req.body.city_state);
  console.log(location);
  WeatherData.getWeatherByName(location, apiResp => {
    // console.log("response: ", apiResp);
    const weather = apiResp.data;
    let dt = weather.dt;
    let id = weather.id;
    let sunr = weather.sys.sunrise;
    let suns = weather.sys.sunset;
    const getDate = WeatherDate.convertUTC(dt, sunr, suns);

    let r = weather.rain;
    let s = weather.snow;
    let c = weather.clouds;
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

    let r = weather.rain;
    let s = weather.snow;
    let precipitation = checkPrecip(r, s);

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

// Save city weather search
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
