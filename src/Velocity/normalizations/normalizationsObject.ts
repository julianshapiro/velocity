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
import {VelocityNormalizationsFn} from "../../../velocity.d";

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
export const NormalizationUnits: {[unit: string]: VelocityNormalizationsFn[]} = {};

/**
 * Any normalisations that should never be cached are listed here.
 * Faster than an array - https://jsperf.com/array-includes-and-find-methods-vs-set-has
 */
export const NoCacheNormalizations = new Set<string>();

/**
 * Used to define a constructor.
 */
export interface ClassConstructor {
	new(): object;
}

/**
 * An array of classes used for the per-class normalizations. This
 * translates into a bitwise enum for quick cross-reference, and so that
 * the element doesn't need multiple <code>instanceof</code> calls every
 * frame.
 */
export const constructors: (ClassConstructor | string)[] = [];

/**
 * A cache of the various constructors we've found and mapping to their real
 * name - saves expensive lookups.
 */
export const constructorCache = new Map<ClassConstructor, ClassConstructor | string>();
