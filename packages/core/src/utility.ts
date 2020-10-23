/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { isKnownElement } from "./types";
import { KnownElement } from "./velocity";

/**
 * Add a single className to an Element.
 */
export function addClass(element: KnownElement, className: string): void {
	if (element instanceof Element) {
		if (element.classList) {
			element.classList.add(className);
		} else if ("className" in element) {
			removeClass(element, className);
			(element as HTMLElement).className += (element.className.length ? " " : "") + className;
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
export function defineProperty(proto: any, name: string | number | symbol, value: any, readonly?: boolean) {
	if (proto) {
		Object.defineProperty(proto, name, {
			configurable: !readonly,
			writable: !readonly,
			value,
		});
	}
}

/**
 * Remove a single className from an HTMLElement.
 */
export function removeClass(element: KnownElement, className: string): void {
	if (element instanceof Element) {
		if (element.classList) {
			element.classList.remove(className);
		} else if ("className" in element) {
			// TODO: Need some jsperf tests on performance - can we get rid of the regex and maybe use split / array manipulation?
			(element as any).className = element.className.replace(new RegExp(` ?\\b${className}\\b`, "gi"), "");
		}
	}
}

/**
 * Convert an element or array-like element list into an array if needed.
 */
export function sanitizeElements(elements: KnownElement | KnownElement[]): KnownElement[] {
	return isKnownElement(elements)
		? [elements] as KnownElement[]
		: elements as KnownElement[];
}

/**
 * Returns a copy of the string with the first letter capitalised.
 */
export function ucFirst(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
