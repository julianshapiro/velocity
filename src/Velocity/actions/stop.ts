///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Stop animation.
 */

namespace VelocityStatic {

	/**
	 * Check if an animation should be paused / resumed.
	 */
	function checkAnimationShouldBeStopped(animation: AnimationCall, queueName: false | string, defaultQueue: false | string, isStopped: boolean) {
		if (queueName === undefined || (queueName !== undefined && queueName === getValue(animation.queue, animation.options.queue, defaultQueue))) {
			if (isStopped) {
				animation._flags |= AnimationFlags.STOPPED;
			}
			completeCall(animation);
		}
	}

	/**
	 * When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
	 * been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
	 * is stopped, the next item in its animation queue is immediately triggered.
	 * An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
	 * or a custom queue string can be passed in.
	 * Note: The stop command runs prior to Velocity's Queueing phase since its behavior is intended to take effect *immediately*,
	 * regardless of the element's current queue state.
	 * @param {any[]} args
	 * @param {VelocityResult} elements
	 * @param {VelocityPromise} promiseHandler
	 * @param {string} action
	 */
	function stop(args: any[], elements: VelocityResult, promiseHandler?: VelocityPromise, action?: string): void {
		let queueName = args[0] === undefined ? undefined : validateQueue(args[0]),
			defaultQueue = defaults.queue,
			isStopped = action[0] === "s" && action[1] === "t" && action[2] === "o" && action[3] === "p";

		if (isVelocityResult(elements) && elements.velocity.animations) {
			for (let i = 0, animations = elements.velocity.animations; i < animations.length; i++) {
				checkAnimationShouldBeStopped(animations[i], queueName, defaultQueue, isStopped);
			}
		} else {
			for (let activeCall = State.first, nextCall: AnimationCall; activeCall; activeCall = nextCall) {
				nextCall = activeCall._next;
				if (!elements || _inArray.call(elements, activeCall.element)) {
					checkAnimationShouldBeStopped(activeCall, queueName, defaultQueue, isStopped);
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

	registerAction(["finish", stop], true);
	registerAction(["stop", stop], true);
}
