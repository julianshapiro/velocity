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

import {isFunction, isString} from "../types";
import {registerAction} from "../actions/actions";

/**
 * Unlike "actions", normalizations can always be replaced by users.
 */
export const Normalizations: { [name: string]: VelocityNormalizationsFn }[] = [];

/**
 * Any normalisations that should never be cached are listed here.
 * Faster than an array - https://jsperf.com/array-includes-and-find-methods-vs-set-has
 */
export const NoCacheNormalizations = new Set<string>();

/**
 * Used to define a constructor.
 */
export interface ClassConstructor {
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
export function registerNormalization(args?: [ClassConstructor, string, VelocityNormalizationsFn] | [ClassConstructor, string, VelocityNormalizationsFn, boolean]) {
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
    let index = constructors.indexOf(constructor);

    if (index < 0) {
      index = constructors.push(constructor) - 1;
      Normalizations[index] = Object.create(null);
    }
    Normalizations[index][name] = callback;
    if (args[3] === false) {
      NoCacheNormalizations.add(name);
    }
  }
}

registerAction(["registerNormalization", registerNormalization as any]);
