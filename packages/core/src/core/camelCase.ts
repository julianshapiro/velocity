/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

/**
 * Cache every camelCase match to avoid repeating lookups.
 */
const cache: Record<string, string> = {};

/**
 * Camelcase a property name into its JavaScript notation (e.g.
 * "background-color" ==> "backgroundColor"). Camelcasing is used to
 * normalize property names between and across calls.
 */
export const camelCase = (property: string): string =>
	cache[property] ??= property.replace(/-([a-z])/g, (_: unknown, letter: string) => letter.toUpperCase());
