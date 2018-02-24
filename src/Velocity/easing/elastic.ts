///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Elastic easings, based on code from https://github.com/yuichiroharai/easeplus-velocity
 */

interface VelocityEasingsType {
	"easeInElastic": true;
	"easeOutElastic": true;
	"easeInOutElastic": true;
}

namespace VelocityStatic.Easing {
	const pi2 = Math.PI * 2;

	export function registerElasticIn(name: string, amplitude: number, period: number) {
		registerEasing([name, function(percentComplete: number, startValue: number, endValue: number): number {
			if (percentComplete === 0) {
				return startValue;
			}
			if (percentComplete === 1) {
				return endValue;
			}
			return -(amplitude * Math.pow(2, 10 * (percentComplete -= 1)) * Math.sin((percentComplete - (period / pi2 * Math.asin(1 / amplitude))) * pi2 / period)) * (endValue - startValue);
		}]);
	}

	export function registerElasticOut(name: string, amplitude: number, period: number) {
		registerEasing([name, function(percentComplete: number, startValue: number, endValue: number): number {
			if (percentComplete === 0) {
				return startValue;
			}
			if (percentComplete === 1) {
				return endValue;
			}
			return (amplitude * Math.pow(2, -10 * percentComplete) * Math.sin((percentComplete - (period / pi2 * Math.asin(1 / amplitude))) * pi2 / period) + 1) * (endValue - startValue);
		}]);
	}

	export function registerElasticInOut(name: string, amplitude: number, period: number) {
		registerEasing([name, function(percentComplete: number, startValue: number, endValue: number): number {
			if (percentComplete === 0) {
				return startValue;
			}
			if (percentComplete === 1) {
				return endValue;
			}
			const s = period / pi2 * Math.asin(1 / amplitude);

			percentComplete = percentComplete * 2 - 1;
			return (percentComplete < 0
				? -0.5 * (amplitude * Math.pow(2, 10 * percentComplete) * Math.sin((percentComplete - s) * pi2 / period))
				: amplitude * Math.pow(2, -10 * percentComplete) * Math.sin((percentComplete - s) * pi2 / period) * 0.5 + 1
			) * (endValue - startValue);
		}]);
	}

	registerElasticIn("easeInElastic", 1, 0.3);
	registerElasticOut("easeOutElastic", 1, 0.3);
	registerElasticInOut("easeInOutElastic", 1, 0.3 * 1.5);

	// TODO: Expose these as actions to register custom easings?
};
