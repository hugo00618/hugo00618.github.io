$(document).ready(function() {
	// IE9, Chrome, Safari, Opera
	window.addEventListener('mousewheel', collapseTitle, false);
	// Firefox
	window.addEventListener('DOMMouseScroll', collapseTitle, false);

	window.addEventListener('click', collapseTitle);
	window.addEventListener('touchstart', collapseTitle);  	
});

function collapseTitle() {
	$('#title').addClass('collapse-animation');

	setTimeout(function() {
		$('#intro').addClass('expanded');
	}, 600);
	return false;
}