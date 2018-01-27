///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {

	/**
	 * Return a Normalisation that can be used to set / get the vendor prefixed
	 * real name for a propery.
	 */
	function vendorPrefix(property: string, unprefixed: string) {
		return function(element: HTMLorSVGElement, propertyValue?: string): string | boolean {
			if (propertyValue === undefined) {
				return element.style[unprefixed];
			}
			CSS.setPropertyValue(element, property, propertyValue);
			return true;
		} as VelocityNormalizationsFn;
	}

	const vendors = [/^webkit[A-Z]/, /^moz[A-Z]/, /^ms[A-Z]/, /^o[A-Z]/],
		prefixElement = State.prefixElement;

	for (const property in prefixElement.style) {
		for (let i = 0; i < vendors.length; i++) {
			if (vendors[i].test(property)) {
				let unprefixed = property.replace(/^[a-z]+([A-Z])/, ($, letter: string) => letter.toLowerCase());

				if (ALL_VENDOR_PREFIXES || isString(prefixElement.style[unprefixed])) {
					registerNormalization([Element, unprefixed, vendorPrefix(property, unprefixed)]);
				}
			}
		}
	}
}
