///<reference path="jquery.ts" />
///<reference path="constants.ts" />
///<reference path="types.ts" />
///<reference path="css.hooks.ts" />
///<reference path="css.normalizations.ts" />
///<reference path="css.ts" />
///<reference path="core.ts" />

interface VelocityOptions {
	duration?: string | number;
	begin?: (elements?: NodeListOf<HTMLElement>) => void;
	complete?: (elements?: NodeListOf<HTMLElement>) => void;
	progress?: (elements?: NodeListOf<HTMLElement>, percentComplete?: number, remaining?: number, start?: number, tweenValue?: number) => void;
	display?: string | boolean;
	delay?: string | number | boolean;
	mobileHA?: boolean;
	axis?: string;
	offset?: number;
	queue?: boolean | string;
	visibility?: boolean | string;
	loop?: boolean | number;
	easing?: string;
	container?: string | HTMLElement | SVGElement
}

interface ElementData extends VelocityOptions {
	isSVG?: boolean;
	transformCache?: any;
	computedStyle?: CSSStyleDeclaration;
	delay?: number;
	delayTimer?: {
		setTimeout?: number;
		next?: any;
	};
	opts?: VelocityOptions;
	delayBegin?: number;
	delayRemaining?: number;
	delayPaused?: boolean;
	tweensContainer?: (HTMLElement | SVGElement)[];
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
	element?: HTMLElement | SVGElement;
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
	next?: AnimationCall;
	prev?: AnimationCall;
	call: TweensContainer[]; // 0
	elements: (HTMLElement | SVGElement)[]; // 1
	options: VelocityOptions; // 2
	timeStart?: number; // 3
	resolver: (value?: {} | PromiseLike<{}>) => void; // 4
	paused?: boolean;
	ellapsedTime?: number;// number // 6
	[key: number]: never;
}
