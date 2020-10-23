/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Stop animation.
 */

import type { IAnimation } from "../core/animation";
import { isVelocityResult } from "../types";
import { completeCall } from "../core/complete";
import { defaults } from "../core/defaults";
import { validateQueue } from "../core/options";
import { State } from "../core/state";
import { validateTweens } from "../core/tweens";
import { registerAction } from "./registerAction";
import { IActionThis } from "./actionsObject";
import { AnimationCall, AnimationFlags } from "../core/animationCall";

/**
 * Check if an animation should be stopped, and if so then set the STOPPED
 * flag on it, then call complete.
 */
function checkAnimationShouldBeStopped(animation: AnimationCall, queueName: false | string, defaultQueue: false | string) {
	validateTweens(animation);
	if (queueName === undefined || queueName === animation.queue) {
		animation.flags |= AnimationFlags.STOPPED; // tslint:disable-line:no-bitwise
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
function stop(this: IActionThis, maybeQueue?: string | boolean, maybeStopAll?: boolean): void {
	const { elements, promiseHandler } = this;
	const queueName: string | false = validateQueue(maybeQueue, true)!;
	const defaultQueue: false | string = defaults.queue;
	const finishAll = maybeQueue === true || maybeStopAll === true;

	if (isVelocityResult(elements) && elements.velocity.animations) {
		for (const animation of elements.velocity.animations) {
			checkAnimationShouldBeStopped(animation, queueName, defaultQueue);
		}
	} else {
		while (State.firstNew) {
			validateTweens(State.firstNew);
		}
		for (let activeCall = State.first, nextCall: AnimationCall | undefined;
			activeCall && (finishAll || activeCall !== State.firstNew);
			activeCall = nextCall ?? State.firstNew
		) {
			nextCall = activeCall._next;
			if (!elements || elements.includes(activeCall.element as any)) {
				checkAnimationShouldBeStopped(activeCall, queueName, defaultQueue);
			}
		}
	}
	if (promiseHandler) {
		if (isVelocityResult(elements) && elements.velocity.animations && elements.then) {
			elements.then(promiseHandler._resolver);
		} else if (promiseHandler._resolver) {
			promiseHandler._resolver(elements);
		}
	}
}

registerAction("stop", stop, true);

declare module "../velocity" {
	export interface IVelocity {
		/**
		 * Stop without finishing the running animations on this VelocityResult or
		 * on the elements selected.
		 *
		 * @param elements An `Element`, or an array-like list of `Elements` to
		 * process.
		 * @param queue The queue to stop.
		 * @param stopAll Should this stop all queued animations too?
		 */
		(elements: KnownElement, action: "stop", queue?: string | false, stopAll?: true): IAnimation;
		(this: KnownElement, action: "stop", queue?: string | false, stopAll?: true): IAnimation;

		/**
		 * Stop without finishing the running animations on this VelocityResult or
		 * on the elements selected.
		 *
		 * @param elements An `Element`, or an array-like list of `Elements` to
		 * process.
		 * @param stopAll Should this stop all queued animations too?
		 */
		(elements: KnownElement, action: "stop", stopAll?: true): IAnimation;
		(this: KnownElement, action: "stop", stopAll?: true): IAnimation;
	}
}
