/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 * 
 * Determine the appropriate easing type given an easing input.
 */

namespace VelocityStatic {
	export function getEasing(value: any, duration: number): VelocityEasing {
		let easing = value;

		/* The easing option can either be a string that references a pre-registered easing,
		 or it can be a two-/four-item array of integers to be converted into a bezier/spring function. */
		if (isString(value)) {
			/* Ensure that the easing has been assigned to the Velocity.Easings object. */
			easing = Easings[value] || false;
		} else if (Array.isArray(value)) {
			if (value.length === 1) {
				easing = Easing.generateStep(value[0]);
			} else if (value.length === 2) {
				/* springRK4 must be passed the animation's duration. */
				/* Note: If the springRK4 array contains non-numbers, generateSpringRK4() returns an easing
				 function generated with default tension and friction values. */
				easing = Easing.generateSpringRK4(value[0], value[1], duration);
			} else if (value.length === 4) {
				/* Note: If the bezier array contains non-numbers, generateBezier() returns undefined. */
				easing = Easing.generateBezier.apply(null, value) || false;
			} else {
				easing = false;
			}
		} else {
			easing = false;
		}

		/* Revert to the Velocity-wide default easing type, or fall back to "swing"
		 if the Velocity-wide default has been incorrectly modified. */
		if (easing === false) {
			easing = Easings[defaults.easing] || Easings[EASING_DEFAULT];
		}
		return easing;
	}
};
