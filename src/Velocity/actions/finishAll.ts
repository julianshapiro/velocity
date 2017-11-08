/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Finish all animation.
 */

namespace VelocityStatic.Actions {

	/**
	 * Clear the currently-active delay on each targeted element.
	 * @param {HTMLorSVGElement[]} elements The velocity elements
	 */
	export function finishAll(elements: HTMLorSVGElement[]): void {

		let activeCall = VelocityStatic.State.first;
		/* Clear the currently-active delay on each targeted element. */
		elements.forEach((element) => {
			/* If we want to finish everything in the queue, we have to iterate through it
             and call each function. This will make them active calls below, which will
             cause them to be applied via the duration setting. */
			/* Iterate through the items in the element's queue. */
			let animation: AnimationCall;
			let queue = getValue(activeCall.queue, activeCall.options.queue);
			while (animation = VelocityStatic.dequeue(element, queue)) {
				animation.queue = false;
				VelocityStatic.expandTween(animation);
			}
		});
	}
}
