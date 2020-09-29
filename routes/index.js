var express = require('express');
var router = express.Router();
let WeatherData = require('../models/WeatherData');

/* GET home page. */
// router.get('/', getWeatherData);
router.get('/', function (req, res, next) {
  // use these values to set the city and state for the weather url
  const city = req.query.city_field;
  const state = req.query.state_field;

  // console.log("input city: ",city);
  // console.log("input state: ",state);

  WeatherData.setLocation(city, state);

  // WeatherData.locateCityState(cityData => {

  // });

  WeatherData.fetchData(data => {
    // const dateObj = new Date(data.dt);
    // const dateFormat = dateObj.toLocaleString("en-US", {timeZoneName: "short"});
    res.render('index', {
      title: 'Weather Me Now',
      city: data.data.name,
      state: 'ID',
      temp: data.data.main.temp,
      windSpeed: data.data.wind.speed, 
      icon: `http://openweathermap.org/img/wn/${data.data.weather[0].icon}@2x.png`,
      date: data.headers.date,
    });
  });

});

module.exports = router;
