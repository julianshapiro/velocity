/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Call Completion
 */

import { AnimationCall, AnimationFlags } from "./animationCall";
import { removeClass } from "../utility";
import { Data } from "../data";
import { dequeue, freeAnimationCall } from "./queue";
import { State } from "./state";
import { symbolAnimations, symbolCompleted, symbolRejecter, symbolResolver } from "./animation";

/**
 * Call the complete method of an animation in a separate function so it can
 * benefit from JIT compiling while still having a try/catch block.
 */
function callComplete(activeCall: AnimationCall) {
	const { animation, complete } = activeCall;

	if (complete) {
		try {
			complete.call(animation, animation, activeCall);
		} catch (error) {
			setTimeout(() => {
				throw error;
			}, 1);
		}
	}
}

/**
 * Complete an animation. This might involve restarting (for loop or repeat
 * options). Once it is finished we also check for any callbacks or Promises
 * that need updating.
 */
export function completeCall(activeCall: AnimationCall) {
	const { animation, element, flags, loop, queue, repeat } = activeCall;
	const isStopped = flags & AnimationFlags.STOPPED; // tslint:disable-line:no-bitwise
	const data = Data(element);

	if (!isStopped && (loop || repeat)) {
		if (repeat && repeat !== true) {
			activeCall.repeat = repeat - 1;
		} else if (loop && loop !== true) {
			activeCall.loop = loop - 1;
			activeCall.repeat = Object.getPrototypeOf(activeCall).repeat;
		}
		if (loop) {
			activeCall.flags ^= AnimationFlags.REVERSE; // tslint:disable-line:no-bitwise
		}
		if (queue !== false) {
			// Can't be called when stopped so no need for an extra check.
			data.lastFinishTime.set(queue, activeCall.timeStart + activeCall.duration);
		}
		activeCall.timeStart = activeCall.ellapsedTime = activeCall.percentComplete = 0;
		activeCall.flags &= ~AnimationFlags.STARTED; // tslint:disable-line:no-bitwise
	} else {
		if (!--data.count && !isStopped) {
			// TODO: Move into dom module
			removeClass(element, State.className);
		}

		// If this is the last animation in this list then we can check for
		// and complete calls or Promises.
		if (++animation[symbolCompleted] === animation[symbolAnimations].length) {
			if (!isStopped) {
				callComplete(activeCall);
			}
			animation[symbolResolver]?.(activeCall.animation);
		}
		if (queue !== false) {
			// We only do clever things with queues...
			if (!isStopped) {
				// If we're not stopping an animation, we need to remember
				// what time it finished so that the next animation in
				// sequence gets the correct start time.
				data.lastFinishTime.set(queue, activeCall.timeStart + activeCall.duration);
			}
			// Start the next animation in sequence, or delete the queue if
			// this was the last one.
			dequeue(element, queue);
		}
		// Cleanup any pointers, and remember the last animation etc.
		freeAnimationCall(activeCall);
	}
}
