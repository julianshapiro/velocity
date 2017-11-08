///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get a value from one or more running animations.
 */

namespace VelocityStatic {

	function set(args?: any[], elements?: HTMLorSVGElement[] | VelocityResult, promiseHandler?: VelocityPromise, action?: string): any {
		let key = args[0],
			value = args[1],
			queue = action.indexOf(".") >= 0 ? action.replace(/^.*\./, "") : undefined,
			queueName = queue === "false" ? false : getValue(queue && validateQueue(queue), defaults.queue),
			animations: AnimationCall[];

		if (!key) {
			console.warn("VelocityJS: Trying to set a non-existant key:", key);
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
					if (animations[i].options !== options) {
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
			case "promise": // useless
				value = validatePromise(value);
				break;
			case "promiseRejectEmpty": // useless
				value = validatePromiseRejectEmpty(value);
				break;
			case "queue": // careful
				value = validateQueue(value);
				break;
			case "repeat":
			case "repeatAgain":
				value = validateRepeat(value);
				break;
			default:
				if (key[0] !== "_") {
					let num = parseFloat(value);

					if (value == num) {
						value = num;
					}
					break;
				}
			// deliberate fallthrough
			case "easing":
			case "started":
				console.warn("VelocityJS: Trying to set a read-only key:", key);
				return;
		}
		if (value === undefined) {
			console.warn("VelocityJS: Trying to set an invalid value:", key, "=", value, "(" + args[1] + ")");
			return null;
		}
		for (let i = 0; i < animations.length; i++) {
			animations[i][key] = value;
		}
	}

	registerAction(["set", set], true);
}
