/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

// Typedefs
import {HTMLorSVGElement} from "./../velocity.d";

// Project
import {isNode} from "./types";

/**
 * Add a single className to an Element.
 */
export function addClass(element: HTMLorSVGElement, className: string): void {
	if (element instanceof Element) {
		if (element.classList) {
			element.classList.add(className);
		} else {
			removeClass(element, className);
			(element as any).className += (element.className.length ? " " : "") + className;
		}
	}
}

/**
 * Clone an array, works for array-like too.
 */
export function cloneArray<T = any>(arrayLike: T[] | ArrayLike<T>): T[] {
	return Array.prototype.slice.call(arrayLike, 0);
}

/**
 * The <strong><code>defineProperty()</code></strong> function provides a
 * shortcut to defining a property that cannot be accidentally iterated across.
 */
export function defineProperty(proto: any, name: string, value: any, readonly?: boolean) {
	if (proto) {
		Object.defineProperty(proto, name, {
			configurable: !readonly,
			writable: !readonly,
			value,
		});
	}
}

/**
 * When there are multiple locations for a value pass them all in, then get the
 * first value that is valid.
 */
export function getValue<T>(...args: T[]): T {
	for (const arg of args) {
		if (arg !== undefined && arg === arg) {
			return arg;
		}
	}
}

/**
 * Shim to get the current milliseconds - on anything except old IE it'll use
 * Date.now() and save creating an object. If that doesn't exist then it'll
 * create one that gets GC.
 */
export const now = Date.now ? Date.now : () => {
	return (new Date()).getTime();
};

/**
 * Remove a single className from an Element.
 */
export function removeClass(element: HTMLorSVGElement, className: string): void {
	if (element instanceof Element) {
		if (element.classList) {
			element.classList.remove(className);
		} else {
			// TODO: Need some jsperf tests on performance - can we get rid of the regex and maybe use split / array manipulation?
			(element as any).className = element.className.replace(new RegExp(`(^|\\s)${className}(\\s|$)`, "gi"), " ");
		}
	}
}

/**
 * Convert an element or array-like element list into an array if needed.
 */
export function sanitizeElements(elements: HTMLorSVGElement | HTMLorSVGElement[]): HTMLorSVGElement[] {
	return isNode(elements)
		? [elements] as HTMLorSVGElement[]
		: elements as HTMLorSVGElement[];
}
