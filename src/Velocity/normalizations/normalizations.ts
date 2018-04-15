/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Normalisations are used when getting or setting a (normally css compound
 * properties) value that can have a different order in different browsers.
 *
 * It can also be used to extend and create specific properties that otherwise
 * don't exist (such as for scrolling, or inner/outer dimensions).
 */

import {
	HTMLorSVGElement,
	VelocityNormalizationsFn,
} from "../../../index.d";

import {isFunction, isString} from "../../types";
import {registerAction} from "../actions/actions";
import {Data} from "../data";

import {ClassConstructor, constructors, NoCacheNormalizations, Normalizations, NormalizationUnits} from "./normalizationsObject";

/**
 * Used to register a normalization. This should never be called by users
 * directly, instead it should be called via an action:<br/>
 * <code>Velocity("registerNormalization", Element, "name", VelocityNormalizationsFn[, false]);</code>
 *
 * The fourth argument can be an explicit <code>false</code>, which prevents
 * the property from being cached. Please note that this can be dangerous
 * for performance!
 */
export function registerNormalization(
	args?: [ClassConstructor, string, VelocityNormalizationsFn]
		| [ClassConstructor, string, VelocityNormalizationsFn, boolean]
		| [ClassConstructor, string, VelocityNormalizationsFn, string]
		| [ClassConstructor, string, VelocityNormalizationsFn, string, boolean]) {
	const constructor = args[0],
		name: string = args[1],
		callback = args[2];

	if (isString(constructor) || !(constructor instanceof Object)) {
		console.warn(`VelocityJS: Trying to set 'registerNormalization' constructor to an invalid value:`, constructor);
	} else if (!isString(name)) {
		console.warn(`VelocityJS: Trying to set 'registerNormalization' name to an invalid value:`, name);
	} else if (!isFunction(callback)) {
		console.warn(`VelocityJS: Trying to set 'registerNormalization' callback to an invalid value:`, name, callback);
	} else {
		let index = constructors.indexOf(constructor),
			nextArg = 3;

		if (index < 0) {
			index = constructors.push(constructor) - 1;
			Normalizations[index] = {};
		}
		Normalizations[index][name] = callback;
		if (isString(args[nextArg])) {
			const unit = args[nextArg++] as string;
			let units = NormalizationUnits[unit];

			if (!units) {
				units = NormalizationUnits[unit] = [];
			}
			units.push(callback);
		}
		if (args[nextArg] === false) {
			NoCacheNormalizations.add(name);
		}
	}
}

/**
 * Used to check if a normalisation exists on a specific class.
 */
export function hasNormalization(args?: [ClassConstructor, string]) {
	const constructor = args[0],
		name: string = args[1],
		index = constructors.indexOf(constructor);

	return !!Normalizations[index][name];
}

/**
 * Get the unit to add to a unitless number based on the normalization used.
 */
export function getNormalizationUnit(fn: VelocityNormalizationsFn) {
	for (const unit in NormalizationUnits) {
		if (NormalizationUnits[unit].includes(fn)) {
			return unit;
		}
	}

	return "";
}

/**
 * Get the normalization for an element and propertyName combination. This
 * value should be cached at asking time, as it may change if the user adds
 * more normalizations.
 */
export function getNormalization(element: HTMLorSVGElement, propertyName: string) {
	const data = Data(element);
	let fn: VelocityNormalizationsFn;

	for (let index = constructors.length - 1, types = data.types; !fn && index >= 0; index--) {
		if (types & (1 << index)) { // tslint:disable-line:no-bitwise
			fn = Normalizations[index][propertyName];
		}
	}

	return fn;
}

registerAction(["registerNormalization", registerNormalization]);
registerAction(["hasNormalization", hasNormalization]);
