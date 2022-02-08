
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

window.addEventListener('DOMContentLoaded', function() {
	let body = document.querySelector('body');
	let scrolling = document.querySelector('.scrolling');
	console.log(scrolling);
	let yValue = null,
	scollStart = false;
	
	// Obviously this will disable touchmove on all pages;
	body.addEventListener('gesturechange', function(e) {
		e.preventDefault();
	}, {passive: false});

	body.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, {passive: false})

  scrolling.addEventListener('touchstart', function(e) {
		// e.preventDefault();
		if (e.targetTouches.length === 1) {
			yValue = e.targetTouches[0].clientY;
			// console.log(`Y value: ${e.targetTouches.length}`);
			console.log(`Y value: ${yValue}`);
			// console.log(`scrollTop: ${body.scrollTop}`);
		}
		// console.dir(`Outside scrollable area: ${e.targetTouches[0]}`);
	}, {passive: false});

	scrolling.addEventListener('touchmove', function(e) {
		// console.log(`is 1? ${e.targetTouches.length}`)
		if(e.targetTouches.length === 1) {
			console.log(`touchmove started: ${e.targetTouches}`)
		}
	}, {passive: false});

		scrolling.addEventListener('touchend', function(){
			console.log(`touch ended: ${e.targetTouches}`)
		}, {passive: false});



	// function disableRubberBand(e) {
	// 	let stop = e.targetTouches[0].clientY - yValue;
	// 	console.log(`stop: ${stop}`);
	// 	if (scroll.scrollTop === 0 && stop > 0) {
	// 		e.preventDefault();
	// 	}
	// }

  
})

	
	/* Dev Notes:
	1. use touch events that allows for scrolling on pages with scrollable content.  But, prevents the how body of the page on ios from being dragged around.
	* I believe this has to be associated with the css and how the css moves div assocaited with the scrollable content.
		resrouces:
		https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi
	*/