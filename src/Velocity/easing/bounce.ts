///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Bounce easings, based on code from https://github.com/yuichiroharai/easeplus-velocity
 */

interface VelocityEasingsType {
	"easeInBounce": true;
	"easeOutBounce": true;
	"easeInOutBounce": true;
}

namespace VelocityStatic.Easing {
	function easeOutBounce(percentComplete: number): number {
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

	function easeInBounce(percentComplete: number): number {
		return 1 - easeOutBounce(1 - percentComplete);
	};

	registerEasing(["easeInBounce", function(percentComplete: number, startValue: number, endValue: number): number {
		if (percentComplete === 0) {
			return startValue;
		}
		if (percentComplete === 1) {
			return endValue;
		}
		return easeInBounce(percentComplete) * (endValue - startValue);
	}]);

	registerEasing(["easeOutBounce", function(percentComplete: number, startValue: number, endValue: number): number {
		if (percentComplete === 0) {
			return startValue;
		}
		if (percentComplete === 1) {
			return endValue;
		}
		return easeOutBounce(percentComplete) * (endValue - startValue);
	}]);

	registerEasing(["easeInOutBounce", function(percentComplete: number, startValue: number, endValue: number): number {
		if (percentComplete === 0) {
			return startValue;
		}
		if (percentComplete === 1) {
			return endValue;
		}
		return (percentComplete < 0.5
			? easeInBounce(percentComplete * 2) * .5
			: easeOutBounce(percentComplete * 2 - 1) * 0.5 + 0.5
		) * (endValue - startValue);
	}]);
};
