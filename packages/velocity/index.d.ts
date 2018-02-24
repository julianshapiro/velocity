/**
 * Interfaces for VelocityJS
 */

/**
 * Velocity can run on both HTML and SVG elements.
 */
type HTMLorSVGElement = HTMLElement | SVGElement;

/**
 * All easings must return the current value given the start and end values, and
 * a percentage complete. The property name is also passed in case that makes a
 * difference to how values are used.
 */
type VelocityEasingFn = (percentComplete: number, startValue: number, endValue: number, property?: string) => number;

/**
 * Used for action callbacks.
 */
type VelocityActionFn = (args?: any[], elements?: VelocityResult, promiseHandler?: VelocityPromise, action?: string) => any;

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
type VelocityNormalizationsFn = ((element: HTMLorSVGElement, propertyValue: string) => void) & ((element: HTMLorSVGElement) => string);

/**
 * All easings. This is used for "easing:true" mapping, so that they can be
 * recognised for auto-completion and type-safety with custom builds of
 * Velocity.
 */
interface VelocityEasingsType {} // TODO: This needs to be auto-generated

/**
 * List of all easing types for easy code completion in TypeScript
 */
type VelocityEasingType = VelocityEasingFn
	| keyof VelocityEasingsType
	| string // Need to leave in to prevent errors.
	| [number] | [number, number] | [number, number, number, number]
	| number[]; // Need to leave in to prevent errors.

/**
 * The return type of any velocity call. If this is called via a "utility"
 * function (such a jQuery <code>$(elements).velocity(...)</code>) then it will
 * be based on the array-like list of elements supplied, otherwise it will
 * create a plain array. The extra values for Promises and Velocity are inserted
 * into the array in such a way as to not interfere with other methods unless
 * they are specifically overwriting them.
 */
type VelocityResult = Promise<HTMLorSVGElement[] & VelocityExtended> & HTMLorSVGElement[] & VelocityExtended;

// TODO: I don't like having two of these - need to merge into a type or similar
type VelocityObjectArgs = {
	elements?: HTMLorSVGElement[];
	properties?: VelocityProperties;
	options?: VelocityOptions;
	e?: HTMLorSVGElement[];
	p?: VelocityProperties;
	o?: VelocityOptions;
};

/**
 * The various formats of Element argument for Velocity. Some libraries such as
 * jQuery and Zepto provide an array-like
 */
type VelocityElements = HTMLorSVGElement | HTMLorSVGElement[] | VelocityResult;

/**
 * A property value can be a string or a number. If it is a number then it will
 * get the correct unit added to it depending on the property name if required.
 */
type VelocityPropertyValue = number | string | [number | string] | [number | string, VelocityEasingType | number | string] | [number | string, VelocityEasingType, number | string];

/**
 * A callback to allow us to generate a property value for a property name.
 */
type VelocityPropertyFn = (this: HTMLorSVGElement, index?: number, total?: number, elements?: VelocityElements) => VelocityPropertyValue;

/**
 * A callback to allow us to generate a property start / end value.
 */
type VelocityPropertyValueFn = (this: HTMLorSVGElement, index?: number, total?: number) => number | string;

/**
 * A property value can be a string or a number. If it is a number then it will
 * get the correct unit added to it depending on the property name if required.
 */
type VelocityProperty = VelocityPropertyValue | VelocityPropertyFn;

// TODO: | ((element: HTMLorSVGElement, index: number, elements: HTMLorSVGElement[]) => number | string);

/**
 * The properties that are permitted to be animated.
 * TODO: Add SVG and "Tween" properties. Should (can?) this get html / svg specifics later
 */
type VelocityProperties = {
	[property in keyof CSSStyleDeclaration]?: VelocityProperty;
};

/**
 * A callback used at the beginning or end of an animation.
 */
type VelocityCallback = (this: VelocityExtended & HTMLorSVGElement[], elements?: VelocityExtended & HTMLorSVGElement[], activeCall?: AnimationCall) => void;

/**
 * A callback used for progress tracking.
 */
type VelocityProgress = (this: VelocityExtended & HTMLorSVGElement[], elements?: VelocityExtended & HTMLorSVGElement[], percentComplete?: number, remaining?: number, tweenValue?: number, activeCall?: AnimationCall) => void;

// TODO: Clean this up, add comments, remove deprecated options
interface VelocityOptions {
	backwards?: boolean;
	/**
	 * Begin handler. Only the first element to check this callback gets to use
	 * it.
	 *
	 * @default: undefined
	 */
	begin?: VelocityCallback;
	/**
	 * Complete handler (only the last element in a set gets this).
	 *
	 * @default: undefined
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
	 * @default 0
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
	 * @default 400
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
	 * @default "swing"
	 */
	easing?: VelocityEasingType;
	/**
	 * Maximum number of frames to render on each second for all animations
	 *
	 * @default 60
	 */
	fpsLimit?: number;
	/**
	 * How many times should this option loop. A loop is defined as a "return to
	 * start values", so it will run, then reverse. This counts as a single
	 * loop. Setting <code>loop:4</code> will cause the animation to take the
	 * same time as <code>4n+1</code> iterations.
	 *
	 * @default 0
	 */
	loop?: boolean | number;
	/**
	 * The minimum frame time to achieve, the value is calculated based on fpsLimit
	 *
	 * @default 16.33333333 (1000ms / 60fps)
	 */
	minFrameTime?: number;
	mobileHA?: boolean;
	/**
	 * Progress handler (only the last element in a set gets this)
	 *
	 * @default: undefined
	 */
	progress?: VelocityProgress;
	/**
	 * If this should return a Promise with everything else. If promises are not
	 * required at all, then simply setting it globally will turn them off.
	 *
	 * @default true
	 */
	promise?: boolean;
	/**
	 * If promises are turned on, then the promise can reject if there are no
	 * elements supplied (an empty array is still valid).
	 *
	 * @default false
	 */
	promiseRejectEmpty?: boolean;
	/**
	 * The name of the queue to use. If this is set to <code>false</code> then
	 * it will be added immediately ignoring any other queues running. Queues
	 * start playing automatically (unlike jQuery, this doesn't need a queue to
	 * be manually started).
	 *
	 * @default ""
	 */
	queue?: false | string;
	/**
	 * How many times should this animation repeat. A repeat will restart at
	 * initial values and animate once. This is most useful for rotating
	 * animations where <code>0deg === 360deg</code>. If you are after a more
	 * "bounce" effect then look at <code>loop</code>.
	 *
	 * @default 0
	 */
	repeat?: boolean | number;
	/**
	 * The speed to play the animation back at. This number can change while
	 * running, in order to vary the playback rate.
	 *
	 * @default 0
	 */
	speed?: number;
	stagger?: string | number;
	/**
	 * When adding animations to elements each element has its own queue of
	 * pending animations. This ensures that when adding a single animation to
	 * multiple elements, they all begin at the same time.
	 * 
	 * @default true
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
	 * @default true
	 */
	cache?: boolean;
}

/**
 * Used internally for storing the Promise if used.
 */
interface VelocityPromise {
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

/**
 * After correcting the options so they are usable internally, they will be of
 * this type. The base VelocityOptions includes human readable and shortcuts,
 * which this doesn't.
 */
interface StrictVelocityOptions extends VelocityOptions, VelocityPromise {
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
 * Global per-Element data. This is persistent between animations, and freed
 * when the garbage collector removes the Element because it is no longer being
 * used.
 */
interface ElementData {
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
	cache: CSSStyleDeclaration;
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
}

type TweenPattern = ReadonlyArray<string | boolean>;
type TweenValues = ReadonlyArray<string | number>;

interface TweenStep extends ReadonlyArray<TweenValues> {
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
	[index: number]: TweenValues;
}

interface VelocitySequence {
	/**
	 * Pattern to use for tweening.
	 */
	pattern: TweenPattern;
	/**
	 * Step value.
	 */
	[index: number]: TweenStep;
}

interface VelocityTween {
	/**
	 * Pattern to use for tweening (excludes sequence).
	 */
	pattern?: TweenPattern;
	/**
	 * Normalization function - cached at animation creation time.
	 */
	fn: VelocityNormalizationsFn;
	/**
	 * Sequence to use for tweening (excludes pattern).
	 */
	sequence?: VelocitySequence;
	/**
	 * Easing function to use for entire tween.
	 */
	easing?: VelocityEasingFn;
	/**
	 * Start value.
	 */
	start?: TweenValues;
	/**
	 * End value.
	 */
	end: TweenValues;
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
declare const enum AnimationFlags {
	/**
	 * When the tweens are expanded this is set to save future processing.
	 */
	EXPANDED = 1 << 0,
	/**
	 * Set once the animation is ready to start - after any delay (and possible
	 * pause).
	 */
	READY = 1 << 1,
	/**
	 * Set once the animation has started.
	 */
	STARTED = 1 << 2,
	/**
	 * Set when an animation is manually stopped.
	 */
	STOPPED = 1 << 3,
	/**
	 * The pause state of this animation. If true it is paused, if false it was
	 * paused and needs to be resumed, and if undefined / null then not either.
	 */
	PAUSED = 1 << 4,
	/**
	 * Set when the animation is a sync animation.
	 */
	SYNC = 1 << 5,
	/**
	 * When the animation is running in reverse, such as for a loop.
	 */
	REVERSE = 1 << 6,
}

interface AnimationCall extends StrictVelocityOptions {
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
 * VelocityChain is used to extend the chained Velocity calls with specific
 * actions and their arguments.
 */
interface VelocityChain {
	(action: string, ...args: any[]): any | VelocityResult;
	(propertyMap: string | VelocityProperties, complete?: () => void): VelocityResult;
	(propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
	(propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", easing?: VelocityEasingType, complete?: () => void): VelocityResult;
	(propertyMap: string | VelocityProperties, easing?: VelocityEasingType, complete?: () => void): VelocityResult;
	(propertyMap: string | VelocityProperties, option?: VelocityOptions): VelocityResult;
}

/**
 * Direct Velocity access.
 */
interface Velocity {
	// TODO: Add all variations of the velocity argument formats allowed. Make them TYPE based as they're used in multiple places.
	(options: VelocityObjectArgs): VelocityResult;
	(action: string, ...args: any[]): VelocityResult;
	(elements: VelocityElements, action: string, ...args: any[]): VelocityResult;
	(elements: VelocityElements, propertyMap: VelocityProperties, complete?: () => void): VelocityResult;
	(elements: VelocityElements, propertyMap: VelocityProperties, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
	(elements: VelocityElements, propertyMap: VelocityProperties, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;
	(elements: VelocityElements, propertyMap: VelocityProperties, easing?: string | number[], complete?: () => void): VelocityResult;
	(elements: VelocityElements, propertyMap: VelocityProperties, options?: VelocityOptions): VelocityResult;

	defaults: VelocityOptions & {
		/**
		 * Provided in order to reset Velocity defaults back to their initial
		 * state.
		 */
		reset: () => void
	};

	queue(element: HTMLorSVGElement, animation: AnimationCall, queue?: string | boolean): void;
	dequeue(element: HTMLorSVGElement, queue?: string | boolean, skip?: boolean): AnimationCall;
	freeAnimationCall(animation: AnimationCall): void;
	pauseAll(queueName?: string | false): void;
	resumeAll(queueName?: string | false): void;
	RunSequence(originalSequence): void;
	RegisterEffect(effectName: string, properties): Velocity;

	/**
	 * Available to be able to check what version you're running against.
	 */
	readonly version: {
		readonly major: number;
		readonly minor: number;
		readonly patch: number;
	}

	CSS: {
		ColorNames: {[name: string]: string};
		getPropertyValue(element: HTMLorSVGElement, property: string, rootPropertyValue?: string, forceStyleLookup?: boolean): string;
		getUnit(str: string, start?: number): string;
		fixColors(str: string): string;
		Normalizations: {[name: string]: VelocityNormalizationsFn};
		Names: {
			camelCase(property: string): string;
			SVGAttribute(property: string): boolean;
			prefixCheck(property: string): [string, boolean];
		};
		Values: {
			hexToRgb(hex: string): [number, number, number];
			isCSSNullValue(value: any): boolean;
			getUnitType(property: string): string;
			getDisplayType(element: HTMLorSVGElement): string;
			addClass(element: HTMLorSVGElement, className: string): void;
			removeClass(element: HTMLorSVGElement, className: string): void;
		};
	};
	/**
	 * Current internal state of Velocity. 
	 */
	readonly State: {
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
		readonly isAndroid: boolean;
		/**
		 * The mobileHA option's behavior changes on older Android devices
		 * (Gingerbread, versions 2.3.3-2.3.7).
		 */
		readonly isGingerbread: boolean;
		/**
		 * Chrome browser
		 */
		readonly isChrome: boolean;
		/**
		 * Firefox browser
		 */
		readonly isFirefox: boolean;
		/**
		 * Create a cached element for re-use when checking for CSS property
		 * prefixes.
		 */
		readonly prefixElement: boolean;
		/**
		 * Cache every prefix match to avoid repeating lookups.
		 */
		readonly prefixMatches: {[property: string]: string};
		/**
		 * Retrieve the appropriate scroll anchor and property name for the
		 * browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY
		 * 
		 * @deprecated
		 */
		windowScrollAnchor: boolean;
		/**
		 * Cache the anchor used for animating window scrolling.
		 * 
		 * @deprecated
		 */
		scrollAnchor: Element;
		/**
		 * Cache the browser-specific property names associated with the
		 * 
		 * @deprecated
		 * scroll anchor.
		 */
		scrollPropertyLeft: string;
		/**
		 * Cache the browser-specific property names associated with the
		 * 
		 * @deprecated
		 * scroll anchor.
		 */
		scrollPropertyTop: string;
		/**
		 * Keep track of whether our RAF tick is running.
		 */
		readonly isTicking: boolean;
		/**
		 * Container for every in-progress call to Velocity.
		 */
		readonly first: AnimationCall;
		/**
		 * Container for every in-progress call to Velocity.
		 */
		readonly last: AnimationCall;
		/**
		 * First new animation - to shortcut starting them all up and push
		 * any css reads to the start of the tick
		 */
		readonly firstNew: AnimationCall;
	};
}

/**
 * Chaining Velocity calls from various sources.
 */
interface VelocityExtended<TNode extends Node = HTMLorSVGElement> {
	velocity: Velocity & VelocityChain & {
		/**
		 * TODO: Decide if this should be public
		 * @private
		 */
		animations: AnimationCall[]
	}
}

////////////////////
// Action: Finish //
////////////////////
interface Velocity {
	(action: "finish", stopAll?: true): VelocityResult;
	(action: "finish", queue?: string | false, stopAll?: true): VelocityResult;
	(elements: VelocityElements, action: "finish", stopAll?: true): VelocityResult;
	(elements: VelocityElements, action: "finish", queue?: string | false, stopAll?: true): VelocityResult;
}

interface VelocityChain {
	(action: "finish", stopAll?: true): VelocityResult;
	(action: "finish", queue?: string | false, stopAll?: true): VelocityResult;
}

////////////////////
// Action: Option //
////////////////////
interface Velocity {
	(action: "option", option: string): any;
	(action: "option", option: string, value: any): VelocityResult;
	(elements: VelocityElements, action: "option", option: string): any;
	(elements: VelocityElements, action: "option", option: string, value: any): VelocityResult;
}

interface VelocityChain {
	(action: "option", option: string): any;
	(action: "option", option: string, value: any): VelocityResult;
}

///////////////////
// Action: Pause //
///////////////////
interface Velocity {
	(action: "pause", queue?: string): VelocityResult;
	(elements: VelocityElements, action: "pause", queue?: string): VelocityResult;
}

interface VelocityChain {
	(action: "pause", queue?: string): VelocityResult;
}

////////////////////
// Action: Resume //
////////////////////
interface Velocity {
	(action: "resume", queue?: string): VelocityResult;
	(elements: VelocityElements, action: "resume", queue?: string): VelocityResult;
}

interface VelocityChain {
	(action: "resume", queue?: string): VelocityResult;
}

/////////////////////
// Action: Reverse //
/////////////////////
interface Velocity {
	(elements: VelocityElements, action: "reverse", complete?: () => void): VelocityResult;
	(elements: VelocityElements, action: "reverse", duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
	(elements: VelocityElements, action: "reverse", duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;
	(elements: VelocityElements, action: "reverse", easing?: string | number[], complete?: () => void): VelocityResult;
	(elements: VelocityElements, action: "reverse", options?: VelocityOptions): VelocityResult;
}

interface VelocityChain {
	(action: "reverse", complete?: () => void): VelocityResult;
	(action: "reverse", duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
	(action: "reverse", duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;
	(action: "reverse", easing?: string | number[], complete?: () => void): VelocityResult;
	(action: "reverse", options?: VelocityOptions): VelocityResult;
}

//////////////////
// Action: Stop //
//////////////////
interface Velocity {
	(action: "stop", stopAll?: true): VelocityResult;
	(action: "stop", queue?: string | false, stopAll?: true): VelocityResult;
	(elements: VelocityElements, action: "stop", stopAll?: true): VelocityResult;
	(elements: VelocityElements, action: "stop", queue?: string | false, stopAll?: true): VelocityResult;
}

interface VelocityChain {
	(action: "stop", stopAll?: true): VelocityResult;
	(action: "stop", queue?: string | false, stopAll?: true): VelocityResult;
}

///////////////////
// Action: Style //
///////////////////
interface Velocity {
	(action: "style", property: {[property: string]: string}): VelocityResult;
	(action: "style", property: string): string | string[];
	(action: "style", property: string, value: string): VelocityResult;
	(element: HTMLorSVGElement, action: "style", property: string): string;
	(elements: VelocityElements, action: "style", property: {[property: string]: string}): VelocityResult;
	(elements: VelocityElements, action: "style", property: string): string | string[];
	(elements: VelocityElements, action: "style", property: string, value: string): VelocityResult;

	style(elements: VelocityResult, property: {[property: string]: string}): VelocityResult;
	style(elements: VelocityResult, property: string): string | string[];
	style(elements: VelocityResult, property: string, value: string): VelocityResult;
}

interface VelocityChain {
	(action: "style", property: {[property: string]: string}): VelocityResult;
	(action: "style", property: string): string | string[];
	(action: "style", property: string, value: string): VelocityResult;
}

///////////////////
// Action: Tween //
///////////////////
interface Velocity {
	(action: "tween", percentComplete: number, property: string, value: VelocityPropertyValue, easing?: VelocityEasingType): string;
	(action: "tween", percentComplete: number, propertyMap: VelocityProperties, easing?: VelocityEasingType): {[property in keyof CSSStyleDeclaration]?: string};
	(elements: VelocityElements, action: "tween", percentComplete: number, property: string, value: VelocityPropertyValue, easing?: VelocityEasingType): string;
	(elements: VelocityElements, action: "tween", percentComplete: number, propertyMap: VelocityProperties, easing?: VelocityEasingType): {[property in keyof CSSStyleDeclaration]?: string};
}

interface VelocityChain {
	(action: "tween", percentComplete: number, property: string, value: VelocityPropertyValue, easing?: VelocityEasingType): string;
	(action: "tween", percentComplete: number, propertyMap: VelocityProperties, easing?: VelocityEasingType): {[property in keyof CSSStyleDeclaration]?: string};
}

/**
 * Extend the return value from <code>document.querySelectorAll()</code>.
 */
interface NodeListOf<TNode extends Node> extends VelocityExtended<TNode> {}

/**
 * Extend <code>Element</code> directly.
 */
interface Element extends VelocityExtended<Element> {}

/**
 * Extend <code>Element</code> directly.
 */
interface HTMLCollection extends VelocityExtended<Element> {}

declare const Velocity: Velocity;

