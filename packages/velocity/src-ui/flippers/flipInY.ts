/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import Velocity from "velocity-animate";

Velocity("registerSequence", "flipInY", {
	"duration": 1000,
	"0%,100%": {
		backfaceVisibility: "visible",
	},
	"0%": {
		opacity: "0",
		transform: "perspective(400px) rotate3d(0,1,0,90deg)",
	},
	"40%": {
		transform: ["perspective(400px) rotate3d(0,1,0,-20deg)", "easeIn"],
	},
	"60%": {
		opacity: "1",
		transform: "perspective(400px) rotate3d(0,1,0,10deg)",
	},
	"80%": {
		transform: "perspective(400px) rotate3d(0,1,0,-5deg)",
	},
	"100%": {
		transform: "perspective(400px) rotate3d(0,1,0,0)",
	},
});
