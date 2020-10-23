/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details
 *
 * Step easing generator.
 */

import type { EasingFn } from "../";

import { registerEasingValidator } from "../validateEasing";

/**
 * Cache of generated steps functions.
 */
const cache: { [steps: number]: EasingFn } = {};

/**
 * Generate a steps easing function, also caches it.
 *
 * @param steps The number of steps to have.
 */
export const generateStep = (steps: number): EasingFn =>
	cache[steps] ??= (percentComplete: number, startValue: number, endValue: number) =>
		percentComplete === 0
			? startValue
			: percentComplete === 1
				? endValue
				: startValue + Math.round(percentComplete * steps) * (1 / steps) * (endValue - startValue);

registerEasingValidator((value) => {
	if (Array.isArray(value) && value.length === 1) {
		return generateStep(value[0]);
	}
})

declare module "../../velocity" {
	export interface IStaticVelocity {
		/**
		 * Generate a steps easing function, also caches it.
		 *
		 * @param steps The number of steps to have.
		 */
		readonly generateStepEasing: (steps: number) => EasingFn;
	}
}
