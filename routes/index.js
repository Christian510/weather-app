var express = require('express');
var router = express.Router();
var weatherController = require('../controllers/weather');
const WeatherData = require('../models/WeatherData');

/* GET home page. */
router.get('/', (req, res, next) => {

    res.render('weather/index', {
      title: 'Weather Me Now'
    }); 
});

// Display current weather for a city
router.post('/weather', (req, res, next) => {
    console.log("req.body: ",req.body);
    // 1. pass req.body to WeatherData
    // 2. sanitize data.
    // 3. split string into city and state vars
    // 4. find matching city in json data and return it's id.
    // 5. render the data to the page.

    res.render('weather/current-weather', {
        title: "Weather Me Now",
        city: 'City',
        state: 'State',
        temp: 'Temperature',
        windSpeed: 'Windspeed', 
        // icon: `http://openweathermap.org/img/wn/${data.data.weather[0].icon}@2x.png`,
        icon: 'weather image goes here',
        date: 'date of weather reading',
    });
});

// route to save favorite cities.


module.exports = router;
