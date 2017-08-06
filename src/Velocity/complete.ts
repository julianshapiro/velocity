/**********************
 Call Completion
 **********************/

namespace VelocityStatic {

	/* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
	export function completeCall(activeCall: AnimationCall, isStopped?: boolean) {
		//		console.log("complete", activeCall)
		// TODO: Check if it's not been completed already

		/****************************
		 Option: Loop || Repeat
		 ****************************/

		let isLoop = activeCall.loop,
			isRepeat = activeCall.repeat;

		if (!isStopped && (isLoop || isRepeat)) {
			if (isRepeat && activeCall.repeat !== true) {
				activeCall.repeat--;
			} else if (isLoop && activeCall.loop !== true) {
				activeCall.loop--;
				activeCall.repeat = activeCall.repeatAgain;
			}
			/* If a rotateX/Y/Z property is being animated by 360 deg with loop:true, swap tween start/end values to enable
			 continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */
			let tweens = activeCall.tweens;

			if (isLoop) {
				for (var propertyName in tweens) {
					var tweenContainer = tweens[propertyName],
						oldStartValue = tweenContainer.startValue;

					tweenContainer.startValue = tweenContainer.endValue;
					tweenContainer.endValue = oldStartValue;
					tweenContainer.reverse = !tweenContainer.reverse;
				}
			}

			activeCall.timeStart = lastTick;
		} else {
			let elements = activeCall.elements,
				element = activeCall.element,
				data = Data(element);

			/*************************
			 Element Finalization
			 *************************/
			/* If the user set display to "none" (intending to hide the element), set it now that the animation has completed. */
			/* Note: display:none isn't set when calls are manually stopped (via Velocity("stop"). */
			/* Note: Display gets ignored with "reverse" calls and infinite loops, since this behavior would be undesirable. */
			if (activeCall.display === "none") {
				CSS.setPropertyValue(element, "display", activeCall.display, 1);
			}

			if (activeCall.visibility === "hidden") {
				CSS.setPropertyValue(element, "visibility", activeCall.visibility, 1);
			}

			/* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run
			 a non-Velocity-initiated entry, turn off the isAnimating flag. A non-Velocity-initiatied queue entry's logic might alter
			 an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
			 we check for the existence of our special Velocity.queueEntryFlag declaration, which minifiers won't rename since the flag
			 is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
			if (isStopped && data && (activeCall.queue === false || data.queueList[activeCall.queue])) {
				/* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
				data.isAnimating = false;
				/* Clear the element's rootPropertyValueCache, which will become stale. */
				data.rootPropertyValueCache = {};

				var transformHAPropertyExists = false;
				/* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
				CSS.Lists.transforms3D.forEach(function(transformName) {
					var defaultValue = /^scale/.test(transformName) ? 1 : 0,
						currentValue = data.transformCache[transformName];

					if (data.transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
						transformHAPropertyExists = true;

						delete data.transformCache[transformName];
					}
				});

				/* Mobile devices have hardware acceleration removed at the end of the animation in order to avoid hogging the GPU's memory. */
				if (activeCall.mobileHA) {
					transformHAPropertyExists = true;
					delete data.transformCache.translate3d;
				}

				/* Flush the subproperty removals to the DOM. */
				if (transformHAPropertyExists) {
					CSS.flushTransformCache(element);
				}

				/* Remove the "velocity-animating" indicator class. */
				CSS.Values.removeClass(element, "velocity-animating");
			}

			/*********************
			 Option: Complete
			 *********************/

			/* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
			/* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
			let callbacks = activeCall.callbacks;

			if (callbacks && ++callbacks.completed === callbacks.total) {
				if (!isStopped && callbacks.complete) {
					/* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
					try {
						callbacks.complete.call(elements, elements);
					} catch (error) {
						setTimeout(function() {
							throw error;
						}, 1);
					}
					// Only called once, even if reversed or repeated
					callbacks.complete = undefined;
				}

				/**********************
				 Promise Resolving
				 **********************/

				/* Note: Infinite loops don't return promises. */
				if (callbacks.resolver) {
					callbacks.resolver(elements);
					callbacks.resolver = undefined;
				}
			}

			/***************
			 Dequeueing
			 ***************/

			/* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
			 which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
			 dequeue() must still be called in order to completely clear jQuery's animation queue. */
			if (activeCall.queue !== false) {
				dequeue(element, activeCall.queue);
			}

			/************************
			 Cleanup
			 ************************/
			freeAnimationCall(activeCall);
		}
	}
};
