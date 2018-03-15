/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 * 
 * Based on animate.css: https://github.com/daneden/animate.css
 */

namespace VelocityStatic.UI {
	Velocity("registerSequence", "zoomOut", {
		duration: 1000,
		"0%": {
			transform: "scale3d(1,1,1)"
		},
		"50%": {
			opacity: "1"
		},
		"100%": {
			opacity: "0",
			transform: "scale3d(0.3,0.3,0.3)"
		}
	});
};
