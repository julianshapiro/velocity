/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import { registerSequence } from "@velocityjs/core";

export const slideOutLeft = registerSequence("slideOutLeft", {
	"duration": 1000,
	"0%": {
		transform: "translate3d(0,0,0)",
		visibility: "visible",
		opacity: "1",
	},
	"100%": {
		transform: "translate3d(-100%,0,0)",
		visibility: "hidden",
		opacity: "0",
	},
});

export default slideOutLeft;
