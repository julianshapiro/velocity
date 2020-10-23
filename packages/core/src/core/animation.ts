/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { AnimationCall } from "./animationCall";
import { IVelocity, KnownElement } from "../velocity";

export const symbolAnimations = Symbol("velocityAnimations");
export const symbolCompleted = Symbol("velocityCompleted");
export const symbolElements = Symbol("velocityElements");
export const symbolFirst = Symbol("velocityFirst");
export const symbolPromise = Symbol("velocityPromise");
export const symbolReady = Symbol("velocityReady");
export const symbolResolver = Symbol("velocityResolver");
export const symbolRejecter = Symbol("velocityRejecter");
export const symbolStarted = Symbol("velocityStarted");

/**
 * The return type of any velocity call. If this is called via a "utility"
 * function (such a DOM or jQuery) then it will extend the array-like list of
 * elements supplied, otherwise it will be a plain array. The extra values for
 * Promises and Velocity are inserted into the array in such a way as to not
 * interfere with other methods unless they are specifically overwriting them.
 */
export interface IAnimation extends ReadonlyArray<KnownElement>, Promise<IAnimation> {
	/**
	 * This is the Velocity chaining method. It is functionally equivalent to
	 * the normal Velocity call, but allows chaining on the elements it is
	 * attached to.
	 */
	readonly velocity: IVelocity;

	/**
	 * These are the animation objects attached to this specific chain. This
	 * is used in some actions to allow the call to only touch the specific
	 * animations called rather than just the animations on the linked
	 * elements.
	 */
	[symbolAnimations]: AnimationCall[];

	/**
	 * The number of completed AnimationCalls in this Animation. When the last
	 * one is completed the `complete` callback will happen.
	 */
	[symbolCompleted]: number;

	/**
	 * The original elements list we're working with. This stops making
	 * arbitrary depth inherited Animations.
	 */
	[symbolElements]: KnownElement[];

	/**
	 * The first animation to start, this is the one that gets progress called
	 * on it each tick.
	 */
	[symbolFirst]: AnimationCall;

	/**
	 * This is the actual Promise used by Velocity. If using Promise.all() or
	 * similar methods then you may need to use this instead of the Velocity
	 * result itself.
	 */
	[symbolPromise]?: Promise<IAnimation>;

	/**
	 * The number of ready AnimationCalls in this Animation. When `sync=true`
	 * and this matches the length of `[symbolAnimations]` then the animation
	 * will start.
	 */
	[symbolReady]: number;

	/**
	 * This method is called at most once to signify that the animation has
	 * completed. Currently a loop:true animation will never complete. This
	 * allows .then(fn) to run (see Promise support).
	 *
	 * Once the promise is fulfilled this will be deleted.
	 *
	 * @private
	 */
	[symbolResolver]?: (value: IAnimation) => void;

	/**
	 * This method is called at most once to signify that the animation has
	 * completed. Currently a loop:true animation will never complete. This
	 * allows .then(fn) to run (see Promise support).
	 *
	 * Once the promise is fulfilled this will be deleted.
	 *
	 * @private
	 */
	[symbolRejecter]?: (reason?: string) => void;

	/**
	 * The number of AnimationCalls that have started. When the first one starts
	 * the `begin` callback will happen.
	 */
	[symbolStarted]: number;
}
