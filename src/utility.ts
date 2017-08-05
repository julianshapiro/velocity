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
 * Perform a deep copy of an object - also copies children so they're not
 * going to be affected by changing original.
 */
function _deepCopyObject<T, U>(target: T, ...sources: U[]): T & U {
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
					var value = source[key];

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
var _now = Date.now ? Date.now : function() {
	return (new Date()).getTime();
};

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
		elements = [...elements];
	} else if (isNode(elements)) {
		elements = [elements];
	}
	return elements as HTMLorSVGElement[];
}
