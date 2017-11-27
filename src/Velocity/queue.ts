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
		let prev = State.last;

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
	}

	/**
	 * Add an item to an animation queue.
	 */
	export function queue(element: HTMLorSVGElement, animation: AnimationCall, queue?: string | false): void {
		if (queue === false) {
			animate(animation);
		} else {
			if (!isString(queue)) {
				queue = "";
			}
			let data = Data(element),
				last = data.queueList[queue];

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
			let data = Data(element),
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
		let next = animation._next,
			prev = animation._prev;

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
		let queue = getValue(animation.queue, animation.options.queue, defaults.queue);

		if (queue !== false) {
			let data = Data(animation.element);

			if (data) {
				data.lastAnimationList[queue] = animation;
				animation._next = animation._prev = undefined;
			}
		}
	}
}
