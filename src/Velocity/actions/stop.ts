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
			/* Check that this call was applied to the target element. */
			/* Make sure it can't be delayed */ // TODO do we need this?
			animation.started = true;
			/* Remove the queue so this can't trigger any newly added animations when it finishes */
			animation.options.queue = false;

			/* Since "reverse" uses cached start values (the previous call's endValues), these values must be
             changed to reflect the final value that the elements were actually tweened to. */
			/* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
             object. Also, queue:false animations can't be reversed. */
			animation.timeStart = -1;

			/* Prematurely call completeCall() on each matched active call. Pass an additional flag for "stop" to indicate
             that the complete callback and display:none setting should be skipped since we're completing prematurely. */
			completeCall(animation, isStopped)
			dequeue(animation.element, queueName)
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
			activeCall: AnimationCall,
			defaultQueue = defaults.queue

		if (isVelocityResult(elements) && elements.velocity.animations) {
			for (let i = 0, animations = elements.velocity.animations; i < animations.length; i++) {
				checkAnimationShouldBeStopped(animations[i], queueName, defaultQueue, action === "stop");
			}
		} else {
			activeCall = State.first;
			while (activeCall) {
				if (!elements || _inArray.call(elements, activeCall.element)) {
					checkAnimationShouldBeStopped(activeCall, queueName, defaultQueue, action === "stop");
				}
				activeCall = activeCall._next;
			}
		}

		if (promiseHandler) {
			if (elements && elements.then) {
				elements.then(promiseHandler._resolver);
			} else {
				promiseHandler._resolver(elements);
			}
		}
	}

	registerAction(["finish", stop], true);
	registerAction(["stop", stop], true);
}
