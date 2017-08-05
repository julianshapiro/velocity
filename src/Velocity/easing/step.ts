/* Step easing generator. */
function generateStep(steps) {
	return function(p) {
		return Math.round(p * steps) * (1 / steps);
	};
}
