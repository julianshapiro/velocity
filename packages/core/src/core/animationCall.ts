/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import type { IAnimation } from "./animation";

import { VelocityTween } from "../velocity";
import { KnownElement } from "../velocity";
import { Options } from "./options";

/**
 * AnimationFlags are used internally. These are subject to change as they are
 * only valid for the internal state of the current version of Velocity.
 *
 * To get these values use the "option" action with a key of "isReady" etc. All
 * of these are gettable with the same pattern of keyname.
 */
export declare const enum AnimationFlags {
	/**
	 * When the tweens are expanded this is set to save future processing.
	 */
	EXPANDED = 1 << 0, // tslint:disable-line:no-bitwise

	/**
	 * Set once the animation is ready to start - after any delay (and possible
	 * pause).
	 */
	READY = 1 << 1, // tslint:disable-line:no-bitwise

	/**
	 * Set once the animation has started.
	 */
	STARTED = 1 << 2, // tslint:disable-line:no-bitwise

	/**
	 * Set when an animation is manually stopped.
	 */
	STOPPED = 1 << 3, // tslint:disable-line:no-bitwise

	/**
	 * The pause state of this animation. If true it is paused, if false it was
	 * paused and needs to be resumed, and if undefined / null then not either.
	 */
	PAUSED = 1 << 4, // tslint:disable-line:no-bitwise

	/**
	 * Set when the animation is a sync animation.
	 */
	SYNC = 1 << 5, // tslint:disable-line:no-bitwise

	/**
	 * When the animation is running in reverse, such as for a loop.
	 */
	REVERSE = 1 << 6, // tslint:disable-line:no-bitwise
}

/**
 * A single animation for a single element. This extends the strict options (ie,
 * after processing) to allow per-element options. Anything that is shared
 * between all elements in an animation will be under the `options` member.
 */
export class AnimationCall extends Options {
	constructor(
		options: Options,

		/**
		 * The full animation we are referring to.
		 */
		public animation: IAnimation,

		/**
		 * The element this specific animation is for. If there is more than one in
		 * the elements list then this will be duplicated when it is pulled off a
		 * queue.
		 */
		public element: KnownElement,

	) {
		super(options);

		this.flags = this.sync ? AnimationFlags.SYNC : 0;
	}

	/**
	 * A number of flags for use in tracking an animation.
	 */
	flags: AnimationFlags;

	/**
	 * Properties to be tweened
	 *
	 * TODO: Fix this
	 */
	tweens?: Record<string, VelocityTween>;

	/**
	 * The time this animation started according to whichever clock we are
	 * using.
	 */
	timeStart = 0;

	/**
	 * The time (in ms) that this animation has already run. Used with the
	 * duration and easing to provide the exact tween needed.
	 */
	ellapsedTime = 0;

	/**
	 * The percentage complete as a number 0 <= n <= 1
	 */
	percentComplete = 0;

	/**
	 * The current value for the "tween" property, defaults to a percentage if
	 * not used.
	 */
	tween?: string;
}
