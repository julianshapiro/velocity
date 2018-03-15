/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 * 
 * Based on animate.css: https://github.com/daneden/animate.css
 */

namespace VelocityStatic.UI {
	Velocity("registerSequence", "zoomOutLeft", {
		duration: 1000,
		"0%": {
			opacity: "1",
			transform: "scale(1) translate3d(0,0,0)",
			transformOrigin: "left center"
		},
		"40%": {
			opacity: "1",
			transform: "scale(0.475) translate3d(42px,0,0)"
		},
		"100%": {
			opacity: "0",
			transform: "scale(0.1) translate3d(-2000px,0,0)",
			transformOrigin: "left center"
		}
	});
};
