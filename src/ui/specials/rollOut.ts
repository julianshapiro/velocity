/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import {registerSequence} from "../../Velocity/sequences";

registerSequence(["rollOut", {
	"duration": 1000,
	"0%": {
		opacity: "1",
		transform: "translate3d(0,0,0) rotate3d(0,0,1,0)",
	},
	"100%": {
		opacity: "0",
		transform: "translate3d(100%,0,0) rotate3d(0,0,1,120deg)",
	},
}]);
