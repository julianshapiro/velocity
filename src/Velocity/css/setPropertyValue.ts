/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {
	/**
	 * The singular setPropertyValue, which routes the logic for all
	 * normalizations, hooks, and standard CSS properties.
	 */
	export function setPropertyValue(element: HTMLorSVGElement, propertyName: string, propertyValue: any) {
		let data = Data(element);

		if (isString(propertyValue)
			&& propertyValue[0] === "c"
			&& propertyValue[1] === "a"
			&& propertyValue[2] === "l"
			&& propertyValue[3] === "c"
			&& propertyValue[4] === "("
			&& propertyValue[5] === "0") {
			// Make sure we un-calc unit changing values - try not to trigger
			// this code any more often than we have to since it's expensive
			propertyValue = propertyValue.replace(/^calc\(0[^\d]* \+ ([^\(\)]+)\)$/, "$1");
		}
		if (data && data.cache[propertyName] !== propertyValue) {
			// By setting it to undefined we force a true "get" later
			data.cache[propertyName] = propertyValue || undefined;
			if (!Normalizations[propertyName] || !Normalizations[propertyName](element, propertyValue)) {
				if (data.isSVG && Names.SVGAttribute(propertyName)) {
					// TODO: Add this as Normalisations
					/* Note: For SVG attributes, vendor-prefixed property names are never used. */
					/* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
					element.setAttribute(propertyName, propertyValue);
				} else {
					element.style[propertyName] = propertyValue;
				}
			}
			if (debug >= 2) {
				console.info("Set " + propertyName + ": " + propertyValue, element);
			}
		}
	}
};
