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
 * 
 * Merge the VelocityStatic namespace onto the Velocity function for external
 * use. This is done as a read-only way. Any attempt to change these values will
 * be allowed.
 */
for (const key in VelocityStatic) {
	let value = VelocityStatic[key];

	if (isString(value) || isNumber(value) || isBoolean(value)) {
		Object.defineProperty(VelocityFn, key, {
			enumerable: PUBLIC_MEMBERS.indexOf(key) >= 0,
			get: function() {
				return VelocityStatic[key];
			},
			set: function(value?: any) {
				VelocityStatic[key] = value;
			}
		});
	} else {
		Object.defineProperty(VelocityFn, key, {
			enumerable: PUBLIC_MEMBERS.indexOf(key) >= 0,
			get: function() {
				return VelocityStatic[key];
			}
		});
	}
}

// console.log("Velocity keys", Object.keys(VelocityStatic));
