/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import type { EasingFn } from ".";
import { isFunction, isString } from "../types";
import { registerAction } from "../actions";
import invariant from "tiny-invariant";
import { defineProperty } from "../utility";
import { Easings } from "./easingsObject";

/**
 * Used to register an easing. Easings are named tweens that are available to
 * all animations for the shape of the animation.
 *
 * @param name The name of the easing.
 *
 * @param callback The function to be called when the easing occurs.
 */
export function registerEasing(name: string, callback: EasingFn) {
	invariant(isString(name), `VelocityJS: Trying to set 'registerEasing' name to an invalid value`)
	invariant(isFunction(callback), `VelocityJS: Trying to set 'registerEasing' callback to an invalid value`);
	invariant(!Easings[name], `VelocityJS: Trying to override 'registerEasing' callback`);
	defineProperty(Easings, name, callback);
}

registerAction("registerEasing", registerEasing, true, true);

declare module "../velocity" {
	export interface IStaticVelocity {
		/**
		 * Used to register an easing. Easings are named tweens that are available to
		 * all animations for the shape of the animation.
		 *
		 * @param name The name of the easing.
		 *
		 * @param callback The function to be called when the easing occurs.
		 */
		readonly registerEasing: (name: string, callback: EasingFn) => void;
	}
}
