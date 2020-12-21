
// Thinking of how I can reuse the same properties for each render method.
const renderProps = {
    title: "Weather Basics",
    visible: isVisable,
    time: getDate.date,
    observation: cw.weather[0].main,
    typeOfPrecip: "rain",
    precip: precipitation,
    city: sq.city,
    state: sq.abbr.toUpperCase(),
    customName: sq.custom_name,
    // cityID: savedCity._id,
    temp: Math.round(cw.temp),
    humidity: cw.humidity,
    pressure: cw.pressure,
    visibility: Math.round(cw.visibility / 1000),
    windSpeed: Math.round(cw.wind_speed),
    windDir: cw.wind_deg,
    sunrise: getDate.sunrise,
    sunset: getDate.sunset,
    clouds: cw.clouds,
    icon: `http://openweathermap.org/img/wn/${cw.weather[0].icon}@2x.png`,
    main: cw.weather[0].main, // Basic description: "rain", "snow", etc.
    lat: city.coord.lat,
    lon: city.coord.lon
  }