
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

// ----- TOUCH EVENTS ------ //
// window.addEventListener('DOMContentLoaded', function() {
// 	const preventDefault = e => { e.preventDefault() }
// 	const consoleFunc = e => { console.log(e.touches)};
// 	let container = document.querySelector('.js-list-container');
// 	let ul = document.querySelector('.js-ul-list');

// 	window.addEventListener('gesturechange', preventDefault, {passive: false});
// 	window.addEventListener('touchmove', preventDefault, {passive: false});
  
// 	container.addEventListener('touchstart', touchStart, {passive: false});
// 	container.addEventListener('touchmove', touchmove, {passive: false});
// 	container.addEventListener('touchend', touchEnd, {passive: false});

// 	let isScrolling = false;
// 	let curY = null;
// 	let curX = null;
// 	let offset = null;
// 	let scrollHeight = container.scrollHeight
// 	let scrollStart = null;
// 	let scrollTop = container.scrollTop;
// 	let scrollArea = container.scrollHeight - container.scrollTop === container.clientHeight
	// function touchStart(e) {
	// 	// Set values based on whether scrolling has started or not
	// 	// if scrolling has started and a new touch is started then 
	// 	// begin scrolling from that position.
	// 	if (e.targetTouches.length === 1) {
	// 		console.log(`scroll Height: ${container.scrollHeight} | scrollTop: ${container.scrollTop} | clientHeight: ${container.clientHeight}`)
	// 		console.log(`scroll area: ${scrollArea}`);
	// 		isScrolling = true;
	// 		if(curY == null) {
	// 			curY = e.touches[0].pageY;
	// 			curX = e.touches[0].pageX;
	// 		}

	// 		offset = curY - scrollHeight;
	// 		scrollStart = curY + offset;
	// 		// console.log`touches: ${e.touches} | offsetHeight: ${offset}`;
	// 		// console.log(`start point: ${curY}`)
	// 	}
	// 	console.log(`curY: ${curY}`)
	// 	console.log(`offset = curY - scrollHeight: ${offset}`)
	// 	console.log(`scrollStart = curY + offset: ${scrollStart}`);
	// 	console.log(`scrollHeight: ${scrollHeight}`)
	// }

	// function touchmove(e) {
	// 	if (e.targetTouches.length === 1 && isScrolling) {
	// 		for (var i=0; i < e.changedTouches.length; i++) {
	// 			console.log(`last li in view? ${ul.lastElementChild.scrollIntoView(true)}`);
	// 			scrolling = e.changedTouches[i].clientY - curY;
	// 			// disableSwipe = e.changedTouches[i].clientX - curY
	// 			console.log(`scrolling: ${scrolling}`);
	// 			console.log`clientX: ${e.changedTouches[i].clientX}`;
	// 			if (scrolling > 0) {
	// 				// return;
	// 				e.preventDefault();
	// 				curY = e.changedTouches[i].clientY;
	// 			} else {
	// 				console.log(`scrolling: ${scrolling}`);
	// 				container.style.transform = `translateY(${scrolling}px)`;
	// 			}
	// 		}
	// 	}
	// }

	// function touchEnd(e) {
	// 	console.log('touch ended.');
	// 	console.log(e.targetTouches);
	// }
	
// })
// if (window.location.pathname !== '/') {
// 	window.removeEventListener('gesturechange', preventDefault);
// 	window.removeEventListener('touchmove', preventDefault);
// }

	
	/* Dev Notes:
	1. use touch events that allows for scrolling on pages with scrollable content.  But, prevents the how body of the page on ios from being dragged around.
	* I believe this has to be associated with the css and how the css moves div assocaited with the scrollable content.
		resrouces:
		https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi
	*/