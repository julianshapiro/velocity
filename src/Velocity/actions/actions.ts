/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Actions that can be performed by passing a string instead of a propertiesMap.
 */

namespace VelocityStatic {
	/**
	 * Actions cannot be replaced if they are internal (hasOwnProperty is false
	 * but they still exist). Otherwise they can be replaced by users.
	 * 
	 * All external method calls should be using actions rather than sub-calls
	 * of Velocity itself.
	 */
	export let Actions: {[name: string]: VelocityActionFn} = Object.create(null);

	/**
	 * Used to register an action. This should never be called by users
	 * directly, instead it should be called via an Action.
	 * 
	 * @private
	 */
	export function registerAction(args?: [string, VelocityActionFn], internal?: boolean) {
		let name: string = args[0],
			callback = args[1];

		if (!isString(name)) {
			console.warn("VelocityJS: Trying to set 'registerAction' name to an invalid value:", name);
		} else if (!isFunction(callback)) {
			console.warn("VelocityJS: Trying to set 'registerAction' callback to an invalid value:", callback);
		} else if (Actions[name] && !propertyIsEnumerable(Actions, name)) {
			console.warn("VelocityJS: Trying to override internal 'registerAction' callback");
		} else if (internal === true) {
			defineProperty(Actions, name, callback);
		} else {
			Actions[name] = callback;
		}
	}

	registerAction(["registerAction", registerAction as any], true);
}
