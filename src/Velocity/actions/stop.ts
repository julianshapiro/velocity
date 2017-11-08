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
	 * When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
	 * been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
	 * is stopped, the next item in its animation queue is immediately triggered.
	 * An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
	 * or a custom queue string can be passed in.
	 * Note: The stop command runs prior to Velocity's Queueing phase since its behavior is intended to take effect *immediately*,
	 * regardless of the element's current queue state.
	 * @param {HTMLorSVGElement[]} elements The collection of HTML or SVG elements
	 * @param {StrictVelocityOptions} The strict Velocity options
	 * @param {Promise<HTMLorSVGElement[]>} An optional promise if the user uses promises
	 * @param {(value?: (HTMLorSVGElement[] | VelocityResult)) => void} resolver The resolve method of the promise
	 */
	function stop(args: any[], elements: HTMLorSVGElement[] | VelocityResult, promiseHandler?: VelocityPromise, action?: string): void {
		let callsToStop: AnimationCall[] = [],
			/* Iterate through every active call. */
			activeCall = State.first,
			queueName = getValue(validateQueue(args[0]), defaults.queue);

		/* Iterate through all calls and pause any that contain any of our elements */
		while (activeCall) {
			activeCall = activeCall._next;
			let options = activeCall.options;

			/* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
             clear calls associated with the relevant queue. */
			/* Call stopping logic works as follows:
             - options === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
             - options === undefined --> stop current queue:"" call and all queue:false calls.
             - options === false --> stop only queue:false calls.
             - options === "custom" --> stop current queue:"custom" call, including remaining queued ones (there is no functionality to only clear the currently-running queue:"custom" call). */

			if (getValue(activeCall.queue, options.queue) !== queueName) {
				continue;
			}

			/* Iterate through the calls targeted by the stop command. */
			for (let i = 0, elementsLength = elements.length; i < elementsLength; i++) {
				let element = elements[i];

				/* Check that this call was applied to the target element. */
				if (element !== activeCall.element) {
					continue;
				}

				/* Check that this call was applied to the target element. */
				/* Make sure it can't be delayed */
				activeCall.started = true;
				/* Remove the queue so this can't trigger any newly added animations when it finishes */
				activeCall.queue = false;
				/* Optionally clear the remaining queued calls. If we're doing "finishAll" this won't find anything,
                 due to the queue-clearing above. */
				let animation: AnimationCall;

				/* Iterate through the items in the element's queue. */
				while ((animation = dequeue(element, queueName, true))) {
					let options = animation.options,
						resolver = options._resolver;

					if (resolver) {
						resolver(animation.elements);
						delete options._resolver;
					}
				}

				/* Since "reverse" uses cached start values (the previous call's endValues), these values must be
                 changed to reflect the final value that the elements were actually tweened to. */
				/* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
                 object. Also, queue:false animations can't be reversed. */
				activeCall.timeStart = -1;
				callsToStop.push(activeCall);
			}
		}

		/* Prematurely call completeCall() on each matched active call. Pass an additional flag for "stop" to indicate
         that the complete callback and display:none setting should be skipped since we're completing prematurely. */
		callsToStop.forEach((activeCall) => {
			completeCall(activeCall, action === "stop");
		});

		if (promiseHandler) {
			/* Immediately resolve the promise associated with this stop call since stop runs synchronously. */
			promiseHandler._resolver(elements);
		}
	}

	registerAction(["finish", stop], true);
	registerAction(["stop", stop], true);
}
