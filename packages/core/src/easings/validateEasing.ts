/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import type { EasingType, EasingFn } from ".";
import { Easings } from "./easingsObject";
import { isString, isFunction } from "../types";

export type EasingValidatorFn = (value?: EasingType | string, duration?: number, noError?: true) => EasingFn | undefined;

/**
 * Validator functions to run through.
 */
const EasingValidators: EasingValidatorFn[] = [];

/**
 * Register a validator, this allows us to extend the types dynamically.
 */
export function registerEasingValidator(fn: EasingValidatorFn) {
	EasingValidators.push(fn);
}

/**
 * Validate a <code>easing</code> option.
 */
export function validateEasing(value?: EasingType | string | unknown, duration?: number, noError?: true): EasingFn | undefined {
	let result = isString(value)
		? Easings[value]
		: isFunction(value)
			? value as EasingFn
			: undefined;

	for (let i = 0; !result && i < EasingValidators.length; i++) {
		result = EasingValidators[i](value as any, duration, noError);
	}
	if (!result && value != null && !noError) {
		console.error(`VelocityJS: Trying to set 'easing' to an invalid value:`, value);
	}

	return result;
}
