/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "zoomInDown", {
	"duration": 1000,
	"0%": {
		opacity: "0",
		transform: "scale3d(0.1,0.1,0.1) translate3d(0,-1000px,0)",
	},
	"60%": {
		opacity: "1",
		transform: ["scale3d(0.475,0.475,0.475) translate3d(0,60px,0)", "easeInCubic"],
	},
	"100%": {
		transform: ["scale3d(1,1,1) translate3d(0,0,0)", [0.175, 0.885, 0.32, 1]],
	},
});
