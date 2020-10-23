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
import { isFunction, isString, isBoolean } from "../types";
import { registerAction } from "../actions";
import { NoCacheNormalizations, Normalizations, NormalizationUnits } from ".";
import invariant from "tiny-invariant";
import { ClassConstructor, getConstructor, addConstructor } from "../core/constructors";

/**
 * Used for normalization callbacks.
 *
 * @param element The element to be called on.
 * @param propertyValue The value to set. If <code>undefined</code> then this is
 * a get action and must return a string value for that element.
 *
 * @returns When `propertyValue === undefined` it must return a string,
 * otherwise the return value is ignored.
 */
export type NormalizationsFn<T = KnownElement> = ((element: T, propertyValue: string) => void) & ((element: T) => string);

/**
 * Register a new normalization handler. This is the interface between
 * Velocity and the actual properties, so is responsible for reading and
 * writing any values on the `Element`, CSS, or whatever custom classes are
 * supplied.
 *
 * @param constructor Either a class name (such as `"Element"`) which should
 * appear in the `window` object, or a direct class (such as `Element`) which it
 * will attempt to find in the `window` object, and then add directly if not. If
 * the constructor is a name after this then it will work cross-iframe for all
 * animations, otherwise it will only work within the same frame (browser
 * limitation). Note that this allows animation on custom objects.
 *
 * @param property The name of the property that will be used.
 *
 * @param normalization The function to call whenever this property is
 * accessed.
 *
 * @param callback This is a callback to be used for both setting and getting
 * the value. All values *must* be strings (internal tweening will enforce
 * this), but the function can convert this to whatever is needed for storage.
 *
 * @param unit When passing a straight value to be normalised this will be added
 * if there is not already a unit then this will be appended (only useful for
 * specific CSS values which treat unitless as a specific unit).
 *
 * @param cache This is `true` by default, so can be passed a direct `false`
 * only. When disabled this will prevent Veloccity from caching the value
 * internally. Note that this is a performance problem for indirectly accessed
 * data (such as CSS properties), but should have no performance impact on
 * direct property values. This should only be set if anything can change the
 * property from outisde Velocity.
 */
export function registerNormalization(constructor: ClassConstructor | string, property: string, cache?: boolean): void;
export function registerNormalization(constructor: ClassConstructor | string, property: string, callback?: NormalizationsFn, cache?: boolean): void;
export function registerNormalization(constructor: ClassConstructor | string, property: string, callback?: NormalizationsFn, unit?: string, cache?: boolean): void;
export function registerNormalization(constructor: ClassConstructor | string, property: string, maybeCallback?: NormalizationsFn | boolean, maybeUnit?: string | boolean, maybeCache?: boolean): void {
	invariant(((isString(constructor) && (window[constructor] instanceof Object))
		|| (!isString(constructor) && (constructor instanceof Object))),
		`VelocityJS: Trying to set 'registerNormalization' constructor to an invalid value.`);
	invariant(isString(property), `VelocityJS: Trying to set 'registerNormalization' name to an invalid value.`);
	invariant(maybeCallback === undefined || isFunction(maybeCallback) || isBoolean(maybeCallback),
		`VelocityJS: Trying to set 'registerNormalization' callback to an invalid value.`);
	invariant(maybeUnit === undefined || isString(maybeUnit) || isBoolean(maybeUnit),
		`VelocityJS: Trying to set 'registerNormalization' unit to an invalid value.`);
	invariant(maybeCache === undefined || isBoolean(maybeCache),
		`VelocityJS: Trying to set 'registerNormalization' cache to an invalid value.`);

	const callback = isFunction(maybeCallback)
		? maybeCallback
		: undefined;
	const unit = isString(maybeUnit)
		? maybeUnit : undefined;
	const cache = isBoolean(maybeCallback)
		? maybeCallback
		: isBoolean(maybeUnit)
			? maybeUnit
			: isBoolean(maybeCache)
				? maybeCache
				: undefined;
	const symbol = getConstructor(constructor) ?? addConstructor(constructor);

	if (!Normalizations.has(symbol)) {
		Normalizations.set(symbol, {});
	}
	if (callback) {
		Normalizations.get(symbol)![property] = callback;
		if (isString(unit)) {
			let units = NormalizationUnits[unit];

			if (!units) {
				units = NormalizationUnits[unit] = [];
			}
			units.push(callback);
		}
	}
	if (cache === false) {
		NoCacheNormalizations.add(property);
	}
}

registerAction("registerNormalization", registerNormalization, true, true);

declare module "../velocity" {
	export interface IVelocity {
		/**
		 * Register a new normalization handler. This is the interface between
		 * Velocity and the actual properties, so is responsible for reading and
		 * writing any values on the `Element`, CSS, or whatever custom classes are
		 * supplied.
		 *
		 * @param constructor Either a class name (such as `"Element"`) which should
		 * appear in the `window` object, or a direct class (such as `Element`) which it
		 * will attempt to find in the `window` object, and then add directly if not. If
		 * the constructor is a name after this then it will work cross-iframe for all
		 * animations, otherwise it will only work within the same frame (browser
		 * limitation). Note that this allows animation on custom objects.
		 *
		 * @param property The name of the property that will be used.
		 *
		 * @param normalization The function to call whenever this property is
		 * accessed.
		 *
		 * @param callback This is a callback to be used for both setting and getting
		 * the value. All values *must* be strings (internal tweening will enforce
		 * this), but the function can convert this to whatever is needed for storage.
		 *
		 * @param unit When passing a straight value to be normalised this will be added
		 * if there is not already a unit then this will be appended (only useful for
		 * specific CSS values which treat unitless as a specific unit).
		 *
		 * @param cache This is `true` by default, so can be passed a direct `false`
		 * only. When disabled this will prevent Veloccity from caching the value
		 * internally. Note that this is a performance problem for indirectly accessed
		 * data (such as CSS properties), but should have no performance impact on
		 * direct property values. This should only be set if anything can change the
		 * property from outisde Velocity.
		 */
		(action: "registerNormalization", constructor: ClassConstructor | string, property: string, cache?: boolean): void;
		(action: "registerNormalization", constructor: ClassConstructor | string, property: string, callback?: NormalizationsFn, cache?: boolean): void;
		(action: "registerNormalization", constructor: ClassConstructor | string, property: string, callback?: NormalizationsFn, unit?: string, cache?: boolean): void;
	}

	export interface IStaticVelocity {
		/**
		 * Register a new normalization handler. This is the interface between
		 * Velocity and the actual properties, so is responsible for reading and
		 * writing any values on the `Element`, CSS, or whatever custom classes are
		 * supplied.
		 *
		 * @param constructor Either a class name (such as `"Element"`) which should
		 * appear in the `window` object, or a direct class (such as `Element`) which it
		 * will attempt to find in the `window` object, and then add directly if not. If
		 * the constructor is a name after this then it will work cross-iframe for all
		 * animations, otherwise it will only work within the same frame (browser
		 * limitation). Note that this allows animation on custom objects.
		 *
		 * @param property The name of the property that will be used.
		 *
		 * @param normalization The function to call whenever this property is
		 * accessed.
		 *
		 * @param callback This is a callback to be used for both setting and getting
		 * the value. All values *must* be strings (internal tweening will enforce
		 * this), but the function can convert this to whatever is needed for storage.
		 *
		 * @param unit When passing a straight value to be normalised this will be added
		 * if there is not already a unit then this will be appended (only useful for
		 * specific CSS values which treat unitless as a specific unit).
		 *
		 * @param cache This is `true` by default, so can be passed a direct `false`
		 * only. When disabled this will prevent Veloccity from caching the value
		 * internally. Note that this is a performance problem for indirectly accessed
		 * data (such as CSS properties), but should have no performance impact on
		 * direct property values. This should only be set if anything can change the
		 * property from outisde Velocity.
		 */
		readonly registerNormalization: typeof registerNormalization;
	}
}
