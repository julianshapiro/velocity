/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Normalisations are used when getting or setting a (normally css compound
 * properties) value that can have a different order in different browsers.
 *
 * It can also be used to extend and create specific properties that otherwise
 * don't exist (such as for scrolling, or inner/outer dimensions).
 */

import { defineProperty } from "../utility";
import { Velocity } from "../velocity";
import { NormalizationUnits } from "./normalizationsObject";
import { NormalizationsFn } from "./registerNormalization";

/**
 * Get the unit to add to a unitless number based on the normalization used.
 */
export function getNormalizationUnit(fn: NormalizationsFn) {
	for (const unit in NormalizationUnits) {
		if (NormalizationUnits[unit].includes(fn)) {
			return unit;
		}
	}

	return "";
}

defineProperty(Velocity, "getNormalizationUnit", getNormalizationUnit);

declare module "../velocity" {
	export interface IStaticVelocity {
		/**
		 * Get the unit to add to a unitless number based on the normalization
		 * used.
		 */
		readonly getNormalizationUnit: typeof getNormalizationUnit;
	}
}
