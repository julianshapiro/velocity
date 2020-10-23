/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * AnimationCall queue
 */

import { KnownElement } from "../velocity";
import { isString } from "../types";
import { addClass } from "../utility";
import { Data } from "../data";
import { State } from "./state";
import { AnimationCall } from "./animationCall";
import { LinkedList } from "../list";

/**
 * Simple queue management. Un-named queue is directly within the element data,
 * named queue is within an object within it.
 */
function animate(animation?: AnimationCall) {
	if (animation) {
		const { element } = animation;
		const data = Data(element);

		State.animations.push(animation);
		if (!data.count++) {
			addClass(element, State.className);
		}
	}
}

/**
 * Remove an animation from the active animation list.
 */
export function freeAnimationCall(animation: AnimationCall): void {
	State.animations.remove(animation);
}

/**
 * Add an item to an animation queue.
 */
export function queue(element: KnownElement, animation: AnimationCall, queueName: string | false): void {
	if (queueName === false) {
		animate(animation);
	} else {
		if (!isString(queueName)) {
			queueName = "";
		}
		const { queueList } = Data(element);
		let list = queueList.get(queueName);

		if (!list) {
			queueList.set(queueName, list = new LinkedList());
		}
		list.push(animation);
		if (list.current === animation) {
			animate(list.next!);
		}
	}
}

/**
 * Start the next animation on this element's queue (named or default).
 */
export function dequeue(element: KnownElement, queueName?: string | boolean, skip?: boolean) {
	if (queueName !== false) {
		if (!isString(queueName)) {
			queueName = "";
		}
		const { queueList } = Data(element);
		const list = queueList.get(queueName);

		if (list) {
			if (list.first !== list.last) {
				list.shift(); // Forget the first entry
			}
			if (!skip) {
				animate(list.next);
			}
		}
	}
}
