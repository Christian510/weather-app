var express = require('express');
var router = express.Router();
var weatherController = require('../controllers/weather');
const WeatherData = require('../models/WeatherData');


const location = {
    city: '',
    state: '',
};

function cleanUpData(str){

    // if(req.body !=)
    let parsedReq = str.split(", ");
    // console.log("parsedReq: ",parsedReq);
    let cleanReq = parsedReq.filter(value => value !== '' );
    location.city = cleanReq[0];
    location.state = cleanReq[1];
}

/* GET home page. */
router.get('/', (req, res, next) => {

    res.render('weather/index', {
      title: 'Weather Me Now'
    }); 
});

// Display current weather for a city
router.post('/weather', (req, res, next) => {
    // sanitize data.
    let str = req.body.city_state.toLowerCase();
    cleanUpData(str);    
    // render the data to the page.
    WeatherData.getWeather( location, apiResp => {
        const weather = apiResp.data;
        // console.log("weather: ",weather);
        
        let dt = weather.dt;
        const timeOfWeatherReading = new Date(dt * 1000);
        let options = { month: 'short', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric', timeZoneName: 'short'};
        let time = timeOfWeatherReading.toLocaleTimeString("en-US", options);
        console.log(time);
        let date_time = `Current conditions for ${time}`;
        // console.log(date_time);
        res.render('weather/current-weather', {
            title: "Weather Me Now",
            time: date_time,
            city: weather.name,
            state: weather.state,
            temp: weather.main.temp,
            windSpeed: weather.wind.speed, 
            icon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
            date: 'date of weather reading',
        });
    });

});

// route to save favorite cities.


module.exports = router;
