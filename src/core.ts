/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Core "Velocity" function.
 */

interface Document {
	documentMode: any; // IE
}

/**
 * The main Velocity function. Acts as a gateway to everything else.
 */
function VelocityFn(options: VelocityObjectArgs): VelocityResult;
function VelocityFn(elements: VelocityElements, propertyMap: string | VelocityProperties, options?: VelocityOptions): VelocityResult;
function VelocityFn(elements: VelocityElements, propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
function VelocityFn(elements: VelocityElements, propertyMap: string | VelocityProperties, complete?: () => void): VelocityResult;
function VelocityFn(elements: VelocityElements, propertyMap: string | VelocityProperties, easing?: string | number[], complete?: () => void): VelocityResult;
function VelocityFn(elements: VelocityElements, propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;
function VelocityFn(this: VelocityElements, propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
function VelocityFn(this: VelocityElements, propertyMap: string | VelocityProperties, complete?: () => void): VelocityResult;
function VelocityFn(this: VelocityElements, propertyMap: string | VelocityProperties, easing?: string | number[], complete?: () => void): VelocityResult;
function VelocityFn(this: VelocityElements, propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;
function VelocityFn(this: VelocityElements | void, ...args: any[]): VelocityResult {

	/**
	 * Logic for determining what to return to the call stack when exiting out
	 * of Velocity.
	 * If we are using the utility function, attempt to return this call's
	 * promise. If no promise library was detected, default to null instead of
	 * returning the targeted elements so that utility function's return value
	 * is standardized.
	 */
	function getChain(): VelocityResult {
		if (elements) {
			let velocity = VelocityFn.bind(elements);

			defineProperty(elements, "velocity", velocity);
			if (animations) {
				defineProperty(velocity, "animations", animations);
			}
			if (promise) {
				defineProperty(elements, "then", promise.then.bind(promise));
				defineProperty(elements, "catch", promise.catch.bind(promise));
				if ((promise as any).finally) {
					// Semi-standard
					defineProperty(elements, "finally", (promise as any).finally.bind(promise));
				}
			}
			return elements as any;
		}
		return promise as any || null;
	}

	/*************************
	 Arguments Assignment
	 *************************/

	/**
	 * Cache of the first argument - this is used often enough to be saved.
	 */
	let args0 = arguments[0] as VelocityObjectArgs,
		/**
		 * To allow for expressive CoffeeScript code, Velocity supports an
		 * alternative syntax in which "elements" (or "e"), "properties" (or
		 * "p"), and "options" (or "o") objects are defined on a container
		 * object that's passed in as Velocity's sole argument.
		 * 
		 * Note: Some browsers automatically populate arguments with a
		 * "properties" object. We detect it by checking for its default
		 * "names" property.
		 */
		// TODO: Confirm which browsers - if <=IE8 the we can drop completely
		syntacticSugar = (args0 && args0.p || ((isPlainObject(args0.properties) && !(args0.properties as any).names) || isString(args0.properties))),
		/**
		 * Whether Velocity was called via the utility function (as opposed to
		 * on a jQuery/Zepto/Array-like object).
		 */
		isUtility: boolean = !isNode(this) && !isWrapped(this),
		/**
		 *  When Velocity is called via the utility function (Velocity()),
		 * elements are explicitly passed in as the first parameter. Thus,
		 * argument positioning varies.
		 */
		argumentIndex: number = isUtility ? 1 : 0,
		/**
		 * The list of elements.
		 */
		elements: HTMLorSVGElement[],
		/**
		 * The properties being animated. This can be a string, in which case it
		 * is either a function for these elements, or it is a "named" animation
		 * sequence to use instead. Named sequences start with either "callout."
		 * or "transition.". When used as a callout the values will be reset
		 * after finishing. When used as a transtition then there is no special
		 * handling after finishing.
		 */
		propertiesMap: string | VelocityProperties,
		/**
		 * The options for this set of animations. 
		 */
		options: VelocityOptions,
		/**
		 * If called via a chain then this contains the <b>last</b> calls
		 * animations. If this does not have a value then any access to the
		 * element's animations needs to be to the currently-running ones.
		 */
		animations: AnimationCall[],
		/**
		 * A shortcut to the default options.
		 */
		defaults = VelocityStatic.defaults,
		/**
		 * The promise that is returned.
		 */
		promise: Promise<HTMLorSVGElement[]>,
		// Used when the animation is finished
		resolver: (value?: HTMLorSVGElement[] | VelocityResult) => void,
		// Used when there was an issue with one or more of the Velocity arguments
		rejecter: (reason: any) => void;

	// First get the elements, and the animations connected to the last call if
	// this is chained.
	if (isUtility) {
		elements = syntacticSugar ? (args0.elements || args0.e) : args0 as HTMLorSVGElement[];
	} else {
		elements = isNode(this) ? [this as HTMLorSVGElement] : this as HTMLorSVGElement[];
		animations = this && (this as VelocityResult).velocity && (this as VelocityResult).velocity.animations;
	}
	// Next get the propertiesMap and options.
	if (syntacticSugar) {
		propertiesMap = (args0.properties || args0.p) as string | VelocityProperties;
		options = args0.options || args0.o;
	} else {
		propertiesMap = arguments[argumentIndex++] as string | VelocityProperties;
		if (isPlainObject(arguments[argumentIndex])) {
			options = arguments[argumentIndex];
		} else {
			options = {};
		}
		let offset = 1,
			duration = validateDuration(arguments[argumentIndex + offset]);

		if (duration !== undefined) {
			offset++;
			options.duration = duration;
		}
		let easing = validateEasing(arguments[argumentIndex + offset], getValue(options && validateDuration(options.duration), defaults.duration) as number);

		if (easing !== undefined) {
			offset++;
			options.easing = easing;
		}
		let complete = validateComplete(arguments[argumentIndex + offset]);

		if (complete !== undefined) {
			offset++;
			options.complete = complete;
		}
	}
	// Create the promise if supported and wanted.
	if (Promise && getValue(options && options.promise, defaults.promise)) {
		promise = new Promise(function(_resolve, _reject) {
			resolver = _resolve;
			rejecter = _reject;
		});
	}
	// Make sure the elements are actually a usable array of some sort.
	elements = sanitizeElements(elements);
	if (!elements) {
		if (promise) {
			if (!propertiesMap || getValue(options && options.promiseRejectEmpty, defaults.promiseRejectEmpty)) {
				rejecter("Velocity: No elements supplied, if that is deliberate then pass `promiseRejectEmpty:false` as an option. Aborting.");
			} else {
				resolver();
			}
		}
		return getChain();
	}

	/* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
	 single raw DOM element is passed in (which doesn't contain a length property). */
	let elementsLength = elements.length;

	if (isString(propertiesMap)) {
		/*********************
		 Action Detection
		 *********************/

		/* Velocity's behavior is categorized into "actions": Elements can either be specially scrolled into view,
		 or they can be started, stopped, paused, resumed, or reversed . If a literal or referenced properties map is passed in as Velocity's
		 first argument, the associated action is "start". Alternatively, "scroll", "reverse", "pause", "resume" or "stop" can be passed in 
		 instead of a properties map. */
		let action;

		switch (propertiesMap) {
			case "scroll":
				action = "scroll";
				break;

			case "reverse":
				action = "reverse";
				break;

			case "pause":
				{
					/*******************
					 Action: Pause
					 *******************/

					/* Pause and Resume are call-wide (not on a per element basis). Thus, calling pause or resume on a 
					 single element will cause any calls that contain tweens for that element to be paused/resumed
					 as well. */
					let queueName = options === undefined ? "" : options,
						activeCall = VelocityStatic.State.first,
						nextCall: AnimationCall;

					/* Iterate through all calls and pause any that contain any of our elements */
					for (; activeCall; activeCall = nextCall) {
						nextCall = activeCall.next;
						if (activeCall.paused !== true) {
							/* Iterate through the active call's targeted elements. */
							activeCall.elements.some(function(activeElement) {
								if (queueName !== true && (activeCall.queue !== queueName) && !(options === undefined && activeCall.queue === false)) {
									return true;
								}
								if (elements.indexOf(activeElement) >= 0) {
									return activeCall.paused = true;
								}
							});
						}
					}
					/* Since pause creates no new tweens, exit out of Velocity. */
					return getChain();
				}

			case "resume":
				{
					/*******************
					 Action: Resume
					 *******************/

					/* Pause and Resume are call-wide (not on a per element basis). Thus, calling pause or resume on a 
					 single element will cause any calls that containt tweens for that element to be paused/resumed
					 as well. */

					/* Iterate through all calls and pause any that contain any of our elements */
					let queueName = options === undefined ? "" : options,
						activeCall = VelocityStatic.State.first,
						nextCall: AnimationCall;

					/* Iterate through all calls and pause any that contain any of our elements */
					for (; activeCall; activeCall = nextCall) {
						nextCall = activeCall.next;
						if (activeCall.paused !== false) {
							/* Iterate through the active call's targeted elements. */
							activeCall.elements.some(function(activeElement) {
								if (queueName !== true && (activeCall.queue !== queueName) && !(options === undefined && activeCall.queue === false)) {
									return true;
								}
								if (elements.indexOf(activeElement) >= 0) {
									activeCall.paused = false;
									return true;
								}
							});
						}
					}
					/* Since resume creates no new tweens, exit out of Velocity. */
					return getChain();
				}

			case "finishAll":
				/* Clear the currently-active delay on each targeted element. */
				if (options === true || isString(options)) {
					elements.forEach(function(element) {
						/* If we want to finish everything in the queue, we have to iterate through it
						 and call each function. This will make them active calls below, which will
						 cause them to be applied via the duration setting. */
						/* Iterate through the items in the element's queue. */
						let animation: AnimationCall;

						while ((animation = VelocityStatic.dequeue(element, isString(options) ? options : undefined))) {
							animation.queue = false;
							VelocityStatic.expandTween(animation);
						}
					});
				}
			// deliberate fallthrough
			case "finish":
			case "stop":
				/*******************
				 Action: Stop
				 *******************/

				let callsToStop: AnimationCall[] = [];

				/* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
				 been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
				 is stopped, the next item in its animation queue is immediately triggered. */
				/* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
				 or a custom queue string can be passed in. */
				/* Note: The stop command runs prior to Velocity's Queueing phase since its behavior is intended to take effect *immediately*,
				 regardless of the element's current queue state. */

				/* Iterate through every active call. */
				let queueName = (options === undefined) ? "" : options,
					activeCall = VelocityStatic.State.first,
					nextCall: AnimationCall;

				/* Iterate through all calls and pause any that contain any of our elements */
				for (; activeCall; activeCall = nextCall) {
					nextCall = activeCall.next;
					/* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
					 clear calls associated with the relevant queue. */
					/* Call stopping logic works as follows:
					 - options === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
					 - options === undefined --> stop current queue:"" call and all queue:false calls.
					 - options === false --> stop only queue:false calls.
					 - options === "custom" --> stop current queue:"custom" call, including remaining queued ones (there is no functionality to only clear the currently-running queue:"custom" call). */
					let queueName = options === undefined ? defaults.queue : options;

					if (queueName !== true && activeCall.queue !== queueName && !(options === undefined && activeCall.queue === false)) {
						continue;
					}

					/* Iterate through the calls targeted by the stop command. */
					for (let i = 0; i < elementsLength; i++) {
						let element = elements[i];

						/* Check that this call was applied to the target element. */
						if (element === activeCall.element) {
							/* Make sure it can't be delayed */
							activeCall.started = true;
							/* Remove the queue so this can't trigger any newly added animations when it finishes */
							activeCall.queue = false;
							/* Optionally clear the remaining queued calls. If we're doing "finishAll" this won't find anything,
							 due to the queue-clearing above. */
							if (options === true || isString(options)) {
								let animation: AnimationCall;

								/* Iterate through the items in the element's queue. */
								while ((animation = VelocityStatic.dequeue(element, isString(options) ? options : undefined, true))) {
									let callbacks = animation.callbacks;

									if (callbacks.resolver) {
										callbacks.resolver(animation.elements as VelocityResult);
										callbacks.resolver = undefined;
									}
								}
							}
							if (propertiesMap === "stop") {
								/* Since "reverse" uses cached start values (the previous call's endValues), these values must be
								 changed to reflect the final value that the elements were actually tweened to. */
								/* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
								 object. Also, queue:false animations can't be reversed. */
								activeCall.timeStart = -1;
								callsToStop.push(activeCall);
							} else if (propertiesMap === "finish" || propertiesMap === "finishAll") {
								/* To get active tweens to finish immediately, we forcefully change the start time so that
								 they finish upon the next rAf tick then proceed with normal call completion logic. */
								activeCall.timeStart = -1;
							}
						}
					}
				}

				/* Prematurely call completeCall() on each matched active call. Pass an additional flag for "stop" to indicate
				 that the complete callback and display:none setting should be skipped since we're completing prematurely. */
				if (propertiesMap === "stop") {
					callsToStop.forEach(function(activeCall) {
						VelocityStatic.completeCall(activeCall, true);
					});

					if (promise) {
						/* Immediately resolve the promise associated with this stop call since stop runs synchronously. */
						resolver(elements);
					}
				}

				/* Since we're stopping, and not proceeding with queueing, exit out of Velocity. */
				return getChain();

			default:
				/* Treat a non-empty plain object as a literal properties map. */
				if (isPlainObject(propertiesMap) && !isEmptyObject(propertiesMap)) {
					action = "start";

					/****************
					 Redirects
					 ****************/

					/* Check if a string matches a registered redirect (see Redirects above). */
				} else if (isString(propertiesMap) && VelocityStatic.Redirects[propertiesMap]) {
					let opts = {...options},
						durationOriginal = parseFloat(options.duration as string),
						delayOriginal = parseFloat(options.delay as string) || 0;

					/* If the backwards option was passed in, reverse the element set so that elements animate from the last to the first. */
					if (opts.backwards === true) {
						elements = elements.reverse();
					}

					/* Individually trigger the redirect for each element in the set to prevent users from having to handle iteration logic in their redirect. */
					elements.forEach(function(element, elementIndex) {

						/* If the stagger option was passed in, successively delay each element by the stagger value (in ms). Retain the original delay value. */
						if (parseFloat(opts.stagger as string)) {
							opts.delay = delayOriginal + (parseFloat(opts.stagger as string) * elementIndex);
						} else if (isFunction(opts.stagger)) {
							opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
						}

						/* If the drag option was passed in, successively increase/decrease (depending on the presense of opts.backwards)
						 the duration of each element's animation, using floors to prevent producing very short durations. */
						if (opts.drag) {
							/* Default the duration of UI pack effects (callouts and transitions) to 1000ms instead of the usual default duration of 400ms. */
							opts.duration = durationOriginal || (/^(callout|transition)/.test(propertiesMap as string) ? 1000 : DEFAULT_DURATION);

							/* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
							 B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
							 The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
							opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex / elementsLength : (elementIndex + 1) / elementsLength), opts.duration * 0.75, 200);
						}

						/* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
						 reduce the opts checking logic required inside the redirect. */
						VelocityStatic.Redirects[propertiesMap as string].call(element, element, opts, elementIndex, elementsLength, elements, resolver);
					});

					/* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
					 (The performance overhead up to this point is virtually non-existant.) */
					/* Note: The jQuery call chain is kept intact by returning the complete element set. */
					return getChain();
				} else {
					let abortError = "Velocity: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.";

					if (promise) {
						rejecter(new Error(abortError));
					} else if (window.console) {
						console.log(abortError);
					}

					return getChain();
				}
		}
	}
	/************************
	 Element Processing
	 ************************/

	/* Element processing consists of three parts -- data processing that cannot go stale and data processing that *can* go stale (i.e. third-party style modifications):
	 1) Pre-Queueing: Element-wide variables, including the element's data storage, are instantiated. Call options are prepared. If triggered, the Stop action is executed.
	 2) Queueing: The logic that runs once this call has reached its point of execution in the element's queue stack. Most logic is placed here to avoid risking it becoming stale.
	 3) Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
	 `elementArrayIndex` allows passing index of the element in the original array to value functions.
	 If `elementsIndex` were used instead the index would be determined by the elements' per-element queue.
	 */

	/*************************
	 Part I: Pre-Queueing
	 *************************/

	/*********************************
	 Option: Duration
	 *********************************/

	let optionsDuration = getValue(validateDuration(options.duration), defaults.duration) as number,
		optionsDelay = getValue(validateDuration(options.delay), defaults.delay) as number;

	/*********************************
	 Option: Display & Visibility
	 *********************************/

	/* Refer to Velocity's documentation (VelocityJS.org/#displayAndVisibility) for a description of the display and visibility options' behavior. */
	/* Note: We strictly check for undefined instead of falsiness because display accepts an empty string value. */
	let optionsDisplay: string;
	if (options.display !== undefined && options.display !== null) {
		optionsDisplay = options.display.toString().toLowerCase();

		/* Users can pass in a special "auto" value to instruct Velocity to set the element to its default display value. */
		if (optionsDisplay === "auto") {
			// TODO: put this on the element
			//			opts.display = VelocityStatic.CSS.Values.getDisplayType(element);
		}
	}

	let optionsVisibility: string;
	if (options.visibility !== undefined && options.visibility !== null) {
		optionsVisibility = options.visibility.toString().toLowerCase();
	}

	/************************
	 Global Option: Mock
	 ************************/

	/* In mock mode, all animations are forced to 1ms so that they occur immediately upon the next rAF tick.
	 Alternatively, a multiplier can be passed in to time remap all delays and durations. */
	if (VelocityStatic.mock === true) {
		optionsDelay = 0;
		optionsDuration = 1;
	} else if (VelocityStatic.mock) {
		// TODO: Put this in the main tick loop - so we can change the speed
		let mock = parseFloat(VelocityStatic.mock) || 1;

		optionsDelay *= mock;
		optionsDuration *= mock;
	}

	/**********************
	 Option: mobileHA
	 **********************/

	/* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
	 on animating elements. HA is removed from the element at the completion of its animation. */
	/* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
	/* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
	let optionsMobileHA = (options.mobileHA && VelocityStatic.State.isMobile && !VelocityStatic.State.isGingerbread);

	/***********************
	 Part II: Queueing
	 ***********************/

	/* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
	 In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
	/* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
	 the call array is pushed to VelocityStatic.State.calls for live processing by the requestAnimationFrame tick. */

	let elementsCount = 0,
		callbacks: Callbacks = {
			started: 0,
			completed: 0
		} as any,
		// TODO: Don't make such a large object on every call - optimise it down, but make sure things can handle an "undefined" value - maybe have shared options to go with per-animation options
		rootAnimation: AnimationCall = {
			prev: undefined,
			next: undefined,
			//nextProgress: undefined,
			//nextComplete: undefined,
			//paused: false,
			started: false,
			percentComplete: 0,
			callbacks: callbacks,
			delay: optionsDelay,
			display: optionsDisplay,
			duration: optionsDuration as number,
			easing: validateEasing(getValue(options.easing, defaults.easing), optionsDuration) || validateEasing(defaults.easing, optionsDuration),
			//element: element,
			elements: elements,
			ellapsedTime: 0,
			loop: validateLoop(options.loop) || 0,
			mobileHA: optionsMobileHA,
			properties: propertiesMap as VelocityProperties,
			queue: getValue(validateQueue(options.queue), defaults.queue),
			repeat: validateRepeat(options.repeat) || 0,
			repeatAgain: validateRepeat(options.repeat) || 0,
			timeStart: 0,
			//tweens: {},
			visibility: optionsVisibility
		};

	// TODO: Allow functional options for different options per element
	let optionsBegin = validateBegin(options && options.begin),
		optionsComplete = validateComplete(options && options.complete),
		optionsProgress = validateProgress(options && options.progress);

	if (optionsBegin !== undefined) {
		callbacks.begin = optionsBegin;
	}
	if (optionsComplete !== undefined) {
		callbacks.complete = optionsComplete;
	}
	if (optionsProgress !== undefined) {
		callbacks.progress = optionsProgress;
	}
	Object.defineProperty(callbacks, "resolver", {
		get: resolver
	});
	animations = [];
	for (let i = 0, length = elementsLength; i < length; i++) {
		let element = elements[i];

		if (isNode(element)) {
			let data = Data(element),
				animation: AnimationCall = Object.assign({
					element: element,
					tweens: {}
				}, rootAnimation);

			if (data === undefined) {
				data = VelocityStatic.init(element);
			}
			elementsCount++;
			// TODO: Remove this and provide better tests
			data.opts = {
				duration: animation.duration,
				easing: animation.easing,
				complete: callbacks.complete
			} as any;
			animations.push(animation);
			VelocityStatic.queue(element, animation, animation.queue);
		}
	}
	callbacks.total = elementsCount;
	/* If the animation tick isn't running, start it. (Velocity shuts it off when there are no active calls to process.) */
	if (VelocityStatic.State.isTicking === false) {
		VelocityStatic.State.isTicking = true;

		/* Start the tick loop. */
		VelocityStatic.tick();
	}

	/***************
	 Chaining
	 ***************/

	/* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */
	return getChain();
};


/***************
 Summary
 ***************/

/*
 - CSS: CSS stack that works independently from the rest of Velocity.
 - animate(): Core animation method that iterates over the targeted elements and queues the incoming call onto each element individually.
 - Pre-Queueing: Prepare the element for animation by instantiating its data cache and processing the call's options.
 - Queueing: The logic that runs once the call has reached its point of execution in the element's queue stack.
 Most logic is placed here to avoid risking it becoming stale (if the element's properties have changed).
 - Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
 - tick(): The single requestAnimationFrame loop responsible for tweening all in-progress calls.
 - completeCall(): Handles the cleanup process for each Velocity call.
 */

/*********************
 Helper Functions
 *********************/

/* IE detection. Gist: https://gist.github.com/julianshapiro/9098609 */
var IE = (function() {
	if (document.documentMode) {
		return document.documentMode;
	} else {
		for (let i = 7; i > 4; i--) {
			let div = document.createElement("div");

			div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

			if (div.getElementsByTagName("span").length) {
				div = null;

				return i;
			}
		}
	}

	return undefined;
})();

/*****************
 Dependencies
 *****************/

let global: any = this as Window;

/*****************
 CSS Stack
 *****************/

/* Register hooks and normalizations. */
VelocityStatic.CSS.Hooks.register();
VelocityStatic.CSS.Normalizations.register();

/******************
 Frameworks
 ******************/

// Global call
global.Velocity = VelocityFn;

interface Window {
	jQuery: {fn?: any};
	Zepto: {fn?: any};
	Velocity: any;
}

if (window === global) {
	/* Both jQuery and Zepto allow their $.fn object to be extended to allow wrapped elements to be subjected to plugin calls.
	 If either framework is loaded, register a "velocity" extension pointing to Velocity's core animate() method.  Velocity
	 also registers itself onto a global container (window.jQuery || window.Zepto || window) so that certain features are
	 accessible beyond just a per-element scope. Accordingly, Velocity can both act on wrapped DOM elements and stand alone
	 for targeting raw DOM elements. */

	defineProperty(window.jQuery, "Velocity", VelocityFn);
	defineProperty(window.jQuery && window.jQuery.fn, "velocity", VelocityFn);
	defineProperty(window.Zepto, "Velocity", VelocityFn);
	defineProperty(window.Zepto && window.Zepto.fn, "velocity", VelocityFn);

	defineProperty(Element && Element.prototype, "velocity", VelocityFn);
	defineProperty(NodeList && NodeList.prototype, "velocity", VelocityFn);
	defineProperty(HTMLCollection && HTMLCollection.prototype, "velocity", VelocityFn);
}

/******************
 Unsupported
 ******************/

if (IE <= 8) {
	throw new Error("VelocityJS cannot run on Internet Explorer 8 or earlier");
}

/******************
 Known Issues
 ******************/

/* The CSS spec mandates that the translateX/Y/Z transforms are %-relative to the element itself -- not its parent.
 Velocity, however, doesn't make this distinction. Thus, converting to or from the % unit with these subproperties
 will produce an inaccurate conversion value. The same issue exists with the cx/cy attributes of SVG circles and ellipses. */
