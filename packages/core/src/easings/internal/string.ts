/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Easings to act on strings, either set at the start or at the end depending on
 * need.
 */

import { registerEasing } from "../registerEasings";

/**
 * Easing function that sets to the specified value immediately after the
 * animation starts.
 */
export const easeAtStart = (percentComplete: number, startValue: any, endValue: any): any =>
	percentComplete === 0
		? startValue
		: endValue;

/**
 * Easing function that sets to the specified value while the animation is
 * running.
 */
export const easeDuring = (percentComplete: number, startValue: any, endValue: any): any =>
	percentComplete === 0 || percentComplete === 1
		? startValue
		: endValue;

/**
 * Easing function that sets to the specified value when the animation ends.
 */
export const easeAtEnd = (percentComplete: number, startValue: any, endValue: any): any =>
	percentComplete === 1
		? endValue
		: startValue;

registerEasing("at-start", easeAtStart);
registerEasing("during", easeDuring);
registerEasing("at-end", easeAtEnd);
