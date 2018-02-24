///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Back easings, based on code from https://github.com/yuichiroharai/easeplus-velocity
 */

interface VelocityEasingsType {
	"easeInBack": true;
	"easeOutBack": true;
	"easeInOutBack": true;
}

namespace VelocityStatic.Easing {
	export function registerBackIn(name: string, amount: number) {
		registerEasing([name, function(percentComplete: number, startValue: number, endValue: number): number {
			if (percentComplete === 0) {
				return startValue;
			}
			if (percentComplete === 1) {
				return endValue;
			}
			return Math.pow(percentComplete, 2) * ((amount + 1) * percentComplete - amount) * (endValue - startValue);
		}]);
	}

	export function registerBackOut(name: string, amount: number) {
		registerEasing([name, function(percentComplete: number, startValue: number, endValue: number): number {
			if (percentComplete === 0) {
				return startValue;
			}
			if (percentComplete === 1) {
				return endValue;
			}
			return (Math.pow(--percentComplete, 2) * ((amount + 1) * percentComplete + amount) + 1) * (endValue - startValue);
		}]);
	}

	export function registerBackInOut(name: string, amount: number) {
		amount *= 1.525;
		registerEasing([name, function(percentComplete: number, startValue: number, endValue: number): number {
			if (percentComplete === 0) {
				return startValue;
			}
			if (percentComplete === 1) {
				return endValue;
			}
			return ((percentComplete *= 2) < 1
				? (Math.pow(percentComplete, 2) * ((amount + 1) * percentComplete - amount))
				: (Math.pow(percentComplete -= 2, 2) * ((amount + 1) * percentComplete + amount) + 2)
			) * 0.5 * (endValue - startValue);
		}]);
	}

	registerBackIn("easeInBack", 1.7);
	registerBackOut("easeOutBack", 1.7);
	registerBackInOut("easeInOutBack", 1.7);

	// TODO: Expose these as actions to register custom easings?
};
