///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Pause and resume animation.
 */

namespace VelocityStatic {

	let checkAnimation = function (animation: AnimationCall, queueName, defaultQueue, isPaused) {
		if (animation.paused !== isPaused) {
			if (queueName === undefined || (queueName !== undefined && queueName === getValue(animation.queue, animation.options.queue, defaultQueue))) {
				animation.paused = isPaused;
			}
		}
	};

	/**
	 * Pause and Resume are call-wide (not on a per element basis). Thus, calling pause or resume on a
	 * single element will cause any calls that contain tweens for that element to be paused/resumed
	 * as well.
	 */
	function pauseResume(args?: any[], elements?: HTMLorSVGElement[] | VelocityResult, promiseHandler?: VelocityPromise, action?: string) {
		let isPaused = action.indexOf("pause") === 0,
			queueName = args[0] === undefined ? undefined : validateQueue(args[0]),
			activeCall: AnimationCall,
			defaultQueue = defaults.queue

		if (isVelocityResult(elements) && elements.velocity.animations) {
			for (let i = 0, animations = elements.velocity.animations; i < animations.length; i++) {
				checkAnimation(animations[i], queueName, defaultQueue, isPaused);
			}
		} else {
			activeCall = State.first;
			while (activeCall) {
				if (!elements || _inArray.call(elements, activeCall.element)) {
					checkAnimation(activeCall, queueName, defaultQueue, isPaused);
				}
				activeCall = activeCall._next;
			}
		}
	}

	registerAction(["pause", pauseResume], true);
	registerAction(["resume", pauseResume], true);
}
