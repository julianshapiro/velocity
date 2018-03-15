/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 * 
 * Based on animate.css: https://github.com/daneden/animate.css
 */

namespace VelocityStatic.UI {
	Velocity("registerSequence", "bounceOutUp", {
		duration: 1000,
		"0%": {
			opacity: "1",
			transform: "translate3d(0,0,0)"
		},
		"20%": {
			transform: "translate3d(0,-10px,0)"
		},
		"40%,45%": {
			opacity: "1",
			transform: "translate3d(0,20px,0)"
		},
		"100%": {
			opacity: "0",
			transform: "translate3d(0,-2000px,0)"
		}
	});
};
