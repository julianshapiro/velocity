///<reference path="state.ts" />

/************
 Tick
 ************/

namespace VelocityStatic {

	/**************
	 Timing
	 **************/

	var ticker: (callback: FrameRequestCallback) => number,
		/* rAF shim. Gist: https://gist.github.com/julianshapiro/9497513 */
		rAFShim = ticker = (function() {
			var timeLast = 0;

			return window.requestAnimationFrame || function(callback) {
				var timeCurrent = (new Date()).getTime(),
					timeDelta;

				/* Dynamically set delay on a per-tick basis to match 60fps. */
				/* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
				timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
				timeLast = timeCurrent + timeDelta;

				return setTimeout(function() {
					callback(timeCurrent + timeDelta);
				}, timeDelta);
			};
		})(),
		/**
		 * Shim for window.performance in case it doesn't exist
		 */
		performance = (function() {
			var perf = window.performance || {} as Performance;

			if (typeof perf.now !== "function") {
				var nowOffset = perf.timing && perf.timing.navigationStart ? perf.timing.navigationStart : (new Date()).getTime();

				perf.now = function() {
					return (new Date()).getTime() - nowOffset;
				};
			}
			return perf;
		})();

	/* Inactive browser tabs pause rAF, which results in all active animations immediately sprinting to their completion states when the tab refocuses.
	 To get around this, we dynamically switch rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus. We skip this for mobile
	 devices to avoid wasting battery power on inactive tabs. */
	/* Note: Tab focus detection doesn't work on older versions of IE, but that's okay since they don't support rAF to begin with. */
	if (!State.isMobile && document.hidden !== undefined) {
		var updateTicker = function() {
			/* Reassign the rAF function (which the global tick() function uses) based on the tab's focus state. */
			if (document.hidden) {
				ticker = function(callback: any) {
					/* The tick function needs a truthy first argument in order to pass its internal timestamp check. */
					return setTimeout(function() {
						callback(true);
					}, 16);
				};

				/* The rAF loop has been paused by the browser, so we manually restart the tick. */
				tick();
			} else {
				ticker = rAFShim;
			}
		};

		/* Page could be sitting in the background at this time (i.e. opened as new tab) so making sure we use correct ticker from the start */
		updateTicker();

		/* And then run check again every time visibility changes */
		document.addEventListener("visibilitychange", updateTicker);
	}

	/* Note: All calls to Velocity are pushed to the Velocity.State.calls array, which is fully iterated through upon each tick. */
	export function tick(timestamp?: number | boolean) {
		/* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
		 We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
		 the browser's next tick sync time occurs, which results in the first elements subjected to Velocity
		 calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
		 the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
		 by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
		if (timestamp) {
			/* We normally use RAF's high resolution timestamp but as it can be significantly offset when the browser is
			 under high stress we give the option for choppiness over allowing the browser to drop huge chunks of frames.
			 We use performance.now() and shim it if it doesn't exist for when the tab is hidden. */
			var timeCurrent = timestamp && timestamp !== true ? timestamp : performance.now(),
				activeCall = State.first,
				nextCall: AnimationCall;

			/********************
			 Call Iteration
			 ********************/

			/* Iterate through each active call. */
			for (; activeCall; activeCall = nextCall) {
				nextCall = activeCall.next;
				/************************
				 Call-Wide Variables
				 ************************/
				var timeStart = activeCall.timeStart,
					paused = activeCall.paused,
					delay = activeCall.delay,
					firstTick = !timeStart;

				/* If timeStart is undefined, then this is the first time that this call has been processed by tick().
				 We assign timeStart now so that its value is as close to the real animation start time as possible.
				 (Conversely, had timeStart been defined when this call was added to Velocity.State.calls, the delay
				 between that time and now would cause the first few frames of the tween to be skipped since
				 percentComplete is calculated relative to timeStart.) */
				/* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
				 first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
				 same style value as the element's current value. */
				if (firstTick) {
					activeCall.timeStart = timeStart = timeCurrent - 16;
				}

				/* If a pause key is present, skip processing unless it has been set to resume */
				if (paused === true) {
					continue;
				} else if (paused === false) {
					/* Update the time start to accomodate the paused completion amount */
					timeStart = activeCall.timeStart = Math.round(timeCurrent - activeCall.ellapsedTime - 16);

					/* Remove pause key after processing */
					activeCall.paused = undefined;
				}

				// Make sure anything we've delayed doesn't start animating yet
				// There might still be an active delay after something has been un-paused
				if (delay) {
					if (timeStart + delay > timeCurrent) {
						continue;
					}
					activeCall.timeStart = timeStart = timeStart - delay;
					activeCall.delay = 0;
				}

				/* The tween's completion percentage is relative to the tween's start time, not the tween's start value
				 (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
				 Accordingly, we ensure that percentComplete does not exceed 1. */
				var call = activeCall.call,
					opts = activeCall.options,
					tweenDummyValue = null,
					millisecondsEllapsed = activeCall.ellapsedTime = timeCurrent - timeStart,
					percentComplete = Math.min((millisecondsEllapsed) / (opts.duration as number), 1);

				/**********************
				 Element Iteration
				 **********************/

				/* For every call, iterate through each of the elements in its set. */
				for (var j = 0, callLength = call.length; j < callLength; j++) {
					var tweensContainer = call[j],
						element = tweensContainer.element;

					/* Check to see if this element has been deleted midway through the animation by checking for the
					 continued existence of its data cache. If it's gone, or the element is currently paused, skip animating this element. */
					if (!Data(element)) {
						continue;
					}

					var transformPropertyExists = false;

					/**********************************
					 Display & Visibility Toggling
					 **********************************/

					/* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
					 (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
					if (opts.display !== undefined && opts.display !== null && opts.display !== "none") {
						if (opts.display === "flex") {
							var flexValues = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];

							$.each(flexValues, function(i, flexValue) {
								CSS.setPropertyValue(element, "display", flexValue);
							});
						}

						CSS.setPropertyValue(element, "display", opts.display);
					}

					/* Same goes with the visibility option, but its "none" equivalent is "hidden". */
					if (opts.visibility !== undefined && opts.visibility !== "hidden") {
						CSS.setPropertyValue(element, "visibility", opts.visibility);
					}

					/************************
					 Property Iteration
					 ************************/

					/* For every element, iterate through each property. */
					for (var property in tweensContainer) {
						/* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
						if (tweensContainer.hasOwnProperty(property) && property !== "element") {
							var tween = tweensContainer[property] as Tween,
								currentValue: string | number,
								/* Easing can either be a pre-genereated function or a string that references a pre-registered easing
								 on the Easings object. In either case, return the appropriate easing *function*. */
								easing = isString(tween.easing) ? Easings[tween.easing] : tween.easing;

							/******************************
							 Current Value Calculation
							 ******************************/

							if (isString(tween.pattern)) {
								var patternReplace = percentComplete === 1 ?
									function($0, index, round) {
										var result = tween.endValue[index];

										return round ? Math.round(result) : result;
									} :
									function($0, index, round) {
										var startValue = tween.startValue[index],
											tweenDelta = tween.endValue[index] - startValue,
											result = startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));

										return round ? Math.round(result) : result;
									};

								currentValue = tween.pattern.replace(/{(\d+)(!)?}/g, patternReplace);
							} else if (percentComplete === 1) {
								/* If this is the last tick pass (if we've reached 100% completion for this tween),
								 ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
								currentValue = tween.endValue;
							} else {
								/* Otherwise, calculate currentValue based on the current delta from startValue. */
								var tweenDelta = tween.endValue - tween.startValue;

								currentValue = tween.startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));
								/* If no value change is occurring, don't proceed with DOM updating. */
							}
							if (!firstTick && (currentValue === tween.currentValue)) {
								continue;
							}

							tween.currentValue = currentValue;

							/* If we're tweening a fake 'tween' property in order to log transition values, update the one-per-call variable so that
							 it can be passed into the progress callback. */
							if (property === "tween") {
								tweenDummyValue = currentValue;
							} else {
								/******************
								 Hooks: Part I
								 ******************/
								var hookRoot;

								/* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
								 for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
								 rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
								 updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
								 subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
								if (CSS.Hooks.registered[property]) {
									hookRoot = CSS.Hooks.getRoot(property);

									var rootPropertyValueCache = Data(element).rootPropertyValueCache[hookRoot];

									if (rootPropertyValueCache) {
										tween.rootPropertyValue = rootPropertyValueCache;
									}
								}

								/*****************
								 DOM Update
								 *****************/

								/* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
								/* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
								var adjustedSetData = CSS.setPropertyValue(element, /* SET */
									property,
									tween.currentValue + (IE < 9 && parseFloat(currentValue as string) === 0 ? "" : tween.unitType),
									tween.rootPropertyValue,
									tween.scrollData);

								/*******************
								 Hooks: Part II
								 *******************/

								/* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
								if (CSS.Hooks.registered[property]) {
									/* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
									if (CSS.Normalizations.registered[hookRoot]) {
										Data(element).rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
									} else {
										Data(element).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
									}
								}

								/***************
								 Transforms
								 ***************/

								/* Flag whether a transform property is being animated so that flushTransformCache() can be triggered once this tick pass is complete. */
								if (adjustedSetData[0] === "transform") {
									transformPropertyExists = true;
								}

							}
						}
					}

					/****************
					 mobileHA
					 ****************/

					/* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
					 It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
					if (opts.mobileHA) {
						/* Don't set the null transform hack if we've already done so. */
						if (Data(element).transformCache.translate3d === undefined) {
							/* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
							Data(element).transformCache.translate3d = "(0px, 0px, 0px)";

							transformPropertyExists = true;
						}
					}

					if (transformPropertyExists) {
						CSS.flushTransformCache(element);
					}
				}

				/* The non-"none" display value is only applied to an element once -- when its associated call is first ticked through.
				 Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
				if (opts.display !== undefined && opts.display !== "none") {
					opts.display = false;
				}
				if (opts.visibility !== undefined && opts.visibility !== "hidden") {
					opts.visibility = false;
				}

				/* Pass the elements and the timing data (percentComplete, msRemaining, timeStart, tweenDummyValue) into the progress callback. */
				if (opts.progress) {
					opts.progress.call(activeCall.elements,
						activeCall.elements,
						percentComplete,
						Math.max(0, (timeStart + (opts.duration as number)) - timeCurrent),
						timeStart,
						tweenDummyValue);
				}

				/* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
				if (percentComplete === 1) {
					completeCall(activeCall);
				}
			}
		}

		/* Note: completeCall() sets the isTicking flag to false when the last call on Velocity.State.calls has completed. */
		if (State.isTicking) {
			ticker(tick);
		}
	}
};
