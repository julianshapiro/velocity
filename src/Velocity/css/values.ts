/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {

	const rxDegree = /^(rotate|skew)/i,
		rxUnitless = /^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight|opacity)$/i, // TODO: These are wrong
		rxCSSNull = /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i;

	/************************
	 CSS Property Values
	 ************************/

	export const Values = {
		/**
		 * Retrieve a property's default unit type. Used for assigning a unit
		 * type when one is not supplied by the user.
		 */
		getUnitType: function(property: string): string {
			if (rxDegree.test(property)) {
				return "deg";
			}
			if (rxUnitless.test(property)) {
				/* The above properties are unitless. */
				return "";
			}
			/* Default to px for all other properties. */
			return "px";
		},
		/**
		 * Add a single className to an Element.
		 */
		addClass: function(element: HTMLorSVGElement, className: string): void {
			if (element instanceof Element) {
				if (element.classList) {
					element.classList.add(className);
				} else if (isString(element.className)) {
					// Element.className is around 15% faster then set/getAttribute
					element.className += (element.className.length ? " " : "") + className;
				} else {
					const currentClass = element.getAttribute("class") || "";

					element.setAttribute("class", currentClass + (currentClass ? " " : "") + className);
				}
			}
		},
		/**
		 * Remove a single className from an Element.
		 */
		removeClass: function(element: HTMLorSVGElement, className: string): void {
			if (element instanceof Element) {
				if (element.classList) {
					element.classList.remove(className);
				} else {
					const rx = new RegExp("(^|\\s)" + className + "(\\s|$)", "gi");

					if (isString(element.className)) {
						// Element.className is around 15% faster then set/getAttribute
						// TODO: Need some jsperf tests on performance - can we get rid of the regex and maybe use split / array manipulation?
						element.className = element.className.toString().replace(rx, " ");
					} else {
						const currentClass = element.getAttribute("class") || "";

						element.setAttribute("class", currentClass.replace(rx, " "));
					}
				}
			}
		}
	};
}
