/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License
 */

import {
	EasingFn,
	registerEasing,
	registerEasingValidator,
} from "@velocityjs/core";
import invariant from "tiny-invariant";

const fixRange = (num: number) => Math.min(Math.max(num, 0), 1);

const A = (aA1: number, aA2: number) => 1 - 3 * aA2 + 3 * aA1;

const B = (aA1: number, aA2: number) => 3 * aA2 - 6 * aA1;

const C = (aA1: number) => 3 * aA1;

const calcBezier = (aT: number, aA1: number, aA2: number) =>
	((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;

const getSlope = (aT: number, aA1: number, aA2: number) =>
	3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);

const bezierCache: Record<string, EasingFn> = {};

export function generateBezier(...args: [number, number, number, number]) {
	/* Must contain four args. */
	invariant(args.length === 4, "Must have four arguments to create a bezier easing");

	/* Args must be numbers. */
	for (let i = 0; i < 4; ++i) {
		invariant(typeof args[i] === "number" && !isNaN(args[i]) && isFinite(args[i]),
			"All arguments must be numbers to create a bezier easing");
	}
	const cacheKey = args.toString();
	if (bezierCache[cacheKey]) {
		return bezierCache[cacheKey];
	}

	const NEWTON_ITERATIONS = 4;
	const NEWTON_MIN_SLOPE = 0.001;
	const SUBDIVISION_PRECISION = 0.0000001;
	const SUBDIVISION_MAX_ITERATIONS = 10;
	const kSplineTableSize = 11;
	const kSampleStepSize = 1 / (kSplineTableSize - 1);
	const float32ArraySupported = "Float32Array" in window;

	/* X values must be in the [0, 1] range. */
	const mX1 = fixRange(args[0]);
	const mY1 = args[1];
	const mX2 = fixRange(args[2]);
	const mY2 = args[3];

	const mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

	const newtonRaphsonIterate = (aX: number, aGuessT: number) => {
		for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
			const currentSlope = getSlope(aGuessT, mX1, mX2);

			if (currentSlope === 0) {
				return aGuessT;
			}

			const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
			aGuessT -= currentX / currentSlope;
		}

		return aGuessT;
	}

	const calcSampleValues = () => {
		for (let i = 0; i < kSplineTableSize; ++i) {
			mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
		}
	}

	const binarySubdivide = (aX: number, aA: number, aB: number) => {
		let currentX: number;
		let currentT: number;
		let i = 0;

		do {
			currentT = aA + (aB - aA) / 2;
			currentX = calcBezier(currentT, mX1, mX2) - aX;
			if (currentX > 0) {
				aB = currentT;
			} else {
				aA = currentT;
			}
		} while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

		return currentT;
	}

	const getTForX = (aX: number) => {
		const lastSample = kSplineTableSize - 1;
		let intervalStart = 0;
		let currentSample = 1;

		for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
			intervalStart += kSampleStepSize;
		}

		--currentSample;

		const dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]);
		const guessForT = intervalStart + dist * kSampleStepSize;
		const initialSlope = getSlope(guessForT, mX1, mX2);

		if (initialSlope >= NEWTON_MIN_SLOPE) {
			return newtonRaphsonIterate(aX, guessForT);
		} else if (initialSlope === 0) {
			return guessForT;
		} else {
			return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
		}
	}

	let precomputed = false;

	const precompute = () => {
		precomputed = true;
		if (mX1 !== mY1 || mX2 !== mY2) {
			calcSampleValues();
		}
	}

	const fn = (percentComplete: number, startValue: number, endValue: number, _property?: string) => {
		if (!precomputed) {
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
	let str: string;
	fn.toString = () => {
		return str ?? (str = `generateBezier(${[mX1, mY1, mX2, mY2]})`);
	};

	return bezierCache[cacheKey] = fn;
}

registerEasingValidator((value) => {
	if (Array.isArray(value) && value.length === 4) {
		return generateBezier(value[0], value[1], value[2], value[3]);
	}
})

declare module "@velocityjs/core" {
	export interface IEasingTypes {
		/**
		 * Generate a bezier curve for the easing to take.
		 */
		bezier: [number, number, number, number];
	}
}
