///<reference path="../normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {

	/**
	 * Get/set the inner/outer dimension
	 */
	function getAttribute(name: string) {
		return function(element: HTMLorSVGElement, propertyValue?: string): string | boolean {
			if (propertyValue === undefined) {
				propertyValue = element.getAttribute(name);
			}
			element.setAttribute(name, propertyValue);
			return true;
		} as VelocityNormalizationsFn;
	}

	// TODO: Need a better way to determine the SVG attributes
	["width", "height", "x", "y", "cx", "cy", "r", "rx", "ry", "x1", "x2", "y1", "y2", "points"].forEach(function(attribute) {
		registerNormalization([SVGElement, attribute, getAttribute(attribute)]);
	});
	if (IE || (State.isAndroid && !State.isChrome)) {
		registerNormalization([SVGElement, "transform", getAttribute("transform")]);
	}
}
