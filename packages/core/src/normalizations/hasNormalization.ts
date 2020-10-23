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

import { registerAction } from "../actions";
import { Normalizations } from ".";
import { ClassConstructor, getConstructor } from "../core/constructors";

/**
 * Used to check if a normalisation exists on a specific class.
 *
 * @param constructor The type of `Element`. If using ia string it will work
 * across iframe boundaries.
 *
 * @param name The name of the property to find.
 */
export function hasNormalization(constructor: ClassConstructor | string, name: string): boolean {
	const symbol = getConstructor(constructor);

	return !!(symbol && Normalizations.get(symbol)?.hasOwnProperty(name));
}

declare module "../velocity" {
	export interface IVelocity {
		/**
		 * Used to check if a normalisation exists on a specific class.
		 *
		 * @param constructor The type of `Element`. If using ia string it will work
		 * across iframe boundaries.
		 *
		 * @param name The name of the property to find.
		 */
		(action: "hasNormalization", constructor: ClassConstructor | string, name: string): boolean;
	}

	export interface IStaticVelocity {
		/**
		 * Used to check if a normalisation exists on a specific class.
		 *
		 * @param constructor The type of `Element`. If using ia string it will work
		 * across iframe boundaries.
		 *
		 * @param name The name of the property to find.
		 */
		readonly hasNormalization: typeof hasNormalization;
	}
}

registerAction("hasNormalization", hasNormalization, true, true);
