/*
* velocity-animate (C) 2014-2018 Julian Shapiro.
*
* Licensed under the MIT license. See LICENSE file in the project root for details.
*
* Runtime type checking methods.
*/

import { IAnimation } from "./core/animation";
import { Velocity, VelocityObjectArgs, KnownElement } from "./velocity";

/**
 * Check if a variable is the result of calling Velocity.
 */
export function isAnimation(variable: unknown): variable is IAnimation {
	return isPlainObject(variable) && variable.velocity === Velocity;
}

/**
 * Check if a variable is a boolean.
 */
export function isBoolean(variable: unknown): variable is boolean {
	return variable === true || variable === false;
}

/**
 * Check if a variable is an empty object.
 */
export function isEmptyObject(variable: unknown): variable is {} {
	if (!isPlainObject(variable)) {
		return false;
	}
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
export function isFunction(variable: unknown): variable is Function { // tslint:disable-line:ban-types
	return Object.prototype.toString.call(variable) === "[object Function]";
}

/**
 * Check if a variable is an integar.
 */
export function isInteger(variable: unknown): variable is number {
	return isNumber(variable) && (variable | 0) === variable;
}

/**
 * Check if a variable is a known element type.
 *
 * TODO: Register callbacks to check this
 */
export function isKnownElement(variable: unknown): variable is KnownElement {
	return !!(variable && (variable as Element).nodeType);
}

/**
 * Check if a variable is an array-like wrapped jQuery, Zepto or similar, where
 * each indexed value is a Node.
 */
export function isKnownElementArray(variable: unknown): variable is KnownElement[] {
	return variable
		&& variable !== globalThis
		&& !isString(variable)
		&& !isFunction(variable)
		&& !isKnownElement(variable)
		&& isNumber((variable as KnownElement[]).length)
		&& ((variable as KnownElement[]).length === 0
			|| isKnownElement((variable as KnownElement[])[0]));
}

/**
 * Check if a variable is a number.
 */
export function isNumber(variable: unknown): variable is number {
	return typeof variable === "number" && !isNaN(variable);
}

/**
 * Check if this is a Velocity Object Args - the check for a single argument
 * must come before this.
 */
export function isObjectArgs(variable: unknown): variable is VelocityObjectArgs {
	return isPlainObject(variable)
		&& ((isPlainObject(variable.properties) && !(variable.properties as any).names)
			|| isString(variable.properties));
}

/**
 * Check if a variable is a plain object (and not an instance).
 */
export function isPlainObject(variable: unknown): variable is Record<string | number, unknown> {
	return typeof variable === "object" && variable !== null;
}

/**
 * Check if a variable is a string.
 */
export function isString(variable: unknown): variable is string {
	return typeof variable === "string";
}

/**
 * Check if a variable is an SVGElement.
 */
export function isSVG(variable: unknown): variable is SVGElement {
	return SVGElement && variable instanceof SVGElement;
}

/**
 * Check is a property is an enumerable member of an object.
 */
export function propertyIsEnumerable(obj: object, property: string): boolean {
	return Object.prototype.propertyIsEnumerable.call(obj, property);
}
