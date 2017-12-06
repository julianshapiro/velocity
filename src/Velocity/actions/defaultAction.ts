///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Default action.
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
	 * 
	 * @param {HTMLorSVGElement[]} elements The collection of HTML or SVG elements
	 * @param {StrictVelocityOptions} The strict Velocity options
	 * @param {Promise<HTMLorSVGElement[]>} An optional promise if the user uses promises
	 * @param {(value?: (HTMLorSVGElement[] | VelocityResult)) => void} resolver The resolve method of the promise
	 */
	function defaultAction(args?: any[], elements?: HTMLorSVGElement[] | VelocityResult, promiseHandler?: VelocityPromise, action?: string): void {
		// TODO: default is wrong, should be runSequence based, and needs all arguments
		if (isString(action) && VelocityStatic.Redirects[action]) {
			const options = isPlainObject(args[0]) ? args[0] as VelocityOptions : {},
				opts = {...options},
				durationOriginal = parseFloat(options.duration as any),
				delayOriginal = parseFloat(options.delay as any) || 0;

			/* If the backwards option was passed in, reverse the element set so that elements animate from the last to the first. */
			if (opts.backwards === true) {
				elements = elements.reverse();
			}

			/* Individually trigger the redirect for each element in the set to prevent users from having to handle iteration logic in their redirect. */
			elements.forEach(function(element, elementIndex) {

				/* If the stagger option was passed in, successively delay each element by the stagger value (in ms). Retain the original delay value. */
				if (parseFloat(opts.stagger as string)) {
					opts.delay = delayOriginal + (parseFloat(opts.stagger as string) * elementIndex);
				} else if (isFunction(opts.stagger)) {
					opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elements.length);
				}

				/* If the drag option was passed in, successively increase/decrease (depending on the presense of opts.backwards)
                 the duration of each element's animation, using floors to prevent producing very short durations. */
				if (opts.drag) {
					/* Default the duration of UI pack effects (callouts and transitions) to 1000ms instead of the usual default duration of 400ms. */
					opts.duration = durationOriginal || (/^(callout|transition)/.test(action) ? 1000 : DEFAULT_DURATION);

					/* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
                     B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
                     The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
					opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex / elements.length : (elementIndex + 1) / elements.length), opts.duration * 0.75, 200);
				}

				/* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
                 reduce the opts checking logic required inside the redirect. */
				VelocityStatic.Redirects[action].call(element, element, opts, elementIndex, elements.length, elements, promiseHandler && promiseHandler._resolver);
			});

			/* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
             (The performance overhead up to this point is virtually non-existant.) */
			/* Note: The jQuery call chain is kept intact by returning the complete element set. */
		} else {
			const abortError = "Velocity: First argument (" + action + ") was not a property map, a known action, or a registered redirect. Aborting.";

			if (promiseHandler) {
				promiseHandler._rejecter(new Error(abortError));
			} else if (window.console) {
				console.log(abortError);
			}
		}
	}

	registerAction(["default", defaultAction], true);
}
