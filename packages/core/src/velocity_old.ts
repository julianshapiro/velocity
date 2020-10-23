/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity typings.
 */

import { EasingType, VelocityPropertyFn, KnownElement } from "./velocity";
import { EasingFn } from "./easings";
import { NormalizationsFn } from "./normalizations/registerNormalization";

/**
 * Direct Velocity access.
 */
// export interface Velocity<T> {
// 	/********************
// 	 * Calling Velocity *
// 	 ********************/

// 	/**
// 	 * Set the value of an option on a running animation. This performs some
// 	 * validation on the named option as only some are available to set at
// 	 * runtime.
// 	 *
// 	 * @param elements An `Element`, or an array-like list of `Elements` to
// 	 * process.
// 	 * @param option The name of the option to get.
// 	 * @param value The value to set it to.
// 	 */
// 	(elements: T, action: "option", option: string, value: any): VelocityResult;

// 	/**
// 	 * Get the value of an option on a running animation.
// 	 *
// 	 * @param elements An `Element`, or an array-like list of `Elements` to
// 	 * process.
// 	 * @param option The name of the option to get.
// 	 */
// 	(elements: T, action: "option", option: string): any;

// 	/**
// 	 * Set the value of an option on a running animation. This performs some
// 	 * validation on the named option as only some are available to set at
// 	 * runtime.
// 	 *
// 	 * @param option The name of the option to get.
// 	 * @param value The value to set it to.
// 	 */
// 	(this: T, action: "option", option: string, value: any): VelocityResult;

// 	/**
// 	 * Get the value of an option on a running animation.
// 	 *
// 	 * @param option The name of the option to get.
// 	 */
// 	(this: T, action: "option", option: string): any;

// 	/**
// 	 * Register a new easing handler.
// 	 *
// 	 * @param name The name of the easing to add.
// 	 * @param easing The function to call when this easing is used.
// 	 */
// 	(action: "registerEasing", name: string, easing: VelocityEasingFn): void;

// 	/**
// 	 * Get the tween value for one or more elements using an animation at a
// 	 * specific percentage complete. This does not animate the elements, just
// 	 * obtains the values based on the current properties.
// 	 *
// 	 * @param percentComplete What specific percentage is needed (0 <= x <= 1)
// 	 * @param property The property to animate.
// 	 * @param value The end value or forcefed value.
// 	 * @param easing The easing to use.
// 	 */
// 	(this: T, action: "tween", percentComplete: number, property: string, value: VelocityPropertyValue, easing?: VelocityEasingType): string;

// 	/**
// 	 * Get the tween value for one or more elements using an animation at a
// 	 * specific percentage complete. This does not animate the elements, just
// 	 * obtains the values based on the current properties.
// 	 *
// 	 * @param elements An `Element`, or an array-like list of `Elements` to
// 	 * process.
// 	 * @param percentComplete What specific percentage is needed (0 <= x <= 1)
// 	 * @param property The property to animate.
// 	 * @param value The end value or forcefed value.
// 	 * @param easing The easing to use.
// 	 */
// 	(elements: T, action: "tween", percentComplete: number, property: string, value: VelocityPropertyValue, easing?: VelocityEasingType): string;

// 	/**
// 	 * Get the tween value for one or more elements using an animation at a
// 	 * specific percentage complete. This does not animate the elements, just
// 	 * obtains the values based on the current properties.
// 	 *
// 	 * @param percentComplete What specific percentage is needed (0 <= x <= 1)
// 	 * @param propertyMap The `key: value` property map to animate to.
// 	 * @param easing The easing to use.
// 	 */
// 	(this: T, action: "tween", percentComplete: number, propertyMap: Properties<VelocityProperty>, easing?: VelocityEasingType): Properties<string>;

// 	/**
// 	 * Get the tween value for one or more elements using an animation at a
// 	 * specific percentage complete. This does not animate the elements, just
// 	 * obtains the values based on the current properties.
// 	 *
// 	 * @param elements An `Element`, or an array-like list of `Elements` to
// 	 * process.
// 	 * @param percentComplete What specific percentage is needed (0 <= x <= 1)
// 	 * @param propertyMap The `key: value` property map to animate to.
// 	 * @param easing The easing to use.
// 	 */
// 	(elements: T, action: "tween", percentComplete: number, propertyMap: Properties<VelocityProperty>, easing?: VelocityEasingType): Properties<string>;

// 	/**
// 	 * Get the tween value for one or more elements using an animation at a
// 	 * specific percentage complete. This does not animate the elements, just
// 	 * obtains the values based on the current properties.
// 	 *
// 	 * When called on Velocity directly without any supplied elements, then the
// 	 * values will be based on the `document.body` element. This can be useful
// 	 * for simply finding the value for a forcefed animation.
// 	 *
// 	 * @param percentComplete What specific percentage is needed (0 <= x <= 1)
// 	 * @param property The property to animate.
// 	 * @param value The end value or forcefed value.
// 	 * @param easing The easing to use.
// 	 */
// 	(action: "tween", percentComplete: number, property: string, value: VelocityPropertyValue, easing?: VelocityEasingType): string;

// 	/**
// 	 * Get the tween value for one or more elements using an animation at a
// 	 * specific percentage complete. This does not animate the elements, just
// 	 * obtains the values based on the current properties.
// 	 *
// 	 * When called on Velocity directly without any supplied elements, then the
// 	 * values will be based on the `document.body` element. This can be useful
// 	 * for simply finding the value for a forcefed animation.
// 	 *
// 	 * @param percentComplete What specific percentage is needed (0 <= x <= 1)
// 	 * @param propertyMap The `key: value` property map to animate to.
// 	 * @param easing The easing to use.
// 	 */
// 	(action: "tween", percentComplete: number, propertyMap: Properties<VelocityProperty>, easing?: VelocityEasingType): Properties<string>;

// 	/**
// 	 * Call Velocity with a single object containing all the necessary options.
// 	 *
// 	 * @param options An object containing the `elements`, `options`, and
// 	 * `properties` to use.
// 	 */
// 	(options: VelocityObjectArgs): VelocityResult;

// 	/**
// 	 * Call velocity on one or more elements.
// 	 *
// 	 * @param elements An `Element`, or an array-like list of `Elements` to
// 	 * process.
// 	 * @param propertyMap The `key: value` property map to animate to, or a
// 	 * named sequence to use.
// 	 * @param options The options to apply to the animation. This overrides the
// 	 * default and any supplied in a sequence.
// 	 */
// 	(elements: T, propertyMap: string | Properties<VelocityProperty>, options?: VelocityOptions): VelocityResult;

// 	/**
// 	 * Call velocity on one or more elements.
// 	 *
// 	 * @param elements An `Element`, or an array-like list of `Elements` to
// 	 * process.
// 	 * @param propertyMap The `key: value` property map to animate to, or a
// 	 * named sequence to use.
// 	 * @param duration The length of time to run animation in ms (1000/s).
// 	 * @param complete A function to call when the animation is finished.
// 	 */
// 	(elements: T, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;

// 	/**
// 	 * Call velocity on one or more elements.
// 	 *
// 	 * @param elements An `Element`, or an array-like list of `Elements` to
// 	 * process.
// 	 * @param propertyMap The `key: value` property map to animate to, or a
// 	 * named sequence to use.
// 	 * @param complete A function to call when the animation is finished.
// 	 */
// 	(elements: T, propertyMap: string | Properties<VelocityProperty>, complete?: () => void): VelocityResult;

// 	/**
// 	 * Call velocity on one or more elements.
// 	 *
// 	 * @param elements An `Element`, or an array-like list of `Elements` to
// 	 * process.
// 	 * @param propertyMap The `key: value` property map to animate to, or a
// 	 * named sequence to use.
// 	 * @param easing The easing to use for this animation.
// 	 * @param complete A function to call when the animation is finished.
// 	 */
// 	(elements: T, propertyMap: string | Properties<VelocityProperty>, easing?: string | number[], complete?: () => void): VelocityResult;

// 	/**
// 	 * Call velocity on one or more elements.
// 	 *
// 	 * @param elements An `Element`, or an array-like list of `Elements` to
// 	 * process.
// 	 * @param propertyMap The `key: value` property map to animate to, or a
// 	 * named sequence to use.
// 	 * @param duration The length of time to run animation in ms (1000/s).
// 	 * @param easing The easing to use for this animation.
// 	 * @param complete A function to call when the animation is finished.
// 	 */
// 	(elements: T, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;

// 	/**
// 	 * Call velocity on one or more elements.
// 	 *
// 	 * @param propertyMap The `key: value` property map to animate to, or a
// 	 * named sequence to use.
// 	 * @param options The options to apply to the animation. This overrides the
// 	 * default and any supplied in a sequence.
// 	 */
// 	(this: T, propertyMap: string | Properties<VelocityProperty>, options?: VelocityOptions): VelocityResult;

// 	/**
// 	 * Call velocity on one or more elements.
// 	 *
// 	 * @param propertyMap The `key: value` property map to animate to, or a
// 	 * named sequence to use.
// 	 * @param duration The length of time to run animation in ms (1000/s).
// 	 * @param complete A function to call when the animation is finished.
// 	 */
// 	(this: T, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;

// 	/**
// 	 * Call velocity on one or more elements.
// 	 *
// 	 * @param propertyMap The `key: value` property map to animate to, or a
// 	 * named sequence to use.
// 	 * @param complete A function to call when the animation is finished.
// 	 */
// 	(this: T, propertyMap: string | Properties<VelocityProperty>, complete?: () => void): VelocityResult;

// 	/**
// 	 * Call velocity on one or more elements.
// 	 *
// 	 * @param propertyMap The `key: value` property map to animate to, or a
// 	 * named sequence to use.
// 	 * @param easing The easing to use for this animation.
// 	 * @param complete A function to call when the animation is finished.
// 	 */
// 	(this: T, propertyMap: string | Properties<VelocityProperty>, easing?: string | number[], complete?: () => void): VelocityResult;

// 	/**
// 	 * Call velocity on one or more elements.
// 	 *
// 	 * @param propertyMap The `key: value` property map to animate to, or a
// 	 * named sequence to use.
// 	 * @param duration The length of time to run animation in ms (1000/s).
// 	 * @param easing The easing to use for this animation.
// 	 * @param complete A function to call when the animation is finished.
// 	 */
// 	(this: T, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;
// }
