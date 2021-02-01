
const date_time = {
  date: '',
  sunrise: '',
  sunset: '',
}

module.exports = class WeatherDate {
  static convertUTC(dt, sunr, suns, offset, timezone) {
    const displayDate = new Date(dt * 1000);
    let dtOptions = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: timezone};
    date_time.date = displayDate.toLocaleString("en-US", dtOptions);

    const sunrise = new Date(sunr * 1000);
    let sunrOptions = { hour: 'numeric', minute: 'numeric', timeZone: timezone }
    date_time.sunrise = sunrise.toLocaleString("en-US", sunrOptions);

    const sunset = new Date(suns * 1000);
    let sunsOptions = { hour: 'numeric', minute: 'numeric', timeZone: timezone }
    date_time.sunset = sunset.toLocaleString("en-US", sunsOptions);
    return date_time;
  }
}

