/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity option defaults, which can be overriden by the user.
 */

// Typedefs
import {StrictVelocityOptions, VelocityCallbackFn, VelocityEasingFn} from "../../velocity.d";

// Project
import {isBoolean} from "../types";
import {
	validateBegin, validateCache, validateComplete, validateDelay, validateDuration,
	validateEasing, validateFpsLimit, validateLoop, validatePromise, validatePromiseRejectEmpty,
	validateQueue, validateRepeat, validateSpeed, validateSync,
} from "./options";

// Constants
import {
	DEFAULT_CACHE, DEFAULT_DELAY, DEFAULT_DURATION, DEFAULT_EASING, DEFAULT_FPSLIMIT,
	DEFAULT_LOOP, DEFAULT_PROMISE, DEFAULT_PROMISE_REJECT_EMPTY, DEFAULT_QUEUE, DEFAULT_REPEAT,
	DEFAULT_SPEED, DEFAULT_SYNC, FUZZY_MS_PER_SECOND,
} from "../constants";

// NOTE: Add the variable here, then add the default state in "reset" below.
let cache: boolean,
	begin: VelocityCallbackFn,
	complete: VelocityCallbackFn,
	delay: number,
	duration: number,
	easing: VelocityEasingFn,
	fpsLimit: number,
	loop: number | true,
	mobileHA: boolean,
	minFrameTime: number,
	promise: boolean,
	promiseRejectEmpty: boolean,
	queue: string | false,
	repeat: number | true,
	speed: number,
	sync: boolean;

export abstract class defaults implements StrictVelocityOptions {
	static reset() {
		cache = DEFAULT_CACHE;
		begin = undefined;
		complete = undefined;
		delay = DEFAULT_DELAY;
		duration = DEFAULT_DURATION;
		easing = validateEasing(DEFAULT_EASING, DEFAULT_DURATION);
		fpsLimit = DEFAULT_FPSLIMIT;
		loop = DEFAULT_LOOP;
		minFrameTime = FUZZY_MS_PER_SECOND / DEFAULT_FPSLIMIT;
		promise = DEFAULT_PROMISE;
		promiseRejectEmpty = DEFAULT_PROMISE_REJECT_EMPTY;
		queue = DEFAULT_QUEUE;
		repeat = DEFAULT_REPEAT;
		speed = DEFAULT_SPEED;
		sync = DEFAULT_SYNC;
	}

	static get cache(): boolean {
		return cache;
	}

	static set cache(value: boolean) {
		value = validateCache(value);
		if (value !== undefined) {
			cache = value;
		}
	}

	static get begin(): VelocityCallbackFn {
		return begin;
	}
	static set begin(value: VelocityCallbackFn) {
		value = validateBegin(value);
		if (value !== undefined) {
			begin = value;
		}
	}

	static get complete(): VelocityCallbackFn {
		return complete;
	}

	static set complete(value: VelocityCallbackFn) {
		value = validateComplete(value);
		if (value !== undefined) {
			complete = value;
		}
	}

	static get delay(): number {
		return delay;
	}
	static set delay(value: number) {
		value = validateDelay(value);
		if (value !== undefined) {
			delay = value;
		}
	}

	static get duration(): number {
		return duration;
	}
	static set duration(value: number) {
		value = validateDuration(value);
		if (value !== undefined) {
			duration = value;
		}
	}

	static get easing(): VelocityEasingFn {
		return easing;
	}
	static set easing(value: VelocityEasingFn) {
		value = validateEasing(value, duration);
		if (value !== undefined) {
			easing = value;
		}
	}

	static get fpsLimit(): number | false {
		return fpsLimit;
	}
	static set fpsLimit(value: number | false) {
		value = validateFpsLimit(value);
		if (value !== undefined) {
			fpsLimit = value;
			minFrameTime = FUZZY_MS_PER_SECOND / value;
		}
	}

	static get loop(): number | true {
		return loop;
	}
	static set loop(value: number | true) {
		value = validateLoop(value);
		if (value !== undefined) {
			loop = value;
		}
	}

	static get mobileHA(): boolean {
		return mobileHA;
	}
	static set mobileHA(value: boolean) {
		if (isBoolean(value)) {
			mobileHA = value;
		}
	}

	static get minFrameTime(): number | false {
		return minFrameTime;
	}

	static get promise(): boolean {
		return promise;
	}
	static set promise(value: boolean) {
		value = validatePromise(value);
		if (value !== undefined) {
			promise = value;
		}
	}

	static get promiseRejectEmpty(): boolean {
		return promiseRejectEmpty;
	}
	static set promiseRejectEmpty(value: boolean) {
		value = validatePromiseRejectEmpty(value);
		if (value !== undefined) {
			promiseRejectEmpty = value;
		}
	}

	static get queue(): string | false {
		return queue;
	}
	static set queue(value: string | false) {
		value = validateQueue(value);
		if (value !== undefined) {
			queue = value;
		}
	}

	static get repeat(): number | true {
		return repeat;
	}
	static set repeat(value: number | true) {
		value = validateRepeat(value);
		if (value !== undefined) {
			repeat = value;
		}
	}

	static get repeatAgain(): number | true {
		return repeat;
	}

	static get speed(): number {
		return speed;
	}
	static set speed(value: number) {
		value = validateSpeed(value);
		if (value !== undefined) {
			speed = value;
		}
	}
	static get sync(): boolean {
		return sync;
	}
	static set sync(value: boolean) {
		value = validateSync(value);
		if (value !== undefined) {
			sync = value;
		}
	}
}

Object.freeze(defaults);

// Reset to our default values, currently everything is undefined.
defaults.reset();
