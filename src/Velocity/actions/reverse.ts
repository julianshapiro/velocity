///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Actions that can be performed by passing a string instead of a propertiesMap.
 */

namespace VelocityStatic {
	registerAction(["reverse", function(args?: any[], elements?: HTMLorSVGElement[] | VelocityResult, promiseHandler?: VelocityPromise, action?: string) {
		// TODO: Code needs to split out before here - but this is needed to prevent it being overridden
		throw new SyntaxError("VelocityJS: The 'reverse' action is private.");
	}], true)
}
