/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {

	export namespace CSS {

		export function genericReordering(element, propertyValue) {
			if (propertyValue && propertyValue.length > 0) {

				let newString = "";

				const splittedPropertyValue = propertyValue.split(/\s/g);

				const firstSplittedElement = splittedPropertyValue[0];

				if (Lists.colorNames[firstSplittedElement]) {
					splittedPropertyValue.shift();
					splittedPropertyValue.push(firstSplittedElement);
					newString = splittedPropertyValue.join(" ");
				} else if (firstSplittedElement.match(/#|hsl|rgb|.*gradient/)) {

					let matchedString = propertyValue.match(/(hsl.*\)|#\d+|rgb.*\)|.*gradient.*\))\s/g)[0];

					newString = propertyValue.replace(matchedString, "");
					newString += ` ${matchedString.trim()}`
				} else {
					newString = propertyValue;
				}

				return newString;
			}
		}

		registerNormalization(["textShadow", genericReordering]);
	}
}

