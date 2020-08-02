/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "slideInLeft", {
	"duration": 1000,
	"0%": {
		transform: "translate3d(-100%,0,0)",
		visibility: "hidden",
		opacity: "0",
	},
	"100%": {
		transform: "translate3d(0,0,0)",
		visibility: "visible",
		opacity: "1",
	},
});
