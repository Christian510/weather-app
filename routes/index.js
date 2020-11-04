var express = require('express');
var router = express.Router();
var weatherController = require('../controllers/weather');


/* GET home page. */
router.get('/', weatherController.getIndex);

// DISPLAY WEATHER BY CITY NAME
router.post('/weather', weatherController.postWeatherByName);

// DISPLAY WEATHER BY CITY ID
router.get('/weather/:cityID', weatherController.getSavedWeatherById);

router.get('/5-day-forecast', (req, res, next) => {
    res.write('<body>');
    res.write('<h1>5 Day Forecast</h1>')
    res.write('<ul>');
    res.write('<li>5-day forecast card</li>');
    res.write('<li>forecast details</li>');
    res.write('<li></li>');
    res.write('</ul>');
    res.write('</body>');
    res.end();
});

router.post("/save-weather", weatherController.saveWeather);

module.exports = router;
