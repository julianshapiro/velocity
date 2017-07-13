/**********************
 Call Completion
 **********************/

namespace VelocityStatic {

	/* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
	export function completeCall(activeCall: AnimationCall, isStopped?: boolean) {
		// TODO: Check if it's not been completed already

		/* Pull the metadata from the call. */
		var call = activeCall.call,
			elements = activeCall.elements,
			opts = activeCall.options,
			resolver = activeCall.resolver;

		/*************************
		 Element Finalization
		 *************************/

		for (var i = 0, callLength = call.length; i < callLength; i++) {
			var element = call[i].element;

			/* If the user set display to "none" (intending to hide the element), set it now that the animation has completed. */
			/* Note: display:none isn't set when calls are manually stopped (via Velocity("stop"). */
			/* Note: Display gets ignored with "reverse" calls and infinite loops, since this behavior would be undesirable. */
			if (!isStopped && !opts.loop) {
				if (opts.display === "none") {
					CSS.setPropertyValue(element, "display", opts.display);
				}

				if (opts.visibility === "hidden") {
					CSS.setPropertyValue(element, "visibility", opts.visibility);
				}
			}

			/* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run
			 a non-Velocity-initiated entry, turn off the isAnimating flag. A non-Velocity-initiatied queue entry's logic might alter
			 an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
			 we check for the existence of our special Velocity.queueEntryFlag declaration, which minifiers won't rename since the flag
			 is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
			var data = Data(element);

			if ((opts.loop !== true || isStopped) && ($.queue(element)[1] === undefined || !/\.velocityQueueEntryFlag/i.test($.queue(element)[1]))) {
				/* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
				if (data) {
					data.isAnimating = false;
					/* Clear the element's rootPropertyValueCache, which will become stale. */
					data.rootPropertyValueCache = {};

					var transformHAPropertyExists = false;
					/* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
					$.each(CSS.Lists.transforms3D, function(i, transformName) {
						var defaultValue = /^scale/.test(transformName) ? 1 : 0,
							currentValue = data.transformCache[transformName];

						if (data.transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
							transformHAPropertyExists = true;

							delete data.transformCache[transformName];
						}
					});

					/* Mobile devices have hardware acceleration removed at the end of the animation in order to avoid hogging the GPU's memory. */
					if (opts.mobileHA) {
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
			}

			/*********************
			 Option: Complete
			 *********************/

			/* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
			/* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
			if (!isStopped && opts.complete && !opts.loop && (i === callLength - 1)) {
				/* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
				try {
					opts.complete.call(elements, elements);
				} catch (error) {
					setTimeout(function() {
						throw error;
					}, 1);
				}
			}

			/**********************
			 Promise Resolving
			 **********************/

			/* Note: Infinite loops don't return promises. */
			if (resolver && opts.loop !== true) {
				resolver(elements);
			}

			/****************************
			 Option: Loop (Infinite)
			 ****************************/

			if (data && opts.loop === true && !isStopped) {
				/* If a rotateX/Y/Z property is being animated by 360 deg with loop:true, swap tween start/end values to enable
				 continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */
				$.each(data.tweensContainer, function(propertyName, tweenContainer) {
					if (/^rotate/.test(propertyName) && ((parseFloat(tweenContainer.startValue) - parseFloat(tweenContainer.endValue)) % 360 === 0)) {
						var oldStartValue = tweenContainer.startValue;

						tweenContainer.startValue = tweenContainer.endValue;
						tweenContainer.endValue = oldStartValue;
					}

					if (/^backgroundPosition/.test(propertyName) && parseFloat(tweenContainer.endValue) === 100 && tweenContainer.unitType === "%") {
						tweenContainer.endValue = 0;
						tweenContainer.startValue = 100;
					}
				});

				(Velocity as any)(element, "reverse", {loop: true, delay: opts.delay});
			}

			/***************
			 Dequeueing
			 ***************/

			/* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
			 which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
			 dequeue() must still be called in order to completely clear jQuery's animation queue. */
			if (opts.queue !== false) {
				$.dequeue(element, opts.queue);
			}
		}

		/************************
		 Calls Array Cleanup
		 ************************/

		/* Since this call is complete, set it to false so that the rAF tick skips it. This array is later compacted via compactSparseArray().
		 (For performance reasons, the call is set to false instead of being deleted from the array: http://www.html5rocks.com/en/tutorials/speed/v8/) */
		if (State.first === activeCall) {
			State.first = activeCall.next;
		} else if (activeCall.prev) {
			activeCall.prev.next = activeCall.next;
		}
		if (State.last === activeCall) {
			State.last = activeCall.prev;
		} else if (activeCall.next) {
			activeCall.next.prev = activeCall.prev;
		}

		if (!State.first) {
			State.isTicking = false;
			State.cache = undefined;
		} else {
			for (var key in activeCall) {
				(activeCall as any)[key] = undefined;
			}
			activeCall.next = State.cache;
			State.cache = activeCall;
		}
	}
};
