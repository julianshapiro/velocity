/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "bounceInDown", {
	"duration": 1000,
	"0%": {
		opacity: "0",
		transform: "translate3d(0,-3000px,0)",
	},
	"60%": {
		opacity: "1",
		transform: ["translate3d(0,25px,0)", "easeOutCubic"],
	},
	"75%": {
		transform: ["translate3d(0,-10px,0)", "easeOutCubic"],
	},
	"90%": {
		transform: ["translate3d(0,5px,0)", "easeOutCubic"],
	},
	"100%": {
		transform: ["translate3d(0,0,0)", "easeOutCubic"],
	},
});
