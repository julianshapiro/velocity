/*
 * VelocityJS.org (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Runtime type checking methods.
 */

import {
	HTMLorSVGElement,
	VelocityResult,
} from "../index.d";

export function isBoolean(variable): variable is boolean {
	return variable === true || variable === false;
}

export function isNumber(variable): variable is number {
	return typeof variable === "number";
}

/**
 * Faster way to parse a string/number as a number https://jsperf.com/number-vs-parseint-vs-plus/3
 */
export function isNumberWhenParsed(variable: string | number): variable is number {
	return !isNaN(Number(variable));
}

export function isString(variable): variable is string {
	return typeof variable === "string";
}

export function isFunction(variable): variable is Function { // tslint:disable-line:ban-types
	return Object.prototype.toString.call(variable) === "[object Function]";
}

export function isNode(variable): variable is HTMLorSVGElement {
	return !!(variable && variable.nodeType);
}

export function isVelocityResult(variable): variable is VelocityResult {
	return variable && isNumber(variable.length) && isFunction((variable as VelocityResult).velocity);
}

export function propertyIsEnumerable(obj: object, property: string): boolean {
	return Object.prototype.propertyIsEnumerable.call(obj, property);
}

/* Determine if variable is an array-like wrapped jQuery, Zepto or similar element, or even a NodeList etc. */

/* NOTE: HTMLFormElements also have a length. */
export function isWrapped(variable): variable is HTMLorSVGElement[] {
	return variable
		&& variable !== window
		&& isNumber(variable.length)
		&& !isString(variable)
		&& !isFunction(variable)
		&& !isNode(variable)
		&& (variable.length === 0 || isNode(variable[0]));
}

export function isSVG(variable): variable is SVGElement {
	return SVGElement && variable instanceof SVGElement;
}

export function isPlainObject(variable): variable is {} {
	if (!variable || typeof variable !== "object" || variable.nodeType || Object.prototype.toString.call(variable) !== "[object Object]") {
		return false;
	}
	const proto = Object.getPrototypeOf(variable) as object;

	return !proto || (proto.hasOwnProperty("constructor") && proto.constructor === Object);
}

export function isEmptyObject(variable): variable is {} {
	for (const name in variable) {
		if (variable.hasOwnProperty(name)) {
			return false;
		}
	}

	return true;
}
