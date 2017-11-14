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
 */
type VelocityNormalizationsFn = ((element?: HTMLorSVGElement, propertyValue?) => any);

/**
 * List of all easing types for easy code completion in TypeScript
 */
type VelocityEasingType = VelocityEasingFn
	| "linear" | "swing" | "spring"
	| "ease" | "easeIn" | "easeOut" | "easeInOut" | "easeInSine" | "easeOutSine"
	| "easeInOutSine" | "easeInQuad" | "easeOutQuad" | "easeInOutQuad"
	| "easeInCubic" | "easeOutCubic" | "easeInOutCubic" | "easeInQuart"
	| "easeOutQuart" | "easeInOutQuart" | "easeInQuint" | "easeOutQuint"
	| "easeInOutQuint" | "easeInExpo" | "easeOutExpo" | "easeInOutExpo"
	| "easeInCirc" | "easeOutCirc" | "easeInOutCirc"
	| "ease-in" | "ease-out" | "ease-in-out"
	| "at-start" | "at-end" | "during"
	| string
	| [number]
	| [number, number]
	| [number, number, number, number]
	| VelocityEasingFn;

/**
 * Chaining Velocity calls from various sources.
 */
interface VelocityExtended<TNode extends Node = HTMLorSVGElement> {
	velocity: Velocity & {
		(this: TNode[] | NodeListOf<TNode>, propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
		(this: TNode[] | NodeListOf<TNode>, propertyMap: string | VelocityProperties, complete?: () => void): VelocityResult;
		(this: TNode[] | NodeListOf<TNode>, propertyMap: string | VelocityProperties, easing?: VelocityEasingType, complete?: () => void): VelocityResult;
		(this: TNode[] | NodeListOf<TNode>, propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", easing?: VelocityEasingType, complete?: () => void): VelocityResult;
		/**
		 * TODO: Decide if this should be public
		 * @private
		 */
		animations: AnimationCall[]
	}
}

/**
 * The return type of any velocity call. If this is called via a "utility"
 * function (such a jQuery <code>$(elements).velocity(...)</code>) then it will
 * be based on the array-like list of elements supplied, otherwise it will
 * create a plain array. The extra values for Promises and Velocity are inserted
 * into the array in such a way as to not interfere with other methods unless
 * they are specifically overwriting them.
 */
type VelocityResult = Promise<HTMLorSVGElement[]> & HTMLorSVGElement[] & VelocityExtended;

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
type VelocityPropertyValue = number | string | [number | string] | [number | string, number | string] | [number | string, number[] | string, number | string];

/**
 * A property value can be a string or a number. If it is a number then it will
 * get the correct unit added to it depending on the property name if required.
 */
type VelocityProperty = VelocityPropertyValue | ((index?: number, total?: number) => VelocityPropertyValue);

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
type VelocityCallback = (this: HTMLorSVGElement[], elements?: HTMLorSVGElement[], activeCall?: AnimationCall) => void;

/**
 * A callback used for progress tracking.
 */
type VelocityProgress = (this: HTMLorSVGElement[], elements?: HTMLorSVGElement[], percentComplete?: number, remaining?: number, start?: number, tweenValue?: number) => void;

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
	_promise?: Promise<HTMLorSVGElement[]>;
	/**
	 * This method is called at most once to signify that the animation has
	 * completed. Currently a loop:true animation will never complete. This
	 * allows .then(fn) to run (see Promise support).
	 *
	 * @private
	 */
	_resolver?: (value?: HTMLorSVGElement[] | PromiseLike<HTMLorSVGElement[]>) => void;
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
	// TODO: Change this to a const enum, so further future types can be allowed.
	/**
	 * Cache whether this Element is an SVG element.
	 */
	isSVG?: boolean;
	/**
	 * @deprecated
	 */
	transformCache?: any;
	/**
	 * A local cache of the current style values we're using, this is 80x faster
	 * than <code>element.style</code> access.
	 *
	 * Empty strings are set to null to get the value from getComputedStyle
	 * instead. If getComputedStyle returns an empty string then that is saved.
	 */
	style: CSSStyleDeclaration;
	/**
	 * A cached copy of getComputedStyle, this is 50% the speed of
	 * <code>element.style</code> access.
	 */
	computedStyle?: CSSStyleDeclaration;
	opts?: VelocityOptions;
	/**
	 * @deprecated
	 */
	rootPropertyValueCache?: {};
	/**
	 * @deprecated
	 */
	rootPropertyValue?: {};
	/**
	 * Set when this Element has a running animation on it.
	 */
	isAnimating: boolean;
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

/**
 * @deprecated
 */
interface ScrollData {
	/**
	 * @deprecated
	 */
	container?: any;
	/**
	 * @deprecated
	 */
	direction?: string;
	/**
	 * @deprecated
	 */
	alternateValue?: number;
}

interface Tween {
	rootPropertyValue?: string | number;
	startValue?: number | number[];
	currentValue?: string | number;
	endValue?: number | number[];
	/**
	 * @deprecated
	 */
	unitType?: string;
	/**
	 * Per property easing
	 */
	easing?: VelocityEasingFn;
	/**
	 * If an animation is reversed then the easing is also reversed.
	 */
	reverse?: boolean;
	/**
	 * @deprecated
	 */
	scrollData?: ScrollData
	/**
	 * This is an array of string values interspaced with numbers that are
	 * tweened from the startValue and endValue arrays. The final pattern is
	 * joined into a single string to be set as the property value.
	 */
	pattern?: (string | number)[];
	/**
	 * This is an array that matches in position the start and end values. When
	 * a value is true then it means that the array index needs to be rounded to
	 * a whole number (currently only needed for RGB() style values). If no
	 * values are rounded then this array will not exist.
	 */
	rounding?: boolean[];
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
	 * Properties to be tweened
	 */
	tweens?: {[property: string]: Tween};
	/**
	 * Valocity call properties - before processing when the animation goes
	 * live.
	 */
	properties?: "reverse" | VelocityProperties;
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
	 * The pause state of this animation. If true it is paused, if false it was
	 * paused and needs to be resumed, and if undefined / null then not either.
	 */
	paused?: boolean;
	/**
	 * Set once the animation has started - after any delay (and possible pause)
	 */
	started?: boolean;
	/**
	 * The time (in ms) that this animation has already run. Used with the
	 * duration and easing to provide the exact tween needed.
	 */
	ellapsedTime?: number;
	/**
	 * The percentage complete as a number 0 <= n <= 1
	 */
	percentComplete?: number;
	/**
	 * TODO: Remove this so it's a normal property
	 *
	 * @deprecated
	 */
	display?: boolean | string;
	/**
	 * TODO: Remove this so it's a normal property
	 *
	 * @deprecated
	 */
	visibility?: boolean | string;
}

interface Velocity {
	// TODO: Add all variations of the velocity argument formats allowed. Make them TYPE based as they're used in multiple places.
	(options?: VelocityObjectArgs): VelocityResult;
	(elements: VelocityElements, propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
	(elements: VelocityElements, propertyMap: string | VelocityProperties, complete?: () => void): VelocityResult;
	(elements: VelocityElements, propertyMap: string | VelocityProperties, easing?: string | number[], complete?: () => void): VelocityResult;
	(elements: VelocityElements, propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;
	(elements: VelocityElements, propertyMap: string | VelocityProperties, options?: VelocityOptions): VelocityResult;
	(elements: VelocityElements, propertyMap: string | VelocityProperties, option?: any, value?: any): VelocityResult;

	defaults: VelocityOptions;
	queue(element: HTMLorSVGElement, animation: AnimationCall, queue?: string | boolean): void;
	dequeue(element: HTMLorSVGElement, queue?: string | boolean, skip?: boolean): AnimationCall;
	freeAnimationCall(animation: AnimationCall): void;
	pauseAll(queueName?: string | false): void;
	resumeAll(queueName?: string | false): void;
	RunSequence(originalSequence): void;
	RegisterEffect(effectName: string, properties): Velocity;

	CSS: {
		getPropertyValue(element: HTMLorSVGElement, property: string, rootPropertyValue?: string, forceStyleLookup?: boolean): string | number;
		Hooks: {
			getRoot(property: string): string;
			getUnit(str: string, start?: number): string;
			fixColors(str: string): string;
			cleanRootPropertyValue(rootProperty: string, rootPropertyValue: string): string;
			extractValue(fullHookName: string, rootPropertyValue: string): string;
			injectValue(fullHookName: string, hookValue: string, rootPropertyValue: string): string;
		};
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
	State: {
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
		prefixElement: boolean;
		/**
		 * Cache every prefix match to avoid repeating lookups.
		 */
		prefixMatches: {[property: string]: string};
		/**
		 * Retrieve the appropriate scroll anchor and property name for the
		 * browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY
		 */
		windowScrollAnchor: boolean;
		/**
		 * Cache the anchor used for animating window scrolling.
		 */
		scrollAnchor: Element;
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
		 * Keep track of whether our RAF tick is running.
		 */
		isTicking: boolean;
		/**
		 * Container for every in-progress call to Velocity.
		 */
		first: AnimationCall;
		/**
		 * Container for every in-progress call to Velocity.
		 */
		last: AnimationCall;
		/**
		 * First new animation - to shortcut starting them all up and push
		 * any css reads to the start of the tick
		 */
		firstNew: AnimationCall;
	};
}

/**
 * Extend the return value from <code>document.querySelectorAll()</code>.
 */
interface NodeListOf<TNode extends Node> extends NodeList, VelocityExtended<TNode> {}


declare const Velocity: Velocity;

