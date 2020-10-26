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
    console.log("parsedReq: ",parsedReq);
    let cleanReq = parsedReq.filter(value => value !== '' );
    location.city = cleanReq[0];
    location.state = cleanReq[1];
}

/* GET home page. */
router.get('/', (req, res, next) => {

    res.render('weather/index', {
      title: 'Weather Basics'
    }); 
});

// Display current weather for a city
router.post('/weather', (req, res, next) => {
    // sanitize data.
    let str = req.body.city_state.toLowerCase();
    cleanUpData(str); 
    // console.log("location: ", location);   
    // render the data to the page.
    WeatherData.getWeather( location, apiResp => {
        const weather = apiResp.data;
        console.log("weather: ",weather);
        
        let dt = weather.dt;
        const timeOfWeatherReading = new Date( dt * 1000 );
        let options = { month: 'short', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric'};
        let date_time = timeOfWeatherReading.toLocaleTimeString("en-US", options);
        res.render('weather/current-weather', {
            title: "Weather Basics",
            time: date_time,
            observation: weather.weather[0].main,
            city: weather.name,
            state: weather.state,
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

});
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

router.get('/edit-city-list', (req, res, next) => {
    res.write('<body>');
    res.write('<h1>Edit City List</h1>')
    res.write('<ul>');
    res.write('<li>city card</li>');
    res.write('<li>Delete button</li>');
    res.write('<li>Edit Name button</li>');
    res.write('</ul>');
    res.write('</body>');
    res.end();
});




module.exports = router;
