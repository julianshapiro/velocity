/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "rubberBand", {
	"duration": 1000,
	"0%": {
		transform: "scale3d(1,1,1)",
	},
	"30%": {
		transform: "scale3d(1.25,0.75,1)",
	},
	"40%": {
		transform: "scale3d(0.75,1.25,1)",
	},
	"50%": {
		transform: "scale3d(1.15,0.85,1)",
	},
	"65%": {
		transform: "scale3d(0.95,1.05,1)",
	},
	"75%": {
		transform: "scale3d(1.05,0.95,1)",
	},
	"100%": {
		transform: "scale3d(1,1,1)",
	},
});
