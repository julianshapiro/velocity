///<reference path="../actions/_all.d.ts" />
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

namespace VelocityStatic {

	/**
	 * The highest type index for finding the best normalization for a property.
	 */
	export let MaxType: number = -1;

	/**
	 * Unlike "actions", normalizations can always be replaced by users.
	 */
	export const Normalizations: {[name: string]: VelocityNormalizationsFn}[] = [];

	/**
	 * Store a cross-reference to units to be added to specific normalization
	 * functions if the user supplies a unit-less number.
	 * 
	 * This is pretty much confined to adding "px" to several css properties.
	 */
	export const NormalizationUnits: {[unit: string]: VelocityNormalizationsFn[]} = createEmptyObject();

	/**
	 * Any normalisations that should never be cached are listed here.
	 * Faster than an array - https://jsperf.com/array-includes-and-find-methods-vs-set-has
	 */
	export const NoCacheNormalizations = new Set<string>();

	/**
	 * Used to define a constructor.
	 */
	interface ClassConstructor {
		new(): Object;
	}

	/**
	 * An array of classes used for the per-class normalizations. This
	 * translates into a bitwise enum for quick cross-reference, and so that
	 * the element doesn't need multiple <code>instanceof</code> calls every
	 * frame.
	 */
	export const constructors: ClassConstructor[] = [];

	/**
	 * Used to register a normalization. This should never be called by users
	 * directly, instead it should be called via an action:<br/>
	 * <code>Velocity("registerNormalization", Element, "name", VelocityNormalizationsFn[, false]);</code>
	 * 
	 * The fourth argument can be an explicit <code>false</code>, which prevents
	 * the property from being cached. Please note that this can be dangerous
	 * for performance!
	 *
	 * @private
	 */
	export function registerNormalization(args?: [ClassConstructor, string, VelocityNormalizationsFn] | [ClassConstructor, string, VelocityNormalizationsFn, boolean] | [ClassConstructor, string, VelocityNormalizationsFn, string] | [ClassConstructor, string, VelocityNormalizationsFn, string, boolean]) {
		const constructor = args[0],
			name: string = args[1],
			callback = args[2];

		if (isString(constructor) || !(constructor instanceof Object)) {
			console.warn("VelocityJS: Trying to set 'registerNormalization' constructor to an invalid value:", constructor);
		} else if (!isString(name)) {
			console.warn("VelocityJS: Trying to set 'registerNormalization' name to an invalid value:", name);
		} else if (!isFunction(callback)) {
			console.warn("VelocityJS: Trying to set 'registerNormalization' callback to an invalid value:", name, callback);
		} else {
			let index = constructors.indexOf(constructor),
				nextArg = 3;

			if (index < 0) {
				MaxType = index = constructors.push(constructor) - 1;
				Normalizations[index] = createEmptyObject();
			}
			Normalizations[index][name] = callback;
			if (isString(args[nextArg])) {
				let unit = args[nextArg++] as string,
					units = NormalizationUnits[unit];

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
			name: string = args[1];
		let index = constructors.indexOf(constructor);

		return !!Normalizations[index][name];
	}

	/**
	 * Get the unit to add to a unitless number based on the normalization used.
	 */
	export function getNormalizationUnit(fn: VelocityNormalizationsFn) {
		for (let unit in NormalizationUnits) {
			if (_inArray(NormalizationUnits[unit], fn)) {
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

		for (let index = MaxType, types = data.types; !fn && index >= 0; index--) {
			if (types & (1 << index)) {
				fn = Normalizations[index][propertyName];
			}
		}
		return fn;
	}

	registerAction(["registerNormalization", registerNormalization]);
	registerAction(["hasNormalization", hasNormalization]);
}
