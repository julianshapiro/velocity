///<reference path="state.ts" />
///<reference path="easing/easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Tick
 */

namespace VelocityStatic {

	/**
	 * Call the begin method of an animation in a separate function so it can
	 * benefit from JIT compiling while still having a try/catch block.
	 */
	export function callBegin(activeCall: AnimationCall) {
		try {
			const elements = activeCall.elements;

			(activeCall.options.begin as VelocityCallback).call(elements, elements, activeCall);
		} catch (error) {
			setTimeout(function() {
				throw error;
			}, 1);
		}
	}

	/**
	 * Call the progress method of an animation in a separate function so it can
	 * benefit from JIT compiling while still having a try/catch block.
	 */
	function callProgress(activeCall: AnimationCall, timeCurrent: number) {
		try {
			const elements = activeCall.elements,
				percentComplete = activeCall.percentComplete,
				options = activeCall.options,
				tweenValue = activeCall.tween;

			(activeCall.options.progress as VelocityProgress).call(elements,
				elements,
				percentComplete,
				Math.max(0, activeCall.timeStart + (activeCall.duration != null ? activeCall.duration : options.duration != null ? options.duration : defaults.duration) - timeCurrent),
				tweenValue !== undefined ? tweenValue : String(percentComplete * 100),
				activeCall);
		} catch (error) {
			setTimeout(function() {
				throw error;
			}, 1);
		}
	}

	function asyncCallbacks() {
		let activeCall: AnimationCall,
			nextCall: AnimationCall;
		// Callbacks and complete that might read the DOM again.

		// Progress callback
		for (activeCall = firstProgress; activeCall; activeCall = nextCall) {
			nextCall = activeCall._nextProgress;
			// Pass to an external fn with a try/catch block for optimisation
			callProgress(activeCall, lastTick);
		}
		// Complete animations, including complete callback or looping
		for (activeCall = firstComplete; activeCall; activeCall = nextCall) {
			nextCall = activeCall._nextComplete;
			/* If this call has finished tweening, pass it to complete() to handle call cleanup. */
			completeCall(activeCall);
		}
	}

	/**************
	 Timing
	 **************/

	const FRAME_TIME = 1000 / 60,
		/**
		* Shim for window.performance in case it doesn't exist
		*/
		performance = (function() {
			const perf = window.performance || {} as Performance;

			if (typeof perf.now !== "function") {
				const nowOffset = perf.timing && perf.timing.navigationStart ? perf.timing.navigationStart : _now();

				perf.now = function() {
					return _now() - nowOffset;
				};
			}
			return perf;
		})(),
		/**
		 * Proxy function for when rAF is not available.
		 * 
		 * This should hopefully never be used as the browsers often throttle
		 * this to less than one frame per second in the background, making it
		 * completely unusable.
		 */
		rAFProxy = function(callback: FrameRequestCallback) {
			return setTimeout(callback, Math.max(0, FRAME_TIME - (performance.now() - lastTick)));
		},
		/**
		 * Either requestAnimationFrame, or a shim for it.
		 */
		rAFShim = window.requestAnimationFrame || rAFProxy;

	/**
	 * Set if we are currently inside a tick() to prevent double-calling.
	 */
	let ticking: boolean,
		/**
		 * A background WebWorker that sends us framerate messages when we're in
		 * the background. Without this we cannot maintain frame accuracy.
		 */
		worker: Worker,
		/**
		 * The first animation with a Progress callback.
		 */
		firstProgress: AnimationCall,
		/**
		 * The first animation with a Complete callback.
		 */
		firstComplete: AnimationCall;

	/**
	 * The time that the last animation frame ran at. Set from tick(), and used
	 * for missing rAF (ie, when not in focus etc).
	 */
	export let lastTick: number = 0;

	/**
	 * WebWorker background function.
	 * 
	 * When we're in the background this will send us a msg every tick, when in
	 * the foreground it won't.
	 * 
	 * When running in the background the browser reduces allowed CPU etc, so
	 * we raun at 30fps instead of 60fps.
	 */
	function workerFn(this: Worker) {
		let interval: number;

		this.onmessage = (e) => {
			if (e.data === true) {
				if (!interval) {
					interval = setInterval(() => {
						this.postMessage(true);
					}, 1000 / 30);
				}
			} else if (e.data === false) {
				if (interval) {
					clearInterval(interval);
					interval = 0;
				}
			} else {
				this.postMessage(e.data);
			}
		}
	}

	try {
		// Create the worker - this might not be supported, hence the try/catch.
		worker = new Worker(URL.createObjectURL(new Blob(["(" + workerFn + ")()"])));
		// Whenever the worker sends a message we tick()
		worker.onmessage = (e: MessageEvent) => {
			if (e.data === true) {
				tick();
			} else {
				asyncCallbacks();
			}
		}
		// And watch for going to the background to start the WebWorker running.
		if (!State.isMobile && document.hidden !== undefined) {
			document.addEventListener("visibilitychange", () => {
				worker.postMessage(State.isTicking && document.hidden);
			});
		}
	} catch (e) {
		/*
		 * WebWorkers are not supported in this format. This can happen in IE10
		 * where it can't create one from a blob this way. We fallback, but make
		 * no guarantees towards accuracy in this case.
		 */
	}

	/**
	 * Called on every tick, preferably through rAF. This is reponsible for
	 * initialising any new animations, then starting any that need starting.
	 * Finally it will expand any tweens and set the properties relating to
	 * them. If there are any callbacks relating to the animations then they
	 * will attempt to call at the end (with the exception of "begin").
	 */
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
		if (timestamp !== false) {
			const timeCurrent = performance.now(),
				deltaTime = lastTick ? timeCurrent - lastTick : FRAME_TIME,
				defaultSpeed = defaults.speed,
				defaultEasing = defaults.easing,
				defaultDuration = defaults.duration;
			let activeCall: AnimationCall,
				nextCall: AnimationCall,
				lastProgress: AnimationCall,
				lastComplete: AnimationCall;

			firstProgress = null;
			firstComplete = null;
			if (deltaTime >= defaults.minFrameTime || !lastTick) {
				lastTick = timeCurrent;

				/********************
				 Call Iteration
				 ********************/

				// Expand any tweens that might need it.
				while ((activeCall = State.firstNew)) {
					validateTweens(activeCall);
				}
				// Iterate through each active call.
				for (activeCall = State.first; activeCall && activeCall !== State.firstNew; activeCall = activeCall._next) {
					const element = activeCall.element;
					let data: ElementData;

					// Check to see if this element has been deleted midway
					// through the animation. If it's gone then end this
					// animation.
					if (!element.parentNode || !(data = Data(element))) {
						// TODO: Remove safely - decrease count, delete data, remove from arrays
						freeAnimationCall(activeCall);
						continue;
					}
					// Don't bother getting until we can use these.
					const options = activeCall.options,
						flags = activeCall._flags;
					let timeStart = activeCall.timeStart;

					// If this is the first time that this call has been
					// processed by tick() then we assign timeStart now so that
					// it's value is as close to the real animation start time
					// as possible.
					if (!timeStart) {
						const queue = activeCall.queue != null ? activeCall.queue : options.queue;

						timeStart = timeCurrent - deltaTime;
						if (queue !== false) {
							timeStart = Math.max(timeStart, data.lastFinishList[queue] || 0);
						}
						activeCall.timeStart = timeStart;
					}
					// If this animation is paused then skip processing unless
					// it has been set to resume.
					if (flags & AnimationFlags.PAUSED) {
						// Update the time start to accomodate the paused
						// completion amount.
						activeCall.timeStart += deltaTime;
						continue;
					}
					// Check if this animation is ready - if it's synced then it
					// needs to wait for all other animations in the sync
					if (!(flags & AnimationFlags.READY)) {
						activeCall._flags |= AnimationFlags.READY;
						options._ready++;
					}
				}
				// Need to split the loop, as ready sync animations must all get
				// the same start time.
				for (activeCall = State.first; activeCall && activeCall !== State.firstNew; activeCall = nextCall) {
					const flags = activeCall._flags;

					nextCall = activeCall._next;
					if (!(flags & AnimationFlags.READY) || (flags & AnimationFlags.PAUSED)) {
						continue;
					}
					const options = activeCall.options;

					if ((flags & AnimationFlags.SYNC) && options._ready < options._total) {
						activeCall.timeStart += deltaTime;
						continue;
					}
					const speed = activeCall.speed != null ? activeCall.speed : options.speed != null ? options.speed : defaultSpeed;
					let timeStart = activeCall.timeStart;

					// Don't bother getting until we can use these.
					if (!(flags & AnimationFlags.STARTED)) {
						const delay = activeCall.delay != null ? activeCall.delay : options.delay;

						// Make sure anything we've delayed doesn't start
						// animating yet, there might still be an active delay
						// after something has been un-paused
						if (delay) {
							if (timeStart + (delay / speed) > timeCurrent) {
								continue;
							}
							activeCall.timeStart = timeStart += delay / (delay > 0 ? speed : 1);
						}
						activeCall._flags |= AnimationFlags.STARTED;
						// The begin callback is fired once per call, not once
						// per element, and is passed the full raw DOM element
						// set as both its context and its first argument.
						if (options._started++ === 0) {
							options._first = activeCall;
							if (options.begin) {
								// Pass to an external fn with a try/catch block for optimisation
								callBegin(activeCall);
								// Only called once, even if reversed or repeated
								options.begin = undefined;
							}
						}
					}
					if (speed !== 1) {
						// On the first frame we may have a shorter delta
						const delta = Math.min(deltaTime, timeCurrent - timeStart);
						activeCall.timeStart = timeStart += delta * (1 - speed);
					}

					if (options._first === activeCall && options.progress) {
						activeCall._nextProgress = undefined;
						if (lastProgress) {
							lastProgress._nextProgress = lastProgress = activeCall;
						} else {
							firstProgress = lastProgress = activeCall;
						}
					}

					const activeEasing = activeCall.easing != null ? activeCall.easing : options.easing != null ? options.easing : defaultEasing,
						millisecondsEllapsed = activeCall.ellapsedTime = timeCurrent - timeStart,
						duration = activeCall.duration != null ? activeCall.duration : options.duration != null ? options.duration : defaultDuration,
						percentComplete = activeCall.percentComplete = mock ? 1 : Math.min(millisecondsEllapsed / duration, 1),
						tweens = activeCall.tweens,
						reverse = flags & AnimationFlags.REVERSE;

					if (percentComplete === 1) {
						activeCall._nextComplete = undefined;
						if (lastComplete) {
							lastComplete._nextComplete = lastComplete = activeCall;
						} else {
							firstComplete = lastComplete = activeCall;
						}
					}

					for (const property in tweens) {
						// For every element, iterate through each property.
						const tween = tweens[property],
							sequence = tween.sequence,
							pattern = sequence.pattern;
						let currentValue = "",
							i = 0;

						if (pattern) {
							let easingComplete = (tween.easing || activeEasing)(percentComplete, 0, 1, property),
								best = 0;

							for (let i = 0; i < sequence.length - 1; i++) {
								if (sequence[i].percent < easingComplete) {
									best = i;
								}
							}
							const tweenFrom: TweenStep = sequence[best],
								tweenTo: TweenStep = sequence[best + 1] || tweenFrom,
								tweenPercent = (percentComplete - tweenFrom.percent) / (tweenTo.percent - tweenFrom.percent),
								easing = tweenTo.easing || Easing.linearEasing;

							//console.log("tick", percentComplete, tweenPercent, best, tweenFrom, tweenTo, sequence)
							for (; i < pattern.length; i++) {
								const startValue = tweenFrom[i];

								if (startValue == null) {
									currentValue += pattern[i];
								} else {
									const endValue = tweenTo[i];

									if (startValue === endValue) {
										currentValue += startValue;
									} else {
										// All easings must deal with numbers except for our internal ones.
										const result = easing(reverse ? 1 - tweenPercent : tweenPercent, startValue as number, endValue as number, property)

										currentValue += pattern[i] === true ? Math.round(result) : result;
									}
								}
							}
							if (property !== "tween") {
								if (percentComplete === 1 && _startsWith(currentValue, "calc(0 + ")) {
									currentValue = currentValue.replace(/^calc\(0[^\d]* \+ ([^\(\)]+)\)$/, "$1");
								}
								// TODO: To solve an IE<=8 positioning bug, the unit type must be dropped when setting a property value of 0 - add normalisations to legacy
								CSS.setPropertyValue(activeCall.element, property, currentValue, tween.fn);
							} else {
								// Skip the fake 'tween' property as that is only
								// passed into the progress callback.
								activeCall.tween = currentValue;
							}
						} else {
							console.warn("VelocityJS: Missing pattern:", property, JSON.stringify(tween[property]))
							delete tweens[property];
						}
					}
				}
				if (firstProgress || firstComplete) {
					if (document.hidden) {
						asyncCallbacks();
					} else if (worker) {
						worker.postMessage("");
					} else {
						setTimeout(asyncCallbacks, 1);
					}
				}
			}
		}
		if (State.first) {
			State.isTicking = true;
			if (!document.hidden) {
				rAFShim(tick);
			} else if (!worker) {
				rAFProxy(tick);
			} else if (timestamp === false) {
				// Make sure we turn on the messages.
				worker.postMessage(true);
			}
		} else {
			State.isTicking = false;
			lastTick = 0;
			if (document.hidden && worker) {
				// Make sure we turn off the messages.
				worker.postMessage(false);
			}
		}
		ticking = false;
	}
}
