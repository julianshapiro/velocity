/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "tada", {
	"duration": 1000,
	"0%": {
		transform: "scale3d(1,1,1) rotate3d(0,0,0,0)",
	},
	"10%,20%": {
		transform: "scale3d(0.9,0.9,0.9) rotate3d(0,0,1,-3deg)",
	},
	"30%,50%,70%,90%": {
		transform: "scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)",
	},
	"40%,60%,80%": {
		transform: "scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)",
	},
	"100%": {
		transform: "scale3d(1, 1, 1) rotate3d(0,0,0,0)",
	},
});
