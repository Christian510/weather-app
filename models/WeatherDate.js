
const date_time = {
  date: '',
  sunrise: '',
  sunset: '',
}

module.exports = class WeatherDate {
  static convertUTC(dt, sunr, suns, offset) {
    console.log(dt);
    const displayDate = new Date(dt * 1000);
    let dtOptions = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    date_time.date = displayDate.toLocaleTimeString("en-US", dtOptions);

    const sunrise = new Date(sunr * 1000);
    let sunrOptions = { hour: 'numeric', minute: 'numeric' }
    date_time.sunrise = sunrise.toLocaleTimeString("en-US", sunrOptions);

    const sunset = new Date(suns * 1000);
    let sunsOptions = { hour: 'numeric', minute: 'numeric' }
    date_time.sunset = sunset.toLocaleTimeString("en-US", sunsOptions);
    return date_time;
  }
}

