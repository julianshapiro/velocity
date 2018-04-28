/*
 * VelocityJS.org (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Core "Velocity" function.
 */

import {
	State,
	StrictVelocityOptions,
	VelocityActionFn,
	VelocityEasingFn,
} from "../index.d";

import {patch as patchFn} from "./Velocity/patch";

import {Actions as ActionsObject} from "./Velocity/actions/actions";
import {defaults as DefaultObject} from "./Velocity/defaults";
import {Easings as EasingsObject} from "./Velocity/easing/easings";
import {SequenceList, SequencesObject} from "./Velocity/sequencesObject";
import {State as StateObject} from "./Velocity/state";

/**
 * These parts of Velocity absolutely must be included, even if they're unused!
 */
export namespace VelocityStatic {
	/**
	 * Actions cannot be replaced if they are internal (hasOwnProperty is false
	 * but they still exist). Otherwise they can be replaced by users.
	 *
	 * All external method calls should be using actions rather than sub-calls
	 * of Velocity itself.
	 */
	export const Actions: {[name: string]: VelocityActionFn} = ActionsObject;

	/**
	 * Our known easing functions.
	 */
	export const Easings: {[name: string]: VelocityEasingFn} = EasingsObject;

	/**
	 * The currently registered sequences.
	 */
	export const Sequences: {[name: string]: SequenceList} = SequencesObject;

	/**
	 * Current internal state of Velocity.
	 */
	export const State: State = StateObject; // tslint:disable-line:no-shadowed-variable

	/**
	 * Velocity option defaults, which can be overriden by the user.
	 */
	export const defaults: StrictVelocityOptions & {reset?: () => void} = DefaultObject;

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
}

/***************
 Summary
 ***************/

/*
 - CSS: CSS stack that works independently from the rest of Velocity.
 - animate(): Core animation method that iterates over the targeted elements and queues the incoming call onto each element individually.
 - Pre-Queueing: Prepare the element for animation by instantiating its data cache and processing the call's options.
 - Queueing: The logic that runs once the call has reached its point of execution in the element's queue stack.
 Most logic is placed here to avoid risking it becoming stale (if the element's properties have changed).
 - Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
 - tick(): The single requestAnimationFrame loop responsible for tweening all in-progress calls.
 - completeCall(): Handles the cleanup process for each Velocity call.
 */

/*********************
 Helper Functions
 *********************/

/* IE detection. Gist: https://gist.github.com/julianshapiro/9098609 */
const IE = (() => {
	interface IEDocument extends Document {
		documentMode: any; // IE
	}

	if ((document as IEDocument).documentMode) {
		return (document as IEDocument).documentMode;
	} else {
		for (let i = 7; i > 4; i--) {
			let div = document.createElement("div");

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

/******************
 Frameworks
 ******************/

if (window) {
	/*
	 * Both jQuery and Zepto allow their $.fn object to be extended to allow
	 * wrapped elements to be subjected to plugin calls. If either framework is
	 * loaded, register a "velocity" extension pointing to Velocity's core
	 * animate() method. Velocity also registers itself onto a global container
	 * (window.jQuery || window.Zepto || window) so that certain features are
	 * accessible beyond just a per-element scope. Accordingly, Velocity can
	 * both act on wrapped DOM elements and stand alone for targeting raw DOM
	 * elements.
	 */
	const jQuery: {fn: any} = (window as any).jQuery,
		Zepto: {fn: any} = (window as any).Zepto;

	patchFn(window, true);
	patchFn(Element && Element.prototype);
	patchFn(NodeList && NodeList.prototype);
	patchFn(HTMLCollection && HTMLCollection.prototype);

	patchFn(jQuery, true);
	patchFn(jQuery && jQuery.fn);

	patchFn(Zepto, true);
	patchFn(Zepto && Zepto.fn);
}
