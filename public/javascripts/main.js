// import { WeatherDate } from '../../models/WeatherDate.js';

const e = require("express");

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

function scrollList(e) {
	if (e.targetTouch === 1) {
		console.log('scolling started')
	}
}
window.addEventListener('DOMContentLoaded', function() {
  const elm = document.querySelector('body');
  elm.addEventListener('touchmove', function(e) {
		e.preventDefault();
		console.dir(`Outside scrollable area: ${e.touches}`);
	}, {passive: false});

	const scroll = document.querySelector('.scrollable-list');
	e.preventDefault();
	scroll.addEventListener('touchstart', function(e) {
		console.dir(`Inside scrollable area: ${e}`);
		// if(e.target)
	})
	scroll.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);
	scroll.addEventListener('touchend', function(e) {
		e.preventDefault();
	}, false);

  
})

  // const scroll = document.querySelector('#scroll');
  // scroll.addEventListener('scroll', function(e) {
  //   console.log(window.scrollY);
  // });
  // https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

// 1. Write a function that deletes an item and updates the list pull in WeatherData and use it to make the changes to the db Then update the list //

// 2. Write a function that activeates a modal to warn user of incomplete search.  Search requires a valid city and state //