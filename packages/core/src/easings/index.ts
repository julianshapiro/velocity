/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

export { registerEasing } from "./registerEasings";
export { Easings } from "./easingsObject";
export { registerEasingValidator, validateEasing } from "./validateEasing";
export * from "./internal";

/**
 * A list of easings for use in Typescript autocomplete. Extend this with the
 * following code:
 *
 * ```ts
 * declare module "@velocityjs" {
 *     export interface INamedEasings {
 *         "myEasing": true;
 *     }
 * }
 * ```
 */
export interface INamedEasings {
	// internal/linear.ts
	"linear": true;
	// internal/spring.ts
	"spring": true;
	// internal/string.ts
	"at-start": true;
	"during": true;
	"at-end": true;
	// internal/swing.ts
	"swing": true;
}

/**
 * All easings must return the current value given the start and end values, and
 * a percentage complete. The property name is also passed in case that makes a
 * difference to how values are used.
 *
 * @param percentComplete Between 0 and 1 inclusive.
 * @param startValue The value at 0.
 * @param endValue The value at 1.
 * @param property The property name.
 *
 * @returns the value at the specified percentComplete.
 */
export type EasingFn = (
	percentComplete: number,
	startValue: number,
	endValue: number,
	property: string) => number;

/**
 * This is a list of easings types for use in Typescript autocomplete. It should
 * be extended when registering any other automatic easings if relevant.
 */
export interface IEasingTypes {
	/**
	 * Named easings.
	 */
	named: keyof INamedEasings;

	/**
	 * Direct function easings.
	 */
	fn: EasingFn;

	/**
	 * An easing that has a number of discrete steps.
	 *
	 * @param steps The number of steps to take.
	 */
	step: [steps: number];
}

/**
 * List of all easing types for easy code completion in TypeScript.
 */
export type EasingType = IEasingTypes[keyof IEasingTypes];
