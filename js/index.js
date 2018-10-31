$(document).ready(function() {

	if (window.addEventListener) {
    	// IE9, Chrome, Safari, Opera
    	window.addEventListener("mousewheel", MouseWheelHandler, false);
    	// Firefox
    	window.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	} else { // IE 6/7/8
		window.attachEvent("onmousewheel", MouseWheelHandler);
	}

});

function MouseWheelHandler() {
	$('#title').addClass('collapse-animation');

	setTimeout(function() {
		$('#intro').addClass('expanded');
	}, 600);
	return false;
}