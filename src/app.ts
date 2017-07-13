///<reference path="../index.d.ts" />
///<reference path="jquery.ts" />
///<reference path="constants.ts" />
///<reference path="types.ts" />
///<reference path="utility.ts" />
///<reference path="Velocity/_all.d.ts" />
///<reference path="core.ts" />

/*
 * Merge the VelocityStatic namespace onto the Velocity function for external
 * use.
 */

for (var key in VelocityStatic) {
	Velocity[key] = VelocityStatic[key];
}
