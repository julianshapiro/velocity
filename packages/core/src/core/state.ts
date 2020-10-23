/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { Velocity } from "../velocity";
import { defineProperty } from "../utility";
import { AnimationCall } from "./animationCall";
import { LinkedList } from "../list";

const isClient = window && window === window.window;
const windowScrollAnchor = isClient && window.pageYOffset !== undefined;

/**
 * Container for page-wide Velocity state data.
 */
export interface VelocityState {
	/**
	 * Detect if this is a NodeJS or web browser
	 */
	readonly isClient: boolean;

	/**
	 * Detect mobile devices to determine if mobileHA should be turned
	 * on.
	 */
	readonly isMobile: boolean;

	/**
	 * The mobileHA option's behavior changes on older Android devices
	 * (Gingerbread, versions 2.3.3-2.3.7).
	 */
	readonly isGingerbread: boolean;

	/**
	 * Create a cached element for re-use when checking for CSS property
	 * prefixes.
	 */
	readonly prefixElement?: HTMLDivElement;

	/**
	 * Retrieve the appropriate scroll anchor and property name for the
	 * browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY
	 */
	readonly windowScrollAnchor: boolean;

	/**
	 * Cache the anchor used for animating window scrolling.
	 */
	readonly scrollAnchor: Window | HTMLElement | Node | boolean;

	/**
	 * Cache the browser-specific property names associated with the
	 * scroll anchor.
	 */
	readonly scrollPropertyLeft: string;

	/**
	 * Cache the browser-specific property names associated with the
	 * scroll anchor.
	 */
	readonly scrollPropertyTop: string;

	/**
	 * The className we add / remove when animating.
	 */
	readonly className: string;

	/**
	 * Keep track of whether our RAF tick is running.
	 *
	 * @private
	 */
	isTicking: boolean;

	/**
	 * All active animations.
	 *
	 * @private
	 */
	animations: LinkedList<AnimationCall>;
}

export const State: VelocityState = {
	isClient,
	isMobile: isClient && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
	isGingerbread: isClient && /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
	prefixElement: isClient ? document.createElement("div") : undefined,
	windowScrollAnchor,
	scrollAnchor: windowScrollAnchor ? window : (!isClient || document.documentElement || document.body.parentNode || document.body),
	scrollPropertyLeft: windowScrollAnchor ? "pageXOffset" : "scrollLeft",
	scrollPropertyTop: windowScrollAnchor ? "pageYOffset" : "scrollTop",
	className: "velocity-animating",
	isTicking: false,
	animations: new LinkedList<AnimationCall>(),
};

declare module "../velocity" {
	export interface IStaticVelocity {
		/**
		 * Current internal state of Velocity.
		 */
		readonly State: VelocityState;
	}
}

defineProperty(Velocity, "State", State);
