/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { isString } from "../types";
import invariant from "tiny-invariant";

/**
 * Used to define a constructor.
 */
export interface ClassConstructor {
	new(...args: any[]): object;
}

/**
 * An array of classes used for the per-class normalizations. This
 * translates into a bitwise enum for quick cross-reference, and so that
 * the element doesn't need multiple <code>instanceof</code> calls every
 * frame.
 */
export const constructors = new Map<ClassConstructor | string, Symbol>();

/**
 * A cache of the various constructors we've found and mapping to their real
 * name - saves expensive lookups.
 */
export const constructorCache = new Map<ClassConstructor, string>();

/**
 * Get the internal symbol for a constructor. If the passed constructor is a
 * class constructor rather than a global name it will compare against the cache
 * of global constructor names.
 */
export function getConstructor(constructor: ClassConstructor | string): Symbol | undefined {
	return constructors.has(constructor)
		? constructors.get(constructor)
		: !isString(constructor) && constructorCache.has(constructor)
			? constructors.get(constructorCache.get(constructor)!)
			: undefined;
}

/**
 * Adds a constructor, checking against the global potential names if necessary.
 */
export function addConstructor(constructor: ClassConstructor | string): Symbol {
	if (!isString(constructor)) {
		for (const prop in globalThis) {
			if (prop !== "Object" && (globalThis[prop] as any) === constructor) {
				invariant(!constructors.has(prop), `VelocityJS: Trying to use 'addConstructor' on an already registered constructor.`);
				constructorCache.set(constructor as ClassConstructor, prop);
				constructor = prop; // So we can fall through but with the correct name
				break;
			}
		}
	}

	const symbol = Symbol(`velocityConstructor${isString(constructor) ? `(${constructor})` : ""}`);

	constructors.set(constructor, symbol);

	return symbol;
}
