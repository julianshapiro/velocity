/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "rotateIn", {
	"duration": 1000,
	"0%": {
		opacity: "0",
		transform: "rotate3d(0,0,1,-200deg)",
		transformOrigin: "center",
	},
	"100%": {
		opacity: "1",
		transform: "translate3d(0,0,0)",
		transformOrigin: "center",
	},
});
