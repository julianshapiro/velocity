/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "headShake", {
	"duration": 1000,
	"easing": "easeInOut",
	"0%": {
		transform: "translateX(0) rotateY(0)",
	},
	"6.5%": {
		transform: "translateX(-6px) rotateY(-9deg)",
	},
	"18.5%": {
		transform: "translateX(5px) rotateY(7deg)",
	},
	"31.5%": {
		transform: "translateX(-3px) rotateY(-5deg)",
	},
	"43.5%": {
		transform: "translateX(2px) rotateY(3deg)",
	},
	"50%": {
		transform: "translateX(0) rotateY(0)",
	},
});
