/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get or set a property from one or more elements.
 */

import {
	VelocityPromise,
	VelocityResult,
} from "../../../index.d";

import {isNumber, isPlainObject, isString, isVelocityResult} from "../../types";
import {fixColors} from "../css/fixColors";
import {getPropertyValue} from "../css/getPropertyValue";
import {setPropertyValue} from "../css/setPropertyValue";
import {registerAction} from "./actions";

/**
 * Expose a style shortcut - can't be used with chaining, but might be of
 * use to people.
 */
export function style(elements: VelocityResult, property: {[property: string]: string}): VelocityResult;
export function style(elements: VelocityResult, property: string): string | string[];
export function style(elements: VelocityResult, property: string, value: string): VelocityResult;
export function style(elements: VelocityResult, property: string | {[property: string]: string}, value?: string) {
	return styleAction([property, value], elements);
}

/**
 * Get or set a style of Nomralised property value on one or more elements.
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
function styleAction(args?: any[], elements?: VelocityResult, promiseHandler?: VelocityPromise, action?: string): any {
	const property = args[0],
		value = args[1];

	if (!property) {
		console.warn(`VelocityJS: Cannot access a non-existant property!`);

		return null;
	}
	// GET
	if (value === undefined && !isPlainObject(property)) {
		// If only a single animation is found and we're only targetting a
		// single element, then return the value directly
		if (elements.length === 1) {
			return fixColors(getPropertyValue(elements[0], property));
		}
		const result = [];

		for (const element of elements) {
			result.push(fixColors(getPropertyValue(element, property)));
		}

		return result;
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
			promiseHandler._rejecter(error.join(", "));
		} else if (isVelocityResult(elements) && elements.velocity.animations && elements.then) {
			elements.then(promiseHandler._resolver);
		} else {
			promiseHandler._resolver(elements);
		}
	}
}

registerAction(["style", styleAction], true);
