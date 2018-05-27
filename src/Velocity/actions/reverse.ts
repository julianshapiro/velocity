/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Actions that can be performed by passing a string instead of a propertiesMap.
 */

// Typedefs
import {HTMLorSVGElement, VelocityPromise, VelocityResult} from "../../../velocity.d";

// Project
import {registerAction} from "./actions";

registerAction(["reverse", (args?: any[], elements?: HTMLorSVGElement[] | VelocityResult, promiseHandler?: VelocityPromise, action?: string) => {
	// NOTE: Code needs to split out before here - but this is needed to prevent it being overridden
	throw new SyntaxError("VelocityJS: The 'reverse' action is built in and private.");
}], true);
