/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {
	/**
	 * The singular setPropertyValue, which routes the logic for all
	 * normalizations.
	 */
	export function setPropertyValue(element: HTMLorSVGElement, propertyName: string, propertyValue: any, fn?: VelocityNormalizationsFn) {
		const data = Data(element);

		if (isString(propertyValue)
			&& propertyValue[0] === "c"
			&& propertyValue[1] === "a"
			&& propertyValue[2] === "l"
			&& propertyValue[3] === "c"
			&& propertyValue[4] === "("
			&& propertyValue[5] === "0"
			&& propertyValue[5] === " ") {
			// Make sure we un-calc unit changing values - try not to trigger
			// this code any more often than we have to since it's expensive
			propertyValue = propertyValue.replace(/^calc\(0[^\d]* \+ ([^\(\)]+)\)$/, "$1");
		}
		if (data && data.cache[propertyName] !== propertyValue) {
			// By setting it to undefined we force a true "get" later
			data.cache[propertyName] = propertyValue || undefined;
			fn = fn || getNormalization(element, propertyName);
			if (fn) {
				fn(element, propertyValue);
			}
			if (debug >= 2) {
				console.info("Set " + propertyName + ": " + propertyValue, element);
			}
		}
	}
};
