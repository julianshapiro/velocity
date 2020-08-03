/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

// Project
import { defineProperty } from "../utility";
import { Velocity } from "../velocityFn";

/**
 * Used to patch any object to allow Velocity chaining. In order to chain an
 * object must either be treatable as an array - with a <code>.length</code>
 * property, and each member a Node, or a Node directly.
 */
export function patch(proto?: any, global?: boolean) {
	try {
		if (proto) {
			defineProperty(proto, (global ? "V" : "v") + "elocity", Velocity);
		}
	} catch (e) {
		console.warn(`VelocityJS: Error when trying to add prototype.`, e);
	}
}
