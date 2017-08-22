///<reference path="data.ts" />

/*
 * Simple queue management. Un-named queue is directly within the element data,
 * named queue is within an object within it.
 */

function animate(animation: AnimationCall) {
	var State = VelocityStatic.State,
		prev = State.last;

	animation.prev = prev;
	animation.next = undefined;
	if (prev) {
		prev.next = animation;
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
function queue(element: HTMLorSVGElement, animation: AnimationCall, queue?: string | boolean) {

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
			while (last.next) {
				last = last.next;
			}
			last.next = animation;
			animation.prev = last;
		}
	}
}

/**
 * Start the next animation on this element's queue (named or default).
 * 
 * @returns the next animation that is starting.
 */
function dequeue(element: HTMLorSVGElement, queue?: string | boolean, skip?: boolean): AnimationCall {
	if (queue !== false) {
		if (!isString(queue)) {
			queue = "";
		}
		let data = Data(element),
			animation = data.queueList[queue];

		if (animation) {
			data.queueList[queue] = animation.next || null;
			if (!skip) {
				animate(animation);
			}
		} else if(animation === null) {
			delete data.queueList[queue];
		}
		return animation;
	}
}
