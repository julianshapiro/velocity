/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License
 */

import { registerEasing } from "@velocityjs/core";
import { generateBezier } from "generateBezier";

export const ease = generateBezier(0.25, 0.1, 0.25, 1);
export const easeIn = generateBezier(0.42, 0, 1, 1);
export const easeInCirc = generateBezier(0.6, 0.04, 0.98, 0.335);
export const easeInCubic = generateBezier(0.55, 0.055, 0.675, 0.19);
export const easeInExpo = generateBezier(0.95, 0.05, 0.795, 0.035);
export const easeInOut = generateBezier(0.42, 0, 0.58, 1);
export const easeInOutCirc = generateBezier(0.785, 0.135, 0.15, 0.86);
export const easeInOutCubic = generateBezier(0.645, 0.045, 0.355, 1);
export const easeInOutExpo = generateBezier(1, 0, 0, 1);
export const easeInOutQuad = generateBezier(0.455, 0.03, 0.515, 0.955);
export const easeInOutQuart = generateBezier(0.77, 0, 0.175, 1);
export const easeInOutQuint = generateBezier(0.86, 0, 0.07, 1);
export const easeInOutSine = generateBezier(0.445, 0.05, 0.55, 0.95);
export const easeInQuad = generateBezier(0.55, 0.085, 0.68, 0.53);
export const easeInQuart = generateBezier(0.895, 0.03, 0.685, 0.22);
export const easeInQuint = generateBezier(0.755, 0.05, 0.855, 0.06);
export const easeInSine = generateBezier(0.47, 0, 0.745, 0.715);
export const easeOut = generateBezier(0, 0, 0.58, 1);
export const easeOutCirc = generateBezier(0.075, 0.82, 0.165, 1);
export const easeOutCubic = generateBezier(0.215, 0.61, 0.355, 1);
export const easeOutExpo = generateBezier(0.19, 1, 0.22, 1);
export const easeOutQuad = generateBezier(0.25, 0.46, 0.45, 0.94);
export const easeOutQuart = generateBezier(0.165, 0.84, 0.44, 1);
export const easeOutQuint = generateBezier(0.23, 1, 0.32, 1);
export const easeOutSine = generateBezier(0.39, 0.575, 0.565, 1);

registerEasing("ease-in-out", easeInOut);
registerEasing("ease-in", easeIn);
registerEasing("ease-out", easeOut);
registerEasing("ease", ease);
registerEasing("easeIn", easeIn);
registerEasing("easeInCirc", easeInCirc);
registerEasing("easeInCubic", easeInCubic);
registerEasing("easeInExpo", easeInExpo);
registerEasing("easeInOut", easeInOut);
registerEasing("easeInOutCirc", easeInOutCirc);
registerEasing("easeInOutCubic", easeInOutCubic);
registerEasing("easeInOutExpo", easeInOutExpo);
registerEasing("easeInOutQuad", easeInOutQuad);
registerEasing("easeInOutQuart", easeInOutQuart);
registerEasing("easeInOutQuint", easeInOutQuint);
registerEasing("easeInOutSine", easeInOutSine);
registerEasing("easeInQuad", easeInQuad);
registerEasing("easeInQuart", easeInQuart);
registerEasing("easeInQuint", easeInQuint);
registerEasing("easeInSine", easeInSine);
registerEasing("easeOut", easeOut);
registerEasing("easeOutCirc", easeOutCirc);
registerEasing("easeOutCubic", easeOutCubic);
registerEasing("easeOutExpo", easeOutExpo);
registerEasing("easeOutQuad", easeOutQuad);
registerEasing("easeOutQuart", easeOutQuart);
registerEasing("easeOutQuint", easeOutQuint);
registerEasing("easeOutSine", easeOutSine);

declare module "@velocityjs/core" {
	export interface INamedEasings {
		"ease-in-out": true;
		"ease-in": true;
		"ease-out": true;
		"ease": true;
		"easeIn": true;
		"easeInCirc": true;
		"easeInCubic": true;
		"easeInExpo": true;
		"easeInOut": true;
		"easeInOutCirc": true;
		"easeInOutCubic": true;
		"easeInOutExpo": true;
		"easeInOutQuad": true;
		"easeInOutQuart": true;
		"easeInOutQuint": true;
		"easeInOutSine": true;
		"easeInQuad": true;
		"easeInQuart": true;
		"easeInQuint": true;
		"easeInSine": true;
		"easeOut": true;
		"easeOutCirc": true;
		"easeOutCubic": true;
		"easeOutExpo": true;
		"easeOutQuad": true;
		"easeOutQuart": true;
		"easeOutQuint": true;
		"easeOutSine": true;
	}

	export interface IEasingTypes {
		/**
		 * Generate a bezier curve for the easing to take.
		 */
		bezier: [number, number, number, number];
	}
}
