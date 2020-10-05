var express = require('express');
var router = express.Router();
var weatherController = require('../controllers/weather')

/* GET home page. */

router.get('/city', weatherController.getWeatherByCity);

router.post('/city', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
})
// route to display weather.

// route to save favorite cities.


module.exports = router;
