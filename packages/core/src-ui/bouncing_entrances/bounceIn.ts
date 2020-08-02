/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "bounceIn", {
	"duration": 750,
	"easing": "easeOutCubic",
	"0%": {
		opacity: "0",
		transform: "scale3d(0.3,0.3,0.3)",
	},
	"20%": {
		transform: "scale3d(1.1,1.1,1.1)",
	},
	"40%": {
		transform: "scale3d(0.9,0.9,0.9)",
	},
	"60%": {
		opacity: "1",
		transform: "scale3d(1.03,1.03,1.03)",
	},
	"80%": {
		transform: "scale3d(0.97,0.97,0.97)",
	},
	"100%": {
		opacity: "1",
		transform: "scale3d(1,1,1)",
	},
});
