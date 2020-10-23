/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { AnimationCall } from "../core/animationCall";
import { getConstructor, addConstructor } from "../core/constructors";
import { IOptions } from "../core/options";
import { LinkedList } from "../list";
import { defineProperty } from "../utility";
import { KnownElement } from "../velocity";

/**
 * The symbol for the data storage within an Object.
 */
export const symbolData = Symbol("velocity");

/**
 * Global per-Element data. This is persistent between animations, and freed
 * when the garbage collector removes the Element because it is no longer being
 * used.
 */
export class ElementData {
	constructor(element: KnownElement) {
		const prototype = Object.getPrototypeOf(element);

		this.symbol = getConstructor(prototype) ?? addConstructor(prototype);
		this.window = (element as unknown as HTMLElement).ownerDocument?.defaultView || undefined;

		defineProperty(element, symbolData, this, false);
	}

	/**
	 * A local cache of the current style values we're using, this is 80x faster
	 * than <code>element.style</code> access.
	 *
	 * Empty strings are set to null to get the value from getComputedStyle
	 * instead. If getComputedStyle returns an empty string then that is saved.
	 */
	cache = new Map<string, string>();

	/**
	 * A cached copy of getComputedStyle, this is 50% the speed of
	 * <code>element.style</code> access.
	 */
	computedStyle?: CSSStyleDeclaration;

	/**
	 * Changed as animations start and finish on an element. This allows us to
	 * keep track of exactly how many are running at a given time.
	 */
	count = 0;

	/**
	 * The time the last animation on an element finished. This is used for
	 * starting a new animation and making sure it follows directly if possible,
	 * otherwise it will start as if one frame in already.
	 */
	lastFinishTime = new Map<IOptions["queue"], number>();

	/**
	 * Animations to be run for each queue. The animations are linked lists,
	 * but treated as a FIFO queue (new ones are added to the end). When the
	 * queue is empty (but still running) the key will still exist with a value
	 * of "null". When the queue is empty and the next entry is pulled from it
	 * then it will be set to "undefined".
	 *
	 * The default queue is an empty string - ""
	 */
	queueList = new Map<IOptions["queue"], LinkedList<AnimationCall>>();

	/**
	 * A generated enum of types of this element, used for Normalizations.
	 */
	symbol: Symbol;

	/**
	 * The window used for this element. This allows for cross-iframe animations
	 * where possible.
	 */
	window?: typeof globalThis;
}

/**
 * Get (and create) the internal data store for an element.
 */
export const Data = (element: KnownElement): ElementData =>
	element[symbolData] ?? new ElementData(element);
