
const date_time = {
  date: '',
  sunrise: '',
  sunset: '',
}

module.exports = class WeatherDate {
  static convertUTC(dt, sunr, suns, offset) {
    console.log(dt);
    const displayDate = new Date(dt);
    let dtOptions = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC'};
    date_time.date = displayDate.toLocaleString("en-US", dtOptions);

    const sunrise = new Date(sunr);
    let sunrOptions = { hour: 'numeric', minute: 'numeric', timeZone: 'UTC' }
    date_time.sunrise = sunrise.toLocaleString("en-US", sunrOptions);

    const sunset = new Date(suns);
    let sunsOptions = { hour: 'numeric', minute: 'numeric' }
    date_time.sunset = sunset.toLocaleString("en-US", sunsOptions);
    return date_time;
  }
}

