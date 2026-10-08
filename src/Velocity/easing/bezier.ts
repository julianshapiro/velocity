/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Bezier curve function generator. Copyright 2014-2026 Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License
 * https://github.com/gre/bezier-easing
 */

// Typedefs
import { VelocityEasingFn } from "../../../velocity.d";

// Project
import { registerEasing } from "./easings";

/**
 * Fix to a range of <code>0 <= num <= 1</code>.
 */
function fixRange(num: number) {
	return Math.min(Math.max(num, 0), 1);
}

/**
 * Fallback for environments without Math.cbrt.
 */
const cbrt = Math.cbrt || ((num: number) => (num < 0 ? -Math.pow(-num, 1 / 3) : Math.pow(num, 1 / 3)));

/**
 * Solves x(t) = ((2a * t + 3b) * t + 3c) * t = x for t, with x in (0, 1):
 * u = 1/t is the largest real root of x*u^3 - 3c*u^2 - 3b*u - 2a = 0
 */
function solveTForX(x: number, a: number, b: number, c: number) {
	const j = 1 / Math.max(c, Math.sqrt(x)),
		k = x * j,
		l = k * j,
		s = c * j,
		q = b * l,
		m = s * s + q,
		h = -s * (s * s + 1.5 * q) - a * k * l,
		D = h * h - m * m * m;
	let v: number;

	if (m === 0 || D > 1e-12 * h * h) {
		// one real root (Cardano)
		const U = -cbrt(h < 0 ? h - Math.sqrt(D) : h + Math.sqrt(D));

		v = (U + m / U) || 0;
	} else {
		// three real roots, take the largest
		const r = Math.sqrt(m);

		v = 2 * r * Math.cos(Math.acos(Math.max(-1, Math.min(1, -h / (m * r)))) / 3);
	}

	return Math.min(1, k / (v + s));
}

export function generateBezier(...args: [number, number, number, number]): VelocityEasingFn {
	/* Must contain four args. */
	if (args.length !== 4) {
		return;
	}

	/* Args must be numbers. */
	for (let i = 0; i < 4; ++i) {
		if (typeof args[i] !== "number" || isNaN(args[i]) || !isFinite(args[i])) {
			return;
		}
	}

	/* X values must be in the [0, 1] range. */
	const mX1 = fixRange(args[0]);
	const mY1 = args[1];
	const mX2 = fixRange(args[2]);
	const mY2 = args[3];

	/* x(t) = ((2a * t + 3b) * t + 3c) * t, y(t) = ((ay * t + by) * t + cy) * t */
	const isLinear = mX1 === mY1 && mX2 === mY2,
		a = (3 * mX1 - 3 * mX2 + 1) / 2,
		b = mX2 - 2 * mX1,
		c = mX1,
		ay = 3 * mY1 - 3 * mY2 + 1,
		by = 3 * (mY2 - 2 * mY1),
		cy = 3 * mY1;

	const str = `generateBezier(${[mX1, mY1, mX2, mY2]})`,
		f = (percentComplete: number, startValue: number, endValue: number, property?: string) => {
			if (percentComplete === 0) {
				return startValue;
			}
			if (percentComplete === 1) {
				return endValue;
			}
			if (isLinear) {
				return startValue + percentComplete * (endValue - startValue);
			}
			/* percentComplete outside (0, 1) saturates to startValue / endValue */
			if (percentComplete < 0) {
				return startValue;
			}
			if (percentComplete > 1) {
				return endValue;
			}
			const t = solveTForX(percentComplete, a, b, c);

			return startValue + ((ay * t + by) * t + cy) * t * (endValue - startValue);
		};

	(f as any).getControlPoints = () => {
		return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }];
	};
	f.toString = () => {
		return str;
	};

	return f;
}

/* Common easings */
const easeIn = generateBezier(0.42, 0, 1, 1),
	easeOut = generateBezier(0, 0, 0.58, 1),
	easeInOut = generateBezier(0.42, 0, 0.58, 1);

registerEasing(["ease", generateBezier(0.25, 0.1, 0.25, 1)]);
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
