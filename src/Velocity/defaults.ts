/*
 * VelocityJS.org (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity option defaults, which can be overriden by the user.
 */

import {
	StrictVelocityOptions,
	VelocityCallback,
	VelocityEasingType,
} from "../../index.d";

import {
	DEFAULT_CACHE,
	DEFAULT_DELAY,
	DEFAULT_DURATION,
	DEFAULT_EASING,
	DEFAULT_FPSLIMIT,
	DEFAULT_LOOP,
	DEFAULT_PROMISE,
	DEFAULT_PROMISE_REJECT_EMPTY,
	DEFAULT_QUEUE,
	DEFAULT_REPEAT,
	DEFAULT_SPEED,
	DEFAULT_SYNC,
	FUZZY_MS_PER_SECOND,
} from "../constants";
import {isBoolean} from "../types";
import {
	validateBegin,
	validateCache,
	validateComplete,
	validateDelay,
	validateDuration,
	validateEasing,
	validateFpsLimit,
	validateLoop,
	validatePromise,
	validatePromiseRejectEmpty,
	validateQueue,
	validateRepeat,
	validateSpeed,
	validateSync,
} from "./validate";

// NOTE: Add the variable here, then add the default state in "reset" below.
let cache: boolean,
	begin: VelocityCallback,
	complete: VelocityCallback,
	delay: number,
	duration: number,
	easing: VelocityEasingType,
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

export const defaults: StrictVelocityOptions & {reset?: () => void} = {
	mobileHA: true,
};

// IMPORTANT: Make sure any new defaults get added to the actions/set.ts list
Object.defineProperties(defaults, {
	reset: {
		enumerable: true,
		value() {
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
		},
	},
	cache: {
		enumerable: true,
		get(): boolean {
			return cache;
		},
		set(value: boolean) {
			value = validateCache(value);
			if (value !== undefined) {
				cache = value;
			}
		},
	},
	begin: {
		enumerable: true,
		get(): VelocityCallback {
			return begin;
		},
		set(value: VelocityCallback) {
			value = validateBegin(value);
			if (value !== undefined) {
				begin = value;
			}
		},
	},
	complete: {
		enumerable: true,
		get(): VelocityCallback {
			return complete;
		},
		set(value: VelocityCallback) {
			value = validateComplete(value);
			if (value !== undefined) {
				complete = value;
			}
		},
	},
	delay: {
		enumerable: true,
		get(): "fast" | "normal" | "slow" | number {
			return delay;
		},
		set(value: "fast" | "normal" | "slow" | number) {
			value = validateDelay(value);
			if (value !== undefined) {
				delay = value;
			}
		},
	},
	duration: {
		enumerable: true,
		get(): "fast" | "normal" | "slow" | number {
			return duration;
		},
		set(value: "fast" | "normal" | "slow" | number) {
			value = validateDuration(value);
			if (value !== undefined) {
				duration = value;
			}
		},
	},
	easing: {
		enumerable: true,
		get(): VelocityEasingType {
			return easing;
		},
		set(value: VelocityEasingType) {
			value = validateEasing(value, duration);
			if (value !== undefined) {
				easing = value;
			}
		},
	},
	fpsLimit: {
		enumerable: true,
		get(): number | false {
			return fpsLimit;
		},
		set(value: number | false) {
			value = validateFpsLimit(value);
			if (value !== undefined) {
				fpsLimit = value;
				minFrameTime = FUZZY_MS_PER_SECOND / value;
			}
		},
	},
	loop: {
		enumerable: true,
		get(): number | true {
			return loop;
		},
		set(value: number | boolean) {
			value = validateLoop(value);
			if (value !== undefined) {
				loop = value;
			}
		},
	},
	mobileHA: {
		enumerable: true,
		get(): boolean {
			return mobileHA;
		},
		set(value: boolean) {
			if (isBoolean(value)) {
				mobileHA = value;
			}
		},
	},
	minFrameTime: {
		enumerable: true,
		get(): number | false {
			return minFrameTime;
		},
	},
	promise: {
		enumerable: true,
		get(): boolean {
			return promise;
		},
		set(value: boolean) {
			value = validatePromise(value);
			if (value !== undefined) {
				promise = value;
			}
		},
	},
	promiseRejectEmpty: {
		enumerable: true,
		get(): boolean {
			return promiseRejectEmpty;
		},
		set(value: boolean) {
			value = validatePromiseRejectEmpty(value);
			if (value !== undefined) {
				promiseRejectEmpty = value;
			}
		},
	},
	queue: {
		enumerable: true,
		get(): string | false {
			return queue;
		},
		set(value: string | false) {
			value = validateQueue(value);
			if (value !== undefined) {
				queue = value;
			}
		},
	},
	repeat: {
		enumerable: true,
		get(): number | true {
			return repeat;
		},
		set(value: number | boolean) {
			value = validateRepeat(value);
			if (value !== undefined) {
				repeat = value;
			}
		},
	},
	speed: {
		enumerable: true,
		get(): number {
			return speed;
		},
		set(value: number) {
			value = validateSpeed(value);
			if (value !== undefined) {
				speed = value;
			}
		},
	},
	sync: {
		enumerable: true,
		get(): boolean {
			return sync;
		},
		set(value: boolean) {
			value = validateSync(value);
			if (value !== undefined) {
				sync = value;
			}
		},
	},
});

// Reset to our default values, currently everything is undefined.
defaults.reset();
