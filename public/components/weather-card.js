
// import { WeatherDate } from '../../models/WeatherDate';

function checkTimeOfDay(day, tz, offset) {
  const dt = day.dt;
  const sr = '';
  const ss = '';
  const date = convertUTC(dt, sr, ss, offset, tz);
  return date;
}

// This is temporary until I can convert my file system to imports
// Then I should be able to import this function from models on the client side.
function convertUTC(dt, sunr, suns, offset, timezone) {
  const date_time = {
    date: '',
    sunrise: '',
    sunset: '',
  }
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

const template = document.createElement("template")
template.innerHTML = `
	<div class="container">
		<div class="weather-card">
			<div>
				<p class="time-of-day">Afternoon</p>
				<div class="weather-img">
					<img src="" alt="">
				</div>
				<div>
					<p class="high-low">High: 39° F</p>
				</div>
			</div>
		</div>
	</div>
`

class WeatherCard extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' })

    window.addEventListener('load', () => {
      let jsonStr = this.getAttribute('data-weather');
      let forecast = JSON.parse(jsonStr);
      const tz = forecast.timezone;
      const offset = forecast.timezone_offset;

      // Function that formats the Card based on inputs for day or night forecast data
      function formatCard(day, dateObj, dayOfWk, temp, temp_text) {
        console.log(`day: ${day}`)
        let url = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        let card = template.content.cloneNode(true);

        card.querySelector('.time-of-day').innerText = dayOfWk;
        card.querySelector('.high-low').innerText = `${temp_text} ${Math.round(temp)}° F`;
        card.querySelector('img').setAttribute('src', url);
        return card;
      }
      // console.log(forecast.daily)
      forecast.daily.forEach((day, i) => {
        let dateObj = checkTimeOfDay(day, tz, offset);
        let dayOfWk = dateObj.date.split(', ');
        let temp_text, temp, dotw;

        if (i === 0) {
          dotw = 'Today';
          temp = day.temp.max;
          temp_text = "High";
          let card = formatCard(day, dateObj, dotw, temp, temp_text)
          this.shadowRoot.appendChild(card);

          dotw = 'Tonight';
          temp = day.temp.night;
          temp_text = "Low";
          card = formatCard(day, dateObj, dotw, temp, temp_text)
          this.shadowRoot.appendChild(card);
        }

        else if (i > 0) {
          dotw = dayOfWk[0];
          temp = day.temp.max;
          temp_text = "High";
          let card = formatCard(day, dateObj, dotw, temp, temp_text)
          this.shadowRoot.appendChild(card);

          dotw = `${dayOfWk[0]} Night`;
          temp = day.temp.night;
          temp_text = "Low";
          card = formatCard(day, dateObj, dotw, temp, temp_text)
          this.shadowRoot.appendChild(card);
        }
      })
      
    })
  }
}

customElements.define('weather-card', WeatherCard);

// export default WeatherCard;