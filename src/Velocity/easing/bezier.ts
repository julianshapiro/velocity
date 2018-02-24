///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License
 */

interface VelocityEasingsType {
	"ease": true;
	"easeIn": true;
	"ease-in": true;
	"easeOut": true;
	"ease-out": true;
	"easeInOut": true;
	"ease-in-out": true;
	"easeInSine": true;
	"easeOutSine": true;
	"easeInOutSine": true;
	"easeInQuad": true;
	"easeOutQuad": true;
	"easeInOutQuad": true;
	"easeInCubic": true;
	"easeOutCubic": true;
	"easeInOutCubic": true;
	"easeInQuart": true;
	"easeOutQuart": true;
	"easeInOutQuart": true;
	"easeInQuint": true;
	"easeOutQuint": true;
	"easeInOutQuint": true;
	"easeInExpo": true;
	"easeOutExpo": true;
	"easeInOutExpo": true;
	"easeInCirc": true;
	"easeOutCirc": true;
	"easeInOutCirc": true;
}

namespace VelocityStatic.Easing {
	/**
	 * Fix to a range of <code>0 <= num <= 1</code>.
	 */
	function fixRange(num: number) {
		return Math.min(Math.max(num, 0), 1);
	}

	function A(aA1, aA2) {
		return 1.0 - 3.0 * aA2 + 3.0 * aA1;
	}

	function B(aA1, aA2) {
		return 3.0 * aA2 - 6.0 * aA1;
	}

	function C(aA1) {
		return 3.0 * aA1;
	}

	function calcBezier(aT, aA1, aA2) {
		return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
	}

	function getSlope(aT, aA1, aA2) {
		return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
	}

	export function generateBezier(mX1: number, mY1: number, mX2: number, mY2: number): VelocityEasingFn {
		const NEWTON_ITERATIONS = 4,
			NEWTON_MIN_SLOPE = 0.001,
			SUBDIVISION_PRECISION = 0.0000001,
			SUBDIVISION_MAX_ITERATIONS = 10,
			kSplineTableSize = 11,
			kSampleStepSize = 1.0 / (kSplineTableSize - 1.0),
			float32ArraySupported = "Float32Array" in window;

		/* Must contain four arguments. */
		if (arguments.length !== 4) {
			return;
		}

		/* Arguments must be numbers. */
		for (let i = 0; i < 4; ++i) {
			if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
				return;
			}
		}

		/* X values must be in the [0, 1] range. */
		mX1 = fixRange(mX1);
		mX2 = fixRange(mX2);

		const mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

		function newtonRaphsonIterate(aX, aGuessT) {
			for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
				const currentSlope = getSlope(aGuessT, mX1, mX2);

				if (currentSlope === 0.0) {
					return aGuessT;
				}

				const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
				aGuessT -= currentX / currentSlope;
			}

			return aGuessT;
		}

		function calcSampleValues() {
			for (let i = 0; i < kSplineTableSize; ++i) {
				mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
			}
		}

		function binarySubdivide(aX, aA, aB) {
			let currentX, currentT, i = 0;

			do {
				currentT = aA + (aB - aA) / 2.0;
				currentX = calcBezier(currentT, mX1, mX2) - aX;
				if (currentX > 0.0) {
					aB = currentT;
				} else {
					aA = currentT;
				}
			} while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

			return currentT;
		}

		function getTForX(aX) {
			let intervalStart = 0.0,
				currentSample = 1,
				lastSample = kSplineTableSize - 1;

			for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
				intervalStart += kSampleStepSize;
			}

			--currentSample;

			const dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]),
				guessForT = intervalStart + dist * kSampleStepSize,
				initialSlope = getSlope(guessForT, mX1, mX2);

			if (initialSlope >= NEWTON_MIN_SLOPE) {
				return newtonRaphsonIterate(aX, guessForT);
			} else if (initialSlope === 0.0) {
				return guessForT;
			} else {
				return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
			}
		}

		let _precomputed = false;

		function precompute() {
			_precomputed = true;
			if (mX1 !== mY1 || mX2 !== mY2) {
				calcSampleValues();
			}
		}

		const f = function(percentComplete: number, startValue: number, endValue: number, property?: string) {
			if (!_precomputed) {
				precompute();
			}
			if (percentComplete === 0) {
				return startValue;
			}
			if (percentComplete === 1) {
				return endValue;
			}
			if (mX1 === mY1 && mX2 === mY2) {
				return startValue + percentComplete * (endValue - startValue);
			}
			return startValue + calcBezier(getTForX(percentComplete), mY1, mY2) * (endValue - startValue);
		};

		(f as any).getControlPoints = function() {
			return [{x: mX1, y: mY1}, {x: mX2, y: mY2}];
		};

		const str = "generateBezier(" + [mX1, mY1, mX2, mY2] + ")";
		f.toString = function() {
			return str;
		};

		return f;
	}

	/* Common easings */
	const easeIn = generateBezier(0.42, 0.0, 1.00, 1.0),
		easeOut = generateBezier(0.00, 0.0, 0.58, 1.0),
		easeInOut = generateBezier(0.42, 0.0, 0.58, 1.0);

	registerEasing(["ease", generateBezier(0.25, 0.1, 0.25, 1.0)]);
	registerEasing(["easeIn", easeIn]);
	registerEasing(["ease-in", easeIn]);
	registerEasing(["easeOut", easeOut]);
	registerEasing(["ease-out", easeOut]);
	registerEasing(["easeInOut", easeInOut]);
	registerEasing(["ease-in-out", easeInOut]);
	registerEasing(["easeInSine", generateBezier(0.47, 0, 0.745, 0.715)]);
	registerEasing(["easeOutSine", generateBezier(0.39, 0.575, 0.565, 1)]);
	registerEasing(["easeInOutSine", generateBezier(0.445, 0.05, 0.55, 0.95)]);
	registerEasing(["easeInQuad", generateBezier(0.55, 0.085, 0.68, 0.53)]);
	registerEasing(["easeOutQuad", generateBezier(0.25, 0.46, 0.45, 0.94)]);
	registerEasing(["easeInOutQuad", generateBezier(0.455, 0.03, 0.515, 0.955)]);
	registerEasing(["easeInCubic", generateBezier(0.55, 0.055, 0.675, 0.19)]);
	registerEasing(["easeOutCubic", generateBezier(0.215, 0.61, 0.355, 1)]);
	registerEasing(["easeInOutCubic", generateBezier(0.645, 0.045, 0.355, 1)]);
	registerEasing(["easeInQuart", generateBezier(0.895, 0.03, 0.685, 0.22)]);
	registerEasing(["easeOutQuart", generateBezier(0.165, 0.84, 0.44, 1)]);
	registerEasing(["easeInOutQuart", generateBezier(0.77, 0, 0.175, 1)]);
	registerEasing(["easeInQuint", generateBezier(0.755, 0.05, 0.855, 0.06)]);
	registerEasing(["easeOutQuint", generateBezier(0.23, 1, 0.32, 1)]);
	registerEasing(["easeInOutQuint", generateBezier(0.86, 0, 0.07, 1)]);
	registerEasing(["easeInExpo", generateBezier(0.95, 0.05, 0.795, 0.035)]);
	registerEasing(["easeOutExpo", generateBezier(0.19, 1, 0.22, 1)]);
	registerEasing(["easeInOutExpo", generateBezier(1, 0, 0, 1)]);
	registerEasing(["easeInCirc", generateBezier(0.6, 0.04, 0.98, 0.335)]);
	registerEasing(["easeOutCirc", generateBezier(0.075, 0.82, 0.165, 1)]);
	registerEasing(["easeInOutCirc", generateBezier(0.785, 0.135, 0.15, 0.86)]);
};
