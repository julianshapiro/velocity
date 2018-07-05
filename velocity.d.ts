/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity typings.
 */

/**************
 * Interfaces *
 **************/

/**
 * A single animation for a single element. This extends the strict options (ie,
 * after processing) to allow per-element options. Anything that is shared
 * between all elements in an animation will be under the `options` member.
 */
export interface AnimationCall extends StrictVelocityOptions {
	/**
	 * Used to store the next AnimationCell in this list.
	 *
	 * @private
	 */
	_next?: AnimationCall;

	/**
	 * Used to store the previous AnimationCell in this list. Used to make
	 * removing items from the list significantly easier.
	 *
	 * @private
	 */
	_prev?: AnimationCall;

	/**
	 * A number of flags for use in tracking an animation.
	 */
	_flags: number;

	/**
	 * Properties to be tweened
	 */
	tweens?: {[property: string]: VelocityTween};

	/**
	 * The current value for the "tween" property, defaults to a percentage if
	 * not used.
	 */
	tween?: string;

	/**
	 * The element this specific animation is for. If there is more than one in
	 * the elements list then this will be duplicated when it is pulled off a
	 * queue.
	 */
	element?: HTMLorSVGElement;

	/**
	 * The list of elements associated with this specific animation.
	 * TODO: This should be removed so we're not trying to lock an element.
	 * Without this entry, any removed elements will simply not exist in Data
	 * (a WeakMap) and then can be removed from the list of animations.
	 * @deprecated
	 */
	elements?: VelocityResult;

	/**
	 * Shared options for the entire set of elements.
	 */
	options?: StrictVelocityOptions;

	/**
	 * The time this animation started according to whichever clock we are
	 * using.
	 */
	timeStart?: number;

	/**
	 * The time (in ms) that this animation has already run. Used with the
	 * duration and easing to provide the exact tween needed.
	 */
	ellapsedTime?: number;

	/**
	 * The percentage complete as a number 0 <= n <= 1
	 */
	percentComplete?: number;
}

/**
 * AnimationFlags are used internally. These are subject to change as they are
 * only valid for the internal state of the current version of Velocity.
 *
 * To get these values use the "option" action with a key of "isReady" etc. All
 * of these are gettable with the same pattern of keyname.
 *
 * @private
 */
export declare const enum AnimationFlags {
	/**
	 * When the tweens are expanded this is set to save future processing.
	 */
	EXPANDED = 1 << 0, // tslint:disable-line:no-bitwise

	/**
	 * Set once the animation is ready to start - after any delay (and possible
	 * pause).
	 */
	READY = 1 << 1, // tslint:disable-line:no-bitwise

	/**
	 * Set once the animation has started.
	 */
	STARTED = 1 << 2, // tslint:disable-line:no-bitwise

	/**
	 * Set when an animation is manually stopped.
	 */
	STOPPED = 1 << 3, // tslint:disable-line:no-bitwise

	/**
	 * The pause state of this animation. If true it is paused, if false it was
	 * paused and needs to be resumed, and if undefined / null then not either.
	 */
	PAUSED = 1 << 4, // tslint:disable-line:no-bitwise

	/**
	 * Set when the animation is a sync animation.
	 */
	SYNC = 1 << 5, // tslint:disable-line:no-bitwise

	/**
	 * When the animation is running in reverse, such as for a loop.
	 */
	REVERSE = 1 << 6, // tslint:disable-line:no-bitwise
}

/**
 * Global per-Element data. This is persistent between animations, and freed
 * when the garbage collector removes the Element because it is no longer being
 * used.
 */
export interface ElementData {
	/**
	 * A generated enum of types of this element, used for Normalizations.
	 */
	types: number;

	/**
	 * A local cache of the current style values we're using, this is 80x faster
	 * than <code>element.style</code> access.
	 *
	 * Empty strings are set to null to get the value from getComputedStyle
	 * instead. If getComputedStyle returns an empty string then that is saved.
	 */
	cache: Properties<string>;

	/**
	 * A cached copy of getComputedStyle, this is 50% the speed of
	 * <code>element.style</code> access.
	 */
	computedStyle?: CSSStyleDeclaration;

	/**
	 * Changed as animations start and finish on an element. This allows us to
	 * keep track of exactly how many are running at a given time.
	 */
	count: number;

	/**
	 * Animations to be run for each queue. The animations are linked lists,
	 * but treated as a FIFO queue (new ones are added to the end). When the
	 * queue is empty (but still running) the key will still exist with a value
	 * of "null". When the queue is empty and the next entry is pulled from it
	 * then it will be set to "undefined".
	 *
	 * The default queue is an empty string - ""
	 */
	queueList: {[name: string]: AnimationCall};

	/**
	 * Last properties tweened per each queue. Used for both "reverse" and
	 * "repeat" methods.
	 */
	lastAnimationList: {[name: string]: AnimationCall};

	/**
	 * The time the last animation on an element finished. This is used for
	 * starting a new animation and making sure it follows directly if possible,
	 * otherwise it will start as if one frame in already.
	 */
	lastFinishList: {[name: string]: number};

	/**
	 * The window used for this element.
	 */
	window: Window;
}

/**
 * Internal Sequence property value.
 */
export interface Sequence extends ReadonlyArray<TweenStep> {
	/**
	 * Pattern to use for tweening.
	 */
	pattern: ReadonlyArray<string | boolean>;

	/**
	 * Step value.
	 */
	[index: number]: TweenStep;
}

export interface SequenceList {
	duration: number;
	tweens: Properties<Sequence>;
}

/**
 * After correcting the options so they are usable internally, they will be of
 * this type. The base VelocityOptions includes human readable and shortcuts,
 * which this doesn't.
 */
export interface StrictVelocityOptions extends VelocityOptions, VelocityPromise {
	/**
	 * Begin handler. Only the first element to check this callback gets to use
	 * it. Cleared after calling
	 *
	 * @private
	 */
	begin?: VelocityCallbackFn;

	/**
	 * Complete handler (only the last element in a set gets this)
	 *
	 * @private
	 */
	complete?: VelocityCallbackFn;

	/**
	 * The amount of delay before this animation can start doing anything.
	 */
	delay?: number;

	/**
	 * The length of time this animation will run for.
	 */
	duration?: number;

	/**
	 * Easing for this animation while running.
	 */
	easing?: VelocityEasingFn;

	/**
	 * Loop, calls 2n-1 times reversing it each iteration
	 */
	loop?: true | number;

	/**
	 * TODO: Remove this so it's a normal property
	 */
	mobileHA?: boolean;

	/**
	 * Progress handler (only the last element in a set gets this)
	 *
	 * @private
	 */
	progress?: VelocityProgressFn;

	/**
	 * Queue
	 */
	queue?: false | string;

	/**
	 * Repeat this number of times. If looped then each iteration of the loop
	 * is actually repeated this number of times.
	 */
	repeat?: true | number;

	/**
	 * This is a cache of the repeat value. When looping and repeating work
	 * together, the repeat is looped, so it needs to remember how many repeats
	 * to perform for each loop.
	 */
	repeatAgain?: true | number;

	/**
	 * The first AnimationCall to get this - used for the progress callback.
	 *
	 * @private
	 */
	_first?: AnimationCall;

	/**
	 * The total number of AnimationCalls that are pointing at this.
	 *
	 * @private
	 */
	_total?: number;

	/**
	 * The number of AnimationCalls that are ready to start.
	 *
	 * @private
	 */
	_ready?: number;

	/**
	 * The number of AnimationCalls that have started.
	 *
	 * @private
	 */
	_started?: number;

	/**
	 * The number of AnimationCalls that have finished.
	 *
	 * @private
	 */
	_completed?: number;
}

/**
 * Internal list of values for a single Sequence data point.
 */
export interface TweenStep extends ReadonlyArray<string | number> {
	/**
	 * Percent of animation.
	 */
	percent?: number;

	/**
	 * Easing function.
	 */
	easing?: VelocityEasingFn | null;

	/**
	 * Values to tween and insert into pattern.
	 */
	[index: number]: string | number;
}

/**
 * Direct Velocity access.
 */
export interface Velocity<T = VelocityElements> {
	/**
	 * Available to be able to check what version you're running against.
	 */
	readonly version: string;

	/**
	 * Velocity option defaults, which can be overriden by the user.
	 */
	readonly defaults: VelocityOptions & {
		/**
		 * Provided in order to reset Velocity defaults back to their initial
		 * state.
		 */
		readonly reset: () => void;
	};

	/**
	 * Current internal state of Velocity.
	 */
	readonly State: VelocityState;

	/**
	 * Actions cannot be replaced if they are internal (hasOwnProperty is false
	 * but they still exist). Otherwise they can be replaced by users.
	 *
	 * All external method calls should be using actions rather than sub-calls
	 * of Velocity itself.
	 */
	readonly Actions: {[name: string]: VelocityActionFn};

	/**
	 * Our known easing functions.
	 */
	readonly Easings: {[name: string]: VelocityEasingFn};

	/**
	 * The currently registered sequences.
	 */
	readonly Sequences: {[name: string]: SequenceList};

	/**
	 * Used to patch any object to allow Velocity chaining. In order to chain an
	 * object must either be treatable as an array - with a <code>.length</code>
	 * property, and each member a Node, or a Node directly.
	 *
	 * By default Velocity will try to patch <code>window</code>,
	 * <code>jQuery</code>, <code>Zepto</code>, and several classes that return
	 * Nodes or lists of Nodes.
	 */
	patch(proto: any, global?: boolean): void;

	/**
	 * Set to true, 1 or 2 (most verbose) to output debug info to console.
	 */
	debug: boolean | 1 | 2;

	/**
	 * In mock mode, all animations are forced to complete immediately upon the
	 * next rAF tick. If there are further animations queued then they will each
	 * take one single frame in turn. Loops and repeats will be disabled while
	 * <code>mock = true</code>.
	 */
	mock: boolean;

	/********************
	 * Calling Velocity *
	 ********************/

	/**
	 * Finish the running animations on the elements selected.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param queue The queue to finish.
	 * @param finishAll Should this stop all queued animations too?
	 */
	(elements: T, action: "finish", queue?: string | false, finishAll?: true): VelocityResult;

	/**
	 * Finish the running animations on the elements selected.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param finishAll Should this stop all queued animations too?
	 */
	(elements: T, action: "finish", finishAll?: true): VelocityResult;

	/**
	 * Finish the running animations on this VelocityResult or on the elements
	 * selected.
	 *
	 * @param queue The queue to finish.
	 * @param finishAll Should this stop all queued animations too?
	 */
	(this: T, action: "finish", queue?: string | false, finishAll?: true): VelocityResult;

	/**
	 * Finish the running animations on this VelocityResult or on the elements
	 * selected.
	 *
	 * @param finishAll Should this stop all queued animations too?
	 */
	(this: T, action: "finish", finishAll?: true): VelocityResult;

	/**
	 * Finish any running animations.
	 *
	 * @param queue The queue to finish.
	 * @param finishAll Should this stop all queued animations too?
	 */
	(action: "finish", queue?: string | false, finishAll?: true): VelocityResult;

	/**
	 * Finish any running animations.
	 *
	 * @param finishAll Should this stop all queued animations too?
	 */
	(action: "finish", finishAll?: true): VelocityResult;

	/**
	 * Check if there is a normalisation handler for the named type of `Element`
	 * and the named property.
	 */
	(this: T, action: "hasNormalization", constructor: {new: () => Element} | string, name: string): boolean;

	/**
	 * Set the value of an option on a running animation. This performs some
	 * validation on the named option as only some are available to set at
	 * runtime.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param option The name of the option to get.
	 * @param value The value to set it to.
	 */
	(elements: T, action: "option", option: string, value: any): VelocityResult;

	/**
	 * Get the value of an option on a running animation.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param option The name of the option to get.
	 */
	(elements: T, action: "option", option: string): any;

	/**
	 * Set the value of an option on a running animation. This performs some
	 * validation on the named option as only some are available to set at
	 * runtime.
	 *
	 * @param option The name of the option to get.
	 * @param value The value to set it to.
	 */
	(this: T, action: "option", option: string, value: any): VelocityResult;

	/**
	 * Get the value of an option on a running animation.
	 *
	 * @param option The name of the option to get.
	 */
	(this: T, action: "option", option: string): any;

	/**
	 * Pause a currently running animation.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param queue The name of the queue to pause on it.
	 */
	(elements: T, action: "pause", queue?: string): VelocityResult;

	/**
	 * Pause a currently running animation.
	 *
	 * @param queue The name of the queue to pause on it.
	 */
	(this: T, action: "pause", queue?: string): VelocityResult;

	/**
	 * Pause all currently running animations.
	 *
	 * @param queue The name of the queue to pause on them.
	 */
	(action: "pause", queue?: string): VelocityResult;

	/**
	 * Resume a currently paused animation.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param queue The name of the queue to resume on it.
	 */
	(elements: T, action: "resume", queue?: string): VelocityResult;

	/**
	 * Resume a currently paused animation.
	 *
	 * @param queue The name of the queue to resume on it.
	 */
	(this: T, action: "resume", queue?: string): VelocityResult;

	/**
	 * Resume all currently paused animations.
	 *
	 * @param queue The name of the queue to resume on them.
	 */
	(action: "resume", queue?: string): VelocityResult;

	/**
	 * Register a new easing handler.
	 *
	 * @param name The name of the easing to add.
	 * @param easing The function to call when this easing is used.
	 */
	(action: "registerEasing", name: string, easing: VelocityEasingFn): void;

	/**
	 * Register a new normalization handler. This is the interface between
	 * Velocity and the actual properties, so is responsible for reading and
	 * writing any values on the `Element`.
	 *
	 * @param constructor The type of `Element`. If using ia string it will work
	 * across iframe boundaries.
	 * @param name The name of the property to provide.
	 * @param normalization The function to call whenever this property is
	 * accessed.
	 * @param unit An optional unit string to add to any numeric values passed.
	 * @param cache Set to false to prevent this property from being cached.
	 */
	(action: "registerNormalization", constructor: {new: () => Element} | string, name: string, normalization: VelocityNormalizationsFn, unit?: string, cache?: boolean): void;

	/**
	 * Register a new normalization handler. This is the interface between
	 * Velocity and the actual properties, so is responsible for reading and
	 * writing any values on the `Element`.
	 *
	 * @param constructor The type of `Element`. If using ia string it will work
	 * across iframe boundaries.
	 * @param name The name of the property to provide.
	 * @param normalization The function to call whenever this property is
	 * accessed.
	 * @param cache Set to false to prevent this property from being cached.
	 */
	(action: "registerNormalization", constructor: {new: () => Element} | string, name: string, normalization: VelocityNormalizationsFn, cache?: boolean): void;

	/**
	 * Register a named animation sequence to be used elsewhere.
	 *
	 * @param name The sequence name.
	 * @param sequence The animation steps to perform.
	 */
	(action: "registerSequence", name: string, sequence: VelocitySequence): void;

	/**
	 * Register a named animation sequence to be used elsewhere.
	 *
	 * @param sequences Multiple named sequences to add.
	 */
	(action: "registerSequence", sequences: {[name: string]: VelocitySequence}): void;

	/**
	 * Reverse the most recent animations on the supplied elements.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 */
	(elements: T, action: "reverse", complete?: () => void): VelocityResult;

	/**
	 * Reverse the most recent animations on the supplied elements.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param duration How long the animation should run in ms.
	 * @param complete A function to call when finished.
	 */
	(elements: T, action: "reverse", duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;

	/**
	 * Reverse the most recent animations on the supplied elements.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param duration How long the animation should run in ms.
	 * @param easing The default easing to apply.
	 * @param complete A function to call when finished.
	 */
	(elements: T, action: "reverse", duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;

	/**
	 * Reverse the most recent animations on the supplied elements.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param easing The default easing to apply.
	 * @param complete A function to call when finished.
	 */
	(elements: T, action: "reverse", easing?: string | number[], complete?: () => void): VelocityResult;

	/**
	 * Reverse the most recent animations on the supplied elements.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param options The options to apply.
	 */
	(elements: T, action: "reverse", options?: VelocityOptions): VelocityResult;

	/**
	 * Stop without finishing the running animations on this VelocityResult or
	 * on the elements selected.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param queue The queue to stop.
	 * @param stopAll Should this stop all queued animations too?
	 */
	(elements: T, action: "stop", queue?: string | false, stopAll?: true): VelocityResult;

	/**
	 * Stop without finishing the running animations on this VelocityResult or
	 * on the elements selected.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param stopAll Should this stop all queued animations too?
	 */
	(elements: T, action: "stop", stopAll?: true): VelocityResult;

	/**
	 * Stop without finishing the running animations on this VelocityResult or
	 * on the elements selected.
	 *
	 * @param queue The queue to stop.
	 * @param stopAll Should this stop all queued animations too?
	 */
	(this: T, action: "stop", queue?: string | false, stopAll?: true): VelocityResult;

	/**
	 * Stop without finishing the running animations on this VelocityResult or
	 * on the elements selected.
	 *
	 * @param stopAll Should this stop all queued animations too?
	 */
	(this: T, action: "stop", stopAll?: true): VelocityResult;

	/**
	 * Get or set the value for a property that Velocity understands how to
	 * access.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param property The name of the property to access.
	 */
	(elements: HTMLorSVGElement, action: "style" | "property", property: string): string;

	/**
	 * Get or set the value for a property that Velocity understands how to
	 * access.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param property The name of the property to access, or an object with
	 * `name: value` pairs for setting.
	 */
	(elements: HTMLorSVGElement, action: "style" | "property", property: string[]): {[property: string]: string}[] | {[property: string]: string};

	/**
	 * Get or set the value for a property that Velocity understands how to
	 * access.
	 *
	 * @param property The name of the property to access.
	 */
	(this: T, action: "style" | "property", property: string): string | string[];

	/**
	 * Get or set the value for a property that Velocity understands how to
	 * access.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param property The name of the property to access.
	 */
	(elements: T, action: "style" | "property", property: string): string[];

	/**
	 * Get or set the value for a property that Velocity understands how to
	 * access.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param property The name of the property to access, or an object with
	 * `name: value` pairs for setting.
	 */
	(elements: T, action: "style" | "property", property: string[]): {[property: string]: string}[] | {[property: string]: string}[];

	/**
	 * Get or set the value for a property that Velocity understands how to
	 * access.
	 *
	 * @param property The name of the property to access.
	 * @param value The value to set the property to.
	 */
	(this: T, action: "style" | "property", property: string, value: string): VelocityResult;

	/**
	 * Get or set the value for a property that Velocity understands how to
	 * access.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param property The name of the property to access.
	 * @param value The value to set the property to.
	 */
	(elements: T, action: "style" | "property", property: string, value: string): VelocityResult;

	/**
	 * Get or set the value for a property that Velocity understands how to
	 * access.
	 *
	 * @param property An object with `name: value` pairs for setting.
	 */
	(this: T, action: "style" | "property", property: {[property: string]: string}): VelocityResult;

	/**
	 * Get or set the value for a property that Velocity understands how to
	 * access.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param property An object with `name: value` pairs for setting.
	 */
	(elements: T, action: "style" | "property", property: {[property: string]: string}): VelocityResult;

	/**
	 * Get the tween value for one or more elements using an animation at a
	 * specific percentage complete. This does not animate the elements, just
	 * obtains the values based on the current properties.
	 *
	 * @param percentComplete What specific percentage is needed (0 <= x <= 1)
	 * @param property The property to animate.
	 * @param value The end value or forcefed value.
	 * @param easing The easing to use.
	 */
	(this: T, action: "tween", percentComplete: number, property: string, value: VelocityPropertyValue, easing?: VelocityEasingType): string;

	/**
	 * Get the tween value for one or more elements using an animation at a
	 * specific percentage complete. This does not animate the elements, just
	 * obtains the values based on the current properties.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param percentComplete What specific percentage is needed (0 <= x <= 1)
	 * @param property The property to animate.
	 * @param value The end value or forcefed value.
	 * @param easing The easing to use.
	 */
	(elements: T, action: "tween", percentComplete: number, property: string, value: VelocityPropertyValue, easing?: VelocityEasingType): string;

	/**
	 * Get the tween value for one or more elements using an animation at a
	 * specific percentage complete. This does not animate the elements, just
	 * obtains the values based on the current properties.
	 *
	 * @param percentComplete What specific percentage is needed (0 <= x <= 1)
	 * @param propertyMap The `key: value` property map to animate to.
	 * @param easing The easing to use.
	 */
	(this: T, action: "tween", percentComplete: number, propertyMap: Properties<VelocityProperty>, easing?: VelocityEasingType): Properties<string>;

	/**
	 * Get the tween value for one or more elements using an animation at a
	 * specific percentage complete. This does not animate the elements, just
	 * obtains the values based on the current properties.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param percentComplete What specific percentage is needed (0 <= x <= 1)
	 * @param propertyMap The `key: value` property map to animate to.
	 * @param easing The easing to use.
	 */
	(elements: T, action: "tween", percentComplete: number, propertyMap: Properties<VelocityProperty>, easing?: VelocityEasingType): Properties<string>;

	/**
	 * Get the tween value for one or more elements using an animation at a
	 * specific percentage complete. This does not animate the elements, just
	 * obtains the values based on the current properties.
	 *
	 * When called on Velocity directly without any supplied elements, then the
	 * values will be based on the `document.body` element. This can be useful
	 * for simply finding the value for a forcefed animation.
	 *
	 * @param percentComplete What specific percentage is needed (0 <= x <= 1)
	 * @param property The property to animate.
	 * @param value The end value or forcefed value.
	 * @param easing The easing to use.
	 */
	(action: "tween", percentComplete: number, property: string, value: VelocityPropertyValue, easing?: VelocityEasingType): string;

	/**
	 * Get the tween value for one or more elements using an animation at a
	 * specific percentage complete. This does not animate the elements, just
	 * obtains the values based on the current properties.
	 *
	 * When called on Velocity directly without any supplied elements, then the
	 * values will be based on the `document.body` element. This can be useful
	 * for simply finding the value for a forcefed animation.
	 *
	 * @param percentComplete What specific percentage is needed (0 <= x <= 1)
	 * @param propertyMap The `key: value` property map to animate to.
	 * @param easing The easing to use.
	 */
	(action: "tween", percentComplete: number, propertyMap: Properties<VelocityProperty>, easing?: VelocityEasingType): Properties<string>;

	/**
	 * Call Velocity with a single object containing all the necessary options.
	 *
	 * @param options An object containing the `elements`, `options`, and
	 * `properties` to use.
	 */
	(options: VelocityObjectArgs): VelocityResult;

	/**
	 * Call velocity on one or more elements.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param propertyMap The `key: value` property map to animate to, or a
	 * named sequence to use.
	 * @param options The options to apply to the animation. This overrides the
	 * default and any supplied in a sequence.
	 */
	(elements: T, propertyMap: string | Properties<VelocityProperty>, options?: VelocityOptions): VelocityResult;

	/**
	 * Call velocity on one or more elements.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param propertyMap The `key: value` property map to animate to, or a
	 * named sequence to use.
	 * @param duration The length of time to run animation in ms (1000/s).
	 * @param complete A function to call when the animation is finished.
	 */
	(elements: T, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;

	/**
	 * Call velocity on one or more elements.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param propertyMap The `key: value` property map to animate to, or a
	 * named sequence to use.
	 * @param complete A function to call when the animation is finished.
	 */
	(elements: T, propertyMap: string | Properties<VelocityProperty>, complete?: () => void): VelocityResult;

	/**
	 * Call velocity on one or more elements.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param propertyMap The `key: value` property map to animate to, or a
	 * named sequence to use.
	 * @param easing The easing to use for this animation.
	 * @param complete A function to call when the animation is finished.
	 */
	(elements: T, propertyMap: string | Properties<VelocityProperty>, easing?: string | number[], complete?: () => void): VelocityResult;

	/**
	 * Call velocity on one or more elements.
	 *
	 * @param elements An `Element`, or an array-like list of `Elements` to
	 * process.
	 * @param propertyMap The `key: value` property map to animate to, or a
	 * named sequence to use.
	 * @param duration The length of time to run animation in ms (1000/s).
	 * @param easing The easing to use for this animation.
	 * @param complete A function to call when the animation is finished.
	 */
	(elements: T, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;

	/**
	 * Call velocity on one or more elements.
	 *
	 * @param propertyMap The `key: value` property map to animate to, or a
	 * named sequence to use.
	 * @param options The options to apply to the animation. This overrides the
	 * default and any supplied in a sequence.
	 */
	(this: T, propertyMap: string | Properties<VelocityProperty>, options?: VelocityOptions): VelocityResult;

	/**
	 * Call velocity on one or more elements.
	 *
	 * @param propertyMap The `key: value` property map to animate to, or a
	 * named sequence to use.
	 * @param duration The length of time to run animation in ms (1000/s).
	 * @param complete A function to call when the animation is finished.
	 */
	(this: T, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;

	/**
	 * Call velocity on one or more elements.
	 *
	 * @param propertyMap The `key: value` property map to animate to, or a
	 * named sequence to use.
	 * @param complete A function to call when the animation is finished.
	 */
	(this: T, propertyMap: string | Properties<VelocityProperty>, complete?: () => void): VelocityResult;

	/**
	 * Call velocity on one or more elements.
	 *
	 * @param propertyMap The `key: value` property map to animate to, or a
	 * named sequence to use.
	 * @param easing The easing to use for this animation.
	 * @param complete A function to call when the animation is finished.
	 */
	(this: T, propertyMap: string | Properties<VelocityProperty>, easing?: string | number[], complete?: () => void): VelocityResult;

	/**
	 * Call velocity on one or more elements.
	 *
	 * @param propertyMap The `key: value` property map to animate to, or a
	 * named sequence to use.
	 * @param duration The length of time to run animation in ms (1000/s).
	 * @param easing The easing to use for this animation.
	 * @param complete A function to call when the animation is finished.
	 */
	(this: T, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;
}

/**
 * Add any easings to this interface to have them picked up by the Easings type.
 */
export interface VelocityEasings {
	"at-end": true;
	"at-start": true;
	"during": true;
	"ease": true;
	"ease-in": true;
	"ease-in-out": true;
	"ease-out": true;
	"easeIn": true;
	"easeInBack": true;
	"easeInBounce": true;
	"easeInCirc": true;
	"easeInCubic": true;
	"easeInElastic": true;
	"easeInExpo": true;
	"easeInOut": true;
	"easeInOutBack": true;
	"easeInOutBounce": true;
	"easeInOutCirc": true;
	"easeInOutCubic": true;
	"easeInOutElastic": true;
	"easeInOutExpo": true;
	"easeInOutQuad": true;
	"easeInOutQuart": true;
	"easeInOutQuint": true;
	"easeInOutSine": true;
	"easeInQuad": true;
	"easeInQuart": true;
	"easeInQuint": true;
	"easeInSine": true;
	"easeOut": true;
	"easeOutBack": true;
	"easeOutBounce": true;
	"easeOutCirc": true;
	"easeOutCubic": true;
	"easeOutElastic": true;
	"easeOutExpo": true;
	"easeOutQuad": true;
	"easeOutQuart": true;
	"easeOutQuint": true;
	"easeOutSine": true;
	"linear": true;
	"spring": true;
	"swing": true;
}

/**
 * Chaining Velocity calls from various sources.
 */
export interface VelocityExtended<T> {
	/**
	 * This is the Velocity chaining method. It is functionally equivalent to
	 * the normal Velocity call, but allows chaining on the elements it is
	 * attached to.
	 */
	readonly velocity: Velocity<T>;
}

/**
 * This is used for CoffeeScript shortcuts apparently. Kept for legacy reasons.
 *
 * TODO: I don't like having two of these - need to merge into a type or similar
 */
export interface VelocityObjectArgs {
	elements?: HTMLorSVGElement[];
	properties?: Properties<VelocityProperty>;
	options?: VelocityOptions;
	e?: HTMLorSVGElement[];
	p?: Properties<VelocityProperty>;
	o?: VelocityOptions;
}

/**
 * Options passed to a new Velocity animation. These are validated and copied
 * into a StrictVelocityOptions object.
 */
export interface VelocityOptions {
	backwards?: boolean;

	/**
	 * Begin handler. Only the first element to check this callback gets to use
	 * it.
	 *
	 * default: undefined
	 */
	begin?: VelocityCallbackFn;

	/**
	 * Complete handler (only the last element in a set gets this).
	 *
	 * default: undefined
	 */
	complete?: VelocityCallbackFn;

	/**
	 * How long the animation should delay after becoming active and before it
	 * actually starts to animate. This is a millisecond timer, but
	 * can handle some string values.
	 * <code>"fast"</code> = 200ms
	 * <code>"normal"</code> = 400ms
	 * <code>"slow"</code> = 600ms
	 * NOTE: If passing a negative number then this will allow you to start with
	 * the animation partially complete from the start.
	 *
	 * default 0
	 */
	delay?: "fast" | "normal" | "slow" | number;

	/**
	 * Reduce the duration of each successive element so they drag into final
	 * state. The first quarter of the elements will get a reduced duration (ie.
	 * they will finish faster) in a smooth way.
	 */
	drag?: boolean;

	/**
	 * How long the animation should run for. This is a millisecond timer, but
	 * can handle some string values.
	 * <code>"fast"</code> = 200ms
	 * <code>"normal"</code> = 400ms (default)
	 * <code>"slow"</code> = 600ms
	 *
	 * default 400
	 */
	duration?: "fast" | "normal" | "slow" | number;

	/**
	 * Easing is the rate of change over time for an animation. A linear easing
	 * would simply be 1% of the time to 1% of the animation. This allows you
	 * to specify how that rate of change should be. There are various named
	 * easings, but you can also supply your own.
	 *
	 * TODO: Copy more of the original description
	 *
	 * default "swing"
	 */
	easing?: VelocityEasingType;

	/**
	 * Maximum number of frames to render on each second for all animations
	 *
	 * default 60
	 */
	fpsLimit?: number;

	/**
	 * How many times should this option loop. A loop is defined as a "return to
	 * start values", so it will run, then reverse. This counts as a single
	 * loop. Setting <code>loop:4</code> will cause the animation to take the
	 * same time as <code>4n+1</code> iterations.
	 *
	 * default 0
	 */
	loop?: boolean | number;

	/**
	 * The minimum frame time to achieve, the value is calculated based on fpsLimit
	 *
	 * default 16.33333333 (1000ms / 60fps)
	 */
	minFrameTime?: number;

	/**
	 * Not currently implemented.
	 *
	 * @deprecated
	 */
	mobileHA?: boolean;

	/**
	 * Progress handler (only the last element in a set gets this)
	 *
	 * default: undefined
	 */
	progress?: VelocityProgressFn;

	/**
	 * If this should return a Promise with everything else. If promises are not
	 * required at all, then simply setting it globally will turn them off.
	 *
	 * default true
	 */
	promise?: boolean;

	/**
	 * If promises are turned on, then the promise can reject if there are no
	 * elements supplied (an empty array is still valid).
	 *
	 * default false
	 */
	promiseRejectEmpty?: boolean;

	/**
	 * The name of the queue to use. If this is set to <code>false</code> then
	 * it will be added immediately ignoring any other queues running. Queues
	 * start playing automatically (unlike jQuery, this doesn't need a queue to
	 * be manually started).
	 *
	 * default ""
	 */
	queue?: false | string;

	/**
	 * How many times should this animation repeat. A repeat will restart at
	 * initial values and animate once. This is most useful for rotating
	 * animations where <code>0deg === 360deg</code>. If you are after a more
	 * "bounce" effect then look at <code>loop</code>.
	 *
	 * default 0
	 */
	repeat?: boolean | number;

	/**
	 * The speed to play the animation back at. This number can change while
	 * running, in order to vary the playback rate.
	 *
	 * default 0
	 */
	speed?: number;

	/**
	 * Supply a delay in ms, and every element in the animation will get this
	 * delay multiplied by its index added to it.
	 */
	stagger?: number | VelocityOptionFn<number>;

	/**
	 * When adding animations to elements each element has its own queue of
	 * pending animations. This ensures that when adding a single animation to
	 * multiple elements, they all begin at the same time.
	 *
	 * default true
	 */
	sync?: boolean;

	/**
	 * Should the cache be used for the tweens. Turning this off can improve
	 * memory usage slightly, but will also make things slower when creating
	 * animations.
	 *
	 * @private
	 * default true
	 */
	cache?: boolean;
}

/**
 * Used internally for storing the Promise if used.
 */
export interface VelocityPromise {
	/**
	 * A saved copy of the Promise.
	 *
	 * @private
	 */
	_promise?: Promise<VelocityResult>;

	/**
	 * This method is called at most once to signify that the animation has
	 * completed. Currently a loop:true animation will never complete. This
	 * allows .then(fn) to run (see Promise support).
	 *
	 * @private
	 */
	_resolver?: (value?: (VelocityResult) | PromiseLike<VelocityResult>) => void;

	/**
	 * This method is called at most once to signify that the animation has
	 * completed. Currently a loop:true animation will never complete. This
	 * allows .then(fn) to run (see Promise support).
	 *
	 * @private
	 */
	_rejecter?: (reason?: any) => void;
}

/**
 * The return type of any velocity call. If this is called via a "utility"
 * function (such a jQuery <code>$(elements).velocity(...)</code>) then it will
 * be based on the array-like list of elements supplied, otherwise it will
 * create a plain array. The extra values for Promises and Velocity are inserted
 * into the array in such a way as to not interfere with other methods unless
 * they are specifically overwriting them.
 */
export interface VelocityResult<T = HTMLorSVGElement> extends Array<T>, Partial<Promise<T[] & VelocityResult<T>>> {
	/**
	 * This is the actual Promise used by Velocity. If using Promise.all() or
	 * similar methods then you may need to use this instead of the Velocity
	 * result itself.
	 */
	readonly promise?: Promise<T[] & VelocityResult<T>>;

	/**
	 * This is the Velocity chaining method. It is functionally equivalent to
	 * the normal Velocity call, but allows chaining on the elements it is
	 * attached to.
	 */
	readonly velocity?: Velocity & {
		/**
		 * These are the animation objects attached to this specific chain. This
		 * is used in some actions to allow the call to only touch the specific
		 * animations called rather than just the animations on the linked
		 * elements.
		 *
		 * TODO: Decide if this should be public
		 * @private
		 */
		readonly animations?: AnimationCall[];
	};
}

/**
 * Container for page-wide Velocity state data.
 */
export interface VelocityState {
	/**
	 * Detect if this is a NodeJS or web browser
	 */
	readonly isClient: boolean;

	/**
	 * Detect mobile devices to determine if mobileHA should be turned
	 * on.
	 */
	readonly isMobile: boolean;

	/**
	 * The mobileHA option's behavior changes on older Android devices
	 * (Gingerbread, versions 2.3.3-2.3.7).
	 */
	readonly isGingerbread: boolean;

	/**
	 * Create a cached element for re-use when checking for CSS property
	 * prefixes.
	 */
	readonly prefixElement?: HTMLDivElement;

	/**
	 * Retrieve the appropriate scroll anchor and property name for the
	 * browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY
	 */
	readonly windowScrollAnchor: boolean;

	/**
	 * Cache the anchor used for animating window scrolling.
	 */
	readonly scrollAnchor: Window | HTMLElement | Node | boolean;

	/**
	 * Cache the browser-specific property names associated with the
	 * scroll anchor.
	 */
	readonly scrollPropertyLeft: string;

	/**
	 * Cache the browser-specific property names associated with the
	 * scroll anchor.
	 */
	readonly scrollPropertyTop: string;

	/**
	 * The className we add / remove when animating.
	 */
	readonly className: string;

	/**
	 * Keep track of whether our RAF tick is running.
	 *
	 * @private
	 */
	isTicking: boolean;

	/**
	 * Container for every in-progress call to Velocity.
	 *
	 * @private
	 */
	first?: AnimationCall;

	/**
	 * Container for every in-progress call to Velocity.
	 *
	 * @private
	 */
	last?: AnimationCall;

	/**
	 * First new animation - to shortcut starting them all up and push
	 * any css reads to the start of the tick.
	 *
	 * @private
	 */
	firstNew?: AnimationCall;
}

/**
 * Internal Sequence per property.
 */
export interface VelocityTween {
	/**
	 * Normalization function - cached at animation creation time.
	 */
	fn: VelocityNormalizationsFn;

	/**
	 * Sequence to use for tweening (excludes pattern).
	 */
	sequence?: Sequence;

	/**
	 * Easing function to use for entire tween.
	 */
	easing?: VelocityEasingFn;

	/**
	 * Start value.
	 */
	start?: string;

	/**
	 * End value.
	 */
	end?: string;
}

/*********
 * Types *
 *********/

/**
 * Velocity can run on both HTML and SVG elements.
 */
export type HTMLorSVGElement = HTMLElement | SVGElement;

/**
 * The properties that are permitted to be animated.
 * TODO: Add SVG and "Tween" properties. Should (can?) this get html / svg specifics later
 */
export type Properties<T> = {
	"clientHeight"?: T;
	"clientWidth"?: T;
	"innerHeight"?: T;
	"innerWidth"?: T;
	"outerHeight"?: T;
	"outerWidth"?: T;
	"scroll"?: T;
	"scrollHeight"?: T;
	"scrollLeft"?: T;
	"scrollTop"?: T;
	"scrollWidth"?: T;
	"tween"?: T;
} & {
		// "style" normalizations
		[property in keyof CSSStyleDeclaration]?: T;
	};

/**
 * Used for action callbacks. These are the commands such as `"pause"` and
 * `"stop"`
 *
 * @param args The arguments passed to Velocity when calling this action. They
 * start as the first argument passed after the name of the action.
 * @param elements Any elements this action is being called on. This may be
 * null, in which case it is being called without any.
 * @param promiseHandler The action should resolve or reject the promise as
 * needed.
 * @param action The name of the action before any dot (used for sub-actions).
 */
export type VelocityActionFn = (
	args?: any[],
	elements?: VelocityResult,
	promiseHandler?: VelocityPromise,
	action?: string) => any;

/**
 * A callback used for the `begin` or `complete` callbacks of an animation.
 *
 * @param elements The elements being animated.
 * @param activeCall The animation being performed.
 */
export type VelocityCallbackFn = (
	this: VelocityResult,
	elements?: VelocityResult,
	activeCall?: AnimationCall) => void;

/**
 * All easings must return the current value given the start and end values, and
 * a percentage complete. The property name is also passed in case that makes a
 * difference to how values are used.
 *
 * @param percentComplete Between 0 and 1 inclusive.
 * @param startValue The value at 0.
 * @param endValue The value at 1.
 * @param property The property name.
 */
export type VelocityEasingFn = (
	percentComplete: number,
	startValue: number,
	endValue: number,
	property?: string) => number;

/**
 * List of all easing types for easy code completion in TypeScript
 */
export type VelocityEasingType = VelocityEasingFn
	| keyof VelocityEasings
	| string // Need to leave in to prevent errors.
	| [number] | [number, number] | [number, number, number, number]
	| number[]; // Need to leave in to prevent errors.

/**
 * The various formats of Element argument for Velocity. Some libraries such as
 * jQuery and Zepto provide an array-like
 */
export type VelocityElements = HTMLorSVGElement | HTMLorSVGElement[];

/**
 * Used for normalization callbacks.
 *
 * @param element The element to be called on.
 * @param propertyValue The value to set. If <code>undefined</code> then this is
 * a get action and must return a string value for that element.
 *
 * @returns When getting a value it must return a string, otherwise the return
 * value is ignored.
 */
export type VelocityNormalizationsFn =
	((
		element: HTMLorSVGElement,
		propertyValue: string) => void)
	& ((
		element: HTMLorSVGElement) => string);

/**
 * A callback to allow us to generate an option value.
 */
export type VelocityOptionFn<T> = (
	this: HTMLorSVGElement,
	index?: number,
	total?: number,
	elements?: VelocityElements,
	option?: string) => T;

/**
 * A callback used for progress tracking.
 */
export type VelocityProgressFn = (
	this: VelocityResult,
	elements?: VelocityResult,
	percentComplete?: number,
	remaining?: number,
	tweenValue?: number,
	activeCall?: AnimationCall) => void;

/**
 * Shortcut property type for HTML Elements.
 */
export type VelocityProperties = Properties<VelocityProperty>;

/**
 * A property value can be a string or a number. If it is a number then it will
 * get the correct unit added to it depending on the property name if required.
 */
export type VelocityProperty = VelocityPropertyValue | VelocityPropertyFn;

/**
 * A callback to allow us to generate a property value for a property name.
 */
export type VelocityPropertyFn = (
	this: HTMLorSVGElement,
	index?: number,
	total?: number,
	elements?: VelocityElements) => VelocityPropertyValue;

/**
 * A property value can be a string or a number. If it is a number then it will
 * get the correct unit added to it depending on the property name if required.
 */
export type VelocityPropertyValue = number
	| string
	| [number | string]
	| [number | string, VelocityEasingType | number | string]
	| [number | string, VelocityEasingType, number | string];

/**
 * A callback to allow us to generate a property start / end value.
 */
export type VelocityPropertyValueFn = (
	this: HTMLorSVGElement,
	index?: number,
	total?: number,
	propertyName?: string) => number | string;

/**
 * Public Sequence definition.
 */
export type VelocitySequence = {
	duration?: number;
	easing?: VelocityEasingType;
	[percent: number]: Properties<VelocitySequenceProperty>;
} | {
	[percent: string]: Properties<VelocitySequenceProperty>;
}; // Needs to be like this to prevent warnings.

/**
 * Public property value for a Sequence.
 */
export type VelocitySequenceProperty = string | [string] | [string, VelocityEasingType];

/******************
 * Global extends *
 ******************/

declare global {
	/**
	 * Extend the return value from <code>document.querySelectorAll()</code>.
	 */
	export interface NodeListOf<TNode extends Node> extends VelocityExtended<NodeListOf<TNode>> {}

	/**
	 * Extend <code>Element</code> directly.
	 */
	export interface Element extends VelocityExtended<Element> {}

	/**
	 * Extend <code>Element</code> directly.
	 */
	export interface HTMLCollection extends VelocityExtended<Element> {}
}

/*****************
 * Global access *
 *****************/
export default Velocity;
export declare const Velocity: Velocity;
