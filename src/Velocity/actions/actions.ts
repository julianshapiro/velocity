/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Actions that can be performed by passing a string instead of a propertiesMap.
 */

// Typedefs
import {VelocityActionFn} from "../../../velocity.d";

// Project
import {isFunction, isString, propertyIsEnumerable} from "../../types";
import {defineProperty} from "../../utility";

// Constants
export const Actions: {[name: string]: VelocityActionFn} = {};

/**
 * Used to register an action. This should never be called by users
 * directly, instead it should be called via  an action:<br/>
 * <code>Velocity("registerAction", "name", VelocityActionFn);</code>
 */
export function registerAction(args?: [string, VelocityActionFn], internal?: boolean) {
	const name: string = args[0],
		callback = args[1];

	if (!isString(name)) {
		console.warn(`VelocityJS: Trying to set 'registerAction' name to an invalid value:`, name);
	} else if (!isFunction(callback)) {
		console.warn(`VelocityJS: Trying to set 'registerAction' callback to an invalid value:`, name, callback);
	} else if (Actions[name] && !propertyIsEnumerable(Actions, name)) {
		console.warn(`VelocityJS: Trying to override internal 'registerAction' callback`, name);
	} else if (internal === true) {
		defineProperty(Actions, name, callback);
	} else {
		Actions[name] = callback;
	}
}

registerAction(["registerAction", registerAction as any], true);
