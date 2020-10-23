import { IAnimation } from "../core/animation";
/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Actions that can be performed by passing a string instead of a propertiesMap.
 */

import { defineProperty } from "../utility";
import { Velocity, KnownElement } from "../velocity";

/**
 * The contents of `this` within an action. Not all actions have elements (ie,
 * when they are called globally), so care should be taken to check before using
 * them.
 *
 * @param elements Any elements this action is being called on. This may be
 * undefined, in which case it is being called without any.
 *
 * @param promiseHandler The action should resolve or reject the promise as
 * needed.
 *
 * @param action The full name of the action before any dot (used for
 * sub-actions).
 */
export interface IActionThis {
	/**
	 * This is the new animation object, and must be used for the promise via
	 * `animation[symbolResolver](value)` or `animation[symbolRejecter](value)`.
	 */
	animation: IAnimation,
	/**
	 * This is either the previous animation if chaining a call, or the plain
	 * elements.
	 */
	elements?: KnownElement[] | IAnimation,
	/**
	 * The action being called.
	 */
	action: string,
}

/**
 * Used for action callbacks. These are the commands such as `"pause"` and
 * `"stop"`
 *
 * @param args The arguments passed to Velocity when calling this action. They
 * start as the first argument passed after the name of the action.
 */
export type ActionFn = (
	this: IActionThis,
	...args: any[]) => any;

/**
 * The contents of the Actions list.
 */
export interface IActions {
	[name: string]: ActionFn;
}

/**
 * Action list. Actions that are internal (propertyIsEnumerable is false) are
 * read-only, otherwise they can be replaced by users.
 */
export const Actions: IActions = {};

declare module "../velocity" {
	export interface IStaticVelocity {
		/**
		 * Action list. Actions that are internal (propertyIsEnumerable is false) are
		 * read-only, otherwise they can be replaced by users.
		 */
		readonly Actions: IActions;
	}
}

defineProperty(Velocity, "Actions", Actions);
