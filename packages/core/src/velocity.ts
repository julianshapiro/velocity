/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Core "Velocity" function.
 */

import { isFunction, isKnownElement, isNumber, isObjectArgs, isPlainObject, isString, isWrapped } from "./types";
import { defineProperty } from "./utility";
import { Data } from "./data";
import { queue } from "./core/queue";
import { expandSequence } from "./core/expandSequence";
import { tick } from "./core/tick";
import { expandProperties } from "./core/tweens";
import { Actions as ActionsObject } from "./actions";
import { SequencesObject } from "./core/sequencesObject";
import { State as StateObject } from "./core/state";
import { IActionThis } from "./actions/actionsObject";
import { validateEasing, EasingFn, EasingType } from "./easings";
import { IAnimation, symbolAnimations, symbolCompleted, symbolElements, symbolPromise, symbolReady, symbolRejecter, symbolResolver, symbolStarted } from "./core/animation";
import { IOptions, Options } from "./core/options";
import { AnimationCall, AnimationFlags } from "./core/animationCall";
import { NormalizationsFn } from "./normalizations";
import { __createBinding } from "tslib";

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
	easing?: EasingFn | null;

	/**
	 * Values to tween and insert into pattern.
	 */
	[index: number]: string | number;
}

/**
 * Internal Sequence per property.
 */
export interface VelocityTween {
	/**
	 * Normalization function - cached at animation creation time.
	 */
	fn: NormalizationsFn;

	/**
	 * Sequence to use for tweening (excludes pattern).
	 */
	sequence?: Sequence;

	/**
	 * Easing function to use for entire tween.
	 */
	easing?: EasingFn;

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
 * Shortcut property type for HTML Elements.
 */
export type VelocityProperties = Properties<VelocityProperty>;

/**
 * A property value can be a string or a number. If it is a number then it will
 * get the correct unit added to it depending on the property name if required.
 */
export type VelocityProperty = VelocityPropertyValue | VelocityPropertyFn;

/**
 * A property value can be a string or a number. If it is a number then it will
 * get the correct unit added to it depending on the property name if required.
 */
export type VelocityPropertyValue = number
	| string
	| [to: number | string]
	| [to: number | string, from: number | string]
	| [to: number | string, easing: EasingType]
	| [to: number | string, easing: EasingType, from: number | string];

/**
 * A callback to allow us to generate a property start / end value.
 */
export type VelocityPropertyValueFn = (
	this: KnownElement,
	index?: number,
	total?: number,
	propertyName?: string) => number | string;

/**
 * Public Sequence definition.
 */
export type VelocitySequence = {
	duration?: number;
	easing?: EasingType;
	[percent: number]: Properties<VelocitySequenceProperty>;
} | {
	[percent: string]: Properties<VelocitySequenceProperty>;
}; // Needs to be like this to prevent warnings.

/**
 * Public property value for a Sequence.
 */
export type VelocitySequenceProperty = string | [string] | [string, EasingType];


/**
 * These are all the known element types. Currently this needs to be extended to
 * allow us to know what to do.
 */
export interface IElementTypes {
	dom: Element;
}

/**
 * The various formats of Element argument for Velocity. Some libraries such as
 * jQuery and Zepto provide an array-like
 */
export type KnownElement = IElementTypes[keyof IElementTypes];

/**
 * A callback to allow us to generate a property value for a property name.
 */
export type VelocityPropertyFn = (
	this: KnownElement,
	index: number,
	total: number,
	elements: KnownElement[]) => VelocityPropertyValue;

/**
 * Chaining Velocity calls from various sources.
 */
export interface IVelocity {
	/**
	 * This is the Velocity chaining method. It is functionally equivalent to
	 * the normal Velocity call, but allows chaining on the elements it is
	 * attached to.
	 */
	// readonly velocity: typeof Velocity;
	(options: VelocityObjectArgs): IAnimation;
	(elements: KnownElement, propertyMap: string | Properties<VelocityProperty>, options?: IOptions): IAnimation;
	(elements: TemplateStringsArray, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", complete?: () => void): IAnimation;
	(elements: KnownElement, propertyMap: string | Properties<VelocityProperty>, complete?: () => void): IAnimation;
	(elements: KnownElement, propertyMap: string | Properties<VelocityProperty>, easing?: string | number[], complete?: () => void): IAnimation;
	(elements: KnownElement, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): IAnimation;
	(this: IAnimation, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", complete?: () => void): IAnimation;
	(this: IAnimation, propertyMap: string | Properties<VelocityProperty>, complete?: () => void): IAnimation;
	(this: IAnimation, propertyMap: string | Properties<VelocityProperty>, easing?: string | number[], complete?: () => void): IAnimation;
	(this: IAnimation, propertyMap: string | Properties<VelocityProperty>, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): IAnimation;
}

export type test = IVelocity[never];

export interface IStaticVelocity {
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

	/**
	 * Save our version number somewhere visible.
	 */
	readonly version: string;
}

/**
 * This is used for simple single-argument access.
 */
export interface VelocityObjectArgs {
	elements?: KnownElement[];
	options?: IOptions;
	properties: Properties<VelocityProperty>;
}

/**
 * The main Velocity function. Acts as a gateway to everything else.
 */
export const Velocity: Function & IVelocity & IStaticVelocity = function(this: KnownElement | KnownElement[] | void, ...args: unknown[]): any {
	/** An array-like list of objects to operate on.*/
	const elements: KnownElement[] | undefined = isKnownElement(args[0])
		? [args.shift() as KnownElement]
		: isWrapped(args[0])
			? args.shift() as KnownElement[]
			: isKnownElement(this)
				? [this as KnownElement]
				: isWrapped(this)
					? this as KnownElement[]
					: undefined;

	// Get object args out of the way first
	if (args.length === 1 && isObjectArgs(args[0])) {
		return Velocity.call(args[0].elements ?? elements, args[0].properties, args[0].options);
	}

	/** The action we're calling if it exists. */
	const action = isString(args[0]) && ActionsObject[args[0]];
	/** The sequence we're applying if it exists. */
	const sequence = isString(args[0]) && SequencesObject[args[0]];
	/** Used to let us figure out our options to add to the animation. */
	let baseOptions: Partial<IOptions> = {};

	if (!action) {
		if (isPlainObject(args[1])) {
			// Passing an options object, can't happen
			baseOptions = args[1];
		} else {
			// Parse the other arguments in case there's options being passed directly
			for (let i = 1; i < args.length; i++) {
				const arg = args[i];
				const tmpDuration = Options.parseDuration(arg);
				const tmpEasing = validateEasing(arg, (baseOptions.duration as number) ?? Options.defaults.duration, true);

				if (isNumber(tmpDuration)) {
					baseOptions.duration = tmpDuration;
				} else if (tmpEasing) {
					baseOptions.easing = tmpEasing;
				} else if (isFunction(arg)) {
					baseOptions.complete = arg as any;
				} else {
					console.warn(`Velocity: Unknown option "${String(arg)}".`)
				}
			}
		}
	}
	const options = new Options(baseOptions);

	/** If we're a chained call then don't nest the data. */
	const originalElements: KnownElement[] = elements?.hasOwnProperty(symbolElements)
		? elements[symbolElements]
		: elements;

	/** The animation object we will return. */
	const animation: IAnimation = Object.create(originalElements, {
		velocity: { value: Velocity },
		[symbolCompleted]: { value: 0 },
		[symbolElements]: { value: originalElements },
		[symbolReady]: { value: 0 },
		[symbolStarted]: { value: 0 },
	});

	// Create the promise if supported and wanted. This adds the properties to
	// the above`promiseAnimationObject` which will be added to `animation`
	// below.
	if (options.promise && Promise) {
		const promise = new Promise((_resolve, _reject) => {
			Object.defineProperties(animation, {
				[symbolRejecter]: {
					value: (reason?: any) => {
						delete animation[symbolRejecter];
						delete animation[symbolResolver];
						_reject(reason);
					},
					configurable: true,
				},
				[symbolResolver]: {
					value: (value?: unknown) => {
						delete animation[symbolRejecter];
						delete animation[symbolResolver];
						_resolve(value);
					},
					configurable: true,
				},
			});
		});

		Object.defineProperties(animation, {
			then: { value: promise.then },
			catch: { value: promise.catch },
			finally: { value: promise.finally },
			[symbolPromise]: { value: promise },
		});
	}

	if (action) {
		// Velocity's behavior is categorized into "actions". If a string is
		// passed in instead of a propertiesMap then that will call a function
		// to do something special to the animation linked.
		const actionThis: IActionThis = {
			animation,
			elements,
			action: args[0] as string,
		};

		return action.apply(actionThis, args) ?? animation;
	}

	// throw new Error(`VelocityJS: First argument (${args[0]}) was not a property map, a known action, or a registered redirect. Aborting.`);

	/**
	 * If called via a chain then this contains the <b>last</b> calls
	 * animations. If this does not have a value then any access to the
	 * element's animations needs to be to the currently-running ones.
	 */
	let animations: AnimationCall[] | undefined;

	// Get any options map passed in as arguments first, expand any direct
	// options if possible.
	const isReverse = propertiesMap === "reverse";
	const isAction = !isReverse && isString(propertiesMap);
	const maybeSequence = isAction && SequencesObject[propertiesMap as string];

	const missing = !originalElements
		? "elements"
		: !propertiesMap
			? "properties"
			: undefined;

	if (missing) {
		if (options.promiseRejectEmpty) {
			animation[symbolRejecter]?.(`Velocity: No ${missing} supplied, if that is deliberate then pass \`promiseRejectEmpty: false,\` as an option. Aborting.`);
		} else {
			animation[symbolResolver]?.(animation);
		}

		return animation;
	}

	let hasValidDuration: boolean = false;

	if (isPlainObject(propertiesMap) || isReverse || maybeSequence) {
		if (isReverse && options.queue === false) {
			throw new Error("VelocityJS: Cannot reverse a queue:false animation.");
		}

		// When a set of elements is targeted by a Velocity call, the set is
		// broken up and each element has the current Velocity call individually
		// queued onto it. In this way, each element's existing queue is
		// respected; some elements may already be animating and accordingly
		// should not have this current Velocity call triggered immediately
		// unless the sync:true option is used.

		animations = [];
		for (let index = 0; index < originalElements.length; index++) {
			const element = originalElements[index];

			if (isKnownElement(element)) { // TODO: This needs to check for valid animation targets, not just Elements
				if (isReverse) {
					const lastAnimation = Data(element).lastAnimation.get(options.queue);

					propertiesMap = lastAnimation && lastAnimation.tweens as any;
					if (!propertiesMap) {
						console.error(`VelocityJS: Attempting to reverse an animation on an element with no previous animation:`, element);
						continue;
					}
					activeCall.flags |= AnimationFlags.REVERSE & ~(lastAnimation._flags & AnimationFlags.REVERSE); // tslint:disable-line:no-bitwise
				}
				const activeCall = new AnimationCall(options, animation, element);

				animations.push(activeCall);
				if (activeCall.stagger) {
					if (isFunction(activeCall.stagger)) {
						const num = optionCallback(activeCall.stagger, element, index, originalElements.length, originalElements, "stagger");

						if (isNumber(num)) {
							activeCall.delay += num;
						}
					} else {
						activeCall.delay += activeCall.stagger * index;
					}
				}
				if (activeCall.drag) {
					activeCall.duration -= (activeCall.duration! * Math.max(1 - (index + 1) / originalElements.length, 0.75));
				}
				if (maybeSequence) {
					expandSequence(activeCall, maybeSequence);
				} else if (isReverse) {
					// In this case we're using the previous animation, so
					// it will be expanded correctly when that one runs.
					activeCall.tweens = propertiesMap as any;
				} else {
					activeCall.tweens = Object.create(null);
					expandProperties(activeCall, propertiesMap);
				}
				queue(element, activeCall, options.queue!);
			}
		}
		if (animations) {
			defineProperty(animation, symbolAnimations, animations);
		}
		if (StateObject.isTicking === false) {
			// If the animation tick isn't running, start it. (Velocity shuts it
			// off when there are no active calls to process.)
			tick(false);
		}
	}
	/***************
	 Chaining
	 ***************/

	/* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */
	return animation;
} as any;

// @ts-ignore
defineProperty(Velocity, "version", __VERSION__);
defineProperty(Velocity, "debug", false, false);
defineProperty(Velocity, "mock", false, false);

/**
 * Call an option callback in a try/catch block and report an error if needed.
 */
function optionCallback<T>(fn: VelocityOptionFn<T>, element: KnownElement, index: number, length: number, elements: KnownElement[], option: string): T | undefined {
	try {
		return fn.call(element, index, length, elements, option);
	} catch (e) {
		console.error(`VelocityJS: Exception when calling '${option}' callback:`, e);

		return undefined;
	}
}
