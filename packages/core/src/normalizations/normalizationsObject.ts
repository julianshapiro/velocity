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

import { NormalizationsFn } from ".";

/**
 * Unlike "actions", normalizations can always be replaced by users.
 */
export const Normalizations = new Map<Symbol, Record<string, NormalizationsFn>>();

/**
 * Store a cross-reference to units to be added to specific normalization
 * functions if the user supplies a unit-less number.
 *
 * This is pretty much confined to adding "px" to several css properties.
 */
export const NormalizationUnits: Record<string, NormalizationsFn[]> = {};

/**
 * Any normalisations that should never be cached are listed here.
 * Faster than an array - https://jsperf.com/array-includes-and-find-methods-vs-set-has
 */
export const NoCacheNormalizations = new Set<string>();
