/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get or set a property from one or more elements.
 */

import type { IAnimation } from "../core/animation";
import { isNumber, isPlainObject, isString, isVelocityResult } from "../types";
import { fixColors } from "../core/css/fixColors";
import { getPropertyValue } from "../core/css/getPropertyValue";
import { setPropertyValue } from "../core/css/setPropertyValue";
import { registerAction } from "./registerAction";
import { IActionThis } from "./actionsObject";
import invariant from "tiny-invariant";

/**
 * Get or set a style of Normalised property value on one or more elements.
 * If there is no value passed then it will get, otherwise we will set.
 *
 * NOTE: When using "get" this will not touch the Promise as it is never
 * returned to the user.
 *
 * This can fail to set, and will reject the Promise if it does so.
 *
 * Velocity(elements, "style", "property", "value") => elements;
 * Velocity(elements, "style", {"property": "value", ...}) => elements;
 * Velocity(element, "style", "property") => "value";
 * Velocity(elements, "style", "property") => ["value", ...];
 */
export function propertyAction(this: IActionThis, property: string | string[], value: string): any {
	const { elements, promiseHandler } = this;

	invariant(property, `VelocityJS: Cannot access a non-existant property!`);
	// GET
	if (value === undefined && !isPlainObject(property)) {
		if (Array.isArray(property)) {
			if (elements.length === 1) {
				const result = {};

				for (const prop of property) {
					result[prop] = fixColors(getPropertyValue(elements[0], prop));
				}

				return result;
			} else {
				const result: any[] = [];

				for (const element of elements) {
					const res = {};

					for (const prop of property) {
						res[prop] = fixColors(getPropertyValue(element, prop));
					}

					result.push(res);
				}

				return result;
			}
		} else {
			// If only a single animation is found and we're only targetting a
			// single element, then return the value directly
			if (elements.length === 1) {
				return fixColors(getPropertyValue(elements[0], property));
			}
			const result: any[] = [];

			for (const element of elements) {
				result.push(fixColors(getPropertyValue(element, property)));
			}

			return result;
		}
	}
	// SET
	const error: string[] = [];

	if (isPlainObject(property)) {
		for (const propertyName in property) {
			if (property.hasOwnProperty(propertyName)) {
				for (const element of elements) {
					const propertyValue = property[propertyName];

					if (isString(propertyValue) || isNumber(propertyValue)) {
						setPropertyValue(element, propertyName, property[propertyName]);
					} else {
						error.push(`Cannot set a property "${propertyName}" to an unknown type: ${typeof propertyValue}`);
						console.warn(`VelocityJS: Cannot set a property "${propertyName}" to an unknown type:`, propertyValue);
					}
				}
			}
		}
	} else if (isString(value) || isNumber(value)) {
		for (const element of elements) {
			setPropertyValue(element, property, String(value));
		}
	} else {
		error.push(`Cannot set a property "${property}" to an unknown type: ${typeof value}`);
		console.warn(`VelocityJS: Cannot set a property "${property}" to an unknown type:`, value);
	}
	if (promiseHandler) {
		if (error.length) {
			if (promiseHandler._rejecter) {
				promiseHandler._rejecter(error.join(", "));
			}
		} else if (isVelocityResult(elements) && elements.velocity?.animations && elements.then) {
			elements.then(promiseHandler._resolver);
		} else if (promiseHandler._resolver) {
			promiseHandler._resolver(elements);
		}
	}
}

registerAction("property", propertyAction, true);
registerAction("style", propertyAction, true);

declare module "../velocity" {
	export interface IVelocity {
		/**
		 * Get or set the value for a property that Velocity understands how to
		 * access.
		 *
		 * @param elements An `Element`, or an array-like list of `Elements` to
		 * process.
		 * @param property The name of the property to access.
		 */
		(elements: KnownElement, action: "style" | "property", property: string): string | string[];
		(this: IActionThis, action: "style" | "property", property: string): string | string[];


		/**
		 * Get or set the value for a property that Velocity understands how to
		 * access.
		 *
		 * @param elements An `Element`, or an array-like list of `Elements` to
		 * process.
		 * @param property The name of the property to access, or an object with
		 * `name: value` pairs for setting.
		 */
		(elements: KnownElement, action: "style" | "property", property: string[]): Record<string, string>[] | Record<string, string>;
		(this: IActionThis, action: "style" | "property", property: string[]): Record<string, string>[] | Record<string, string>;

		/**
		 * Get or set the value for a property that Velocity understands how to
		 * access.
		 *
		 * @param elements An `Element`, or an array-like list of `Elements` to
		 * process.
		 * @param property The name of the property to access.
		 * @param value The value to set the property to.
		 */
		(elements: KnownElement, action: "style" | "property", property: string, value: string): IAnimation;
		(this: IActionThis, action: "style" | "property", property: string, value: string): IAnimation;

		/**
		 * Get or set the value for a property that Velocity understands how to
		 * access.
		 *
		 * @param elements An `Element`, or an array-like list of `Elements` to
		 * process.
		 * @param property An object with `name: value` pairs for setting.
		 */
		(elements: KnownElement, action: "style" | "property", property: Record<string, string>): IAnimation;
		(this: IActionThis, action: "style" | "property", property: Record<string, string>): IAnimation;
	}
}
