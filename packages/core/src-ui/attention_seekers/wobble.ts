/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "wobble", {
	"duration": 1000,
	"0%": {
		transform: "translate3d(0,0,0) rotate3d(0,0,0,0)",
	},
	"15%": {
		transform: "translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)",
	},
	"30%": {
		transform: "translate3d(20%,0,0) rotate3d(0,0,1,3deg)",
	},
	"45%": {
		transform: "translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)",
	},
	"60%": {
		transform: "translate3d(10%,0,0) rotate3d(0,0,1,2deg)",
	},
	"75%": {
		transform: "translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)",
	},
	"100%": {
		transform: "translate3d(0,0,0) rotate3d(0,0,0,0)",
	},
});
