/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Bounce easings, based on code from https://github.com/yuichiroharai/easeplus-velocity
 */

import { registerEasing } from "@velocityjs/core";

const easeInBouncePercent = (percentComplete: number): number =>
	1 - easeOutBouncePercent(1 - percentComplete);

const easeOutBouncePercent = (percentComplete: number): number => {
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
};

export const easeInBounce = (percentComplete: number, startValue: number, endValue: number): number =>
	percentComplete === 0
		? startValue
		: percentComplete === 1
			? endValue
			: easeInBouncePercent(percentComplete) * (endValue - startValue);

export const easeOutBounce = (percentComplete: number, startValue: number, endValue: number): number =>
	percentComplete === 0
		? startValue
		: percentComplete === 1
			? endValue
			: easeOutBouncePercent(percentComplete) * (endValue - startValue);

export const easeInOutBounce = (percentComplete: number, startValue: number, endValue: number): number =>
	percentComplete === 0
		? startValue
		: percentComplete === 1
			? endValue
			: (percentComplete < 0.5
				? easeInBouncePercent(percentComplete * 2) * 0.5
				: easeOutBouncePercent(percentComplete * 2 - 1) * 0.5 + 0.5
			) * (endValue - startValue);

registerEasing("easeInBounce", easeInBounce);
registerEasing("easeInOutBounce", easeInOutBounce);
registerEasing("easeOutBounce", easeOutBounce);

declare module "@velocityjs/core" {
	export interface INamedEasings {
		"easeInBounce": true;
		"easeInOutBounce": true;
		"easeOutBounce": true;
	}
}
