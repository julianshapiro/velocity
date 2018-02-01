/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {
	if (IE <= 8) {
		/**
		 * IE8 and below returns a "filter" value of "alpha(opacity=\d{1,3})".
		 * Extract the value and convert it to a decimal value to match the
		 * standard CSS opacity property's formatting.
		 */
		function opacity(element: HTMLorSVGElement): string;
		function opacity(element: HTMLorSVGElement, propertyValue: string): boolean;
		function opacity(element: HTMLorSVGElement, propertyValue?: string): string | boolean {
			if (propertyValue === undefined) {
				let filterValue: number | string = getPropertyValue(element, "filter"),
					extracted = filterValue.toString().match(/alpha\(opacity=(.*)\)/i);

				return String(extracted ? parseInt(extracted[1]) / 100 : 1);
			}
			let value = parseFloat(propertyValue);

			// Opacified elements are required to have their zoom
			// property set to a non-zero value.
			setPropertyValue(element, "zoom", 1);
			// Setting the filter property on elements with certain font
			// property combinations can result in a highly unappealing
			// ultra-bolding effect. There's no way to remedy this through
			// a tween, but dropping the value altogether (when opacity
			// hits 1) at leasts ensures that the glitch is gone
			// post-tweening.

			// As per the filter property's spec, convert the decimal value
			// to a whole number and wrap the value.
			setPropertyValue(element, "filter", value >= 1 ? "" : "alpha(opacity=" + Math.floor(value * 100) + ")");
			return true;
		}

		registerNormalization(["opacity", opacity]);
	}
}
