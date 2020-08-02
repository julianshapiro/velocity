/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "bounceOutLeft", {
	"duration": 1000,
	"0%": {
		opacity: "1",
		transform: "translate3d(0,0,0)",
	},
	"20%": {
		opacity: "1",
		transform: "translate3d(20px,0,0)",
	},
	"100%": {
		opacity: "0",
		transform: "translate3d(-2000px,0,0)",
	},
});
