/**
 * Interfaces for VelocityJS
 */

type HTMLorSVGElement = HTMLElement | SVGElement;

type VelocityProperty = number | string;

type VelocityEasing = (percentComplete: number, startValue: number, endValue: number, property?: string) => number;

interface VelocityPropertiesMap {
	[property: string]: VelocityProperty | [VelocityProperty] | [VelocityProperty, VelocityProperty] | [VelocityProperty, string, VelocityProperty];
}

interface VelocityOptions {
	axis?: string;
	backwards?: boolean;
	begin?: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>) => void;
	complete?: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>) => void;
	container?: string | HTMLorSVGElement;
	delay?: string | number;
	/**
	 * @deprecated
	 */
	display?: string | boolean;
	drag?: boolean;
	duration?: string | number;
	easing?: string;
	loop?: false | number;
	mobileHA?: boolean;
	offset?: number;
	progress?: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>, percentComplete?: number, remaining?: number, start?: number, tweenValue?: number) => void;
	queue?: false | string;
	repeat?: false | number;
	stagger?: string | number;
	/**
	 * @deprecated
	 */
	visibility?: boolean | string;

	/* private */
	cache?: boolean;
	promiseRejectEmpty?: boolean;
}

interface ElementData {
	isSVG?: boolean;
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
	rootPropertyValueCache?: {};
	rootPropertyValue?: {};
	isAnimating?: boolean;
	/**
	 * Animations to be run for each queue. The animations are linked lists,
	 * but treated as a FIFO queue (new ones are added to the end). When the
	 * queue is empty (but still running) the key will still exist with a value
	 * of "null". When the queue is empty and the next entry is pulled from it
	 * then it will be set to "undefined".
	 * 
	 * The default queue is an empty string - ""
	 */
	queueList?: {[name: string]: AnimationCall};
	/**
	 * Last properties tweened per each queue. Used for both "reverse" and
	 * "repeat" methods.
	 */
	lastAnimationList?: {[name: string]: AnimationCall};
}

interface ScrollData {
	container?: any;
	direction?: string;
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
	easing?: any;
	/**
	 * If an animation is reversed then the easing is also reversed.
	 */
	reverse?: boolean;
	/**
	 * @deprecated
	 */
	scrollData?: ScrollData
	pattern?: (string | number)[];
	rounding?: boolean[];
}

interface TweensContainer {
	element?: HTMLorSVGElement;
	scroll?: Tween;
	[key: string]: Tween | boolean | HTMLorSVGElement;
}

interface Callbacks {
	/**
	 * The first AnimationCall to get this - used for the progress callback.
	 */
	first: AnimationCall;
	/**
	 * The total number of AnimationCalls that are pointing at this.
	 */
	total: number;
	/**
	 * The number of AnimationCalls that have started.
	 */
	started: number;
	/**
	 * The number of AnimationCalls that have finished.
	 */
	completed: number;
	/**
	 * Begin handler. Only the first element to check this callback gets to use
	 * it. Cleared after calling
	 */
	begin: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>, activeCall?: AnimationCall) => void;
	/**
	 * Complete handler (only the last element in a set gets this)
	 */
	complete: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>, activeCall?: AnimationCall) => void;
	/**
	 * Progress handler (only the last element in a set gets this)
	 */
	progress: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>, percentComplete?: number, remaining?: number, start?: number, tweenValue?: number, activeCall?: AnimationCall) => void;
	/**
	 * This method is called at most once to signify that the animation has
	 * completed. Currently a loop:true animation will never complete. This
	 * allows .then(fn) to run (see Promise support).
	 */
	resolver: (value?: {} | PromiseLike<{}>) => void;
}

interface AnimationCall {
	/**
	 * Used to store the next AnimationCell in this list.
	 */
	next: AnimationCall;
	/**
	 * Used to store the previous AnimationCell in this list. Used to make
	 * removing items from the list significantly easier.
	 */
	prev: AnimationCall;
	/**
	 * Used to store the next call with a Progress callback.
	 * @private
	 */
	nextProgress: AnimationCall;
	/**
	 * Used to store the next call with a Complete callback.
	 * @private
	 */
	nextComplete: AnimationCall;
	/**
	 * The callbacks associated with this AnimationCall.
	 */
	callbacks: Callbacks;
	/**
	 * Properties to be tweened
	 */
	tweens: {[property: string]: Tween};
	/**
	 * Valocity call properties - before processing when the animation goes
	 * live.
	 */
	properties: "reverse" | VelocityPropertiesMap;
	/**
	 * The element this specific animation is for. If there is more than one in
	 * the elements list then this will be duplicated when it is pulled off a
	 * queue.
	 */
	element: HTMLorSVGElement;
	/**
	 * The list of elements associated with this specific animation.
	 */
	elements: HTMLorSVGElement[];
	/**
	 * The "fixed" options passed to this animation.
	 */
	//	options: VelocityOptions;
	/**
	 * Easing for this animation while running.
	 */
	easing: (percentComplete: number, startValue: number, endValue: number, property?: string) => number;
	/**
	 * The time this animation started according to whichever clock we are
	 * using.
	 */
	timeStart: number;
	/**
	 * The amount of delay before this animation can start doing anything.
	 */
	delay: number;
	/**
	 * The length of time this animation will run for.
	 */
	duration: number;
	/**
	 * The pause state of this animation. If true it is paused, if false it was
	 * paused and needs to be resumed, and if undefined / null then not either.
	 */
	paused: boolean;
	/**
	 * Set once the animation has started - after any delay (and possible pause)
	 */
	started: boolean;
	/**
	 * The time (in ms) that this animation has already run. Used with the
	 * duration and easing to provide the exact tween needed.
	 */
	ellapsedTime: number;
	/**
	 * The percentage complete as a number 0 <= n <= 1
	 */
	percentComplete: number;
	/**
	 * TODO: Remove this so it's a normal property
	 * 
	 * @deprecated
	 */
	display: boolean | string;
	/**
	 * TODO: Remove this so it's a normal property
	 * 
	 * @deprecated
	 */
	visibility: boolean | string;
	/**
	 * TODO: Remove this so it's a normal property
	 */
	mobileHA: boolean;
	/**
	 * Queue
	 */
	queue: false | string;
	/**
	 * Loop, calls 2n-1 times reversing it each iteration
	 */
	loop: true | number;
	/**
	 * Repeat this number of times. If looped then each iteration of the loop
	 * is actually repeated this number of times.
	 */
	repeat: true | number;
	/**
	 * Private store of the repeat value used for looping
	 */
	repeatAgain: true | number;
}

type VelocityResult = Promise<HTMLElement[]> & HTMLElement[] & {velocity: Velocity};

interface Velocity {
	(...args: any[]): VelocityResult;

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

declare const Velocity: Velocity;