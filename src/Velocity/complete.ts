/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Call Completion
 */

namespace VelocityStatic {
	/**
	 * Call the complete method of an animation in a separate function so it can
	 * benefit from JIT compiling while still having a try/catch block.
	 */
	function callComplete(activeCall: AnimationCall) {
		try {
			let elements = activeCall.elements;

			activeCall.options.complete.call(elements, elements, activeCall);
		} catch (error) {
			setTimeout(function() {
				throw error;
			}, 1);
		}
	}


	/* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
	export function completeCall(activeCall: AnimationCall, isStopped?: boolean) {
		//		console.log("complete", activeCall)
		// TODO: Check if it's not been completed already

		/****************************
		 Option: Loop || Repeat
		 ****************************/

		let options = activeCall.options,
			queue = getValue(activeCall.queue, options.queue),
			isLoop = getValue(activeCall.loop, options.loop, defaults.loop),
			isRepeat = getValue(activeCall.repeat, options.repeat, defaults.repeat);

		if (!isStopped && (isLoop || isRepeat)) {
			if (isRepeat && isRepeat !== true) {
				activeCall.repeat = isRepeat - 1;
			} else if (isLoop && isLoop !== true) {
				activeCall.loop = isLoop - 1;
				activeCall.repeat = getValue(activeCall.repeatAgain, options.repeatAgain, defaults.repeatAgain);
			}
			if (isLoop) {
				activeCall._reverse = !activeCall._reverse;
			}
			if (queue !== false) {
				Data(activeCall.element).lastFinishList[queue] = activeCall.timeStart + getValue(activeCall.duration, options.duration, defaults.duration);
			}
			activeCall.timeStart = activeCall.ellapsedTime = activeCall.percentComplete = 0;
			activeCall.started = false;
		} else {
			let elements = activeCall.elements,
				element = activeCall.element,
				data = Data(element);

			// TODO: Need to check that there's no other animations running on this element
			if (isStopped && data && (queue === false || data.queueList[queue])) {
				data.isAnimating = false;
			}
			// Remove the "velocity-animating" indicator class.
			CSS.Values.removeClass(element, "velocity-animating");

			/*********************
			 Option: Complete
			 *********************/

			/* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
			/* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
			if (options && ++options._completed === options._total) {

				if (!isStopped && options.complete) {
					callComplete(activeCall);
					// Only called once, even if reversed or repeated
					//TODO: change all delete commands with assignment to null. This is consistently 5-10 times faster than deleting the key  https://jsperf.com/delete-vs-undefined-vs-null/16
					options.complete = null;
				}

				/**********************
				 Promise Resolving
				 **********************/

				/* Note: Infinite loops don't return promises. */
				let resolver = options._resolver;

				if (resolver) {
					resolver(elements as any);
					delete options._resolver;
				}
			}

			/***************
			 Dequeueing
			 ***************/

			/* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
			 which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
			 dequeue() must still be called in order to completely clear jQuery's animation queue. */
			if (queue !== false) {
				data.lastFinishList[queue] = activeCall.timeStart + getValue(activeCall.duration, options.duration, defaults.duration);
				dequeue(element, queue);
			}

			/************************
			 Cleanup
			 ************************/
			freeAnimationCall(activeCall);
		}
	}
};
