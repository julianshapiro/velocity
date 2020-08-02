/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "jackInTheBox", {
	"duration": 1000,
	"0%": {
		opacity: "0",
		transform: "scale(0.1) rotate(30deg)",
		transformOrigin: "center bottom",
	},
	"50%": {
		transform: "scale(0.5) rotate(-10deg)",
	},
	"70%": {
		transform: "scale(0.7) rotate(3deg)",
	},
	"100%": {
		opacity: "1",
		transform: "scale(1) rotate(0)",
	},
});
