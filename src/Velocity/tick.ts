/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Tick
 */

// Typedefs
import {AnimationCall, AnimationFlags, TweenStep} from "../../velocity.d";

// Project
import {now} from "../utility";
import Velocity from "../velocity";
import {completeCall} from "./complete";
import {removeNestedCalc} from "./css/removeNestedCalc";
import {setPropertyValue} from "./css/setPropertyValue";
import {Data} from "./data";
import {defaults} from "./defaults";
import {linearEasing} from "./easing/easings";
import {freeAnimationCall} from "./queue";
import {State} from "./state";
import {validateTweens} from "./tweens";

/**
 * Call the begin method of an animation in a separate function so it can
 * benefit from JIT compiling while still having a try/catch block.
 */
export function beginCall(activeCall: AnimationCall) {
	const callback = activeCall.begin || activeCall.options.begin;

	if (callback) {
		try {
			const elements = activeCall.elements;

			callback.call(elements, elements, activeCall);
		} catch (error) {
			setTimeout(() => {
				throw error;
			}, 1);
		}
	}
}

/**
 * Call the progress method of an animation in a separate function so it can
 * benefit from JIT compiling while still having a try/catch block.
 */
function progressCall(activeCall: AnimationCall) {
	const callback = activeCall.progress || activeCall.options.progress;

	if (callback) {
		try {
			const elements = activeCall.elements,
				percentComplete = activeCall.percentComplete,
				options = activeCall.options,
				tweenValue = activeCall.tween;

			callback.call(elements,
				elements,
				percentComplete,
				Math.max(0, activeCall.timeStart + (activeCall.duration != null ? activeCall.duration : options.duration != null ? options.duration : defaults.duration) - lastTick),
				tweenValue !== undefined ? tweenValue : String(percentComplete * 100),
				activeCall);
		} catch (error) {
			setTimeout(() => {
				throw error;
			}, 1);
		}
	}
}

/**
 * Call callbacks, potentially run async with the main animation thread.
 */
function asyncCallbacks() {
	for (const activeCall of progressed) {
		progressCall(activeCall);
	}
	progressed.clear();
	for (const activeCall of completed) {
		completeCall(activeCall);
	}
	completed.clear();
}

/**************
 Timing
 **************/

const FRAME_TIME = 1000 / 60,
	/**
	 * Animations with a Complete callback.
	 */
	completed = new Set<AnimationCall>(),
	/**
	 * Animations with a Progress callback.
	 */
	progressed = new Set<AnimationCall>(),
	/**
	 * Shim for window.performance in case it doesn't exist
	 */
	performance = (() => {
		const perf = window.performance || {} as Performance;

		if (typeof perf.now !== "function") {
			const nowOffset = perf.timing && perf.timing.navigationStart ? perf.timing.navigationStart : now();

			perf.now = () => {
				return now() - nowOffset;
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
	rAFProxy = (callback: FrameRequestCallback) => {
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
	worker: Worker;

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
	let interval: any;

	this.onmessage = (e) => {
		switch (e.data) {
			case true:
				if (!interval) {
					interval = setInterval(() => {
						this.postMessage(true);
					}, 1000 / 30);
				}
				break;

			case false:
				if (interval) {
					clearInterval(interval);
					interval = 0;
				}
				break;

			default:
				this.postMessage(e.data);
				break;
		}
	};
}

try {
	// Create the worker - this might not be supported, hence the try/catch.
	worker = new Worker(URL.createObjectURL(new Blob([`(${workerFn})()`])));
	// Whenever the worker sends a message we tick()
	worker.onmessage = (e: MessageEvent) => {
		if (e.data === true) {
			tick();
		} else {
			asyncCallbacks();
		}
	};
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
			nextCall: AnimationCall;

		if (deltaTime >= defaults.minFrameTime || !lastTick) {
			lastTick = timeCurrent;

			/********************
			 Call Iteration
			 ********************/

			// Expand any tweens that might need it.
			while (State.firstNew) {
				validateTweens(State.firstNew);
			}
			// Iterate through each active call.
			for (activeCall = State.first; activeCall && activeCall !== State.firstNew; activeCall = activeCall._next) {
				const element = activeCall.element,
					data = Data(element);

				// Check to see if this element has been deleted midway
				// through the animation. If it's gone then end this
				// animation.
				if (!element.parentNode || !data) {
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
				if (flags & AnimationFlags.PAUSED) { // tslint:disable-line:no-bitwise
					// Update the time start to accomodate the paused
					// completion amount.
					activeCall.timeStart += deltaTime;
					continue;
				}
				// Check if this animation is ready - if it's synced then it
				// needs to wait for all other animations in the sync
				if (!(flags & AnimationFlags.READY)) { // tslint:disable-line:no-bitwise
					activeCall._flags |= AnimationFlags.READY; // tslint:disable-line:no-bitwise
					options._ready++;
				}
			}
			// Need to split the loop, as ready sync animations must all get
			// the same start time.
			for (activeCall = State.first; activeCall && activeCall !== State.firstNew; activeCall = nextCall) {
				const flags = activeCall._flags;

				nextCall = activeCall._next;
				if (!(flags & AnimationFlags.READY) || (flags & AnimationFlags.PAUSED)) { // tslint:disable-line:no-bitwise
					continue;
				}
				const options = activeCall.options;

				if ((flags & AnimationFlags.SYNC) && options._ready < options._total) { // tslint:disable-line:no-bitwise
					activeCall.timeStart += deltaTime;
					continue;
				}
				const speed = activeCall.speed != null ? activeCall.speed : options.speed != null ? options.speed : defaultSpeed;
				let timeStart = activeCall.timeStart;

				// Don't bother getting until we can use these.
				if (!(flags & AnimationFlags.STARTED)) { // tslint:disable-line:no-bitwise
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
					activeCall._flags |= AnimationFlags.STARTED; // tslint:disable-line:no-bitwise
					// The begin callback is fired once per call, not once
					// per element, and is passed the full raw DOM element
					// set as both its context and its first argument.
					if (options._started++ === 0) {
						options._first = activeCall;
						if (options.begin) {
							// Pass to an external fn with a try/catch block for optimisation
							beginCall(activeCall);
							// Only called once, even if reversed or repeated
							options.begin = undefined;
						}
					}
				}
				if (speed !== 1) {
					// On the first frame we may have a shorter delta
					// const delta = Math.min(deltaTime, timeCurrent - timeStart);
					activeCall.timeStart = timeStart += Math.min(deltaTime, timeCurrent - timeStart) * (1 - speed);
				}
				const activeEasing = activeCall.easing != null ? activeCall.easing : options.easing != null ? options.easing : defaultEasing,
					millisecondsEllapsed = activeCall.ellapsedTime = timeCurrent - timeStart,
					duration = activeCall.duration != null ? activeCall.duration : options.duration != null ? options.duration : defaultDuration,
					percentComplete = activeCall.percentComplete = Velocity.mock ? 1 : Math.min(millisecondsEllapsed / duration, 1),
					tweens = activeCall.tweens,
					reverse = flags & AnimationFlags.REVERSE; // tslint:disable-line:no-bitwise

				if (activeCall.progress || (options._first === activeCall && options.progress)) {
					progressed.add(activeCall);
				}
				if (percentComplete === 1) {
					completed.add(activeCall);
				}
				// tslint:disable-next-line:forin
				for (const property in tweens) {
					// For every element, iterate through each property.
					const tween = tweens[property],
						sequence = tween.sequence,
						pattern = sequence.pattern;
					let currentValue = "",
						i = 0;

					if (pattern) {
						const easingComplete = (tween.easing || activeEasing)(percentComplete, 0, 1, property);
						let best = 0;

						for (let j = 0; j < sequence.length - 1; j++) {
							if (sequence[j].percent < easingComplete) {
								best = j;
							}
						}
						const tweenFrom: TweenStep = sequence[best],
							tweenTo: TweenStep = sequence[best + 1] || tweenFrom,
							rawPercent = (percentComplete - tweenFrom.percent) / (tweenTo.percent - tweenFrom.percent),
							tweenPercent = reverse ? 1 - rawPercent : rawPercent,
							easing = tweenTo.easing || activeEasing || linearEasing;

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
									const result = easing(tweenPercent, startValue as number, endValue as number, property);

									currentValue += pattern[i] !== true ? result : Math.round(result);
								}
							}
						}
						if (property !== "tween") {
							if (percentComplete === 1) {
								currentValue = removeNestedCalc(currentValue);
							}
							// TODO: To solve an IE<=8 positioning bug, the unit type must be dropped when setting a property value of 0 - add normalisations to legacy
							setPropertyValue(activeCall.element, property, currentValue, tween.fn);
						} else {
							// Skip the fake 'tween' property as that is only
							// passed into the progress callback.
							activeCall.tween = currentValue;
						}
					} else {
						console.warn(`VelocityJS: Missing pattern:`, property, JSON.stringify(tween[property]));
						delete tweens[property];
					}
				}
			}
			if (progressed.size || completed.size) {
				if (!document.hidden) {
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
