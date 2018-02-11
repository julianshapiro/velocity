/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {
	/**
	 * Used to patch any object to allow Velocity chaining. In order to chain an
	 * object must either be treatable as an array - with a <code>.length</code>
	 * property, and each member a Node, or a Node directly.
	 * 
	 * By default Velocity will try to patch <code>window</code>,
	 * <code>jQuery</code>, <code>Zepto</code>, and several classes that return
	 * Nodes or lists of Nodes.
	 * 
	 * @public
	 */
	export function patch(proto: any, global?: boolean) {
		try {
			defineProperty(proto, (global ? "V" : "v") + "elocity", VelocityFn);
		} catch (e) {
			console.warn("VelocityJS: Error when trying to add prototype.", e);
		}
	}
};
