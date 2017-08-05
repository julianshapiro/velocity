/**
 * Interfaces for VelocityJS
 */

type HTMLorSVGElement = HTMLElement | SVGElement;

type VelocityProperty = number | string;

interface VelocityPropertiesMap {
	[property: string]: VelocityProperty | [VelocityProperty] | [VelocityProperty, VelocityProperty] | [VelocityProperty, string, VelocityProperty];
}

interface VelocityOptions {
	axis?: string;
	backwards?: boolean;
	begin?: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>) => void;
	complete?: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>) => void;
	container?: string | HTMLorSVGElement;
	delay?: string | number | boolean;
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
	rootPropertyValue?: boolean;
	startValue?: number | number[];
	currentValue?: string | number;
	endValue?: number | number[];
	/**
	 * @deprecated
	 */
	unitType?: string;
	easing?: any;
	/**
	 * @deprecated
	 */
	scrollData?: ScrollData
	pattern?: string;
}

interface TweensContainer {
	element?: HTMLorSVGElement;
	scroll?: Tween;
	[key: string]: Tween | boolean | HTMLorSVGElement;
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
	 * Begin handler (only the first element in a set gets this)
	 */
	begin: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>) => void;
	/**
	 * Complete handler (only the last element in a set gets this)
	 */
	complete: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>) => void;
	/**
	 * Progress handler (only the last element in a set gets this)
	 */
	progress: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>, percentComplete?: number, remaining?: number, start?: number, tweenValue?: number) => void;
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
	easing: string;
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
	 * This method is called at most once to signify that the animation has
	 * completed. Currently a loop:true animation will never complete. This
	 * allows .then(fn) to run (see Promise support).
	 */
	resolver: (value?: {} | PromiseLike<{}>) => void;
	/**
	 * The pause state of this animation. If true it is paused, if false it was
	 * paused and needs to be resumed, and if undefined / null then not either.
	 */
	paused: boolean;
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
	 * Loop
	 */
	loop: true | number;
	/**
	 * Repeat
	 */
	repeat: true | number;
}
