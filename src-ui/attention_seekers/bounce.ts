/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "bounce", {
	"duration": 1000,
	"0,100%": {
		transformOrigin: "center bottom",
	},
	"0%,20%,53%,80%,100%": {
		transform: ["translate3d(0,0px,0)", "easeOutCubic"],
	},
	"40%,43%": {
		transform: ["translate3d(0,-30px,0)", "easeInQuint"],
	},
	"70%": {
		transform: ["translate3d(0,-15px,0)", "easeInQuint"],
	},
	"90%": {
		transform: "translate3d(0,-4px,0)",
	},
});
