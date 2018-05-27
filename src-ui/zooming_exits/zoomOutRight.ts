/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "zoomOutRight", {
	"duration": 1000,
	"0%": {
		opacity: "1",
		transform: "scale(1) translate3d(0,0,0)",
		transformOrigin: "right center",
	},
	"40%": {
		opacity: "1",
		transform: "scale(0.475) translate3d(-42px, 0, 0)",
	},
	"100%": {
		opacity: "0",
		transform: "scale(0.1) translate3d(2000px, 0, 0)",
		transformOrigin: "right center",
	},
});
