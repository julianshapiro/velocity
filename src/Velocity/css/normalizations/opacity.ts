/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {

	export namespace CSS {
		export function opacity(type, element, propertyValue) {
			if (IE <= 8) {
				switch (type) {
					case "name":
						return "filter";
					case "extract":
						/* <=IE8 return a "filter" value of "alpha(opacity=\d{1,3})".
						Extract the value and convert it to a decimal value to match the standard CSS opacity property's formatting. */
						let extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);

						if (extracted) {
							/* Convert to decimal value. */
							propertyValue = extracted[1] / 100;
						} else {
							/* When extracting opacity, default to 1 since a null value means opacity hasn't been set. */
							propertyValue = 1;
						}

						return propertyValue;
					case "inject":
						/* Opacified elements are required to have their zoom property set to a non-zero value. */
						element.style.zoom = "1";

						/* Setting the filter property on elements with certain font property combinations can result in a
						highly unappealing ultra-bolding effect. There's no way to remedy this throughout a tween, but dropping the
						value altogether (when opacity hits 1) at leasts ensures that the glitch is gone post-tweening. */
						if (parseFloat(propertyValue) >= 1) {
							return "";
						} else {
							/* As per the filter property's spec, convert the decimal value to a whole number and wrap the value. */
							return "alpha(opacity=" + parseInt((parseFloat(propertyValue) * 100) as any, 10) + ")";
						}
				}
				/* With all other browsers, normalization is not required; return the same values that were passed in. */
			} else {
				switch (type) {
					case "name":
						return "opacity";
					case "extract":
						return propertyValue;
					case "inject":
						return propertyValue;
				}
			}
		}

		registerNormalization(["opacity", opacity]);
	}
}

