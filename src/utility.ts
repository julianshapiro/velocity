/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

/**
 * Creates an empty object without any prototype chain.
 */
function createEmptyObject() {
	return Object.create(null);
}

/**
 * The <strong><code>defineProperty()</code></strong> function provides a
 * shortcut to defining a property that cannot be accidentally iterated across.
 */
function defineProperty(proto: any, name: string, value: Function | any) {
	if (proto) {
		Object.defineProperty(proto, name, {
			configurable: true,
			writable: true,
			value: value
		});
	}
}

/**
 * Shim to get the current milliseconds - on anything except old IE it'll use
 * Date.now() and save creating an object. If that doesn't exist then it'll
 * create one that gets GC.
 */
const _now = Date.now ? Date.now : function() {
	return (new Date()).getTime();
};

/**
 * Check whether a value belongs to an array
 * https://jsperf.com/includes-vs-indexof-vs-while-loop/6
 * @param array The given array
 * @param value The given element to check if it is part of the array
 * @returns {boolean} True if it exists, false otherwise
 */
function _inArray<T>(array: T[], value: T): boolean {
	let i = 0;

	while (i < array.length) {
		if (array[i++] === value) {
			return true;
		}
	}
	return false;
}

/**
 * Convert an element or array-like element list into an array if needed.
 */
function sanitizeElements(elements: HTMLorSVGElement | HTMLorSVGElement[]): HTMLorSVGElement[] {
	if (isNode(elements)) {
		return [elements];
	}
	return elements as HTMLorSVGElement[];
}

/**
 * When there are multiple locations for a value pass them all in, then get the
 * first value that is valid.
 */
function getValue<T>(...args: T[]): T;
function getValue<T>(args: any): T {
	for (let i = 0, _args = arguments; i < _args.length; i++) {
		const _arg = _args[i];

		if (_arg !== undefined && _arg === _arg) {
			return _arg;
		}
	}
}

/**
 * Add a single className to an Element.
 */
function addClass(element: HTMLorSVGElement, className: string): void {
	if (element instanceof Element) {
		if (element.classList) {
			element.classList.add(className);
		} else {
			removeClass(element, className);
			element.className += (element.className.length ? " " : "") + className;
		}
	}
}

/**
 * Remove a single className from an Element.
 */
function removeClass(element: HTMLorSVGElement, className: string): void {
	if (element instanceof Element) {
		if (element.classList) {
			element.classList.remove(className);
		} else {
			// TODO: Need some jsperf tests on performance - can we get rid of the regex and maybe use split / array manipulation?
			element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className + "(\\s|$)", "gi"), " ");
		}
	}
}
