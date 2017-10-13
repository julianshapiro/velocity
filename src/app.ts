///<reference path="../index.d.ts" />
///<reference path="constants.ts" />
///<reference path="types.ts" />
///<reference path="utility.ts" />
///<reference path="Velocity/_all.d.ts" />
///<reference path="core.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

/*
 * Merge the VelocityStatic namespace onto the Velocity function for external
 * use.
 */
for (let key in VelocityStatic) {
	VelocityFn[key] = VelocityStatic[key];
}
