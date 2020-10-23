/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Bounce easings, based on code from https://github.com/yuichiroharai/easeplus-velocity
 */

import { registerEasing } from "../registerEasings";

/**
 * Linear easing, used for sequence parts that don't have an actual easing
 * function.
 */
export const easeLinear = (percentComplete: number, startValue: number, endValue: number) =>
	startValue + percentComplete * (endValue - startValue);

registerEasing("linear", easeLinear);
