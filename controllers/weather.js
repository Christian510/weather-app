let WeatherData = require('../models/WeatherData');

exports.getIndex = (req, res, next) => {

  res.render('weather/index', {
    title: 'Weather Me Now'
  });

  // WeatherData.getWeather(function(){
  //   res.render('index', {
  //     title: 'Weather Me Now',
  //   });
  // });
}

// Get weather by using Latitude and Longitude
// exports.getWeatherByLatLon = (req, res, next) => {}
