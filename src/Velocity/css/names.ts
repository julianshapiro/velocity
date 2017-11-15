///<reference path="../state.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {
	/************************
	 CSS Property Names
	 ************************/

	/* Certain browsers require an SVG transform to be applied as an attribute. (Otherwise, application via CSS is preferable due to 3D support.) */
	let SVGAttributes = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2" + (IE || (State.isAndroid && !State.isChrome) ? "|transform" : ""),
		SVGAttributesRX = RegExp("^(" + SVGAttributes + ")$", "i");

	export let Names = {
		/* Camelcase a property name into its JavaScript notation (e.g. "background-color" ==> "backgroundColor").
		 Camelcasing is used to normalize property names between and across calls. */
		camelCase: function(property: string): string {
			return property.replace(/-(\w)/g, function(match: string, subMatch: string) {
				return subMatch.toUpperCase();
			});
		},
		/* For SVG elements, some properties (namely, dimensional ones) are GET/SET via the element's HTML attributes (instead of via CSS styles). */
		// TODO: Convert to Normalisations
		SVGAttribute: function(property: string): boolean {
			return SVGAttributesRX.test(property);
		},
		/* Determine whether a property should be set with a vendor prefix. */
		/* If a prefixed version of the property exists, return it. Otherwise, return the original property name.
		 If the property is not at all supported by the browser, return a false flag. */
		// TODO: Convert to Normalisations
		prefixCheck: function(property: string): [string, boolean] {
			/* If this property has already been checked, return the cached value. */
			if (State.prefixMatches[property]) {
				return [State.prefixMatches[property], true];
			} else {
				let vendors = ["", "Webkit", "Moz", "ms", "O"];

				for (let i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
					let propertyPrefixed;

					if (i === 0) {
						propertyPrefixed = property;
					} else {
						/* Capitalize the first letter of the property to conform to JavaScript vendor prefix notation (e.g. webkitFilter). */
						propertyPrefixed = vendors[i] + property.replace(/^\w/, function(match) {
							return match.toUpperCase();
						});
					}

					/* Check if the browser supports this property as prefixed. */
					let prefixElement = State.prefixElement;

					if (prefixElement && isString(prefixElement.style[propertyPrefixed])) {
						/* Cache the match. */
						State.prefixMatches[property] = propertyPrefixed;

						return [propertyPrefixed, true];
					}
				}

				/* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
				return [property, false];
			}
		}
	};
}