/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details
 * 
 * Step easing generator.
 */

namespace Easing {
	let cache: {[steps: number]: VelocityEasing} = {};

	export function generateStep(steps): VelocityEasing {
		let fn = cache[steps];

		if (!fn) {
			fn = cache[steps] = function(percentComplete, startValue, endValue) {
				return startValue + Math.round(percentComplete * steps) * (1 / steps) * (endValue - startValue);
			};
		}
		return fn;
	}
};
