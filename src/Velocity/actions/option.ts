///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get or set a value from one or more running animations.
 */

namespace VelocityStatic {
	/**
	 * Used to map getters for the various AnimationFlags.
	 */
	const animationFlags: {[key: string]: number} = {
		"isExpanded": AnimationFlags.EXPANDED,
		"isReady": AnimationFlags.READY,
		"isStarted": AnimationFlags.STARTED,
		"isStopped": AnimationFlags.STOPPED,
		"isPaused": AnimationFlags.PAUSED,
		"isSync": AnimationFlags.SYNC,
		"isReverse": AnimationFlags.REVERSE
	};

	/**
	 * Get or set an option or running AnimationCall data value. If there is no
	 * value passed then it will get, otherwise we will set.
	 * 
	 * NOTE: When using "get" this will not touch the Promise as it is never
	 * returned to the user.
	 */
	function option(args?: any[], elements?: VelocityResult, promiseHandler?: VelocityPromise, action?: string): any {
		const key = args[0],
			queue = action.indexOf(".") >= 0 ? action.replace(/^.*\./, "") : undefined,
			queueName = queue === "false" ? false : validateQueue(queue, true);
		let animations: AnimationCall[],
			value = args[1];

		if (!key) {
			console.warn("VelocityJS: Cannot access a non-existant key!");
			return null;
		}
		// If we're chaining the return value from Velocity then we are only
		// interested in the values related to that call
		if (isVelocityResult(elements) && elements.velocity.animations) {
			animations = elements.velocity.animations;
		} else {
			animations = [];

			for (let activeCall = State.first; activeCall; activeCall = activeCall._next) {
				if (elements.indexOf(activeCall.element) >= 0 && getValue(activeCall.queue, activeCall.options.queue) === queueName) {
					animations.push(activeCall);
				}
			}
			// If we're dealing with multiple elements that are pointing at a
			// single running animation, then instead treat them as a single
			// animation.
			if (elements.length > 1 && animations.length > 1) {
				let i = 1,
					options = animations[0].options;

				while (i < animations.length) {
					if (animations[i++].options !== options) {
						options = null;
						break;
					}
				}
				// TODO: this needs to check that they're actually a sync:true animation to merge the results, otherwise the individual values may be different
				if (options) {
					animations = [animations[0]];
				}
			}
		}
		// GET
		if (value === undefined) {
			const result = [],
				flag = animationFlags[key];

			for (let i = 0; i < animations.length; i++) {
				if (flag === undefined) {
					// A normal key to get.
					result.push(getValue(animations[i][key], animations[i].options[key]));
				} else {
					// A flag that we're checking against.
					result.push((animations[i]._flags & flag) === 0);
				}
			}
			if (elements.length === 1 && animations.length === 1) {
				// If only a single animation is found and we're only targetting a
				// single element, then return the value directly
				return result[0];
			}
			return result;
		}
		// SET
		let isPercentComplete: boolean;

		switch (key) {
			case "cache":
				value = validateCache(value);
				break;
			case "begin":
				value = validateBegin(value);
				break;
			case "complete":
				value = validateComplete(value);
				break;
			case "delay":
				value = validateDelay(value);
				break;
			case "duration":
				value = validateDuration(value);
				break;
			case "fpsLimit":
				value = validateFpsLimit(value);
				break;
			case "loop":
				value = validateLoop(value);
				break;
			case "percentComplete":
				isPercentComplete = true;
				value = parseFloat(value);
				break;
			case "repeat":
			case "repeatAgain":
				value = validateRepeat(value);
				break;
			default:
				if (key[0] !== "_") {
					const num = parseFloat(value);

					if (value == num) {
						value = num;
					}
					break;
				}
			// deliberate fallthrough
			case "queue":
			case "promise":
			case "promiseRejectEmpty":
			case "easing":
			case "started":
				console.warn("VelocityJS: Trying to set a read-only key:", key);
				return;
		}
		if (value === undefined || value !== value) {
			console.warn("VelocityJS: Trying to set an invalid value:", key, "=", value, "(" + args[1] + ")");
			return null;
		}
		for (let i = 0; i < animations.length; i++) {
			const animation = animations[i];

			if (isPercentComplete) {
				animation.timeStart = lastTick - (getValue(animation.duration, animation.options.duration, defaults.duration) * value);
			} else {
				animation[key] = value;
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

	registerAction(["option", option], true);
}
