///<reference path="../index.d.ts" />
/**********************
 AnimationCall cache
 **********************/

namespace VelocityStatic {

	/**
	 * Allow all properties of the AnimationCall objects to be changed, but not
	 * removed.
	 */
	const defaultUndefinedDescriptor: PropertyDescriptor = {
		writable: true,
		enumerable: true,
		value: undefined
	};

	/**
	 * Allow all properties of the AnimationCall objects to be changed, but not
	 * removed.
	 */
	const defaultNumberDescriptor: PropertyDescriptor = {
		writable: true,
		enumerable: true,
		value: 0
	};

	/**
	 * Initialise an empty AnimationCall object so everything is always in the
	 * same order and with the same content.
	 */
	const emptyAnimation: {[key in keyof AnimationCall]: PropertyDescriptor} = {
		begin: defaultUndefinedDescriptor,
		complete: defaultUndefinedDescriptor,
		delay: defaultNumberDescriptor,
		duration: defaultNumberDescriptor,
		easing: defaultUndefinedDescriptor,
		element: defaultUndefinedDescriptor,
		elements: defaultUndefinedDescriptor,
		ellapsedTime: defaultNumberDescriptor,
		loop: defaultUndefinedDescriptor,
		next: defaultUndefinedDescriptor,
		//		options: defaultUndefinedDescriptor,
		paused: defaultUndefinedDescriptor,
		percentComplete: defaultNumberDescriptor,
		prev: defaultUndefinedDescriptor,
		progress: defaultUndefinedDescriptor,
		properties: defaultUndefinedDescriptor,
		queue: defaultUndefinedDescriptor,
		repeat: defaultUndefinedDescriptor,
		resolver: defaultUndefinedDescriptor,
		timeStart: defaultNumberDescriptor,
		tweens: defaultUndefinedDescriptor,
		display: defaultUndefinedDescriptor,
		visibility: defaultUndefinedDescriptor,
		mobileHA: defaultUndefinedDescriptor,
	};

	/**
	 * Store unused AnimationCall objects, LIFO style, clear when no animations
	 * left - used to prevent GC thrashing.
	 */
	var cache: AnimationCall;

	/**
	 * Get an AnimationCall object. If there is an empty one in the cache then
	 * grab that one, otherwise create a new one and initialise everything.
	 */
	export function getAnimationCall(): AnimationCall {
		let animation = cache;

		if (animation) {
			cache = animation.next;
			return Object.defineProperties(animation, emptyAnimation);
		}
		return Object.create(null, emptyAnimation); // Create a prototype-less object as we don't want to extend it
	}

	/**
	 * Remove an animation from the active animation list. If it has a queue set
	 * then remember it as the last animation for that queue, and free the one
	 * that was previously there by adding it to the cached list of
	 * AnimationCall elements we store for re-use. If the animation list is
	 * completely empty then instead simply clear the cache so the GC can clear
	 * the memory.
	 */
	export function freeAnimationCall(animation: AnimationCall): void {
		if (State.first === animation) {
			State.first = animation.next;
		} else if (animation.prev) {
			animation.prev.next = animation.next;
		}
		if (State.last === animation) {
			State.last = animation.prev;
		} else if (animation.next) {
			animation.next.prev = animation.prev;
		}
		if (animation.queue !== false) {
			var data = Data(animation.element);

			if (data) {
				var lastAnimationList = data.lastAnimationList,
					lastAnimation = lastAnimationList[animation.queue];

				lastAnimationList[animation.queue] = animation;
				animation = lastAnimation;
			}
		}
		if (!State.first) {
			// If there's no running animations, then allow GC to clean up
			// and stop ticking until something else comes along
			State.isTicking = false;
			cache = undefined;
			//		} else if (animation) {
			//			animation.next = cache;
			//			cache = animation;
		}
	}
};