/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Make sure that the values within Velocity are read-only and upatchable.
 */

import {Velocity} from "./velocityFn";

import {VelocityStatic} from "./velocity";

import "./ui/_all";
import {defineProperty} from "./utility";
import "./Velocity/_all";

// Make sure that the values within Velocity are read-only and upatchable.
for (const property in VelocityStatic) {
	if (VelocityStatic.hasOwnProperty(property)) {
		switch (typeof property) {
			case "number":
			case "boolean":
				defineProperty(Velocity, property, {
					get() {
						return VelocityStatic[property];
					},
					set(value) {
						VelocityStatic[property] = value;
					},
				}, true);
				break;

			default:
				defineProperty(Velocity, property, VelocityStatic[property], true);
				break;
		}
	}
}

export {Velocity};
