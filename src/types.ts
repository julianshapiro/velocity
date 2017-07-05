
function isNumber(variable): variable is number {
	return typeof variable === "number";
}

function isString(variable): variable is string {
	return typeof variable === "string";
}

function isFunction(variable): variable is Function {
	return Object.prototype.toString.call(variable) === "[object Function]";
}

function isNode(variable): variable is HTMLElement | SVGElement {
	return variable && variable.nodeType;
}

/* Determine if variable is an array-like wrapped jQuery, Zepto or similar element, or even a NodeList etc. */
/* NOTE: HTMLFormElements also have a length. */
function isWrapped(variable): variable is (HTMLElement | SVGElement)[] {
	return variable
		&& variable !== window
		&& isNumber(variable.length)
		&& !isString(variable)
		&& !isFunction(variable)
		&& !isNode(variable)
		&& (variable.length === 0 || isNode(variable[0]));
}

function isSVG(variable): variable is SVGElement {
	return (window as any).SVGElement && (variable instanceof (window as any).SVGElement);
}

function isEmptyObject(variable): variable is {} {
	for (var name in variable) {
		if (variable.hasOwnProperty(name)) {
			return false;
		}
	}
	return true;
}
