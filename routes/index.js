var express = require('express');
var router = express.Router();
var weatherController = require('../controllers/weather');


/* GET home page. */
router.get('/', weatherController.getIndex);

// DISPLAY WEATHER BY CITY NAME
router.post('/weather', weatherController.postWeatherByName);

// GET SAVED WEATHER BY CITY ID
router.get('/weather', weatherController.getSavedWeatherById);

// DISPLAY 5 DAY WEATHER FORECAST
router.get('/weather/5-day-forecast', weatherController.getFiveDayWeather);

// DISPLAY HOURLY WEATHER FORECAST
router.get('/weather/hourly', weatherController.getHourlyWeather);

// SEARCH FOR WEATHER BY MAP
router.get('/weather/map', weatherController.getMap);

// SAVE TO YOUR FAVORITES
router.post("/save-weather", weatherController.saveWeather);
// router.put("/save-weather", weatherController.saveWeather);
router.get('/weather/about', weatherController.getAboutPage)

module.exports = router;
