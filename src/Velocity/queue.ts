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
	var data = Data(element),
		last: AnimationCall;

	if (queue === false) {
		animate(animation);
	} else {
		if (!isString(queue)) {
			queue = "";
		}
		last = data.queueList[queue];
		if (!last) {
			if (data.queueList[queue] === null) {
				data.queueList[queue] = animation;
			} else {
				data.queueList[queue] = undefined;
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
		var data = Data(element),
			animation: AnimationCall;

		if (!isString(queue)) {
			queue = "";
		}
		animation = data.queueList[queue];
		if (animation) {
			data.queueList[queue] = animation.next || null;
			if (!skip) {
				animate(animation);
			}
		} else {
			delete data.queueList[queue];
		}
		return animation;
	}
}
