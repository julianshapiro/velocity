/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

// Typedefs
import {VelocityEasingFn} from "../../../velocity.d";

// Project
import {isFunction, isString} from "../../types";
import {registerAction} from "../actions/actions";

// Constants
export const Easings: {[name: string]: VelocityEasingFn} = {};

/**
 * Used to register a easing. This should never be called by users
 * directly, instead it should be called via an action:<br/>
 * <code>Velocity("registerEasing", "name", VelocityEasingFn);</code>
 */
export function registerEasing(args?: [string, VelocityEasingFn]) {
	const name: string = args[0],
		callback = args[1];

	if (!isString(name)) {
		console.warn(`VelocityJS: Trying to set 'registerEasing' name to an invalid value:`, name);
	} else if (!isFunction(callback)) {
		console.warn(`VelocityJS: Trying to set 'registerEasing' callback to an invalid value:`, name, callback);
	} else if (Easings[name]) {
		console.warn(`VelocityJS: Trying to override 'registerEasing' callback`, name);
	} else {
		Easings[name] = callback;
	}
}

registerAction(["registerEasing", registerEasing], true);

/**
 * Linear easing, used for sequence parts that don't have an actual easing
 * function.
 */
export function linearEasing(percentComplete, startValue, endValue, property) {
	return startValue + percentComplete * (endValue - startValue);
}

/**
 * Swing is the default for jQuery and Velocity.
 */
export function swingEasing(percentComplete, startValue, endValue) {
	return startValue + (0.5 - Math.cos(percentComplete * Math.PI) / 2) * (endValue - startValue);
}

/**
 * A less exaggerated version of easeInOutElastic.
 */
export function springEasing(percentComplete, startValue, endValue) {
	return startValue + (1 - (Math.cos(percentComplete * 4.5 * Math.PI) * Math.exp(-percentComplete * 6))) * (endValue - startValue);
}

registerEasing(["linear", linearEasing]);
registerEasing(["swing", swingEasing]);
registerEasing(["spring", springEasing]);
