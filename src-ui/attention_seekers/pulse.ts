/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "pulse", {
	"duration": 1000,
	"0%": {
		transform: "scale3d(1,1,1)",
	},
	"50%": {
		transform: "scale3d(1.05,1.05,1.05)",
	},
	"100%": {
		transform: "scale3d(1,1,1)",
	},
});
