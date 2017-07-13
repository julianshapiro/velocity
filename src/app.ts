///<reference path="jquery.ts" />
///<reference path="constants.ts" />
///<reference path="types.ts" />
///<reference path="utility.ts" />
///<reference path="css/_all.d.ts" />
///<reference path="easing/_all.d.ts" />
///<reference path="core.ts" />

type HTMLorSVGElement = HTMLElement | SVGElement;

interface VelocityOptions {
	duration?: string | number;
	begin?: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>) => void;
	complete?: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>) => void;
	progress?: (this: NodeListOf<HTMLorSVGElement>, elements?: NodeListOf<HTMLorSVGElement>, percentComplete?: number, remaining?: number, start?: number, tweenValue?: number) => void;
	display?: string | boolean;
	delay?: string | number | boolean;
	mobileHA?: boolean;
	axis?: string;
	offset?: number;
	queue?: boolean | string;
	visibility?: boolean | string;
	loop?: boolean | number;
	easing?: string;
	container?: string | HTMLorSVGElement;
	backwards?: boolean;
	stagger?: string | number;
	drag?: boolean;

	/* private */
	_cacheValues?: boolean;
	promiseRejectEmpty?: boolean;
}

interface ElementData extends VelocityOptions {
	isSVG?: boolean;
	transformCache?: any;
	computedStyle?: CSSStyleDeclaration;
	opts?: VelocityOptions;
	tweensContainer?: HTMLorSVGElement[];
	rootPropertyValueCache?: {};
	rootPropertyValue?: {};
	isAnimating?: boolean;
}

interface ScrollData {
	container?: any;
	direction?: string;
	alternateValue?: number;
}

interface TweensContainer {
	queue?: boolean;
	element?: HTMLorSVGElement;
	scroll?: {
		rootPropertyValue: boolean;
		startValue: number;
		currentValue: number;
		endValue: number;
		unitType: string;
		easing: any;
		scrollData: ScrollData
	},
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

	call: TweensContainer[];
	/**
	 * The list of elements associated with this specific animation.
	 */
	elements: HTMLorSVGElement[];
	/**
	 * The "fixed" options passed to this animation.
	 */
	options: VelocityOptions;
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
	 * Added to make sure this is never accessed without having an entry in the
	 * interface without throwing an error. The reason for this is to ensure
	 * that every copy of this interface is the same size and order - letting
	 * the JS engines optimise things a tiny bit more if relevant.
	 */
	[key: number]: never;
}
