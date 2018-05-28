/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

// Typedefs
import {HTMLorSVGElement, VelocityNormalizationsFn} from "../../../velocity.d";

// Project
import Velocity from "../../velocity";
import {Data} from "../data";
import {getNormalization} from "../normalizations/normalizations";
import {NoCacheNormalizations} from "../normalizations/normalizationsObject";

/**
 * The singular setPropertyValue, which routes the logic for all
 * normalizations.
 */
export function setPropertyValue(element: HTMLorSVGElement, propertyName: string, propertyValue: any, fn?: VelocityNormalizationsFn) {
	const noCache = NoCacheNormalizations.has(propertyName),
		data = !noCache && Data(element);

	if (noCache || (data && data.cache[propertyName] !== propertyValue)) {
		// By setting it to undefined we force a true "get" later
		if (!noCache) {
			data.cache[propertyName] = propertyValue || undefined;
		}
		fn = fn || getNormalization(element, propertyName);
		if (fn) {
			fn(element, propertyValue);
		}
		if (Velocity.debug >= 2) {
			console.info(`Set "${propertyName}": "${propertyValue}"`, element);
		}
	}
}
