///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Pause and resume animation.
 */

namespace VelocityStatic {

	/**
	 * Pause and Resume are call-wide (not on a per element basis). Thus, calling pause or resume on a
	 * single element will cause any calls that contain tweens for that element to be paused/resumed
	 * as well.
	 * 
	 * @param {HTMLorSVGElement[]} elements The velocity elements
	 * @param {StrictVelocityOptions} queue The internal Velocity options
	 * @param {boolean} isPaused A flag to check whether we call this method from pause or resume case
	 */
	function handlePauseResume(args: any[], elements: HTMLorSVGElement[], isPaused: boolean): void {
		let queueName = args[0] === undefined ? undefined : validateQueue(args[0]),
			defaultQueue = defaults.queue;

		if (isVelocityResult(elements) && elements.velocity.animations) {
			for (let i = 0, animations = elements.velocity.animations; i < animations.length; i++) {
				let activeCall = animations[i];

				if (activeCall.paused !== isPaused) {
					if (queueName === undefined || (queueName !== undefined && queueName === getValue(activeCall.queue, activeCall.options.queue, defaultQueue))) {
						activeCall.paused = isPaused;
					}
				}
			}
		} else {
			// TODO: Check for only animations on these specific elements
			let activeCall = VelocityStatic.State.first;

			while (activeCall) {
				if (activeCall.paused !== isPaused) {
					if (queueName === undefined || (queueName !== undefined && queueName === getValue(activeCall.queue, activeCall.options.queue, defaultQueue))) {
						activeCall.paused = isPaused;
					}
				}
				activeCall = activeCall._next;
			}
		}
	}

	function pause(args?: any[], elements?: HTMLorSVGElement[] | VelocityResult, promiseHandler?: VelocityPromise, action?: string) {
		handlePauseResume(args, elements, true);
	}

	function resume(args?: any[], elements?: HTMLorSVGElement[] | VelocityResult, promiseHandler?: VelocityPromise, action?: string) {
		handlePauseResume(args, elements, false);
	}

	registerAction(["pause", pause], true);
	registerAction(["resume", resume], true);
}
