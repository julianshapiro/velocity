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
			const elements = activeCall.elements;

			(activeCall.options.complete as VelocityCallback).call(elements, elements, activeCall);
		} catch (error) {
			setTimeout(function() {
				throw error;
			}, 1);
		}
	}

	/**
	 * Complete an animation. This might involve restarting (for loop or repeat
	 * options). Once it is finished we also check for any callbacks or Promises
	 * that need updating.
	 */
	export function completeCall(activeCall: AnimationCall) {
		//		console.log("complete", activeCall)
		// TODO: Check if it's not been completed already

		const options = activeCall.options,
			queue = getValue(activeCall.queue, options.queue),
			isLoop = getValue(activeCall.loop, options.loop, defaults.loop),
			isRepeat = getValue(activeCall.repeat, options.repeat, defaults.repeat),
			isStopped = activeCall._flags & AnimationFlags.STOPPED;

		if (!isStopped && (isLoop || isRepeat)) {

			////////////////////
			// Option: Loop   //
			// Option: Repeat //
			////////////////////

			if (isRepeat && isRepeat !== true) {
				activeCall.repeat = isRepeat - 1;
			} else if (isLoop && isLoop !== true) {
				activeCall.loop = isLoop - 1;
				activeCall.repeat = getValue(activeCall.repeatAgain, options.repeatAgain, defaults.repeatAgain);
			}
			if (isLoop) {
				activeCall._flags ^= AnimationFlags.REVERSE;
			}
			if (queue !== false) {
				// Can't be called when stopped so no need for an extra check.
				Data(activeCall.element).lastFinishList[queue] = activeCall.timeStart + getValue(activeCall.duration, options.duration, defaults.duration);
			}
			activeCall.timeStart = activeCall.ellapsedTime = activeCall.percentComplete = 0;
			activeCall._flags &= ~AnimationFlags.STARTED;
		} else {
			const element = activeCall.element,
				data = Data(element);

			if (!--data.count && !isStopped) {

				////////////////////////
				// Feature: Classname //
				////////////////////////

				removeClass(element, State.className);
			}

			//////////////////////
			// Option: Complete //
			//////////////////////

			// If this is the last animation in this list then we can check for
			// and complete calls or Promises.
			// TODO: When deleting an element we need to adjust these values.
			if (options && ++options._completed === options._total) {
				if (!isStopped && options.complete) {
					// We don't call the complete if the animation is stopped,
					// and we clear the key to prevent it being called again.
					callComplete(activeCall);
					options.complete = null;
				}
				const resolver = options._resolver;

				if (resolver) {
					// Fulfil the Promise
					resolver(activeCall.elements as any);
					delete options._resolver;
				}
			}

			///////////////////
			// Option: Queue //
			///////////////////

			if (queue !== false) {
				// We only do clever things with queues...
				if (!isStopped) {
					// If we're not stopping an animation, we need to remember
					// what time it finished so that the next animation in
					// sequence gets the correct start time.
					data.lastFinishList[queue] = activeCall.timeStart + getValue(activeCall.duration, options.duration, defaults.duration);
				}
				// Start the next animation in sequence, or delete the queue if
				// this was the last one.
				dequeue(element, queue);
			}
			// Cleanup any pointers, and remember the last animation etc.
			freeAnimationCall(activeCall);
		}
	}
};
