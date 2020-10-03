let WeatherData = require('../models/WeatherData');

exports.getWeather = (req, res, next) => {
  // use these values to set the city and state for the weather url
  const city = req.query.city_field;
  const state = req.query.state_field;
  console.log("input city: ", city);
  console.log("input state: ", state);


  // pass title a value to display an image next to title.
  WeatherData.getWeather(city, state, function(data){
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

}
