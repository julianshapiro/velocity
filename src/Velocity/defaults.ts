/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity option defaults, which can be overriden by the user.
 */

namespace VelocityStatic {
	// NOTE: Add the variable here, then add the default state in "reset" below.
	let _cache: boolean,
		_begin: VelocityCallback,
		_complete: VelocityCallback,
		_delay: number,
		_duration: number,
		_easing: VelocityEasingType,
		_fpsLimit: number,
		_loop: number | true,
		_minFrameTime: number,
		_promise: boolean,
		_promiseRejectEmpty: boolean,
		_queue: string | false,
		_repeat: number | true,
		_speed: number,
		_sync: boolean;

	export const defaults: StrictVelocityOptions & {reset?: () => void} = {
		mobileHA: true
	};

	// IMPORTANT: Make sure any new defaults get added to the actions/set.ts list
	Object.defineProperties(defaults, {
		reset: {
			enumerable: true,
			value: function() {
				_cache = DEFAULT_CACHE;
				_begin = undefined;
				_complete = undefined;
				_delay = DEFAULT_DELAY;
				_duration = DEFAULT_DURATION;
				_easing = validateEasing(DEFAULT_EASING, DEFAULT_DURATION);
				_fpsLimit = DEFAULT_FPSLIMIT;
				_loop = DEFAULT_LOOP;
				_minFrameTime = FUZZY_MS_PER_SECOND / DEFAULT_FPSLIMIT;
				_promise = DEFAULT_PROMISE;
				_promiseRejectEmpty = DEFAULT_PROMISE_REJECT_EMPTY;
				_queue = DEFAULT_QUEUE;
				_repeat = DEFAULT_REPEAT;
				_speed = DEFAULT_SPEED;
				_sync = DEFAULT_SYNC;
			}
		},
		cache: {
			enumerable: true,
			get: function(): boolean {
				return _cache;
			},
			set: function(value: boolean) {
				value = validateCache(value);
				if (value !== undefined) {
					_cache = value;
				}
			}
		},
		begin: {
			enumerable: true,
			get: function(): VelocityCallback {
				return _begin;
			},
			set: function(value: VelocityCallback) {
				value = validateBegin(value);
				if (value !== undefined) {
					_begin = value;
				}
			}
		},
		complete: {
			enumerable: true,
			get: function(): VelocityCallback {
				return _complete;
			},
			set: function(value: VelocityCallback) {
				value = validateComplete(value);
				if (value !== undefined) {
					_complete = value;
				}
			}
		},
		delay: {
			enumerable: true,
			get: function(): "fast" | "normal" | "slow" | number {
				return _delay;
			},
			set: function(value: "fast" | "normal" | "slow" | number) {
				value = validateDelay(value);
				if (value !== undefined) {
					_delay = value;
				}
			}
		},
		duration: {
			enumerable: true,
			get: function(): "fast" | "normal" | "slow" | number {
				return _duration;
			},
			set: function(value: "fast" | "normal" | "slow" | number) {
				value = validateDuration(value);
				if (value !== undefined) {
					_duration = value;
				}
			}
		},
		easing: {
			enumerable: true,
			get: function(): VelocityEasingType {
				return _easing;
			},
			set: function(value: VelocityEasingType) {
				value = validateEasing(value, _duration);
				if (value !== undefined) {
					_easing = value;
				}
			}
		},
		fpsLimit: {
			enumerable: true,
			get: function(): number | false {
				return _fpsLimit;
			},
			set: function(value: number | false) {
				value = validateFpsLimit(value);
				if (value !== undefined) {
					_fpsLimit = value;
					_minFrameTime = FUZZY_MS_PER_SECOND / value;
				}
			}
		},
		loop: {
			enumerable: true,
			get: function(): number | true {
				return _loop;
			},
			set: function(value: number | boolean) {
				value = validateLoop(value);
				if (value !== undefined) {
					_loop = value;
				}
			}
		},
		minFrameTime: {
			enumerable: true,
			get: function(): number | false {
				return _minFrameTime;
			}
		},
		promise: {
			enumerable: true,
			get: function(): boolean {
				return _promise;
			},
			set: function(value: boolean) {
				value = validatePromise(value);
				if (value !== undefined) {
					_promise = value;
				}
			}
		},
		promiseRejectEmpty: {
			enumerable: true,
			get: function(): boolean {
				return _promiseRejectEmpty;
			},
			set: function(value: boolean) {
				value = validatePromiseRejectEmpty(value);
				if (value !== undefined) {
					_promiseRejectEmpty = value;
				}
			}
		},
		queue: {
			enumerable: true,
			get: function(): string | false {
				return _queue;
			},
			set: function(value: string | false) {
				value = validateQueue(value);
				if (value !== undefined) {
					_queue = value;
				}
			}
		},
		repeat: {
			enumerable: true,
			get: function(): number | true {
				return _repeat;
			},
			set: function(value: number | boolean) {
				value = validateRepeat(value);
				if (value !== undefined) {
					_repeat = value;
				}
			}
		},
		speed: {
			enumerable: true,
			get: function(): number {
				return _speed;
			},
			set: function(value: number) {
				value = validateSpeed(value);
				if (value !== undefined) {
					_speed = value;
				}
			}
		},
		sync: {
			enumerable: true,
			get: function(): boolean {
				return _sync;
			},
			set: function(value: boolean) {
				value = validateSync(value);
				if (value !== undefined) {
					_sync = value;
				}
			}
		}
	});
	defaults.reset();
};
