/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Pause and resume animation.
 */

// Typedefs
import {AnimationCall, AnimationFlags, VelocityPromise, VelocityResult} from "../../../velocity.d";

// Project
import {isVelocityResult} from "../../types";
import {getValue} from "../../utility";
import {defaults} from "../defaults";
import {validateQueue} from "../options";
import {State} from "../state";
import {registerAction} from "./actions";

/**
 * Check if an animation should be paused / resumed.
 */
function checkAnimation(animation: AnimationCall, queueName: false | string, defaultQueue: false | string, isPaused: boolean) {
	if (queueName === undefined || queueName === getValue(animation.queue, animation.options.queue, defaultQueue)) {
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
function pauseResume(args?: any[], elements?: VelocityResult, promiseHandler?: VelocityPromise, action?: string) {
	const isPaused = action.indexOf("pause") === 0,
		queue = action.indexOf(".") >= 0 ? action.replace(/^.*\./, "") : undefined,
		queueName = queue === "false" ? false : validateQueue(args[0]),
		defaultQueue = defaults.queue;

	if (isVelocityResult(elements) && elements.velocity.animations) {
		for (const animation of elements.velocity.animations) {
			checkAnimation(animation, queueName, defaultQueue, isPaused);
		}
	} else {
		let activeCall: AnimationCall = State.first;

		while (activeCall) {
			if (!elements || elements.includes(activeCall.element)) {
				checkAnimation(activeCall, queueName, defaultQueue, isPaused);
			}
			activeCall = activeCall._next;
		}
	}
	if (promiseHandler) {
		if (isVelocityResult(elements) && elements.velocity.animations && elements.then) {
			elements.then(promiseHandler._resolver);
		} else {
			promiseHandler._resolver(elements);
		}
	}
}

registerAction(["pause", pauseResume], true);
registerAction(["resume", pauseResume], true);
