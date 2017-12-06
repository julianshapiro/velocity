/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

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
 * Perform a deep copy of an object - also copies children so they're not
 * going to be affected by changing original.
 */
function _deepCopyObject<T, U>(target: T, ...sources: U[]): T & U {
	if (target == null) { // TypeError if undefined or null
		throw new TypeError("Cannot convert undefined or null to object");
	}
	const to = Object(target),
		hasOwnProperty = Object.prototype.hasOwnProperty;
	let source: any;

	while ((source = sources.shift())) {
		if (source != null) {
			for (const key in source) {
				if (hasOwnProperty.call(source, key)) {
					const value = source[key];

					if (Array.isArray(value)) {
						_deepCopyObject(to[key] = [], value);
					} else if (isPlainObject(value)) {
						_deepCopyObject(to[key] = {}, value);
					} else {
						to[key] = value;
					}
				}
			}
		}
	}
	return to;
}

function _position(element: HTMLorSVGElement): ClientRect {
	if (element) {
		return element.getBoundingClientRect();
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
 * Get the index of an element
 */
const _indexOf = Array.prototype.indexOf;

/**
 * Shim for [].includes, can fallback to indexOf
 */
const _inArray: (searchElement: any) => boolean =
	(Array.prototype as any).includes || function(value) {
		return _indexOf.call(this, value) > -1;
	};

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
