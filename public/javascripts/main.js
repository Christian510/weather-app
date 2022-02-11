
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
window.addEventListener('DOMContentLoaded', function() {
	const preventDefault = e => { e.preventDefault() }
	const consoleFunc = e => { console.log(e.touches)};
	const container = document.querySelector('.scrollable-area')

	let elm = document.querySelector('.scrollable-area');
	console.log("scroll height: ", elm.scrollHeight);

	window.addEventListener('gesturechange', preventDefault, {passive: false});
	// window.addEventListener('touchstart', touchStart, {passive: false})
	// window.addEventListener('touchmove', preventDefault, {passive: false});
	// window.addEventListener('touchstart', scrollArea, {passive: false})
  
	container.addEventListener('touchstart', touchStart, {passive: false});
	container.addEventListener('touchmove', touchmove, {passive: false});
	container.addEventListener('touchend', touchEnd, {passive: false});

	let scrolling = false;
	let curY = null;
	let offSet = container.offsetHeight

	function touchStart(e) {
		if (e.targetTouches.length === 1) {
			console.log`touches: ${e.touches} | offsetHeight: ${offSet}`;
			curY = e.touches[0].pageY;
			console.log(`start point: ${curY}`)
			scrolling = true;
		}
	}

	function touchmove(e) {
		if (e.targetTouches.length === 1) {
			console.log`${e.touches}`;
			for (var i=0; i < e.changedTouches.length; i++) {
				let scrolling = e.changedTouches[i].clientY;
				console.log(`scrolling: ${scrolling}`);
				container.style.transform = `translateY(${scrolling}px)`;
			}
		}
	}

	function touchEnd(e) {
		console.log(e.targetTouches);
	}
	
	function scrollArea(e) {
		let listHeight = container.firstElementChild.offsetHeight
		// console.log("scrollHeight: ", container.scrollHeight)
		// console.log(container.offsetHeight)
		// console.log(e.touches)
		// console.log(container.firstElementChild.offsetHeight)
		// console.log(window.visualViewport)
		// console.log(`list hight: ${listHeight} | ${e.touches[0].clientY} | ${e.changedTouches[0]}`);
		for (var i=0; i < e.changedTouches.length; i++) {
			console.log("changedTouches[" + i + "].clientY = " + e.changedTouches[i].clientY);
		}
	}
	
})
if (window.location.pathname !== '/') {
	window.removeEventListener('gesturechange', preventDefault);
	window.removeEventListener('touchmove', preventDefault);
}

	
	/* Dev Notes:
	1. use touch events that allows for scrolling on pages with scrollable content.  But, prevents the how body of the page on ios from being dragged around.
	* I believe this has to be associated with the css and how the css moves div assocaited with the scrollable content.
		resrouces:
		https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi
	*/