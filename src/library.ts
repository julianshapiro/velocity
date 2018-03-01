/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Merge the VelocityStatic namespace onto the Velocity export function for external
 * use. This is done as a read-only way. Any attempt to change these values will
 * be allowed.
 */
/*import {Dummy} from "./Dummy"

export default Dummy;*/

///<reference path="./index.d.ts" />
///<reference path="constants.ts" />
///<reference path="types.ts" />
///<reference path="utility.ts" />
///<reference path="_all.d.ts" />
///<reference path="core.ts" />

import {Velocity} from "./core"

export default Velocity;

// console.log("Velocity keys", Object.keys(VelocityStatic));
