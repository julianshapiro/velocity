/**
 * The <strong><code>defineProperty()</code></strong> function provides a
 * shortcut to defining a property that cannot be accidentally iterated across.
 */
function defineProperty(proto: any, name: string, value: Function | any, force?: boolean) {
	if (proto && (force || !proto[name])) {
		Object.defineProperty(proto, name, {
			configurable: true,
			writable: true,
			value: value
		});
	}
}

/**
 * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
 * (technically, since host objects have been implementation-dependent,
 * at least before ES2015, IE hasn't needed to work this way).
 * Also works on strings, fixes IE < 9 to allow an explicit undefined
 * for the 2nd argument (as in Firefox), and prevents errors when
 * called on other DOM objects.
 */
var _slice: (this: HTMLorSVGElement[], begin?: number, end?: number) => Element[] = (function() {
	var slice = Array.prototype.slice;

	try {
		// Can't be used with DOM elements in IE < 9
		slice.call(document.documentElement);
		return slice;
	} catch (e) { // Fails in IE < 9

		// This will work for genuine arrays, array-like objects, 
		// NamedNodeMap (attributes, entities, notations),
		// NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
		// and will not fail on other DOM objects (as do DOM elements in IE < 9)
		return function(this: HTMLorSVGElement[], begin, end) {
			var length = this.length;

			if (!isNumber(begin)) {
				begin = 0;
			}
			if (!isNumber(end)) {
				end = length;
			}
			// For native Array objects, we use the native slice function
			if (this.slice) {
				return slice.call(this, begin, end);
			}
			// For array like object we handle it ourselves.
			var i: number,
				cloned: any[],
				// Handle negative value for "begin"
				start = (begin >= 0) ? begin : Math.max(0, length + begin),
				// Handle negative value for "end"
				upTo = end < 0 ? length + end : Math.min(end, length),
				// Actual expected size of the slice
				size = upTo - start;

			if (size > 0) {
				cloned = new Array(size);
				for (i = 0; i < size; i++) {
					cloned[i] = this[start + i];
				}
			}
			return cloned || [];
		};
	}
})();

/**
 * Shim for Object.assign on IE.
 * Copy the values of all of the enumerable own properties from one or more source objects to a
 * target object. Returns the target object.
 */
var _assign = (function() {
	if (typeof Object.assign === "function") {
		return Object.assign.bind(Object);
	}
	return function <T, U>(target: T, ...sources: U[]): T & U {
		if (target == null) { // TypeError if undefined or null
			throw new TypeError("Cannot convert undefined or null to object");
		}
		var to = Object(target),
			source: any,
			hasOwnProperty = Object.prototype.hasOwnProperty;

		while ((source = sources.shift())) {
			if (source != null) {
				for (var key in source) {
					if (hasOwnProperty.call(source, key)) {
						to[key] = source[key];
					}
				}
			}
		}
		return to;
	}
})();

/**
 * Shim for [].includes, can fallback to .indexOf and even manual search for
 * IE < 9
 */
var _inArray = (function() {
	if ((Array.prototype as any).includes) { // ES6
		return function(arr: any[], val) {
			return (arr as any).includes(val);
		};
	}
	if (Array.prototype.indexOf) {
		return function(arr: any[], val) {
			return arr.indexOf(val) >= 0;
		};
	}
	return function(arr: any[], val) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === val) {
				return true;
			}
		}
		return false;
	};
}) as any as ((arr: any[], val: any) => boolean);

/**
 * Convert an element or array-like element list into an actual array
 */
function sanitizeElements(elements: HTMLorSVGElement | HTMLorSVGElement[]): HTMLorSVGElement[] {
	/* Unwrap jQuery/Zepto objects. */
	if (isWrapped(elements)) {
		elements = _slice.call(elements);
	} else if (isNode(elements)) {
		elements = [elements];
	}
	return elements as HTMLorSVGElement[];
}
