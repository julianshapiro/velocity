///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Finish all animation.
 */

namespace VelocityStatic {

	/**
	 * Check if an animation should be finished, and if so we set the tweens to
	 * the final value for it, then call complete.
	 */
	function checkAnimationShouldBeFinished(animation: AnimationCall, queueName: false | string, defaultQueue: false | string) {
		validateTweens(animation);
		if (queueName === undefined || queueName === getValue(animation.queue, animation.options.queue, defaultQueue)) {
			for (const property in animation.tweens) {
				let tween = animation.tweens[property],
					pattern = tween[Tween.PATTERN],
					currentValue = "",
					i = 0;

				if (pattern) {
					for (; i < pattern.length; i++) {
						let endValue = tween[Tween.END][i];

						currentValue += endValue == null ? pattern[i] : endValue;
					}
				}
				CSS.setPropertyValue(animation.element, property, currentValue);
			}
			completeCall(animation);
		}
	}

	/**
	 * Clear the currently-active delay on each targeted element.
	 * @param {HTMLorSVGElement[]} elements The velocity elements
	 */
	function finish(args: any[], elements: VelocityResult, promiseHandler?: VelocityPromise): void {
		let queueName: string | false = args[0] === undefined ? undefined : validateQueue(args[0]),
			defaultQueue: false | string = defaults.queue;

		if (isVelocityResult(elements) && elements.velocity.animations) {
			for (let i = 0, animations = elements.velocity.animations; i < animations.length; i++) {
				checkAnimationShouldBeFinished(animations[i], queueName, defaultQueue);
			}
		} else {
			for (let element of elements) {
				let activeCall = State.first,
					nextCall: AnimationCall;

				// Exapand any tweens that might need it.
				while ((activeCall = State.firstNew)) {
					validateTweens(activeCall);
				}
				// If we want to finish everything in the queue, we have to
				// iterate through every element. We first get each queued
				// animation and add the end value given to each element.
				for (activeCall = State.first; activeCall; activeCall = nextCall || State.firstNew) {
					nextCall = activeCall._next || VelocityStatic.dequeue(element, queueName);
					checkAnimationShouldBeFinished(activeCall, queueName, defaultQueue);
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

	registerAction(["finish", finish], true);
}
