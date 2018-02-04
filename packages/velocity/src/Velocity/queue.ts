///<reference path="data.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * AnimationCall queue
 */

namespace VelocityStatic {

	/**
	 * Simple queue management. Un-named queue is directly within the element data,
	 * named queue is within an object within it.
	 */
	function animate(animation: AnimationCall) {
		const prev = State.last;

		animation._prev = prev;
		animation._next = undefined;
		if (prev) {
			prev._next = animation;
		} else {
			State.first = animation;
		}
		State.last = animation;
		if (!State.firstNew) {
			State.firstNew = animation;
		}
		const element = animation.element,
			data = Data(element);

		if (!data.count++) {

			////////////////////////
			// Feature: Classname //
			////////////////////////

			addClass(element, State.className);
		}
	}

	/**
	 * Add an item to an animation queue.
	 */
	export function queue(element: HTMLorSVGElement, animation: AnimationCall, queue: string | false): void {
		const data = Data(element);

		if (queue !== false) {
			// Store the last animation added so we can use it for the
			// beginning of the next one.
			data.lastAnimationList[queue] = animation;
		}
		if (queue === false) {
			animate(animation);
		} else {
			if (!isString(queue)) {
				queue = "";
			}
			let last = data.queueList[queue];

			if (!last) {
				if (last === null) {
					data.queueList[queue] = animation;
				} else {
					data.queueList[queue] = null;
					animate(animation);
				}
			} else {
				while (last._next) {
					last = last._next;
				}
				last._next = animation;
				animation._prev = last;
			}
		}
	}

	/**
	 * Start the next animation on this element's queue (named or default).
	 *
	 * @returns the next animation that is starting.
	 */
	export function dequeue(element: HTMLorSVGElement, queue?: string | boolean, skip?: boolean): AnimationCall {
		if (queue !== false) {
			if (!isString(queue)) {
				queue = "";
			}
			const data = Data(element),
				animation = data.queueList[queue];

			if (animation) {
				data.queueList[queue] = animation._next || null;
				if (!skip) {
					animate(animation);
				}
			} else if (animation === null) {
				delete data.queueList[queue];
			}
			return animation;
		}
	}

	/**
	 * Remove an animation from the active animation list. If it has a queue set
	 * then remember it as the last animation for that queue, and free the one
	 * that was previously there. If the animation list is completely empty then
	 * mark us as finished.
	 */
	export function freeAnimationCall(animation: AnimationCall): void {
		const next = animation._next,
			prev = animation._prev,
			queue = animation.queue == null ? animation.options.queue : animation.queue;

		if (State.firstNew === animation) {
			State.firstNew = next;
		}
		if (State.first === animation) {
			State.first = next;
		} else if (prev) {
			prev._next = next;
		}
		if (State.last === animation) {
			State.last = prev;
		} else if (next) {
			next._prev = prev;
		}
		if (queue) {
			const data = Data(animation.element);

			if (data) {
				animation._next = animation._prev = undefined;
			}
		}
	}
}
