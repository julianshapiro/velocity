/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Stop animation.
 */

// Typedefs
import {AnimationCall, AnimationFlags, VelocityPromise, VelocityResult} from "../../../velocity.d";

// Project
import {isVelocityResult} from "../../types";
import {getValue} from "../../utility";
import {completeCall} from "../complete";
import {defaults} from "../defaults";
import {validateQueue} from "../options";
import {State} from "../state";
import {validateTweens} from "../tweens";
import {registerAction} from "./actions";

/**
 * Check if an animation should be stopped, and if so then set the STOPPED
 * flag on it, then call complete.
 */
function checkAnimationShouldBeStopped(animation: AnimationCall, queueName: false | string, defaultQueue: false | string) {
	validateTweens(animation);
	if (queueName === undefined || queueName === getValue(animation.queue, animation.options.queue, defaultQueue)) {
		animation._flags |= AnimationFlags.STOPPED; // tslint:disable-line:no-bitwise
		completeCall(animation);
	}
}

/**
 * When the stop action is triggered, the elements' currently active call is
 * immediately stopped. When an element is stopped, the next item in its
 * animation queue is immediately triggered. If passed via a chained call
 * then this will only target the animations in that call, and not the
 * elements linked to it.
 *
 * A queue name may be passed in to specify that only animations on the
 * named queue are stopped. The default queue is named "". In addition the
 * value of `false` is allowed for the queue name.
 *
 * An final argument may be passed in to clear an element's remaining queued
 * calls. This may only be the value `true`.
 *
 * Note: The stop command runs prior to Velocity's Queueing phase since its
 * behavior is intended to take effect *immediately*, regardless of the
 * element's current queue state.
 */
function stop(args: any[], elements: VelocityResult, promiseHandler?: VelocityPromise, action?: string): void {
	const queueName: string | false = validateQueue(args[0], true),
		defaultQueue: false | string = defaults.queue,
		finishAll = args[queueName === undefined ? 0 : 1] === true;

	if (isVelocityResult(elements) && elements.velocity.animations) {
		for (const animation of elements.velocity.animations) {
			checkAnimationShouldBeStopped(animation, queueName, defaultQueue);
		}
	} else {
		while (State.firstNew) {
			validateTweens(State.firstNew);
		}
		for (let activeCall = State.first, nextCall: AnimationCall; activeCall && (finishAll || activeCall !== State.firstNew); activeCall = nextCall || State.firstNew) {
			nextCall = activeCall._next;
			if (!elements || elements.includes(activeCall.element)) {
				checkAnimationShouldBeStopped(activeCall, queueName, defaultQueue);
			}
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

registerAction(["stop", stop], true);
