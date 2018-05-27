/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "bounceOut", {
	"duration": 750,
	"0%": {
		opacity: "1",
		transform: "scale3d(1,1,1)",
	},
	"20%": {
		transform: "scale3d(0.9,0.9,0.9)",
	},
	"50%,55%": {
		opacity: "1",
		transform: "scale3d(1.1,1.1,1.1)",
	},
	"to": {
		opacity: "0",
		transform: "scale3d(0.3,0.3,0.3)",
	},
});
