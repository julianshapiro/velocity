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
	 * @param {HTMLorSVGElement[]} elements The velocity elements
	 * @param {StrictVelocityOptions} queue The internal Velocity options
	 * @param {boolean} isPaused A flag to check whether we call this method from pause or resume case
	 */
	function handlePauseResume(args: any[], elements: HTMLorSVGElement[], isPaused: boolean): void {
		let queueName = getValue(validateQueue(args[0]), defaults.queue),
			activeCall = VelocityStatic.State.first;

		/* Iterate through all calls and pause any that contain any of our elements */
		while (activeCall && !activeCall.paused) {
			activeCall = activeCall._next;
			if (activeCall.paused !== isPaused) {
				/* Iterate through the active call's targeted elements. */
				activeCall.elements.some((activeElement) => {
					let queue = getValue(activeCall.queue, activeCall.options.queue);

					if (queueName !== true && (queue !== queueName) && !(queue === undefined && queue === false)) {
						return true;
					}
					if (elements.indexOf(activeElement) >= 0) {
						activeCall.paused = isPaused;
						return true;
					}
				});
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
