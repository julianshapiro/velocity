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

import { KnownElement } from "../velocity";
import { Data } from "../data";
import { Normalizations } from ".";
import { defineProperty } from "../utility";
import { Velocity } from "../velocity";

/**
 * Get the normalization for an element and propertyName combination. This
 * value should be cached at asking time, as it may change if the user adds
 * more normalizations.
 */
export function getNormalization(element: KnownElement, propertyName: string) {
	return Normalizations.get(Data(element).symbol)?.[propertyName];
}

defineProperty(Velocity, "getNormalization", getNormalization);

declare module "../velocity" {
	export interface IStaticVelocity {
		/**
		 * Get the normalization for an element and propertyName combination. This
		 * value should be cached at asking time, as it may change if the user adds
		 * more normalizations.
		 */
		readonly getNormalization: typeof getNormalization;
	}
}
