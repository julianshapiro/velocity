/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

interface VelocityEasingsType {
	"linear": true;
	"swing": true;
	"spring": true;
}

namespace VelocityStatic.Easing {
	export const Easings: {[name: string]: VelocityEasingFn} = createEmptyObject();

	/**
	 * Used to register a easing. This should never be called by users
	 * directly, instead it should be called via an action:<br/>
	 * <code>Velocity("registerEasing", "name", VelocityEasingFn);</code>
	 *
	 * @private
	 */
	export function registerEasing(args?: [string, VelocityEasingFn]) {
		const name: string = args[0],
			callback = args[1];

		if (!isString(name)) {
			console.warn("VelocityJS: Trying to set 'registerEasing' name to an invalid value:", name);
		} else if (!isFunction(callback)) {
			console.warn("VelocityJS: Trying to set 'registerEasing' callback to an invalid value:", name, callback);
		} else if (Easings[name]) {
			console.warn("VelocityJS: Trying to override 'registerEasing' callback", name);
		} else {
			Easings[name] = callback;
		}
	}

	registerAction(["registerEasing", registerEasing], true);

	/* Basic (same as jQuery) easings. */
	registerEasing(["linear", function(percentComplete, startValue, endValue) {
		return startValue + percentComplete * (endValue - startValue);
	}]);

	registerEasing(["swing", function(percentComplete, startValue, endValue) {
		return startValue + (0.5 - Math.cos(percentComplete * Math.PI) / 2) * (endValue - startValue);
	}]);

	/* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
	registerEasing(["spring", function(percentComplete, startValue, endValue) {
		return startValue + (1 - (Math.cos(percentComplete * 4.5 * Math.PI) * Math.exp(-percentComplete * 6))) * (endValue - startValue);
	}]);
};
