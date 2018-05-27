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

/**
 * The singular setPropertyValue, which routes the logic for all
 * normalizations.
 */
export function setPropertyValue(element: HTMLorSVGElement, propertyName: string, propertyValue: any, fn?: VelocityNormalizationsFn) {
	const data = Data(element);

	if (data && data.cache[propertyName] !== propertyValue) {
		// By setting it to undefined we force a true "get" later
		data.cache[propertyName] = propertyValue || undefined;
		fn = fn || getNormalization(element, propertyName);
		if (fn) {
			fn(element, propertyValue);
		}
		if (Velocity.debug >= 2) {
			console.info(`Set "${propertyName}": "${propertyValue}"`, element);
		}
	}
}
