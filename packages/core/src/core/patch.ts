/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { Velocity } from "../velocity";
import { defineProperty } from "../utility";

/**
 * Used to patch any object to allow Velocity chaining. In order to chain an
 * object must either be treatable as an array - with a <code>.length</code>
 * property, and each member a Node, or a Node directly.
 */
export function patch(proto?: any, global?: boolean) {
	try {
		if (proto) {
			Object.defineProperty(proto, (global ? "V" : "v") + "elocity", { value: Velocity });
		}
	} catch (e) {
		console.warn(`VelocityJS: Error when trying to add prototype.`, e);
	}
}

type patch = typeof patch;

declare module "../velocity" {
	export interface IStaticVelocity {
		/**
		 * Used to patch any object to allow Velocity chaining. In order to chain an
		 * object must either be treatable as an array - with a <code>.length</code>
		 * property, and each member a Node, or a Node directly.
		 *
		 * By default Velocity will try to patch <code>window</code>,
		 * <code>jQuery</code>, <code>Zepto</code>, and several classes that return
		 * Nodes or lists of Nodes.
		 */
		readonly patch: patch;
	}
}

defineProperty(Velocity, "patch", patch);
