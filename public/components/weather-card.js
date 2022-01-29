
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
function convertUTC(dt, sunr=0, suns=0, offset, timezone) {
  const date_time = {
    date: '',
    sunrise: '',
    sunset: '',
  }
  const displayDate = new Date(dt * 1000);
  let dtOptions = {weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: timezone };
  date_time.date = displayDate.toLocaleString("en-US", dtOptions);

  const sunrise = new Date(sunr * 1000);
  let sunrOptions = { hour: 'numeric', minute: 'numeric', timeZone: timezone }
  date_time.sunrise = sunrise.toLocaleString("en-US", sunrOptions);

  const sunset = new Date(suns * 1000);
  let sunsOptions = { hour: 'numeric', minute: 'numeric', timeZone: timezone }
  date_time.sunset = sunset.toLocaleString("en-US", sunsOptions);
  return date_time;
}

const scroll = document.createElement('div');
scroll.classList.add('scroll');

const template = document.createElement("template")
template.innerHTML = `
	<div class="container">
		<div class="weather-card">
      <p class="time-of-day"></p>
      <div class="weather-img">
        <img src="" alt="" width="60px" height="60px">
      </div>
        <p class="high-low"></p>
      </div>
			</div>
		</div>
	</div>
`;

class WeatherCard extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          background-color: gray;
          width: 135px;
        }
        .scroll {
            overflow: auto;
            white-space: nowrap;
        }
        .scroll .container {
            display: inline-block;
        }
        .weather-card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        p {
          display: block;
          margin-block-start: .5em;
          margin-block-end: .5em;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
        }
      </style>
    `;

    window.addEventListener('load', () => {
      let jsonStr = this.getAttribute('data-weather');
      let forecast = JSON.parse(jsonStr);
      const tz = forecast.timezone;
      const offset = forecast.timezone_offset;
      const dt = forecast.current.dt;
      let today = new Date();
      const hours = today.getUTCHours();

      // Function that formats the Card based on inputs for day or night forecast data
      function formatCard(day, dateObj, dayOfWk, temp, temp_text) {
        let url = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        let card = template.content.cloneNode(true);

        card.querySelector('.time-of-day').innerText = dayOfWk;
        card.querySelector('.high-low').innerText = `${temp_text} ${Math.round(temp)}° F`;
        card.querySelector('img').setAttribute('src', url);
        scroll.appendChild(card);
        
      }

      forecast.daily.forEach((day, i) => {
        let dateObj = checkTimeOfDay(day, tz, offset);
        let dayOfWk = dateObj.date.split(', ');
        let temp_text, temp, dotw;
        if (i === 0) {
          if(hours < "21") {
            dotw = 'Today';
            temp = day.temp.max;
            temp_text = "High";
            formatCard(day, dateObj, dotw, temp, temp_text)
          }
          if(hours) {
            dotw = 'Tonight';
            temp = day.temp.night;
            temp_text = "Low";
            formatCard(day, dateObj, dotw, temp, temp_text)
          }
        }

        else if (i > 0) {
          dotw = dayOfWk[0];
          temp = day.temp.max;
          temp_text = "High";
          formatCard(day, dateObj, dotw, temp, temp_text)

          dotw = `${dayOfWk[0]} Night`;
          temp = day.temp.night;
          temp_text = "Low";
          formatCard(day, dateObj, dotw, temp, temp_text)
        }
      })
      this.shadowRoot.appendChild(scroll);
    })
  }
}

customElements.define('weather-card', WeatherCard);

// export default WeatherCard;