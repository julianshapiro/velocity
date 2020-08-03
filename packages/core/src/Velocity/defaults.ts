/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity option defaults, which can be overriden by the user.
 */

// Typedefs
import { StrictVelocityOptions } from "../velocity";

// Project
import { isBoolean } from "../types";
import {
	validateBegin, validateCache, validateComplete, validateDelay, validateDuration,
	validateEasing, validateFpsLimit, validateLoop, validatePromise, validatePromiseRejectEmpty,
	validateQueue, validateRepeat, validateSpeed, validateSync, validateProgress,
} from "./options";

// Constants
import {
	DEFAULT_CACHE, DEFAULT_DELAY, DEFAULT_DURATION, DEFAULT_EASING, DEFAULT_FPSLIMIT,
	DEFAULT_LOOP, DEFAULT_PROMISE, DEFAULT_PROMISE_REJECT_EMPTY, DEFAULT_QUEUE, DEFAULT_REPEAT,
	DEFAULT_SPEED, DEFAULT_SYNC, FUZZY_MS_PER_SECOND,
} from "../constants";

type RequiredVelocityOptions = Required<StrictVelocityOptions>;

class Defaults implements StrictVelocityOptions {
	#cache!: RequiredVelocityOptions["cache"];
	#begin!: StrictVelocityOptions["begin"];
	#complete!: StrictVelocityOptions["complete"];
	#delay!: RequiredVelocityOptions["delay"];
	#duration!: RequiredVelocityOptions["duration"];
	#easing!: StrictVelocityOptions["easing"];
	#fpsLimit!: RequiredVelocityOptions["fpsLimit"];
	#loop!: RequiredVelocityOptions["loop"];
	#mobileHA!: RequiredVelocityOptions["mobileHA"];
	#minFrameTime!: RequiredVelocityOptions["minFrameTime"];
	#progress!: RequiredVelocityOptions["progress"];
	#promise!: RequiredVelocityOptions["promise"];
	#promiseRejectEmpty!: RequiredVelocityOptions["promiseRejectEmpty"];
	#queue!: RequiredVelocityOptions["queue"];
	#repeat!: RequiredVelocityOptions["repeat"];
	#speed!: RequiredVelocityOptions["speed"];
	#sync!: RequiredVelocityOptions["sync"];

	constructor() {
		this.reset();
	}

	reset() {
		this.#cache = DEFAULT_CACHE;
		this.#begin = undefined;
		this.#complete = undefined;
		this.#delay = DEFAULT_DELAY;
		this.#duration = DEFAULT_DURATION;
		this.#easing = validateEasing(DEFAULT_EASING, DEFAULT_DURATION);
		this.#fpsLimit = DEFAULT_FPSLIMIT;
		this.#loop = DEFAULT_LOOP;
		this.#minFrameTime = FUZZY_MS_PER_SECOND / DEFAULT_FPSLIMIT;
		this.#promise = DEFAULT_PROMISE;
		this.#promiseRejectEmpty = DEFAULT_PROMISE_REJECT_EMPTY;
		this.#queue = DEFAULT_QUEUE;
		this.#repeat = DEFAULT_REPEAT;
		this.#speed = DEFAULT_SPEED;
		this.#sync = DEFAULT_SYNC;
	}

	// cache
	get cache() {
		return this.#cache;
	}
	set cache(value) {
		this.#cache = validateCache(value) ?? this.#cache;
	}

	// begin
	get begin() {
		return this.#begin;
	}
	set begin(value) {
		this.#begin = validateBegin(value) ?? this.#begin;
	}

	// complete
	get complete() {
		return this.#complete;
	}
	set complete(value) {
		this.#complete = validateComplete(value) ?? this.#complete;
	}

	// delay
	get delay() {
		return this.#delay;
	}
	set delay(value) {
		this.#delay = validateDelay(value) ?? this.#delay;
	}

	// duration
	get duration() {
		return this.#duration;
	}
	set duration(value) {
		this.#duration = validateDuration(value) ?? this.#duration;
	}

	// easing
	get easing() {
		return this.#easing;
	}
	set easing(value) {
		this.#easing = validateEasing(value, this.#duration) ?? this.#easing;
	}

	// fpsLimit
	get fpsLimit() {
		return this.#fpsLimit;
	}
	set fpsLimit(value) {
		this.#fpsLimit = validateFpsLimit(value) ?? this.#fpsLimit;
	}

	// loop
	get loop() {
		return this.#loop;
	}
	set loop(value) {
		this.#loop = validateLoop(value) ?? this.#loop;
	}

	// mobileHA
	get mobileHA() {
		return this.#mobileHA;
	}
	set mobileHA(value) {
		if (isBoolean(value)) {
			this.#mobileHA = value;
		}
	}

	// minFrameTime
	get minFrameTime() {
		return this.#minFrameTime;
	}

	// promise
	get progress() {
		return this.#progress;
	}
	set progress(value) {
		this.#progress = validateProgress(value) ?? this.#progress;
	}

	// promise
	get promise() {
		return this.#promise;
	}
	set promise(value) {
		this.#promise = validatePromise(value) ?? this.#promise;
	}

	// promiseRejectEmpty
	get promiseRejectEmpty() {
		return this.#promiseRejectEmpty;
	}
	set promiseRejectEmpty(value) {
		this.#promiseRejectEmpty = validatePromiseRejectEmpty(value) ?? this.#promiseRejectEmpty;
	}

	// queue
	get queue() {
		return this.#queue;
	}
	set queue(value) {
		this.#queue = validateQueue(value) ?? this.#queue;
	}

	// repeat
	get repeat() {
		return this.#repeat;
	}
	set repeat(value) {
		this.#repeat = validateRepeat(value) ?? this.#repeat;
	}

	// repeatAgain
	get repeatAgain() {
		return this.#repeat;
	}

	// speed
	get speed() {
		return this.#speed;
	}
	set speed(value) {
		this.#speed = validateSpeed(value) ?? this.#speed;
	}

	// sync
	get sync() {
		return this.#sync;
	}
	set sync(value) {
		this.#sync = validateSync(value) ?? this.#sync;
	}
}

export const defaults = new Defaults();

Object.freeze(defaults);
