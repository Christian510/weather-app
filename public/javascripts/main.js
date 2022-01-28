// import { WeatherDate } from '../../models/WeatherDate.js';
import '../components/weather-card';

function isEmpty() {
    let input;
    input = document.getElementById("city_state").value;
    // console.log(input);
    if (input == "") {
        alert("Enter a City, State and/or Country");
        return false;
    }
}

function savedMsg(e) {
    let input;
    input = document.getElementById("save-btn").innerHTML = "Saved!";
    if(input == "Saved") {
        let visibility;
        visibility = document.getElementsByClassName("visible");
        visibility.className = "invisible";
        console.log(e);
        e.preventDefault();
    }   
}

// function convertUTC(dt, sunr, suns, offset, timezone) {
//     const displayDate = new Date(dt * 1000);
//     let dtOptions = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: timezone};
//     date_time.date = displayDate.toLocaleString("en-US", dtOptions);

//     const sunrise = new Date(sunr * 1000);
//     let sunrOptions = { hour: 'numeric', minute: 'numeric', timeZone: timezone }
//     date_time.sunrise = sunrise.toLocaleString("en-US", sunrOptions);

//     const sunset = new Date(suns * 1000);
//     let sunsOptions = { hour: 'numeric', minute: 'numeric', timeZone: timezone }
//     date_time.sunset = sunset.toLocaleString("en-US", sunsOptions);
//     return date_time;
//   }


// 1. Write a function that deletes an item and updates the list pull in WeatherData and use it to make the changes to the db Then update the list //

// 2. Write a function that activeates a modal to warn user of incomplete search.  Search requires a valid city and state //