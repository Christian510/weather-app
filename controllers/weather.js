


exports.getWeather =  (req, res, next) => {
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
}
