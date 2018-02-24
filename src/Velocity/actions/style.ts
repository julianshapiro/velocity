///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get or set a property from one or more elements.
 */

namespace VelocityStatic {

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
			console.warn("VelocityJS: Cannot access a non-existant property!");
			return null;
		}
		// GET
		if (value === undefined && !isPlainObject(property)) {
			// If only a single animation is found and we're only targetting a
			// single element, then return the value directly
			if (elements.length === 1) {
				return CSS.fixColors(CSS.getPropertyValue(elements[0], property));
			}
			const result = [];

			for (let i = 0; i < elements.length; i++) {
				result.push(CSS.fixColors(CSS.getPropertyValue(elements[i], property)));
			}
			return result;
		}
		// SET
		let error: string;

		if (isPlainObject(property)) {
			for (const propertyName in property) {
				for (let i = 0; i < elements.length; i++) {
					const value = property[propertyName];

					if (isString(value) || isNumber(value)) {
						CSS.setPropertyValue(elements[i], propertyName, property[propertyName]);
					} else {
						error = (error ? error + ", " : "") + "Cannot set a property '" + propertyName + "' to an unknown type: " + (typeof value);
						console.warn("VelocityJS: Cannot set a property '" + propertyName + "' to an unknown type:", value);
					}
				}
			}
		} else if (isString(value) || isNumber(value)) {
			for (let i = 0; i < elements.length; i++) {
				CSS.setPropertyValue(elements[i], property, String(value));
			}
		} else {
			error = "Cannot set a property '" + property + "' to an unknown type: " + (typeof value);
			console.warn("VelocityJS: Cannot set a property '" + property + "' to an unknown type:", value);
		}
		if (promiseHandler) {
			if (error) {
				promiseHandler._rejecter(error);
			} else if (isVelocityResult(elements) && elements.velocity.animations && elements.then) {
				elements.then(promiseHandler._resolver);
			} else {
				promiseHandler._resolver(elements);
			}
		}
	}

	registerAction(["style", styleAction], true);
}
