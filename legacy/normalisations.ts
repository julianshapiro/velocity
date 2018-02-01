/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

// TODO: Need to override all properties for IE<=8

if (IE <= 8) {
	try {
		/* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
		 Try/catch is avoided for other browsers since it incurs a performance overhead. */
		if (Normalizations[propertyName]) {
			Normalizations[propertyName](element, propertyValue);
		} else {
			element.style[propertyName] = propertyValue;
		}
	} catch (error) {
		if (debug) {
			console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]");
		}
	}
}
