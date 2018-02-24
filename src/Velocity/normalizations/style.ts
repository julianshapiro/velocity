///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 * 
 * This handles all CSS style properties. With browser prefixed properties it
 * will register a version that handles setting (and getting) both the prefixed
 * and non-prefixed version.
 */

namespace VelocityStatic {

	/**
	 * Return a Normalisation that can be used to set / get a prefixed style
	 * property.
	 */
	function getSetPrefixed(propertyName: string, unprefixed: string) {
		return function(element: HTMLorSVGElement, propertyValue?: string): string | void {
			if (propertyValue === undefined) {
				return CSS.computePropertyValue(element, propertyName) || CSS.computePropertyValue(element, unprefixed);
			}
			element.style[propertyName] = element.style[unprefixed] = propertyValue;
		} as VelocityNormalizationsFn;
	}

	/**
	 * Return a Normalisation that can be used to set / get a style property.
	 */
	function getSetStyle(propertyName: string) {
		return function(element: HTMLorSVGElement, propertyValue?: string): string | void {
			if (propertyValue === undefined) {
				return CSS.computePropertyValue(element, propertyName);
			}
			element.style[propertyName] = propertyValue;
		} as VelocityNormalizationsFn;
	}

	const rxVendors = /^(webkit|moz|ms|o)[A-Z]/,
		rxUnit = /^\d+([a-z]+)/,
		prefixElement = State.prefixElement;

	for (const propertyName in prefixElement.style) {
		if (rxVendors.test(propertyName)) {
			let unprefixed = propertyName.replace(/^[a-z]+([A-Z])/, ($, letter: string) => letter.toLowerCase());

			if (ALL_VENDOR_PREFIXES || isString(prefixElement.style[unprefixed])) {
				registerNormalization([Element, unprefixed, getSetPrefixed(propertyName, unprefixed)]);
			}
		} else if (!hasNormalization([Element, propertyName])) {
			registerNormalization([Element, propertyName, getSetStyle(propertyName)]);
		}
	}
}
