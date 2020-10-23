/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */

import { registerSequence } from "@velocityjs/core";

export const flash = registerSequence("flash", {
	"duration": 1000,
	"0%,50%,100%": {
		opacity: "1",
	},
	"25%,75%": {
		opacity: "0",
	},
});

export default flash;
