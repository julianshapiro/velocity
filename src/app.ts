///<reference path="jquery.ts" />
///<reference path="constants.ts" />
///<reference path="types.ts" />
///<reference path="css.hooks.ts" />
///<reference path="css.normalizations.ts" />
///<reference path="css.ts" />
///<reference path="core.ts" />

interface VelocityOptions {
	duration?: string | number;
	begin?: (elements: NodeListOf<HTMLElement>) => void;
	complete?: (elements: NodeListOf<HTMLElement>) => void;
	display?: string | boolean;
	delay?: number | boolean;
	mobileHA?: boolean;
	axis?: string;
	offset?: number;
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
	delayBegin?: number;
	delayRemaining?: number;
	delayPaused?: boolean;
	tweensContainer?: (HTMLElement | SVGElement)[];
	rootPropertyValueCache?: {};
	rootPropertyValue?: {};
	isAnimating?: boolean;
}
