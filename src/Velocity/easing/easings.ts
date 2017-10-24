/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {
	let generateBezier = Easing.generateBezier;

	export let Easings: {[name: string]: VelocityEasingFn} = {
		/* Basic (same as jQuery) easings. */
		"linear": function(percentComplete, startValue, endValue) {
			return startValue + percentComplete * (endValue - startValue);
		},
		"swing": function(percentComplete, startValue, endValue) {
			return startValue + (0.5 - Math.cos(percentComplete * Math.PI) / 2) * (endValue - startValue);
		},
		/* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
		"spring": function(percentComplete, startValue, endValue) {
			return startValue + (1 - (Math.cos(percentComplete * 4.5 * Math.PI) * Math.exp(-percentComplete * 6))) * (endValue - startValue);
		},
		/* Common names */
		"ease": generateBezier(0.25, 0.1, 0.25, 1.0),
		"easeIn": generateBezier(0.42, 0.0, 1.00, 1.0),
		"easeOut": generateBezier(0.00, 0.0, 0.58, 1.0),
		"easeInOut": generateBezier(0.42, 0.0, 0.58, 1.0),
		"easeInSine": generateBezier(0.47, 0, 0.745, 0.715),
		"easeOutSine": generateBezier(0.39, 0.575, 0.565, 1),
		"easeInOutSine": generateBezier(0.445, 0.05, 0.55, 0.95),
		"easeInQuad": generateBezier(0.55, 0.085, 0.68, 0.53),
		"easeOutQuad": generateBezier(0.25, 0.46, 0.45, 0.94),
		"easeInOutQuad": generateBezier(0.455, 0.03, 0.515, 0.955),
		"easeInCubic": generateBezier(0.55, 0.055, 0.675, 0.19),
		"easeOutCubic": generateBezier(0.215, 0.61, 0.355, 1),
		"easeInOutCubic": generateBezier(0.645, 0.045, 0.355, 1),
		"easeInQuart": generateBezier(0.895, 0.03, 0.685, 0.22),
		"easeOutQuart": generateBezier(0.165, 0.84, 0.44, 1),
		"easeInOutQuart": generateBezier(0.77, 0, 0.175, 1),
		"easeInQuint": generateBezier(0.755, 0.05, 0.855, 0.06),
		"easeOutQuint": generateBezier(0.23, 1, 0.32, 1),
		"easeInOutQuint": generateBezier(0.86, 0, 0.07, 1),
		"easeInExpo": generateBezier(0.95, 0.05, 0.795, 0.035),
		"easeOutExpo": generateBezier(0.19, 1, 0.22, 1),
		"easeInOutExpo": generateBezier(1, 0, 0, 1),
		"easeInCirc": generateBezier(0.6, 0.04, 0.98, 0.335),
		"easeOutCirc": generateBezier(0.075, 0.82, 0.165, 1),
		"easeInOutCirc": generateBezier(0.785, 0.135, 0.15, 0.86),
		/* Dashed names */
		"ease-in": generateBezier(0.42, 0.0, 1.00, 1.0),
		"ease-out": generateBezier(0.00, 0.0, 0.58, 1.0),
		"ease-in-out": generateBezier(0.42, 0.0, 0.58, 1.0),
		/* String based - these are special cases, so don't follow the number pattern */
		"at-start": Easing.atStart as any,
		"at-end": Easing.atEnd as any,
		"during": Easing.during as any
	};
};
