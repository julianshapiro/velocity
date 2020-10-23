/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { KnownElement } from "../velocity";
import { Velocity } from "../velocity";
import { Data } from "../core/data";
import {
	getNormalization,
	NoCacheNormalizations,
	NormalizationsFn,
} from "../normalizations";

/**
 * The singular setPropertyValue, which routes the logic for all
 * normalizations.
 */
export function setPropertyValue(element: KnownElement, propertyName: string, propertyValue: any, fn?: NormalizationsFn) {
	const noCache = NoCacheNormalizations.has(propertyName);
	const data = noCache
		? undefined
		: Data(element);

	if (noCache || data?.cache[propertyName] !== propertyValue) {
		if (!noCache && data) {
			// By setting it to undefined we force a true "get" later
			data.cache[propertyName] = propertyValue || undefined;
		}
		(fn ?? getNormalization(element, propertyName))?.(element, propertyValue);
		if (Velocity.debug >= 2) {
			console.info(`Set "${propertyName}": "${propertyValue}"`, element);
		}
	}
}
