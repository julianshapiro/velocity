/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Actions that can be performed by passing a string instead of a propertiesMap.
 */

import { isFunction, isString, propertyIsEnumerable } from "../types";
import { defineProperty } from "../utility";
import { Velocity } from "../velocity";
import invariant from "tiny-invariant";
import { Actions, ActionFn } from "./actionsObject";

/**
 * Used to register an action. Actions are functions available through Velocity
 * that allow it to be extended.
 *
 * Actions are added as a call within Velocity, but all internal global ones are
 * also exported separately. This is to allow basic web pages access to them
 * without requiring in-depth programming.
 *
 * @param name The name of the action.
 *
 * @param callback The function to be called when the action occurs.
 *
 * @param internal (Private) If this is an internal action it cannot be replaced
 * by the user.
 *
 * @param global (Private) If this is a global action then it also gets added to
 * the global Velocity object (add to the declare separately).
 */
export function registerAction(name: string, callback: ActionFn, internal?: boolean, global?: boolean) {
	invariant(isString(name), `VelocityJS: Trying to set 'registerAction' name to an invalid value`);
	invariant(isFunction(callback), `VelocityJS: Trying to set 'registerAction' callback to an invalid value`);
	invariant(!Actions[name] || propertyIsEnumerable(Actions, name), `VelocityJS: Trying to override internal 'registerAction' callback`);

	if (internal === true) {
		defineProperty(Actions, name, callback);
		if (global) {
			defineProperty(Velocity, name, callback);
		}
	} else {
		Actions[name] = callback;
	}
}

registerAction("registerAction", registerAction, true, true);

declare module "../velocity" {
	export interface IStaticVelocity {
		/**
		 * Used to register an action. Actions are functions available through Velocity
		 * that allow it to be extended.
		 *
		 * Actions are added as a call within Velocity, but all internal global ones are
		 * also exported separately. This is to allow basic web pages access to them
		 * without requiring in-depth programming.
		 *
		 * @param name The name of the action.
		 *
		 * @param callback The function to be called when the action occurs.
		 */
		readonly registerAction: (name: string, callback: ActionFn) => void;
	}
}
