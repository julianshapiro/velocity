/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 * 
 * Easings to act on strings, either set at the start or at the end depending on
 * need.
 */

namespace Easing {
	export function atStart(percentComplete: number, startValue: any, endValue: any): any {
		return percentComplete === 0
			? startValue
			: endValue;
	}

	export function atEnd(percentComplete: number, startValue: any, endValue: any): any {
		return percentComplete === 1
			? endValue
			: startValue;
	}

	export function during(percentComplete: number, startValue: any, endValue: any): any {
		return percentComplete === 0 || percentComplete === 1
			? startValue
			: endValue;
	}
};
