///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {
	/**
	 * Handle a browser not supplying a compound borderColor property.
	 */
	function borderColor(element: HTMLorSVGElement): string;
	function borderColor(element: HTMLorSVGElement, propertyValue: string): boolean;
	function borderColor(element: HTMLorSVGElement, propertyValue?: string): string | boolean {
		if (propertyValue === undefined) {
			var top = getPropertyValue(element, "borderTopColor", true),
				right = getPropertyValue(element, "borderRightColor", true),
				bottom = getPropertyValue(element, "borderBottomColor", true),
				left = getPropertyValue(element, "borderLeftColor", true);

			if (left === right) {
				if (top === bottom) {
					if (top === left) {
						return top;
					}
					return top + " " + right;
				}
				return top + " " + right + " " + bottom;
			}
			return top + " " + right + " " + bottom + " " + left;
		}
		let sides = propertyValue.match(/((rgba?|hsla?)\([^\)]+\)|#[0-9a-f])/gi);

		if (sides.length) {
			switch (sides.length) {
				default:
					break;

				case 2:
					top = right = bottom = left = sides[1];
					break;

				case 3:
					top = bottom = sides[1];
					left = right = sides[2];
					break;

				case 4:
					top = sides[1];
					left = right = sides[2];
					bottom = sides[3];
					break;

				case 5:
					top = sides[1];
					right = sides[2];
					bottom = sides[3];
					left = sides[4];
					break;
			}
		}
		setPropertyValue(element, "borderColorTop", top);
		setPropertyValue(element, "borderColorRight", right);
		setPropertyValue(element, "borderColorBottom", bottom);
		setPropertyValue(element, "borderColorLeft", left);
		return true;
	}

	let style = State.prefixElement.style;

	if (!style.borderColor && style.borderTopColor) {
		registerNormalization(["borderColor", borderColor]);
	}
}
