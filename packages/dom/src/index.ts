/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { IVelocity, Velocity } from "@velocityjs/core";

Velocity.patch(window, true);
Velocity.patch(Element?.prototype);
Velocity.patch(NodeList?.prototype);
Velocity.patch(HTMLCollection?.prototype);

declare global {
	/**
	 * Extend <code>Element</code> directly.
	 */
	export interface Element {
		readonly velocity: IVelocity<Element>;
	}

	/**
	 * Extend <code>Element</code> directly.
	 */
	export interface HTMLCollection {
		readonly velocity: IVelocity<Element>;
	}

	/**
	 * Extend the return value from <code>document.querySelectorAll()</code>.
	 */
	export interface NodeListOf<TNode extends Node> {
		readonly velocity: IVelocity<TNode>;
	}
}

declare module "@velocityjs/core" {
	export interface IElements {
		dom: Element | HTMLCollection | NodeListOf<Node>;
	}
}
