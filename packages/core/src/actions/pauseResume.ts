/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Pause and resume animation.
 */

import { AnimationCall, AnimationFlags, VelocityPromise, Animation } from "../velocity";
import { isAnimation } from "../types";
import { defaults } from "../core/defaults";
import { validateQueue } from "../core/options";
import { State } from "../core/state";
import { registerAction } from "./registerAction";

/**
 * Check if an animation should be paused / resumed.
 */
function checkAnimation(animation: AnimationCall, queueName: false | string, defaultQueue: false | string, isPaused: boolean) {
	if (queueName === undefined || queueName === (animation.queue ?? animation.options!.queue ?? defaultQueue)) {
		if (isPaused) {
			animation._flags |= AnimationFlags.PAUSED; // tslint:disable-line:no-bitwise
		} else {
			animation._flags &= ~AnimationFlags.PAUSED; // tslint:disable-line:no-bitwise
		}
	}
}

/**
 * Pause and Resume are call-wide (not on a per element basis). Thus, calling pause or resume on a
 * single element will cause any calls that contain tweens for that element to be paused/resumed
 * as well.
 */
function pauseResume(args: any[], elements: Animation, promiseHandler: VelocityPromise, action: string) {
	const isPaused = action.indexOf("pause") === 0;
	const queue = action.indexOf(".") >= 0 ? action.replace(/^.*\./, "") : undefined;
	const queueName = queue === "false" ? false : validateQueue(args[0])!;
	const defaultQueue = defaults.queue;

	if (isAnimation(elements) && elements.velocity?.animations) {
		for (const animation of elements.velocity.animations) {
			checkAnimation(animation, queueName, defaultQueue, isPaused);
		}
	} else {
		let activeCall: AnimationCall = State.first!;

		while (activeCall) {
			if (!elements || elements.includes(activeCall.element!)) {
				checkAnimation(activeCall, queueName, defaultQueue, isPaused);
			}
			activeCall = activeCall._next!;
		}
	}
	if (promiseHandler) {
		if (isAnimation(elements) && elements.velocity?.animations && elements.then) {
			elements.then(promiseHandler._resolver);
		} else if (promiseHandler._resolver) {
			promiseHandler._resolver(elements);
		}
	}
}

registerAction("pause", pauseResume, true);
registerAction("resume", pauseResume, true);


// 	/**
// 	 * Pause a currently running animation.
// 	 *
// 	 * @param elements An `Element`, or an array-like list of `Elements` to
// 	 * process.
// 	 * @param queue The name of the queue to pause on it.
// 	 */
// 	(elements: T, action: "pause", queue?: string): VelocityResult;
// 	(this: T, action: "pause", queue?: string): VelocityResult;

// 	/**
// 	 * Pause all currently running animations.
// 	 *
// 	 * @param queue The name of the queue to pause on them.
// 	 */
// 	(action: "pause", queue: string): VelocityResult;

// 	/**
// 	 * Resume a currently paused animation.
// 	 *
// 	 * @param elements An `Element`, or an array-like list of `Elements` to
// 	 * process.
// 	 * @param queue The name of the queue to resume on it.
// 	 */
// 	(elements: T, action: "resume", queue?: string): VelocityResult;

// 	/**
// 	 * Resume a currently paused animation.
// 	 *
// 	 * @param queue The name of the queue to resume on it.
// 	 */
// 	(this: T, action: "resume", queue?: string): VelocityResult;

// 	/**
// 	 * Resume all currently paused animations.
// 	 *
// 	 * @param queue The name of the queue to resume on them.
// 	 */
// 	(action: "resume", queue?: string): VelocityResult;
