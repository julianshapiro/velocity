/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {

	const rxDegree = /^(rotate|skew)/i,
		rxUnitless = /^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight|opacity)$/i, // TODO: These are wrong
		rxShortForm = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
		rxLongForm = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
		rxCSSNull = /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i;

	/************************
	 CSS Property Values
	 ************************/

	export const Values = {
		/* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
		hexToRgb: function(hex: string): [number, number, number] {
			let rgbParts;

			hex = hex.replace(rxShortForm, function(m, r, g, b) {
				return r + r + g + g + b + b;
			});

			rgbParts = rxLongForm.exec(hex);

			return rgbParts ? [parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16)] : [0, 0, 0];
		},
		isCSSNullValue: function(value: any): boolean {
			/* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
			 Thus, we check for both falsiness and these special strings. */
			/* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
			 templates as defined as Hooks (for the sake of hook injection/extraction). */
			/* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
			return (!value || rxCSSNull.test(value));
		},
		/* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
		getUnitType: function(property: string): string {
			if (rxDegree.test(property)) {
				return "deg";
			} else if (rxUnitless.test(property)) {
				/* The above properties are unitless. */
				return "";
			} else {
				/* Default to px for all other properties. */
				return "px";
			}
		},
		/* The class add/remove functions are used to temporarily apply a "velocity-animating" class to elements while they're animating. */
		addClass: function(element: HTMLorSVGElement, className: string): void {
			if (element) {
				if (element.classList) {
					element.classList.add(className);
				} else if (isString(element.className)) {
					// Element.className is around 15% faster then set/getAttribute
					element.className += (element.className.length ? " " : "") + className;
				} else {
					// Work around for IE strict mode animating SVG - and anything else that doesn't behave correctly - the same way jQuery does it
					const currentClass = element.getAttribute(IE <= 7 ? "className" : "class") || "";

					element.setAttribute("class", currentClass + (currentClass ? " " : "") + className);
				}
			}
		},
		removeClass: function(element: HTMLorSVGElement, className: string): void {
			if (element) {
				if (element.classList) {
					element.classList.remove(className);
				} else if (isString(element.className)) {
					// Element.className is around 15% faster then set/getAttribute
					// TODO: Need some jsperf tests on performance - can we get rid of the regex and maybe use split / array manipulation?
					element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
				} else {
					// Work around for IE strict mode animating SVG - and anything else that doesn't behave correctly - the same way jQuery does it
					const currentClass = element.getAttribute(IE <= 7 ? "className" : "class") || "";

					element.setAttribute("class", currentClass.replace(new RegExp("(^|\s)" + className.split(" ").join("|") + "(\s|$)", "gi"), " "));
				}
			}
		}
	};
}
