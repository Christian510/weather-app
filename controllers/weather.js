const WeatherData = require('../models/WeatherData');

const location = {
  city: '',
  state: '',
};

function cleanUpData(str){
  let parsedReq = str.split(", ");
  console.log("parsedReq: ",parsedReq);
  let cleanReq = parsedReq.filter(value => value !== '' );
  location.city = cleanReq[0];
  location.state = cleanReq[1];
}

exports.getIndex = (req, res, next) => {
  WeatherData.getSavedLocations(locations => {
    console.log("getIndex: ",locations);

    res.render('weather/index', {
      title: 'Basic Weather',
      searches: locations,
      });
  });
}

// DISPLAY WEATHER BY CITY NAME AND STATE
exports.postWeatherByName = (req, res, next) => {
  // console.log(req.body);
  // sanitize data.
  let str = req.body.city_state.toLowerCase();
  cleanUpData(str); 
  // console.log("location: ", location);   
  // render the data to the page.
  WeatherData.getWeatherByName( location, apiResp => {
      const weather = apiResp.data;
      console.log("weather: ",weather);
      
      let dt = weather.dt;
      const timeOfWeatherReading = new Date( dt * 1000 );
      let options = { month: 'short', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric'};
      let date_time = timeOfWeatherReading.toLocaleTimeString("en-US", options);
      res.render('weather/current-weather', {
          title: "Weather Basics",
          visibility: "visible",
          time: date_time,
          observation: weather.weather[0].main,
          city: weather.name,
          cityID: weather.id,
          state: location.state,
          temp: Math.round(weather.main.temp),
          humidity: weather.main.humidity,
          pressure: weather.main.pressure,
          windSpeed: Math.round(weather.wind.speed),
          windDir: weather.wind.deg,
          sunrise: weather.sys.sunrise,
          sunset: weather.sys.sunset,
          clouds: weather.clouds.all,
          icon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
          main: weather.weather[0].main, // Basic description of weather, i.e.; rain, snow, clouds, etc.
          rain: weather.rain,
          snow: weather.snow,
      });
  });
};

// DISPLAY WEATHER BY CITY ID
exports.postWeatherById = (req, res, next) => {
  console.log("postWeatherById: ",req.body.city_id); 
  const id = req.body.id;

  WeatherData.getWeatherById( id, apiResp => {
      const weather = apiResp.data;
      console.log("getWeatherById: ", id);
      console.log("weather: ",weather);
      
      let dt = weather.dt;
      const timeOfWeatherReading = new Date( dt * 1000 );
      let options = { month: 'short', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric'};
      let date_time = timeOfWeatherReading.toLocaleTimeString("en-US", options);
      res.render('weather/current-weather', {
          visibility: 'invisible', 
          title: "Weather Basics",
          time: date_time,
          observation: weather.weather[0].main,
          city: weather.name,
          cityID: weather.id,
          state: location.state,
          temp: Math.round(weather.main.temp),
          humidity: weather.main.humidity,
          pressure: weather.main.pressure,
          windSpeed: Math.round(weather.wind.speed),
          windDir: weather.wind.deg,
          sunrise: weather.sys.sunrise,
          sunset: weather.sys.sunset,
          clouds: weather.clouds.all,
          icon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
          main: weather.weather[0].main, // Basic description of weather, i.e.; rain, snow, clouds, etc.
          rain: weather.rain,
          snow: weather.snow,
      });
  });
};

// Save city weather search
exports.saveWeather = (req, res, next) => {
  console.log("SaveWeather: req.body",req.body);
  let {city, state, id} = req.body;

  savedSearch = new WeatherData(city, id, state);
  savedSearch.save();
  res.redirect('/');
}
