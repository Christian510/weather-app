
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
	const preventDefault = e => { e.preventDefault() }

	window.addEventListener('gesturechange', function(e) {
		e.preventDefault();
		console.log('touch gestures prevented.')
	}, {passive: false});

	function preventTouchMoveOnBody() {
		window.addEventListener('touchmove', function(e) {
			e.preventDefault();
		}, {passive: false});
	}
	
	let scrollableArea = document.querySelector('.scrollable-area');
	// console.log(`scrollTop: ${scrollableArea.scrollTop} | scrollHeight: ${scrollableArea.scrollHeight} | offsetHeight: ${scrollableArea.offsetHeight}`);
	
	let header = document.querySelector('.header');
	let list = document.querySelector('.scrollable-area')

	header.addEventListener('touchmove', preventTouchMoveOnBody);
	list.addEventListener('touchmove', preventTouchMoveOnBody);
  
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