///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get a value from one or more running animations.
 */

namespace VelocityStatic {

	function get(args?: any[], elements?: HTMLorSVGElement[] | VelocityResult, promiseHandler?: VelocityPromise, action?: string): any {
		let key = args[0],
			queue = action.indexOf(".") >= 0 ? action.replace(/^.*\./, "") : undefined,
			queueName = queue === "false" ? false : getValue(queue && validateQueue(queue), defaults.queue),
			animations: AnimationCall[];

		if (!key) {
			console.warn("VelocityJS: Trying to get a non-existant key:", key);
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
		// If only a single animation is found and we're only targetting a
		// single element, then return the value directly
		if (elements.length === 1 && animations.length === 1) {
			return getValue(animations[0][key], animations[0].options[key]);
		}
		let i = 0,
			result = [];

		for (; i < animations.length; i++) {
			result.push(getValue(animations[i][key], animations[i].options[key]));
		}
		return result;
	}

	registerAction(["get", get], true);
}
