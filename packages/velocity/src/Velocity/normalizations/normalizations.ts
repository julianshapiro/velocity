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

// Typedefs
import {HTMLorSVGElement, VelocityNormalizationsFn} from "../../../velocity.d";

// Project
import {isFunction, isString} from "../../types";
import {registerAction} from "../actions/actions";
import {Data} from "../data";
import {ClassConstructor, constructorCache, constructors, NoCacheNormalizations, Normalizations, NormalizationUnits} from "./normalizationsObject";

/**
 * Used to register a normalization. This should never be called by users
 * directly, instead it should be called via an action:<br/>
 * <code>Velocity("registerNormalization", "Element", "name", VelocityNormalizationsFn[, false]);</code>
 *
 * The second argument is the class of the animatable object. If this is passed
 * as a class name (ie, `"Element"` -> `window["Element"]`) then this will work
 * cross-iframe. If passed as an actual class (ie `Element`) then it will
 * attempt to find the class on the window and use that name instead. If it
 * can't find it then it will use the class passed, which allows for custom
 * animation targets, but will not work cross-iframe boundary.
 *
 * The fourth argument can be an explicit <code>false</code>, which prevents
 * the property from being cached. Please note that this can be dangerous
 * for performance!
 */
export function registerNormalization(
	args?: [ClassConstructor | string, string, VelocityNormalizationsFn]
		| [ClassConstructor | string, string, VelocityNormalizationsFn, boolean]
		| [ClassConstructor | string, string, VelocityNormalizationsFn, string]
		| [ClassConstructor | string, string, VelocityNormalizationsFn, string, boolean]) {
	const constructor = args[0],
		name: string = args[1],
		callback = args[2];

	if ((isString(constructor) && !(window[constructor] instanceof Object))
		|| (!isString(constructor) && !(constructor instanceof Object))) {
		console.warn(`VelocityJS: Trying to set 'registerNormalization' constructor to an invalid value:`, constructor);
	} else if (!isString(name)) {
		console.warn(`VelocityJS: Trying to set 'registerNormalization' name to an invalid value:`, name);
	} else if (!isFunction(callback)) {
		console.warn(`VelocityJS: Trying to set 'registerNormalization' callback to an invalid value:`, name, callback);
	} else {
		let index = constructors.indexOf(constructor),
			nextArg = 3;

		if (index < 0 && !isString(constructor)) {
			if (constructorCache.has(constructor)) {
				index = constructors.indexOf(constructorCache.get(constructor));
			} else {
				for (const property in window) {
					if (window[property] === constructor) {
						index = constructors.indexOf(property);
						if (index < 0) {
							index = constructors.push(property) - 1;
							Normalizations[index] = {};
							constructorCache.set(constructor, property);
						}
						break;
					}
				}
			}
		}
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
export function hasNormalization(args?: [ClassConstructor | string, string]): boolean {
	const constructor = args[0],
		name: string = args[1];
	let index = constructors.indexOf(constructor);

	if (index < 0 && !isString(constructor)) {
		if (constructorCache.has(constructor)) {
			index = constructors.indexOf(constructorCache.get(constructor));
		} else {
			for (const property in window) {
				if (window[property] === constructor) {
					index = constructors.indexOf(property);
					break;
				}
			}
		}
	}

	return index >= 0 && Normalizations[index].hasOwnProperty(name);
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
