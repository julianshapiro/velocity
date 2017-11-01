/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity option defaults, which can be overriden by the user.
 */

namespace VelocityStatic {
	let _cache: boolean = DEFAULT_CACHE,
		_begin: VelocityCallback,
		_complete: VelocityCallback,
		_delay: number = DEFAULT_DELAY,
		_duration: number = DEFAULT_DURATION,
		_easing: VelocityEasingType = DEFAULT_EASING,
		_fpsLimit: number = DEFAULT_FPSLIMIT,
		_loop: number = DEFAULT_LOOP,
		_minFrameTime: number = DEFAULT_MILISECONDS_PER_FRAME / DEFAULT_FPSLIMIT,
		_promise: boolean = DEFAULT_PROMISE,
		_promiseRejectEmpty: boolean = DEFAULT_PROMISE_REJECT_EMPTY,
		_queue: string | false = DEFAULT_QUEUE,
		_repeat: number = DEFAULT_REPEAT;

	export let defaults: VelocityOptions = {
		mobileHA: true
	};

	Object.defineProperties(defaults, {
		cache: {
			get: (function(): boolean {
				return _cache;
			}),
			set: (function(value: boolean) {
				value = validateCache(value);
				if (value !== undefined) {
					_cache = value;
				}
			})
		},
		begin: {
			get: (function(): VelocityCallback {
				return _begin;
			}),
			set: (function(value: VelocityCallback) {
				value = validateBegin(value);
				if (value !== undefined) {
					_begin = value;
				}
			})
		},
		complete: {
			get: (function(): VelocityCallback {
				return _complete;
			}),
			set: (function(value: VelocityCallback) {
				value = validateComplete(value);
				if (value !== undefined) {
					_complete = value;
				}
			})
		},
		delay: {
			get: (function(): "fast" | "normal" | "slow" | number {
				return _delay;
			}),
			set: (function(value: "fast" | "normal" | "slow" | number) {
				value = validateDelay(value);
				if (value !== undefined) {
					_delay = value;
				}
			})
		},
		duration: {
			get: (function(): "fast" | "normal" | "slow" | number {
				return _duration;
			}),
			set: (function(value: "fast" | "normal" | "slow" | number) {
				value = validateDuration(value);
				if (value !== undefined) {
					_duration = value;
				}
			})
		},
		easing: {
			get: (function(): VelocityEasingType {
				return _easing;
			}),
			set: (function(value: VelocityEasingType) {
				value = validateEasing(value, _duration);
				if (value !== undefined) {
					_easing = value;
				}
			})
		},
		fpsLimit: {
			get: (function(): number | false {
				return _fpsLimit;
			}),
			set: (function(value: number | false) {
				value = validateFpsLimit(value);
				if (value !== undefined) {
					_fpsLimit = value;
					_minFrameTime = DEFAULT_MILISECONDS_PER_FRAME / value;
				}
			})
		},
		loop: {
			get: (function(): number | false {
				return _loop;
			}),
			set: (function(value: number | false) {
				value = validateLoop(value);
				if (value !== undefined) {
					_loop = value;
				}
			})
		},
		minFrameTime:{
		   	get: (function(): number | false {
		   		return _minFrameTime;
		   	})
		},
		promise: {
			get: (function(): boolean {
				return _promise;
			}),
			set: (function(value: boolean) {
				value = validatePromise(value);
				if (value !== undefined) {
					_promise = value;
				}
			})
		},
		promiseRejectEmpty: {
			get: (function(): boolean {
				return _promiseRejectEmpty;
			}),
			set: (function(value: boolean) {
				value = validatePromiseRejectEmpty(value);
				if (value !== undefined) {
					_promiseRejectEmpty = value;
				}
			})
		},
		queue: {
			get: (function(): string | false {
				return _queue;
			}),
			set: (function(value: string | false) {
				value = validateQueue(value);
				if (value !== undefined) {
					_queue = value;
				}
			})
		},
		repeat: {
			get: (function(): number | false {
				return _repeat;
			}),
			set: (function(value: number | false) {
				value = validateRepeat(value);
				if (value !== undefined) {
					_repeat = value;
				}
			})
		}
	});
};
