/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Bounce easings, based on code from https://github.com/yuichiroharai/easeplus-velocity
 */

// Project
import {registerEasing} from "./easings";

function easeOutBouncePercent(percentComplete: number): number {
	if (percentComplete < 1 / 2.75) {
		return (7.5625 * percentComplete * percentComplete);
	}
	if (percentComplete < 2 / 2.75) {
		return (7.5625 * (percentComplete -= 1.5 / 2.75) * percentComplete + 0.75);
	}
	if (percentComplete < 2.5 / 2.75) {
		return (7.5625 * (percentComplete -= 2.25 / 2.75) * percentComplete + 0.9375);
	}

	return (7.5625 * (percentComplete -= 2.625 / 2.75) * percentComplete + 0.984375);
}

function easeInBouncePercent(percentComplete: number): number {
	return 1 - easeOutBouncePercent(1 - percentComplete);
}

export function easeInBounce(percentComplete: number, startValue: number, endValue: number): number {
	if (percentComplete === 0) {
		return startValue;
	}
	if (percentComplete === 1) {
		return endValue;
	}

	return easeInBouncePercent(percentComplete) * (endValue - startValue);
}

export function easeOutBounce(percentComplete: number, startValue: number, endValue: number): number {
	if (percentComplete === 0) {
		return startValue;
	}
	if (percentComplete === 1) {
		return endValue;
	}

	return easeOutBouncePercent(percentComplete) * (endValue - startValue);
}

export function easeInOutBounce(percentComplete: number, startValue: number, endValue: number): number {
	if (percentComplete === 0) {
		return startValue;
	}
	if (percentComplete === 1) {
		return endValue;
	}

	return (percentComplete < 0.5
		? easeInBouncePercent(percentComplete * 2) * 0.5
		: easeOutBouncePercent(percentComplete * 2 - 1) * 0.5 + 0.5
	) * (endValue - startValue);
}

registerEasing(["easeInBounce", easeInBounce]);
registerEasing(["easeOutBounce", easeOutBounce]);
registerEasing(["easeInOutBounce", easeInOutBounce]);
