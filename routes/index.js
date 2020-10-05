var express = require('express');
var router = express.Router();
var weatherController = require('../controllers/weather')

/* GET home page. */

router.get('/', weatherController.getWeather);

// route to display weather.

// route to save favorite cities.


module.exports = router;
