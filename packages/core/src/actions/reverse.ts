/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Actions that can be performed by passing a string instead of a propertiesMap.
 */

import type { IAnimation } from "../core/animation";
import { registerAction } from "./registerAction";
import { Options } from "../core/options";

// NOTE: Code needs to split out before here - but this is needed to prevent it being overridden
registerAction("reverse", () => {
	throw new SyntaxError("VelocityJS: The 'reverse' action is built in and private.");
}, true, true);

declare module "../velocity" {
	export interface IVelocity {
		/**
		 * Reverse the most recent animations on the supplied elements.
		 *
		 * @param elements An `Element`, or an array-like list of `Elements` to
		 * process.
		 */
		(elements: KnownElement, action: "reverse", complete?: () => void): IAnimation;
		(this: IAnimation, action: "reverse", complete?: () => void): IAnimation;

		/**
		 * Reverse the most recent animations on the supplied elements.
		 *
		 * @param elements An `Element`, or an array-like list of `Elements` to
		 * process.
		 * @param duration How long the animation should run in ms.
		 * @param complete A function to call when finished.
		 */
		(elements: KnownElement, action: "reverse", duration?: number | "fast" | "normal" | "slow", complete?: () => void): IAnimation;
		(this: IAnimation, action: "reverse", duration?: number | "fast" | "normal" | "slow", complete?: () => void): IAnimation;

		/**
		 * Reverse the most recent animations on the supplied elements.
		 *
		 * @param elements An `Element`, or an array-like list of `Elements` to
		 * process.
		 * @param duration How long the animation should run in ms.
		 * @param easing The default easing to apply.
		 * @param complete A function to call when finished.
		 */
		(elements: KnownElement, action: "reverse", duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): IAnimation;
		(this: IAnimation, action: "reverse", duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): IAnimation;

		/**
		 * Reverse the most recent animations on the supplied elements.
		 *
		 * @param elements An `Element`, or an array-like list of `Elements` to
		 * process.
		 * @param easing The default easing to apply.
		 * @param complete A function to call when finished.
		 */
		(elements: KnownElement, action: "reverse", easing?: string | number[], complete?: () => void): IAnimation;
		(this: IAnimation, action: "reverse", easing?: string | number[], complete?: () => void): IAnimation;

		/**
		 * Reverse the most recent animations on the supplied elements.
		 *
		 * @param elements An `Element`, or an array-like list of `Elements` to
		 * process.
		 * @param options The options to apply.
		 */
		(elements: KnownElement, action: "reverse", options?: Options): IAnimation;
		(this: IAnimation, action: "reverse", options?: Options): IAnimation;
	}
}
