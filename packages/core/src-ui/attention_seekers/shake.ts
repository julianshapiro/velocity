/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "shake", {
	"duration": 1000,
	"0%,100%": {
		transform: "translate3d(0,0,0)",
	},
	"10%,30%,50%,70%,90%": {
		transform: "translate3d(-10px,0,0)",
	},
	"20%,40%,60%,80%": {
		transform: "translate3d(10px,0,0)",
	},
});
