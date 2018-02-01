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
	 * Check if an animation should be stopped, and if so then set the STOPPED
	 * flag on it, then call complete.
	 */
	function checkAnimationShouldBeStopped(animation: AnimationCall, queueName: false | string, defaultQueue: false | string) {
		validateTweens(animation);
		if (queueName === undefined || queueName === getValue(animation.queue, animation.options.queue, defaultQueue)) {
			animation._flags |= AnimationFlags.STOPPED;
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
			for (let i = 0, animations = elements.velocity.animations; i < animations.length; i++) {
				checkAnimationShouldBeStopped(animations[i], queueName, defaultQueue);
			}
		} else {
			let activeCall = State.first,
				nextCall: AnimationCall;

			while ((activeCall = State.firstNew)) {
				validateTweens(activeCall);
			}
			for (activeCall = State.first; activeCall && (finishAll || activeCall !== State.firstNew); activeCall = nextCall || State.firstNew) {
				nextCall = activeCall._next;
				if (!elements || _inArray(elements, activeCall.element)) {
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
}
