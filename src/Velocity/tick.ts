///<reference path="state.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Tick
 */

namespace VelocityStatic {

	/**************
	 Timing
	 **************/

	const FRAME_TIME = 1000 / 60;

	let ticker: (callback: FrameRequestCallback) => number,
		/**
		 * Shim for window.performance in case it doesn't exist
		 */
		performance = (function() {
			let perf = window.performance || {} as Performance;

			if (typeof perf.now !== "function") {
				let nowOffset = perf.timing && perf.timing.navigationStart ? perf.timing.navigationStart : _now();

				perf.now = function() {
					return _now() - nowOffset;
				};
			}
			return perf;
		})(),
		/* rAF shim. Gist: https://gist.github.com/julianshapiro/9497513 */
		rAFShim = ticker = (function() {
			return window.requestAnimationFrame || function(callback) {
				/* Dynamically set delay on a per-tick basis to match 60fps. */
				/* Based on a technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
				let timeCurrent = performance.now(), // High precision if we can
					timeDelta = Math.max(0, FRAME_TIME - (timeCurrent - lastTick));

				return setTimeout(function() {
					callback(timeCurrent + timeDelta);
				}, timeDelta);
			};
		})();

	/**
	 * The time that the last animation frame ran at. Set from tick(), and used
	 * for missing rAF (ie, when not in focus etc).
	 */
	export let lastTick: number = 0;

	/* Inactive browser tabs pause rAF, which results in all active animations immediately sprinting to their completion states when the tab refocuses.
	 To get around this, we dynamically switch rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus. We skip this for mobile
	 devices to avoid wasting battery power on inactive tabs. */
	/* Note: Tab focus detection doesn't work on older versions of IE, but that's okay since they don't support rAF to begin with. */
	if (!State.isMobile && document.hidden !== undefined) {
		let updateTicker = function() {
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

	let ticking: boolean;

	/* Note: All calls to Velocity are pushed to the Velocity.State.calls array, which is fully iterated through upon each tick. */
	export function tick(timestamp?: number | boolean) {
		if (ticking) {
			// Should never happen - but if we've swapped back from hidden to
			// visibile then we want to make sure
			return;
		}
		ticking = true;
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
			let timeCurrent = timestamp && timestamp !== true ? timestamp : performance.now(),
				deltaTime = lastTick ? timeCurrent - lastTick : FRAME_TIME,
				activeCall: AnimationCall,
				nextCall: AnimationCall,
				firstProgress: AnimationCall,
				lastProgress: AnimationCall,
				firstComplete: AnimationCall,
				lastComplete: AnimationCall;

			if (deltaTime >= defaults.minFrameTime || !lastTick) {
				lastTick = timeCurrent;

				/********************
				 Call Iteration
				 ********************/

				/* Exapand any tweens that might need it */
				while ((activeCall = State.firstNew)) {
					expandTween(activeCall);
				}
				/* Iterate through each active call. */
				for (activeCall = State.first; activeCall && activeCall !== State.firstNew; activeCall = nextCall) {
					nextCall = activeCall.next;
					/************************
					 Call-Wide Variables
					 ************************/
					let element = activeCall.element,
						data = Data(element);

					/* Check to see if this element has been deleted midway through the animation by checking for the
					 continued existence of its data cache. If it's gone then end this animation. */
					if (!data) {
						freeAnimationCall(activeCall);
						continue;
					}

					let timeStart = activeCall.timeStart,
						paused = activeCall.paused,
						delay = activeCall.delay,
						started = activeCall.started,
						callbacks = activeCall.callbacks,
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
						let queue = activeCall.queue;

						timeStart = timeCurrent - deltaTime;
						if (queue !== false) {
							timeStart = Math.max(timeStart, data.lastFinishList[queue] || 0);
						}
						activeCall.timeStart = timeStart;
					}

					/* If a pause key is present, skip processing unless it has been set to resume */
					if (paused === true) {
						/* Update the time start to accomodate the paused completion amount */
						activeCall.timeStart += deltaTime;
						continue;
					} else if (paused === false) {
						/* Remove pause key after processing */
						delete activeCall.paused;
					}

					/*******************
					 Option: Begin
					 *******************/

					if (!started) {
						// Make sure anything we've delayed doesn't start animating yet
						// There might still be an active delay after something has been un-paused
						if (delay) {
							if (timeStart + delay > timeCurrent) {
								continue;
							}
							activeCall.timeStart = timeStart += delay;
						}

						// TODO: Option: Sync - make sure all elements start at the same time, the behaviour of all(?) other JS libraries

						activeCall.started = true;
						/* Apply the "velocity-animating" indicator class. */
						CSS.Values.addClass(element, "velocity-animating");

						/**********************************
						 Display & Visibility Toggling
						 **********************************/

						/* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
						 (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
						if (activeCall.display !== undefined && activeCall.display !== null && activeCall.display !== "none") {
							if (activeCall.display === "flex") {
								let flexValues = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];

								flexValues.forEach(function(flexValue) {
									CSS.setPropertyValue(element, "display", flexValue, 0);
								});
							}

							CSS.setPropertyValue(element, "display", activeCall.display, 0);
							activeCall.display = false;
						}

						/* Same goes with the visibility option, but its "none" equivalent is "hidden". */
						if (activeCall.visibility !== undefined && activeCall.visibility !== "hidden") {
							CSS.setPropertyValue(element, "visibility", activeCall.visibility, 0);
							activeCall.visibility = false;
						}

						/* The begin callback is fired once per call -- not once per element -- and is passed the full raw DOM element set as both its context and its first argument. */
						if (callbacks && callbacks.started++ === 0) {
							callbacks.first = activeCall;
							if (callbacks.begin) {
								/* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
								try {
									let elements = activeCall.elements;

									callbacks.begin.call(elements, elements, activeCall);
								} catch (error) {
									setTimeout(function() {
										throw error;
									}, 1);
								}
								// Only called once, even if reversed or repeated
								callbacks.begin = undefined;
							}
						}
					}
					if (callbacks && callbacks.first === activeCall && callbacks.progress) {
						activeCall.nextProgress = undefined;
						if (lastProgress) {
							lastProgress.nextProgress = lastProgress = activeCall;
						} else {
							firstProgress = lastProgress = activeCall;
						}
					}

					/* The tween's completion percentage is relative to the tween's start time, not the tween's start value
					 (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
					 Accordingly, we ensure that percentComplete does not exceed 1. */
					let tweens = activeCall.tweens,
						millisecondsEllapsed = activeCall.ellapsedTime = timeCurrent - timeStart,
						property: string,
						transformPropertyExists = false,
						percentComplete = activeCall.percentComplete = Math.min(millisecondsEllapsed / activeCall.duration, 1);

					if (percentComplete === 1) {
						activeCall.nextComplete = undefined;
						if (lastComplete) {
							lastComplete.nextComplete = lastComplete = activeCall;
						} else {
							firstComplete = lastComplete = activeCall;
						}
					}

					/************************
					 Property Iteration
					 ************************/

					/* For every element, iterate through each property. */
					for (property in tweens) {
						let currentValue: string | number,
							tween = tweens[property],
							/* Easing can either be a pre-genereated function or a string that references a pre-registered easing
							 on the Easings object. In either case, return the appropriate easing *function*. */
							easing = isString(tween.easing) ? Easings[tween.easing] : tween.easing;

						/******************************
						 Current Value Calculation
						 ******************************/

						if (tween.pattern) {
							for (let pattern = tween.pattern, rounding = tween.rounding, i = 0, index = 0; i < pattern.length; i++) {
								if (typeof pattern[i] === "number") {
									let startValue = tween.startValue[index],
										endValue = tween.endValue[index],
										result = tween.reverse
											? easing(percentComplete, endValue, startValue, property)
											: easing(percentComplete, startValue, endValue, property);

									pattern[i] = rounding && rounding[index] ? Math.round(result) : result;
									index++;
								}
							}
							currentValue = "".concat.apply("", tween.pattern);
						} else {
							currentValue = tween.reverse
								? 1 - easing(1 - percentComplete, tween.endValue as number, tween.startValue as number, property)
								: easing(percentComplete, tween.startValue as number, tween.endValue as number, property);
						}
						/* If no value change is occurring, don't proceed with DOM updating. */
						if (!firstTick && tween.currentValue === currentValue) {
							continue;
						}

						tween.currentValue = currentValue;

						/* Skip the fake 'tween' property as that is only passed into the progress callback. */
						if (property !== "tween") {
							/******************
							 Hooks: Part I
							 ******************/
							let hookRoot;

							/* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
							 for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
							 rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
							 updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
							 subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
							if (CSS.Hooks.registered[property]) {
								hookRoot = CSS.Hooks.getRoot(property);

								let rootPropertyValueCache = data.rootPropertyValueCache[hookRoot];

								if (rootPropertyValueCache) {
									tween.rootPropertyValue = rootPropertyValueCache;
								}
							}

							/*****************
							 DOM Update
							 *****************/

							/* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
							/* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
							let adjustedSetData = CSS.setPropertyValue(element, /* SET */
								property,
								tween.currentValue + (IE < 9 && parseFloat(currentValue as string) === 0 ? "" : tween.unitType),
								percentComplete,
								tween.rootPropertyValue,
								tween.scrollData);

							/*******************
							 Hooks: Part II
							 *******************/

							/* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
							if (CSS.Hooks.registered[property]) {
								/* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
								if (CSS.Normalizations.registered[hookRoot]) {
									data.rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
								} else {
									data.rootPropertyValueCache[hookRoot] = adjustedSetData[1];
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

						/****************
						 mobileHA
						 ****************/

						/* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
						 It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
						if (activeCall.mobileHA) {
							/* Don't set the null transform hack if we've already done so. */
							if (data.transformCache.translate3d === undefined) {
								/* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
								data.transformCache.translate3d = "(0px, 0px, 0px)";

								transformPropertyExists = true;
							}
						}

						if (transformPropertyExists) {
							CSS.flushTransformCache(element);
						}
					}
				}

				/* Callbacks and things that might read the DOM again */

				// Progress callback
				for (activeCall = firstProgress; activeCall; activeCall = nextCall) {
					nextCall = activeCall.nextProgress;
					/* Pass the elements and the timing data (percentComplete, msRemaining, timeStart, tweenDummyValue) into the progress callback. */
					activeCall.callbacks.progress.call(activeCall.elements,
						activeCall.elements,
						activeCall.percentComplete,
						Math.max(0, activeCall.timeStart + activeCall.duration - timeCurrent),
						activeCall.timeStart,
						(activeCall.tweens["tween"] || {} as Tween).currentValue,
						activeCall);
				}
				// Complete animations, including complete callback or looping
				for (activeCall = firstComplete; activeCall; activeCall = nextCall) {
					nextCall = activeCall.nextComplete;
					/* If this call has finished tweening, pass it to complete() to handle call cleanup. */
					completeCall(activeCall);
				}
			}
		}
		if (State.first) {
			State.isTicking = true;
			ticker(tick);
		} else {
			State.isTicking = false;
			lastTick = 0;
		}
		ticking = false;
	}
};
