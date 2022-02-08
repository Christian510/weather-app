
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
	window.removeEventListener('gesturechange', preventDefault);
	
	window.addEventListener('touchmove', preventDefault, {passive: false});
	window.removeEventListener('touchmove', preventDefault);

	let scrollableArea = document.querySelector('.scrollable-area');
	console.log(`scrollTop: ${scrollableArea.scrollTop} | scrollHeight: ${scrollableArea.scrollHeight} | offsetHeight: ${scrollableArea.offsetHeight}`);

	scrollableArea.addEventListener('touchstart', function() {
		if (this.scrollTop <= 0) {
			this.scrollTo(0, 1);
			return
		}
		if (this.scrollTop + this.offsetHeight >= this.scrollHeight) {
			this.scrollTo(0, this.scrollHeight - this.offsetHeight - 1);
		}
	})
  
})

	
	/* Dev Notes:
	1. use touch events that allows for scrolling on pages with scrollable content.  But, prevents the how body of the page on ios from being dragged around.
	* I believe this has to be associated with the css and how the css moves div assocaited with the scrollable content.
		resrouces:
		https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi
	*/