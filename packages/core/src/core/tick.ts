/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Tick
 */

import { TweenStep } from "../velocity";
import { Velocity } from "../velocity";
import { completeCall } from "./complete";
import { removeNestedCalc } from "../css/removeNestedCalc";
import { setPropertyValue } from "../css/setPropertyValue";
import { Data } from "../data";
import { defaults } from "./defaults";
import { easeLinear } from "../easings";
import { State } from "./state";
import { validateTweens } from "./tweens";
import { symbolAnimations, symbolFirst, symbolReady, symbolStarted } from "./animation";
import { AnimationCall, AnimationFlags } from "./animationCall";

/**
 * Call the begin method of an animation in a separate function so it can
 * benefit from JIT compiling while still having a try/catch block.
 */
export function beginCall(activeCall: AnimationCall) {
	const { begin } = activeCall;

	if (begin) {
		const { animation } = activeCall;

		try {
			begin.call(animation, animation, activeCall);
		} catch (error) {
			setTimeout(() => { throw error; }, 1);
		}
	}
}

/**
 * Call the progress method of an animation in a separate function so it can
 * benefit from JIT compiling while still having a try/catch block.
 */
function progressCall(activeCall: AnimationCall) {
	const { progress } = activeCall;

	if (progress) {
		try {
			const { animation, duration, percentComplete, tween } = activeCall;
			const tweenValue = tween !== undefined ? tween : String(percentComplete * 100);
			const remaining = Math.max(0, activeCall.timeStart + duration - lastTick);

			progress.call(animation, animation, percentComplete, remaining, tweenValue, activeCall);
		} catch (error) {
			setTimeout(() => { throw error; }, 1);
		}
	}
}

/**************
 Timing
 **************/

const FRAME_TIME = 1000 / 60;

/**
 * Animations with a Complete callback.
 */
const completed = new Set<AnimationCall>();

/**
 * Animations with a Progress callback.
 */
const progressed = new Set<AnimationCall>();

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

/**
 * Shim for window.performance in case it doesn't exist
 */
const performance = (() => {
	const perf = globalThis.performance || {} as Performance;

	if (typeof perf.now !== "function") {
		const nowOffset = Date.now();

		perf.now = () => Date.now() - nowOffset;
	}

	return perf;
})();

/**
 * Proxy function for when rAF is not available.
 *
 * This should hopefully never be used as the browsers often throttle
 * this to less than one frame per second in the background, making it
 * completely unusable.
 */
const rAFProxy = (callback: FrameRequestCallback) => {
	return setTimeout(callback, Math.max(0, FRAME_TIME - (performance.now() - lastTick)));
};

/**
 * Either requestAnimationFrame, or a shim for it.
 */
const rAFShim = globalThis.requestAnimationFrame || rAFProxy;

/**
 * Set if we are currently inside a tick() to prevent double-calling.
 */
let ticking: boolean;
/**
 * A background WebWorker that sends us framerate messages when we're in
 * the background. Without this we cannot maintain frame accuracy.
 */
let worker: Worker;

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
 * we run at 30fps instead of 60fps.
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
		const timeCurrent = performance.now();
		const deltaTime = lastTick ? timeCurrent - lastTick : FRAME_TIME;

		if (deltaTime >= defaults.minFrameTime || !lastTick) {
			const { animations } = State;

			lastTick = timeCurrent;

			// Expand any tweens that might need it.
			while (animations.current) {
				validateTweens(animations.next!);
			}
			// Iterate through each active call. First loop will ready all sync
			// animations at the same time
			for (const activeCall of animations) {
				// Don't process newly added animations.
				if (activeCall === animations.current) {
					break;
				}
				const { animation, element, flags, queue, timeStart } = activeCall;
				const data = Data(element);

				// Check to see if this element has been deleted midway through
				// the animation. If it's gone then end this animation.
				// TODO: Pull out DOM check into dom module
				if (!element.parentNode || !data) {
					animations.remove(activeCall);
					continue;
				}
				// If this is the first time that this call has been processed
				// by tick() then we assign timeStart now so that it's value is
				// as close to the real animation start time as possible.
				if (!timeStart) {
					const relativeStart = timeCurrent - deltaTime;

					activeCall.timeStart = queue !== false
						? Math.max(relativeStart, data.lastFinishTime.get(queue) || 0)
						: relativeStart;
				}
				// If this animation is paused then update the time start to
				// accomodate the paused completion amount.
				if (flags & AnimationFlags.PAUSED) { // tslint:disable-line:no-bitwise
					activeCall.timeStart! += deltaTime;
					continue;
				}
				// Check if this animation is ready - if it's synced then it
				// needs to wait for all other animations in the sync
				if (!(flags & AnimationFlags.READY)) { // tslint:disable-line:no-bitwise
					activeCall.flags |= AnimationFlags.READY; // tslint:disable-line:no-bitwise
					animation[symbolReady]++;
				}
			}
			// Need to split the loop, as ready sync animations must all get
			// the same start time.
			for (const activeCall of animations) {
				// Don't process newly added animations.
				if (activeCall === animations.current) {
					break;
				}
				const { animation, delay, duration, flags, speed, tweens } = activeCall;
				let { timeStart } = activeCall;

				if (!(flags & AnimationFlags.READY) || (flags & AnimationFlags.PAUSED)) { // tslint:disable-line:no-bitwise
					continue;
				}
				if ((flags & AnimationFlags.SYNC) // tslint:disable-line:no-bitwise
					&& animation[symbolReady] < animation[symbolAnimations].length
				) {
					activeCall.timeStart += deltaTime;
					continue;
				}

				// Don't bother getting until we can use these.
				if (!(flags & AnimationFlags.STARTED)) { // tslint:disable-line:no-bitwise
					// Make sure anything we've delayed doesn't start
					// animating yet, there might still be an active delay
					// after something has been un-paused
					if (delay) {
						if (timeStart + (delay / speed) > timeCurrent) {
							continue;
						}
						activeCall.timeStart = timeStart += delay / (delay > 0 ? speed : 1);
					}
					activeCall.flags |= AnimationFlags.STARTED; // tslint:disable-line:no-bitwise
					// The begin callback is fired once per call, not once
					// per element, and is passed the full raw DOM element
					// set as both its context and its first argument.
					if (animation[symbolStarted]++ === 0) {
						beginCall(animation[symbolFirst] = activeCall);
					}
				}
				if (speed !== 1) {
					// On the first frame we may have a shorter delta
					// const delta = Math.min(deltaTime, timeCurrent - timeStart);
					activeCall.timeStart = timeStart += Math.min(deltaTime, timeCurrent - timeStart) * (1 - speed);
				}
				const millisecondsEllapsed = activeCall.ellapsedTime = timeCurrent - timeStart;
				const percentComplete = activeCall.percentComplete = Velocity.mock ? 1 : Math.min(millisecondsEllapsed / duration, 1);
				const reverse = flags & AnimationFlags.REVERSE; // tslint:disable-line:no-bitwise

				if (animation[symbolFirst] === activeCall) {
					progressed.add(activeCall);
				}
				if (percentComplete === 1) {
					completed.add(activeCall);
				}
				// tslint:disable-next-line:forin
				for (const property in tweens) {
					// For every element, iterate through each property.
					const tween = tweens[property];
					const sequence = tween.sequence!;
					const pattern = sequence.pattern;
					let currentValue = "";
					let i = 0;

					if (pattern) {
						const easingComplete = (tween.easing || activeCall.easing)(percentComplete, 0, 1, property);
						let best = 0;

						for (let j = 0; j < sequence.length - 1; j++) {
							if (sequence[j].percent! < easingComplete) {
								best = j;
							}
						}
						const tweenFrom: TweenStep = sequence[best];
						const tweenTo: TweenStep = sequence[best + 1] || tweenFrom;
						const rawPercent = (percentComplete - tweenFrom.percent!) / (tweenTo.percent! - tweenFrom.percent!);
						const tweenPercent = reverse ? 1 - rawPercent : rawPercent;
						const easing = tweenTo.easing || activeCall.easing || easeLinear;

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
							setPropertyValue(activeCall.element!, property, currentValue, tween.fn);
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
	if (State.animations.first) {
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
