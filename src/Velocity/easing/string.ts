///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 * 
 * Easings to act on strings, either set at the start or at the end depending on
 * need.
 */

interface VelocityEasingsType {
	"at-start": true;
	"during": true;
	"at-end": true;
}

namespace VelocityStatic.Easing {
	/**
	 * Easing function that sets to the specified value immediately after the
	 * animation starts.
	 */
	registerEasing(["at-start", function(percentComplete: number, startValue: any, endValue: any): any {
		return percentComplete === 0
			? startValue
			: endValue;
	} as any]);

	/**
	 * Easing function that sets to the specified value while the animation is
	 * running.
	 */
	registerEasing(["during", function(percentComplete: number, startValue: any, endValue: any): any {
		return percentComplete === 0 || percentComplete === 1
			? startValue
			: endValue;
	} as any]);

	/**
	 * Easing function that sets to the specified value when the animation ends.
	 */
	registerEasing(["at-end", function(percentComplete: number, startValue: any, endValue: any): any {
		return percentComplete === 1
			? endValue
			: startValue;
	} as any]);
};
