/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "swing", {
	"duration": 1000,
	"0%,100%": {
		transform: "rotate3d(0,0,1,0deg)",
		transformOrigin: "center",
	},
	"20%": {
		transform: "rotate3d(0,0,1,15deg)",
	},
	"40%": {
		transform: "rotate3d(0,0,1,-10deg)",
	},
	"60%": {
		transform: "rotate3d(0,0,1,5deg)",
	},
	"80%": {
		transform: "rotate3d(0,0,1,-5deg)",
	},
});
