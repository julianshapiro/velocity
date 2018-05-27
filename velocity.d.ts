/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity typings.
 */

/**
 * Used for action callbacks.
 */
export type VelocityActionFn = (args?: any[], elements?: VelocityResult, promiseHandler?: VelocityPromise, action?: string) => any;

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
	 * Used to store the next call with a Progress callback.
	 *
	 * @private
	 */
	_nextProgress?: AnimationCall;
	/**
	 * Used to store the next call with a Complete callback.
	 *
	 * @private
	 */
	_nextComplete?: AnimationCall;
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
	elements?: HTMLorSVGElement[];
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
 * All easings must return the current value given the start and end values, and
 * a percentage complete. The property name is also passed in case that makes a
 * difference to how values are used.
 */
export type VelocityEasingFn = (percentComplete: number, startValue: number, endValue: number, property?: string) => number;

/**
 * Used for normalization callbacks.
 *
 * @param element The element to be called on.
 *
 * @param propertyValue The value to set. If <code>undefined</code> then this is
 * a get action and must return a string value for that element.
 *
 * @returns When getting a value it must return a string, otherwise the return
 * value is ignored.
 */
export type VelocityNormalizationsFn = ((element: HTMLorSVGElement, propertyValue: string) => void) & ((element: HTMLorSVGElement) => string);

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
 * List of all easing types for easy code completion in TypeScript
 */
export type VelocityEasingType = VelocityEasingFn
	| keyof VelocityEasings
	| string // Need to leave in to prevent errors.
	| [number] | [number, number] | [number, number, number, number]
	| number[]; // Need to leave in to prevent errors.

/**
 * A property value can be a string or a number. If it is a number then it will
 * get the correct unit added to it depending on the property name if required.
 */
export type VelocityPropertyValue = number | string | [number | string] | [number | string, VelocityEasingType | number | string] | [number | string,
	VelocityEasingType, number | string];

/**
 * A callback to allow us to generate a property value for a property name.
 */
export type VelocityPropertyFn = (
	this: HTMLorSVGElement,
	index?: number,
	total?: number,
	elements?: VelocityElements) => VelocityPropertyValue;

/**
 * A callback to allow us to generate a property start / end value.
 */
export type VelocityPropertyValueFn = (
	this: HTMLorSVGElement,
	index?: number,
	total?: number) => number | string;

/**
 * A property value can be a string or a number. If it is a number then it will
 * get the correct unit added to it depending on the property name if required.
 */
export type VelocityProperty = VelocityPropertyValue | VelocityPropertyFn;

/**
 * Shortcut property type for HTML Elements.
 */
export type VelocityProperties = Properties<VelocityProperty>;

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
 * A callback used at the beginning or end of an animation.
 */
export type VelocityCallback = (
	this: VelocityExtended & HTMLorSVGElement[],
	elements?: VelocityExtended & HTMLorSVGElement[],
	activeCall?: AnimationCall) => void;

/**
 * A callback used for progress tracking.
 */
export type VelocityProgress = (
	this: VelocityExtended & HTMLorSVGElement[],
	elements?: VelocityExtended & HTMLorSVGElement[],
	percentComplete?: number,
	remaining?: number,
	tweenValue?: number,
	activeCall?: AnimationCall) => void;

/**
 * Used internally for storing the Promise if used.
 */
export interface VelocityPromise {
	/**
	 * A saved copy of the Promise.
	 *
	 * @private
	 */
	_promise?: Promise<HTMLorSVGElement[] & VelocityExtended>;
	/**
	 * This method is called at most once to signify that the animation has
	 * completed. Currently a loop:true animation will never complete. This
	 * allows .then(fn) to run (see Promise support).
	 *
	 * @private
	 */
	_resolver?: (value?: (HTMLorSVGElement[] & VelocityExtended) | PromiseLike<HTMLorSVGElement[] & VelocityExtended>) => void;
	/**
	 * This method is called at most once to signify that the animation has
	 * completed. Currently a loop:true animation will never complete. This
	 * allows .then(fn) to run (see Promise support).
	 *
	 * @private
	 */
	_rejecter?: (reason?: any) => void;
}

// TODO: Clean this up, add comments, remove deprecated options
export interface VelocityOptions {
	backwards?: boolean;
	/**
	 * Begin handler. Only the first element to check this callback gets to use
	 * it.
	 *
	 * default: undefined
	 */
	begin?: VelocityCallback;
	/**
	 * Complete handler (only the last element in a set gets this).
	 *
	 * default: undefined
	 */
	complete?: VelocityCallback;
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
	mobileHA?: boolean;
	/**
	 * Progress handler (only the last element in a set gets this)
	 *
	 * default: undefined
	 */
	progress?: VelocityProgress;
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
	stagger?: string | number;
	/**
	 * When adding animations to elements each element has its own queue of
	 * pending animations. This ensures that when adding a single animation to
	 * multiple elements, they all begin at the same time.
	 *
	 * default true
	 */
	sync?: boolean;
	/**
	 * @deprecated
	 */
	container?: string | HTMLorSVGElement;
	/**
	 * @deprecated
	 */
	display?: string | boolean;
	/**
	 * @deprecated
	 */
	visibility?: boolean | string;
	/**
	 * @deprecated
	 */
	offset?: number;

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
	begin?: VelocityCallback;
	/**
	 * Complete handler (only the last element in a set gets this)
	 *
	 * @private
	 */
	complete?: VelocityCallback;
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
	progress?: VelocityProgress;
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
	//}
	//
	//interface ExtendedVelocityOptions extends StrictVelocityOptions {
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
 * Velocity can run on both HTML and SVG elements.
 */
export type HTMLorSVGElement = HTMLElement | SVGElement;

/**
 * The return type of any velocity call. If this is called via a "utility"
 * function (such a jQuery <code>$(elements).velocity(...)</code>) then it will
 * be based on the array-like list of elements supplied, otherwise it will
 * create a plain array. The extra values for Promises and Velocity are inserted
 * into the array in such a way as to not interfere with other methods unless
 * they are specifically overwriting them.
 */
export type VelocityResult = Promise<HTMLorSVGElement[] & VelocityExtended> & HTMLorSVGElement[] & VelocityExtended;

/**
 * The various formats of Element argument for Velocity. Some libraries such as
 * jQuery and Zepto provide an array-like
 */
export type VelocityElements = HTMLorSVGElement | HTMLorSVGElement[] | VelocityResult;

/**
 * Chaining Velocity calls from various sources.
 */
export interface VelocityExtended<TNode extends Node = HTMLorSVGElement> {
	velocity: Velocity & VelocityChain & {
		/**
		 * TODO: Decide if this should be public
		 * @private
		 */
		animations: AnimationCall[];
	};
}

// TODO: I don't like having two of these - need to merge into a type or similar
export interface VelocityObjectArgs {
	elements?: HTMLorSVGElement[];
	properties?: Properties<VelocityProperty>;
	options?: VelocityOptions;
	e?: HTMLorSVGElement[];
	p?: Properties<VelocityProperty>;
	o?: VelocityOptions;
}

/**
 * Container for page-wide Velocity state data.
 */
export interface VelocityState {
	/**
	 * Detect if this is a NodeJS or web browser
	 */
	isClient: boolean;
	/**
	 * Detect mobile devices to determine if mobileHA should be turned
	 * on.
	 */
	isMobile: boolean;
	/**
	 * The mobileHA option's behavior changes on older Android devices
	 * (Gingerbread, versions 2.3.3-2.3.7).
	 */
	isAndroid: boolean;
	/**
	 * The mobileHA option's behavior changes on older Android devices
	 * (Gingerbread, versions 2.3.3-2.3.7).
	 */
	isGingerbread: boolean;
	/**
	 * Chrome browser
	 */
	isChrome: boolean;
	/**
	 * Firefox browser
	 */
	isFirefox: boolean;
	/**
	 * Create a cached element for re-use when checking for CSS property
	 * prefixes.
	 */
	prefixElement: HTMLDivElement;
	/**
	 * Retrieve the appropriate scroll anchor and property name for the
	 * browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY
	 */
	windowScrollAnchor: boolean;
	/**
	 * Cache the anchor used for animating window scrolling.
	 */
	scrollAnchor: Window | HTMLElement | Node | boolean;
	/**
	 * Cache the browser-specific property names associated with the
	 * scroll anchor.
	 */
	scrollPropertyLeft: string;
	/**
	 * Cache the browser-specific property names associated with the
	 * scroll anchor.
	 */
	scrollPropertyTop: string;
	/**
	 * The className we add / remove when animating.
	 */
	className: string;
	/**
	 * Keep track of whether our RAF tick is running.
	 */
	isTicking: boolean;
	/**
	 * Container for every in-progress call to Velocity.
	 */
	first?: AnimationCall;
	/**
	 * Container for every in-progress call to Velocity.
	 */
	last?: AnimationCall;
	/**
	 * First new animation - to shortcut starting them all up and push
	 * any css reads to the start of the tick
	 */
	firstNew?: AnimationCall;
}

/**
 * Public property value for a Sequence.
 */
export type VelocitySequenceProperty = string | [string] | [string, VelocityEasingType];

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
 * Direct Velocity access.
 */
export interface Velocity {
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
	patch(proto: any, global?: boolean);

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

	(options: VelocityObjectArgs): VelocityResult;
	(elements: VelocityElements, propertyMap: string | Properties<VelocityProperty>, options?: VelocityOptions): VelocityResult;
	(elements: VelocityElements, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
	(elements: VelocityElements, propertyMap: string | Properties<VelocityProperty>, complete?: () => void): VelocityResult;
	(elements: VelocityElements, propertyMap: string | Properties<VelocityProperty>, easing?: string | number[], complete?: () => void): VelocityResult;
	(elements: VelocityElements, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;

	(element: HTMLorSVGElement, action: "style", property: string): string;

	(action: "finish", queue?: string | false, stopAll?: true): VelocityResult;
	(elements: VelocityElements, action: "finish", queue?: string | false, stopAll?: true): VelocityResult;

	(action: "finish", stopAll?: true): VelocityResult;
	(elements: VelocityElements, action: "finish", stopAll?: true): VelocityResult;

	(action: "hasNormalization", constructor: {new: () => Element} | string, name: string): boolean;

	(action: "option", option: string): any;
	(elements: VelocityElements, action: "option", option: string): any;
	(action: "option", option: string, value: any): VelocityResult;
	(elements: VelocityElements, action: "option", option: string, value: any): VelocityResult;

	(action: "pause", queue?: string): VelocityResult;
	(elements: VelocityElements, action: "pause", queue?: string): VelocityResult;

	(action: "resume", queue?: string): VelocityResult;
	(elements: VelocityElements, action: "resume", queue?: string): VelocityResult;

	(action: "registerEasing", name: string, easing: VelocityEasingFn);

	(action: "registerNormalization", constructor: {new: () => Element} | string, name: string, normalization: VelocityNormalizationsFn, unit?: string, cache?: boolean): void;

	(action: "registerSequence", name: string, sequence: VelocitySequence);

	(elements: VelocityElements, action: "reverse", complete?: () => void): VelocityResult;
	(elements: VelocityElements, action: "reverse", duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
	(elements: VelocityElements, action: "reverse", duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;
	(elements: VelocityElements, action: "reverse", easing?: string | number[], complete?: () => void): VelocityResult;
	(elements: VelocityElements, action: "reverse", options?: VelocityOptions): VelocityResult;

	(action: "stop", queue?: string | false, stopAll?: true): VelocityResult;
	(elements: VelocityElements, action: "stop", queue?: string | false, stopAll?: true): VelocityResult;
	(action: "stop", stopAll?: true): VelocityResult;
	(elements: VelocityElements, action: "stop", stopAll?: true): VelocityResult;

	(action: "style", property: string): string | string[];
	(elements: VelocityElements, action: "style", property: string): string | string[];
	(action: "style", property: string, value: string): VelocityResult;
	(elements: VelocityElements, action: "style", property: string, value: string): VelocityResult;
	(action: "style", property: {[property: string]: string}): VelocityResult;
	(elements: VelocityElements, action: "style", property: {[property: string]: string}): VelocityResult;

	(action: "tween", percentComplete: number, property: string, value: VelocityPropertyValue, easing?: VelocityEasingType): string;
	(elements: VelocityElements, action: "tween", percentComplete: number, property: string, value: VelocityPropertyValue, easing?: VelocityEasingType): string;
	(action: "tween", percentComplete: number, propertyMap: Properties<VelocityProperty>, easing?: VelocityEasingType): Properties<string>;
	(elements: VelocityElements, action: "tween", percentComplete: number, propertyMap: Properties<VelocityProperty>, easing?: VelocityEasingType): Properties<string>;
}

/**
 * VelocityChain is used to extend the chained Velocity calls with specific
 * actions and their arguments.
 */
export interface VelocityChain {
	(propertyMap: string | Properties<VelocityProperty>, options?: VelocityOptions): VelocityResult;
	(propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
	(propertyMap: string | Properties<VelocityProperty>, complete?: () => void): VelocityResult;
	(propertyMap: string | Properties<VelocityProperty>, easing?: string | number[], complete?: () => void): VelocityResult;
	(propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;

	(action: string, ...args: any[]): any | VelocityResult;

	(action: "finish", queue?: string | false, stopAll?: true): VelocityResult;
	(action: "finish", stopAll?: true): VelocityResult;
	(action: "option", option: string): any;
	(action: "option", option: string, value: any): VelocityResult;
	(action: "pause", queue?: string): VelocityResult;
	(action: "resume", queue?: string): VelocityResult;
	(action: "reverse", complete?: () => void): VelocityResult;
	(action: "reverse", duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
	(action: "reverse", duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;
	(action: "reverse", easing?: string | number[], complete?: () => void): VelocityResult;
	(action: "reverse", options?: VelocityOptions): VelocityResult;
	(action: "stop", queue?: string | false, stopAll?: true): VelocityResult;
	(action: "stop", stopAll?: true): VelocityResult;
	(action: "style", property: string): string | string[];
	(action: "style", property: string, value: string): VelocityResult;
	(action: "style", property: {[property: string]: string}): VelocityResult;
	(action: "tween", percentComplete: number, property: string, value: VelocityPropertyValue, easing?: VelocityEasingType): string;
	(action: "tween", percentComplete: number, propertyMap: Properties<VelocityProperty>, easing?: VelocityEasingType): Properties<string>;
}

declare global {
	/**
	 * Extend the return value from <code>document.querySelectorAll()</code>.
	 */
	export interface NodeListOf<TNode extends Node> extends VelocityExtended<TNode> {}

	/**
	 * Extend <code>Element</code> directly.
	 */
	export interface Element extends VelocityExtended<Element> {}

	/**
	 * Extend <code>Element</code> directly.
	 */
	export interface HTMLCollection extends VelocityExtended<Element> {}
}

export default Velocity;
export declare const Velocity: Velocity;
