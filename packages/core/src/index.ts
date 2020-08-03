/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Extended Velocity members.
 */

// Typedefs
import {
	SequenceList, StrictVelocityOptions, Velocity as VelocityPublic,
	VelocityActionFn, VelocityEasingFn, VelocityState,
} from "./velocity";

// Project
import { defineProperty } from "./utility";
import { Actions as ActionsObject } from "./Velocity/actions/actions";
import { defaults as DefaultObject } from "./Velocity/defaults";
import { Easings as EasingsObject } from "./Velocity/easing/easings";
import { patch as patchFn } from "./Velocity/patch";
import { SequencesObject } from "./Velocity/sequencesObject";
import { State as StateObject } from "./Velocity/state";
import { Velocity as VelocityFn } from "./velocityFn";

// Build the entire library, even optional bits.
import "./Velocity/_all";

// Constants
const Velocity: VelocityPublic = VelocityFn as any;

/**
 * These parts of Velocity absolutely must be included, even if they're unused!
 */
namespace VelocityStatic {
	/**
	 * Actions cannot be replaced if they are internal (hasOwnProperty is false
	 * but they still exist). Otherwise they can be replaced by users.
	 *
	 * All external method calls should be using actions rather than sub-calls
	 * of Velocity itself.
	 */
	export const Actions: { [name: string]: VelocityActionFn } = ActionsObject;

	/**
	 * Our known easing functions.
	 */
	export const Easings: { [name: string]: VelocityEasingFn } = EasingsObject;

	/**
	 * The currently registered sequences.
	 */
	export const Sequences: { [name: string]: SequenceList } = SequencesObject;

	/**
	 * Current internal state of Velocity.
	 */
	export const State: VelocityState = StateObject; // tslint:disable-line:no-shadowed-variable

	/**
	 * Velocity option defaults, which can be overriden by the user.
	 */
	export const defaults: StrictVelocityOptions & { reset?: () => void } = DefaultObject as any;

	/**
	 * Used to patch any object to allow Velocity chaining. In order to chain an
	 * object must either be treatable as an array - with a <code>.length</code>
	 * property, and each member a Node, or a Node directly.
	 *
	 * By default Velocity will try to patch <code>window</code>,
	 * <code>jQuery</code>, <code>Zepto</code>, and several classes that return
	 * Nodes or lists of Nodes.
	 */
	export const patch = patchFn;

	/**
	 * Set to true, 1 or 2 (most verbose) to output debug info to console.
	 */
	export let debug: boolean | 1 | 2 = false;

	/**
	 * In mock mode, all animations are forced to complete immediately upon the
	 * next rAF tick. If there are further animations queued then they will each
	 * take one single frame in turn. Loops and repeats will be disabled while
	 * <code>mock = true</code>.
	 */
	export let mock: boolean = false;

	/**
	 * Save our version number somewhere visible.
	 */
	// @ts-ignore
	export const version = __VERSION__;

	/**
	 * Added as a fallback for "import {Velocity} from 'velocity-animate';".
	 */
	export const Velocity: VelocityPublic = VelocityFn as any; // tslint:disable-line:no-shadowed-variable
}

/* IE detection. Gist: https://gist.github.com/julianshapiro/9098609 */
const IE = (() => {
	interface IEDocument extends Document {
		documentMode: any; // IE
	}

	if ((document as IEDocument).documentMode) {
		return (document as IEDocument).documentMode;
	} else {
		for (let i = 7; i > 4; i--) {
			let div: HTMLDivElement | null = document.createElement("div");

			div.innerHTML = `<!${"--"}[if IE ${i}]><span></span><![endif]-->`;
			if (div.getElementsByTagName("span").length) {
				div = null;

				return i;
			}
		}
	}

	return undefined;
})();

/******************
 Unsupported
 ******************/

if (IE <= 8) {
	throw new Error("VelocityJS cannot run on Internet Explorer 8 or earlier");
}

// Make sure that the values within Velocity are read-only and upatchable.
for (const property in VelocityStatic) {
	if (VelocityStatic.hasOwnProperty(property)) {
		switch (typeof property) {
			case "number":
			case "boolean":
				defineProperty(Velocity, property, {
					get() {
						return VelocityStatic[property];
					},
					set(value: any) {
						(VelocityStatic[property] as any) = value;
					},
				}, true);
				break;

			default:
				defineProperty(Velocity, property, (VelocityStatic as any)[property], true);
				break;
		}
	}
}

Object.freeze(Velocity);

export { patch } from "./Velocity/patch";

export default Velocity; // tslint:disable-line:no-default-export
