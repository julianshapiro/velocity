/* Determine the appropriate easing type given an easing input. */
function getEasing(value, duration) {
	var easing = value;

	/* The easing option can either be a string that references a pre-registered easing,
	 or it can be a two-/four-item array of integers to be converted into a bezier/spring function. */
	if (isString(value)) {
		/* Ensure that the easing has been assigned to jQuery's Velocity.Easings object. */
		if (!VelocityStatic.Easings[value]) {
			easing = false;
		}
	} else if (Array.isArray(value)) {
		if (value.length === 1) {
			easing = generateStep(value[0]);
		} else if (value.length === 2) {
			/* springRK4 must be passed the animation's duration. */
			/* Note: If the springRK4 array contains non-numbers, generateSpringRK4() returns an easing
			 function generated with default tension and friction values. */
			easing = generateSpringRK4.apply(null, value.concat([duration]));
		} else if (value.length === 4) {
			/* Note: If the bezier array contains non-numbers, generateBezier() returns false. */
			easing = generateBezier.apply(null, value);
		} else {
			easing = false;
		}
	} else {
		easing = false;
	}

	/* Revert to the Velocity-wide default easing type, or fall back to "swing" (which is also jQuery's default)
	 if the Velocity-wide default has been incorrectly modified. */
	if (easing === false) {
		if (VelocityStatic.Easings[VelocityStatic.defaults.easing]) {
			easing = VelocityStatic.defaults.easing;
		} else {
			easing = EASING_DEFAULT;
		}
	}

	return easing;
}
