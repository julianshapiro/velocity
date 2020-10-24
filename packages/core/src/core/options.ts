/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import type { KnownElement } from "../velocity";
import type { IAnimation } from "./animation";

import { isBoolean, isFunction, isNumber, isString, isInteger } from "../types";
import { EasingFn, validateEasing, easeSwing, EasingType } from "../easings";
import { AnimationCall } from "./animationCall";

/**
 * A callback to allow us to generate an option value.
 */
export type OptionFn<T> = T | ((this: ReadonlyArray<KnownElement>, element: KnownElement, index: number, option: keyof IOptions) => T | undefined);

/**
 * Loose options that can be passed to Velocity animations. The Options class
 * tightens these types to reduce processing during animations.
 */
export interface IOptions {
	/**
	 * If the animation is to run backwards.
	 */
	backwards?: OptionFn<boolean>,

	/**
	 * Begin handler. Only the first element to check this callback gets to use
	 * it.
	 */
	begin: undefined | ((
		this: IAnimation,
		elements: IAnimation,
		activeCall: AnimationCall) => void);

	/**
	 * Should the cache be used for the tweens. Turning this off can improve
	 * memory usage slightly, but will also make things slower when creating
	 * animations.
	 *
	 * @private
	 * @default true
	 */
	cache?: OptionFn<boolean>;

	/**
	 * Complete handler (only the last element in a set gets this).
	 */
	complete: undefined | ((
		this: IAnimation,
		elements: IAnimation,
		activeCall: AnimationCall) => void);

	/**
	 * How long the animation should delay after becoming active and before it
	 * actually starts to animate. This is a millisecond timer, but
	 * can handle some string values.
	 * <code>"fast"</code> = 200ms
	 * <code>"normal"</code> = 400ms
	 * <code>"slow"</code> = 600ms
	 * NOTE: If passing a negative number then this will allow you to start with
	 * the animation partially complete from the start.
	 */
	delay?: OptionFn<number | "fast" | "normal" | "slow" | string>;

	/**
	 * Reduce the duration of each successive element so they drag into final
	 * state. The first quarter of the elements will get a reduced duration (ie.
	 * they will finish faster) in a smooth way.
	 */
	drag?: OptionFn<boolean>;

	/**
	 * How long the animation should run for. This is a millisecond timer, but
	 * can handle some string values.
	 * `"fast"` = 200ms
	 * `"normal"` = 400ms
	 * `"slow"` = 600ms
	 *
	 * @default 400
	 */
	duration?: OptionFn<number | "fast" | "normal" | "slow" | string>;

	/**
	 * Easing is the rate of change over time for an animation. A linear easing
	 * would simply be 1% of the time to 1% of the animation. This allows you
	 * to specify how that rate of change should be. There are various named
	 * easings, but you can also supply your own.
	 *
	 * TODO: Copy more of the original description
	 *
	 * @default "swing"
	 */
	easing?: EasingType;

	/**
	 * Maximum number of frames to render on each second for all animations.
	 *
	 * @default 60
	 */
	fpsLimit?: OptionFn<number>;

	/**
	 * How many times should this option loop. A loop is defined as a "return to
	 * start values", so it will run, then reverse. This counts as a single
	 * loop. Setting <code>loop:4</code> will cause the animation to take the
	 * same time as <code>4n+1</code> iterations.
	 *
	 * @default 0
	 */
	loop?: OptionFn<boolean | number>;

	/**
	 * The minimum frame time to achieve, the value is normally calculated from
	 * fpsLimit.
	 *
	 * @default 16.33333333 (1000ms / 60fps)
	 */
	minFrameTime?: OptionFn<number>;

	/**
	 * Progress handler (only the last element in a set gets this).
	 *
	 * @default undefined
	 */
	progress: undefined | ((this: IAnimation,
		elements?: IAnimation,
		percentComplete?: number,
		remaining?: number,
		tweenValue?: string | number,
		activeCall?: AnimationCall) => void);

	/**
	 * If this should return a Promise with everything else. If promises are not
	 * required at all, then simply setting it globally will turn them off.
	 *
	 * @default true
	 */
	promise?: OptionFn<boolean>;

	/**
	 * If promises are turned on, then the promise can reject if there are no
	 * elements supplied (an empty array is still valid).
	 *
	 * @default false
	 */
	promiseRejectEmpty?: OptionFn<boolean>;

	/**
	 * The name of the queue to use. If this is set to <code>false</code> then
	 * it will be added immediately ignoring any other queues running. Queues
	 * start playing automatically.
	 *
	 * @default ""
	 */
	queue?: OptionFn<boolean | string>;

	/**
	 * How many times should this animation repeat. A repeat will restart at
	 * initial values and animate once. This is most useful for rotating
	 * animations where <code>0deg === 360deg</code>. If you are after a more
	 * "bounce" effect then look at <code>loop</code>.
	 *
	 * @default 0
	 */
	repeat?: OptionFn<boolean | number>;

	/**
	 * The speed to play the animation back at. This number can change while
	 * running, in order to vary the playback rate.
	 *
	 * @default 0
	 */
	speed?: OptionFn<number>;

	/**
	 * Supply a delay in ms, and every element in the animation will get this
	 * delay multiplied by its index added to it.
	 *
	 * @default undefined
	 */
	stagger?: OptionFn<number>;

	/**
	 * When adding animations to elements each element has its own queue of
	 * pending animations. This ensures that when adding a single animation to
	 * multiple elements, they all begin at the same time.
	 *
	 * @default true
	 */
	sync?: OptionFn<boolean>;
}

/**
 * Options passed to a new Velocity animation. These are validated in the
 * constructor to ensure they are of an internally useful type - so they are
 * more restrictive than the IOptions interface.
 *
 * To have a parent Options object, use `Object.create(parent)` to allow proper
 * prototyping.
 */
export class Options implements IOptions {
	static readonly DURATION_FAST = 200;
	static readonly DURATION_NORMAL = 400;
	static readonly DURATION_SLOW = 600;

	static readonly DEFAULT_BACKWARDS = false;
	static readonly DEFAULT_BEGIN = undefined;
	static readonly DEFAULT_CACHE = true;
	static readonly DEFAULT_COMPLETE = undefined;
	static readonly DEFAULT_DELAY = 0;
	static readonly DEFAULT_DRAG = false;
	static readonly DEFAULT_DURATION = Options.DURATION_NORMAL;
	static readonly DEFAULT_EASING = easeSwing;
	static readonly DEFAULT_FPS_LIMIT = 60;
	static readonly DEFAULT_LOOP = 0;
	static readonly DEFAULT_MIN_FRAME_TIME = 1000 / Options.DEFAULT_FPS_LIMIT;
	static readonly DEFAULT_PROGRESS = undefined;
	static readonly DEFAULT_PROMISE = true;
	static readonly DEFAULT_PROMISE_REJECT_EMPTY = false;
	static readonly DEFAULT_QUEUE = "";
	static readonly DEFAULT_REPEAT = 0;
	static readonly DEFAULT_SPEED = 1;
	static readonly DEFAULT_STAGGER = 0;
	static readonly DEFAULT_SYNC = true;

	static readonly defaults = new Options({
		backwards: Options.DEFAULT_BACKWARDS,
		begin: Options.DEFAULT_BEGIN,
		cache: Options.DEFAULT_CACHE,
		complete: Options.DEFAULT_COMPLETE,
		delay: Options.DEFAULT_DELAY,
		drag: Options.DEFAULT_DRAG,
		duration: Options.DEFAULT_DURATION,
		easing: Options.DEFAULT_EASING,
		fpsLimit: Options.DEFAULT_FPS_LIMIT,
		loop: Options.DEFAULT_LOOP,
		minFrameTime: Options.DEFAULT_MIN_FRAME_TIME,
		progress: Options.DEFAULT_PROGRESS,
		promise: Options.DEFAULT_PROMISE,
		promiseRejectEmpty: Options.DEFAULT_PROMISE_REJECT_EMPTY,
		queue: Options.DEFAULT_QUEUE,
		repeat: Options.DEFAULT_REPEAT,
		speed: Options.DEFAULT_SPEED,
		stagger: Options.DEFAULT_STAGGER,
		sync: Options.DEFAULT_SYNC,
	} as Required<IOptions>);

	/**
	 * Set the default parameters. The values are parsed into an Options object,
	 * so only valid options can be replaced. These become active immediately so
	 * any animations that do not have their own values will have the new ones
	 * immediately.
	 */
	static setDefault(options: IOptions) {
		const validated = new Options(options);

		for (const key in validated) {
			if (Object.prototype.hasOwnProperty.call(validated, key)) {
				Options.defaults[key] = validated[key];
			}
		}
	}

	/**
	 * Parse a duration value and return an ms number.
	 */
	static parseDuration(duration?: "fast" | "normal" | "slow" | string | number | unknown): number | undefined {
		if (isNumber(duration)) {
			return duration;
		}
		if (isString(duration)) {
			const result = duration === "fast"
				? Options.DURATION_FAST
				: duration === "normal"
					? Options.DURATION_NORMAL
					: duration === "slow"
						? Options.DURATION_SLOW
						: parseFloat(duration.replace("ms", "").replace("s", "000"));

			if (!isNaN(result)) {
				return result;
			}
		}
	}

	constructor(options: Partial<IOptions> | Options, elements?: ReadonlyArray<KnownElement>, index?: number) {
		if (options instanceof Options) {
			// So any we don't set are taken from a parent.
			Object.setPrototypeOf(this, options);

			return;
		}

		if (Options.defaults) {
			// So any we don't set come from the defaults.
			Object.setPrototypeOf(this, Options.defaults);
		}

		const {
			backwards,
			begin,
			cache,
			complete,
			delay,
			drag,
			duration,
			easing,
			fpsLimit,
			loop,
			minFrameTime,
			progress,
			promise,
			promiseRejectEmpty,
			queue,
			repeat,
			speed,
			stagger,
			sync,
		} = options;
		let parsed: unknown;
		let value: unknown
		const warnIfNotUndefined = (key: string, value: any) => {
			if (value !== undefined) {
				console.warn(`VelocityJS: Trying to set '${key}' to an invalid value:`, value);
			}
		}
		/**
		 * Call an option callback in a try/catch block and report an error if needed.
		 */
		const optionCallback = <T extends keyof IOptions>(fn: unknown, option: T): IOptions[T] | undefined => {
			try {
				if (isFunction(fn) && elements) {
					return fn.call(elements, elements[index!], index!, option);
				}

				return fn as IOptions[T]; // This could be wrong, but the next line checks type
			} catch (e) {
				console.error(`VelocityJS: Exception when calling '${option}' option callback:`, e);
			}
		}


		value = optionCallback(backwards, "backwards");
		if (isBoolean(value)) {
			this.backwards = value;
		} else {
			warnIfNotUndefined("backwards", value);
		}

		if (isFunction(begin) || begin === undefined) {
			this.begin = begin;
		} else {
			warnIfNotUndefined("begin", begin);
		}

		value = optionCallback(cache, "cache");
		if (isBoolean(value)) {
			this.cache = value;
		} else {
			warnIfNotUndefined("cache", cache);
		}

		if (isFunction(complete) || complete === undefined) {
			this.complete = complete as any;
		} else {
			warnIfNotUndefined("complete", complete);
		}

		value = optionCallback(delay, "delay");
		parsed = Options.parseDuration(delay);
		if (isNumber(parsed)) {
			this.delay = parsed;
		} else {
			warnIfNotUndefined("delay", delay);
		}

		if (isBoolean(drag)) {
			this.drag = drag;
		} else {
			warnIfNotUndefined("drag", drag);
		}

		value = optionCallback(duration, "duration");
		parsed = Options.parseDuration(value);
		if (isNumber(parsed)) {
			this.duration = parsed;
		} else {
			warnIfNotUndefined("duration", duration);
		}

		parsed = validateEasing(easing, this.duration);
		if (isFunction(parsed)) {
			this.easing = parsed as EasingFn;
		} else {
			warnIfNotUndefined("easing", easing);
		}

		value = optionCallback(fpsLimit, "fpsLimit");
		if (isNumber(value) && value > 0) {
			this.fpsLimit = value;
		} else {
			warnIfNotUndefined("fpsLimit", fpsLimit);
		}

		value = optionCallback(loop, "loop");
		if ((isInteger(value) && value >= 0) || isBoolean(value)) {
			this.loop = value || 0;
		} else {
			warnIfNotUndefined("loop", loop);
		}

		value = optionCallback(minFrameTime, "minFrameTime");
		if (isNumber(value)) {
			this.minFrameTime = value;
		} else {
			warnIfNotUndefined("minFrameTime", minFrameTime);
		}

		if (isFunction(progress) || progress === undefined) {
			this.progress = progress;
		} else {
			warnIfNotUndefined("progress", progress);
		}

		value = optionCallback(promise, "promise");
		if (isBoolean(value)) {
			this.promise = value;
		} else {
			warnIfNotUndefined("promise", promise);
		}

		value = optionCallback(promiseRejectEmpty, "promiseRejectEmpty");
		if (isBoolean(value)) {
			this.promiseRejectEmpty = value;
		} else {
			warnIfNotUndefined("promiseRejectEmpty", promiseRejectEmpty);
		}

		value = optionCallback(queue, "queue");
		if (isString(value) || isBoolean(value)) {
			this.queue = value === true ? "" : value;
		} else {
			warnIfNotUndefined("queue", queue);
		}

		value = optionCallback(repeat, "repeat");
		if ((isInteger(value) && value >= 0) || isBoolean(value)) {
			this.repeat = value || 0;
		} else {
			warnIfNotUndefined("repeat", repeat);
		}

		value = optionCallback(speed, "speed");
		if (isNumber(value)) {
			this.speed = value;
		} else {
			warnIfNotUndefined("speed", speed);
		}

		value = optionCallback(stagger, "stagger");
		if (isNumber(value) || value === undefined) {
			this.stagger = value;
		} else {
			warnIfNotUndefined("stagger", stagger);
		}

		value = optionCallback(sync, "sync");
		if (isBoolean(value)) {
			this.sync = value;
		} else {
			warnIfNotUndefined("sync", sync);
		}
	}

	// All of these have a `!` suffix due to the prototype inheritance!
	backwards!: boolean;
	begin!: IOptions["begin"];
	cache!: boolean;
	complete!: IOptions["complete"];
	delay!: number;
	drag!: boolean;
	duration!: number;
	easing!: EasingFn;
	fpsLimit!: number;
	loop!: true | number;
	minFrameTime!: number;
	progress!: IOptions["progress"];
	promise!: boolean;
	promiseRejectEmpty!: boolean;
	queue!: false | string;
	repeat!: true | number;
	speed!: number;
	stagger?: number;
	sync!: boolean;
}
