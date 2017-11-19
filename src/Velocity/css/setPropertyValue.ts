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

		if (data && data.cache[propertyName] !== propertyValue) {
			data.cache[propertyName] = propertyValue;
			if (Normalizations[propertyName] && Normalizations[propertyName](element, propertyValue) !== false) {
				// Skip if this has been handled
			} else if (data.isSVG && Names.SVGAttribute(propertyName)) {
				// TODO: Add this as Normalisations
				/* Note: For SVG attributes, vendor-prefixed property names are never used. */
				/* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
				element.setAttribute(propertyName, propertyValue);
			} else {
				element.style[propertyName] = propertyValue;
			}
			if (debug >= 2) {
				console.info("Set " + propertyName + ": " + propertyValue, element);
			}
		}
	}
};
