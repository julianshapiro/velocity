/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Runtime type checking methods.
 */

// Typedefs
import {HTMLorSVGElement, VelocityResult} from "./../velocity.d";

/**
 * Check if a variable is a boolean.
 */
export function isBoolean(variable: any): variable is boolean {
	return variable === true || variable === false;
}

/**
 * Check if a variable is an empty object.
 */
export function isEmptyObject(variable: {}): variable is {} {
	for (const name in variable) {
		if (variable.hasOwnProperty(name)) {
			return false;
		}
	}

	return true;
}

/**
 * Check if a variable is a function.
 */
export function isFunction(variable: any): variable is Function { // tslint:disable-line:ban-types
	return Object.prototype.toString.call(variable) === "[object Function]";
}

/**
 * Check if a variable is an HTMLElement or SVGElement.
 */
export function isNode(variable: any): variable is HTMLorSVGElement {
	return !!(variable && (variable as Element).nodeType);
}

/**
 * Check if a variable is a number.
 */
export function isNumber(variable: any): variable is number {
	return typeof variable === "number";
}

/**
 * Faster way to parse a string/number as a number https://jsperf.com/number-vs-parseint-vs-plus/3
 */
export function isNumberWhenParsed(variable: any): variable is number {
	return !isNaN(Number(variable));
}

/**
 * Check if a variable is a plain object (and not an instance).
 */
export function isPlainObject(variable: any): variable is {} {
	if (!variable || typeof variable !== "object" || (variable as Element).nodeType || Object.prototype.toString.call(variable) !== "[object Object]") {
		return false;
	}
	const proto = Object.getPrototypeOf(variable) as object;

	return !proto || (proto.hasOwnProperty("constructor") && proto.constructor === Object);
}

/**
 * Check if a variable is an SVGElement.
 */
export function isSVG(variable: any): variable is SVGElement {
	return SVGElement && variable instanceof SVGElement;
}

/**
 * Check if a variable is a string.
 */
export function isString(variable: any): variable is string {
	return typeof variable === "string";
}

/**
 * Check if a variable is the result of calling Velocity.
 */
export function isVelocityResult(variable: any): variable is VelocityResult {
	return variable && isNumber((variable as VelocityResult).length) && isFunction((variable as VelocityResult).velocity);
}

/**
 * Check if a variable is an array-like wrapped jQuery, Zepto or similar, where
 * each indexed value is a Node.
 */

export function isWrapped(variable: any): variable is HTMLorSVGElement[] {
	return variable
		&& variable !== window
		&& isNumber((variable as HTMLorSVGElement[]).length)
		&& !isString(variable)
		&& !isFunction(variable)
		&& !isNode(variable)
		&& ((variable as HTMLorSVGElement[]).length === 0 || isNode(variable[0]));
}

/**
 * Check is a property is an enumerable member of an object.
 */
export function propertyIsEnumerable(obj: object, property: string): boolean {
	return Object.prototype.propertyIsEnumerable.call(obj, property);
}
