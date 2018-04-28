/*
 * VelocityJS.org (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "@types/qunit";

declare global {
	interface QUnit {
		todo(name: string, callback: (assert: Assert) => void): void;
	}

	interface Assert {
		close: {
			(actual: number, expected: number, maxDifference: number, message: string): void;
			percent(actual: number, expected: number, maxPercentDifference: number, message: string): void;
		};
		notClose: {
			(actual: number, expected: number, minDifference: number, message: string): void;
			percent(actual: number, expected: number, minPercentDifference: number, message: string): void;
		};
	}
}
