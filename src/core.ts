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

interface VelocityObjectArgs {
	elements: HTMLorSVGElement[];
	properties: VelocityProperties;
	options?: VelocityOptions;
}

interface VelocityObjectArgs2 {
	e: HTMLorSVGElement[];
	p: VelocityProperties;
	o?: VelocityOptions;
}

/**
 * The main Velocity function. Acts as a gateway to everything else.
 */
function VelocityFn(options: VelocityObjectArgs | VelocityObjectArgs2): VelocityResult;
function VelocityFn(elements: HTMLorSVGElement | HTMLorSVGElement[] | VelocityResult, propertyMap: string | VelocityProperties, options?: VelocityOptions): VelocityResult;
function VelocityFn(elements: HTMLorSVGElement | HTMLorSVGElement[] | VelocityResult, propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
function VelocityFn(elements: HTMLorSVGElement | HTMLorSVGElement[] | VelocityResult, propertyMap: string | VelocityProperties, complete?: () => void): VelocityResult;
function VelocityFn(elements: HTMLorSVGElement | HTMLorSVGElement[] | VelocityResult, propertyMap: string | VelocityProperties, easing?: string | number[], complete?: () => void): VelocityResult;
function VelocityFn(elements: HTMLorSVGElement | HTMLorSVGElement[] | VelocityResult, propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;
function VelocityFn(this: HTMLorSVGElement | HTMLorSVGElement[] | VelocityResult, propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", complete?: () => void): VelocityResult;
function VelocityFn(this: HTMLorSVGElement | HTMLorSVGElement[] | VelocityResult, propertyMap: string | VelocityProperties, complete?: () => void): VelocityResult;
function VelocityFn(this: HTMLorSVGElement | HTMLorSVGElement[] | VelocityResult, propertyMap: string | VelocityProperties, easing?: string | number[], complete?: () => void): VelocityResult;
function VelocityFn(this: HTMLorSVGElement | HTMLorSVGElement[] | VelocityResult, propertyMap: string | VelocityProperties, duration?: number | "fast" | "normal" | "slow", easing?: string | number[], complete?: () => void): VelocityResult;
function VelocityFn(this: HTMLorSVGElement | HTMLorSVGElement[] | VelocityResult | void, ...args: any[]): VelocityResult {

	/**
	 * Logic for determining what to return to the call stack when exiting out
	 * of Velocity.
	 */
	function getChain(): VelocityResult {
		let promise = promiseData.promise,
			output = elementsWrapped;

		/* If we are using the utility function, attempt to return this call's promise. If no promise library was detected,
		 default to null instead of returning the targeted elements so that utility function's return value is standardized. */
		if (output) {
			let velocity = VelocityFn.bind(output);

			defineProperty(output, "velocity", velocity, true);
			if (animations) {
				defineProperty(velocity, "animations", animations, true);
			}
			if (promise) {
				defineProperty(output, "then", promise.then.bind(promise), true);
				defineProperty(output, "catch", promise.catch.bind(promise), true);
			}
			return output as any;
		}
		return promise as any || null;
	}

	/*************************
	 Arguments Assignment
	 *************************/

	/* To allow for expressive CoffeeScript code, Velocity supports an alternative syntax in which "elements" (or "e"), "properties" (or "p"), and "options" (or "o")
	 objects are defined on a container object that's passed in as Velocity's sole argument. */
	/* Note: Some browsers automatically populate arguments with a "properties" object. We detect it by checking for its default "names" property. */
	let syntacticSugar = (arguments[0] && ((arguments[0] as VelocityObjectArgs2).p || ((isPlainObject((arguments[0] as VelocityObjectArgs).properties) && !((arguments[0] as VelocityObjectArgs).properties as any).names) || isString((arguments[0] as VelocityObjectArgs).properties)))),
		/* Whether Velocity was called via the utility function (as opposed to on a jQuery/Zepto object). */
		isUtility: boolean = !isNode(this) && !isWrapped(this),
		/* When Velocity is called via the utility function (Velocity()), elements are explicitly
		 passed in as the first parameter. Thus, argument positioning varies. We normalize them here. */
		elementsWrapped: HTMLorSVGElement[],
		argumentIndex: number,
		animations: AnimationCall[],
		elements: HTMLorSVGElement[],
		propertiesMap: string | VelocityProperties,
		options: VelocityOptions,
		promiseData = {
			promise: null as Promise<any>,
			resolver: null,
			rejecter: null
		};

	/***************
	 Promises
	 ***************/

	/* If this call was made via the utility function (which is the default method of invocation when jQuery/Zepto are not being used), and if
	 promise support was detected, create a promise object for this call and store references to its resolver and rejecter methods. The resolve
	 method is used when a call completes naturally or is prematurely stopped by the user. In both cases, completeCall() handles the associated
	 call cleanup and promise resolving logic. The reject method is used when an invalid set of arguments is passed into a Velocity call. */
	/* Note: Velocity employs a call-based queueing architecture, which means that stopping an animating element actually stops the full call that
	 triggered it -- not that one element exclusively. Similarly, there is one promise per call, and all elements targeted by a Velocity call are
	 grouped together for the purposes of resolving and rejecting a promise. */
	if (Promise) {
		promiseData.promise = new Promise(function(resolve, reject) {
			promiseData.resolver = resolve;
			promiseData.rejecter = reject;
		});
	}

	if (isUtility) {
		/* Raw elements are being animated via the utility function. */
		argumentIndex = 1;
		elements = syntacticSugar ? ((arguments[0] as VelocityObjectArgs).elements || (arguments[0] as VelocityObjectArgs2).e) : arguments[0];
	} else {
		/* Detect jQuery/Zepto/Native elements being animated via .velocity() method. */
		argumentIndex = 0;
		animations = this && (this as VelocityResult).velocity && (this as VelocityResult).velocity.animations;
		elements = isNode(this) ? [this as HTMLorSVGElement] : this as HTMLorSVGElement[];
		elementsWrapped = elements;
	}

	if (syntacticSugar) {
		propertiesMap = ((arguments[0] as VelocityObjectArgs).properties || (arguments[0] as VelocityObjectArgs2).p) as string | VelocityProperties;
		options = (arguments[0] as VelocityObjectArgs).options || (arguments[0] as VelocityObjectArgs2).o;
	} else {
		propertiesMap = arguments[argumentIndex] as string | VelocityProperties;
		options = arguments[argumentIndex + 1];
	}
	elements = sanitizeElements(elements);

	if (!elements) {
		if (promiseData.promise) {
			if (!propertiesMap || (options && isBoolean(options.promiseRejectEmpty) ? options.promiseRejectEmpty : VelocityStatic.defaults.promiseRejectEmpty) === true) {
				promiseData.rejecter("Velocity: No elements supplied, if that is deliberate then pass `promiseRejectEmpty:false` as an option. Aborting.");
			} else {
				promiseData.resolver();
			}
		}
		return getChain();
	}

	/* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
	 single raw DOM element is passed in (which doesn't contain a length property). */
	let elementsLength = elements.length;

	if (typeof propertiesMap === "string") {
		/***************************
		 Argument Overloading
		 ***************************/

		/* Support is included for jQuery's argument overloading: $.animate(propertyMap [, duration] [, easing] [, complete]).
		 Overloading is detected by checking for the absence of an object being passed into options. */
		/* Note: The stop/finish/pause/resume actions do not accept animation options, and are therefore excluded from this check. */
		if (!/^(stop|finish|finishAll|pause|resume)$/i.test(propertiesMap) && !isPlainObject(options)) {
			/* The utility function shifts all arguments one position to the right, so we adjust for that offset. */
			let startingArgumentPosition = argumentIndex + 1;

			options = {};

			/* Iterate through all options arguments */
			for (let i = startingArgumentPosition; i < arguments.length; i++) {
				/* Treat a number as a duration. Parse it out. */
				/* Note: The following RegEx will return true if passed an array with a number as its first item.
				 Thus, arrays are skipped from this check. */
				if (!Array.isArray(arguments[i]) && (/^(fast|normal|slow)$/i.test(arguments[i]) || /^\d/.test(arguments[i]))) {
					options.duration = arguments[i];
					/* Treat strings and arrays as easings. */
				} else if (isString(arguments[i]) || Array.isArray(arguments[i])) {
					options.easing = arguments[i];
					/* Treat a function as a complete callback. */
				} else if (isFunction(arguments[i])) {
					options.complete = arguments[i];
				}
			}
		}

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
					let queueName = options === undefined ? VelocityStatic.defaults.queue : options;

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
										callbacks.resolver(animation.elements);
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

					if (promiseData.promise) {
						/* Immediately resolve the promise associated with this stop call since stop runs synchronously. */
						promiseData.resolver(elements);
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
							opts.duration = durationOriginal || (/^(callout|transition)/.test(propertiesMap as string) ? 1000 : DURATION_DEFAULT);

							/* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
							 B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
							 The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
							opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex / elementsLength : (elementIndex + 1) / elementsLength), opts.duration * 0.75, 200);
						}

						/* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
						 reduce the opts checking logic required inside the redirect. */
						VelocityStatic.Redirects[propertiesMap as string].call(element, element, opts, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
					});

					/* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
					 (The performance overhead up to this point is virtually non-existant.) */
					/* Note: The jQuery call chain is kept intact by returning the complete element set. */
					return getChain();
				} else {
					let abortError = "Velocity: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.";

					if (promiseData.promise) {
						promiseData.rejecter(new Error(abortError));
					} else if (window.console) {
						console.log(abortError);
					}

					return getChain();
				}
		}
	}
	/**************************
	 Call-Wide Variables
	 **************************/

	/* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all elements
	 being animated in a single Velocity call. Calculating unit ratios necessitates DOM querying and updating, and is therefore
	 avoided (via caching) wherever possible. This container is call-wide instead of page-wide to avoid the risk of using stale
	 conversion metrics across Velocity animations that are not immediately consecutively chained. */
	//	let callUnitConversionData = {
	//		lastParent: null,
	//		lastPosition: null,
	//		lastFontSize: null,
	//		lastPercentToPxWidth: null,
	//		lastPercentToPxHeight: null,
	//		lastEmToPx: null,
	//		remToPx: null,
	//		vwToPx: null,
	//		vhToPx: null
	//	};

	/* A container for all the ensuing tween data and metadata associated with this call. This container gets pushed to the page-wide
	 VelocityStatic.State.calls array that is processed during animation ticking. */
	//let call: TweensContainer[] = [];

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

	/***************************
	 Element-Wide Variables
	 ***************************/

	function parseTime(value: string | number, def: string | number): number {
		if (value == null || value === "") {
			value = def;
		}
		if (isNumber(value)) {
			return value;
		} else if (isString(value)) {
			switch (value.toLowerCase()) {
				case "fast":
					return DURATION_FAST;
				case "normal":
					return DURATION_DEFAULT;
				case "slow":
					return DURATION_SLOW;
				default:
					/* Remove the potential "ms" suffix and default to 1 if the user is attempting to set a duration of 0 (in order to produce an immediate style change). */
					return parseFloat(value.replace("ms", "").replace("s", "000")) || 0;
			}
		}
		return parseTime(def, 0);
	}

	/*********************************
	 Option: Duration
	 *********************************/

	let optionsDuration = parseTime(options.duration, VelocityStatic.defaults.duration || DURATION_DEFAULT),
		optionsDelay = parseTime(options.delay, VelocityStatic.defaults.delay || 0);

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

	/*******************
	 Option: Easing
	 *******************/

	let optionsEasing = VelocityStatic.getEasing(options.easing, optionsDuration);

	/*******************
	 Option: Loop
	 *******************/

	let optionsLoop = options.loop || 0;

	/*******************
	 Option: Repeat
	 *******************/

	let optionsRepeat = options.repeat || 0;

	/**********************
	 Option: mobileHA
	 **********************/

	/* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
	 on animating elements. HA is removed from the element at the completion of its animation. */
	/* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
	/* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
	let optionsMobileHA = (options.mobileHA && VelocityStatic.State.isMobile && !VelocityStatic.State.isGingerbread);

	/******************
	 Element Init
	 ******************/
	for (let i = 0; i < elements.length; i++) {
		let element = elements[i];

		if (isNode(element) && Data(element) === undefined) {
			VelocityStatic.init(element);
		}
	}

	/***********************
	 Part II: Queueing
	 ***********************/

	/* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
	 In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
	/* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
	 the call array is pushed to VelocityStatic.State.calls for live processing by the requestAnimationFrame tick. */

	let callbacks: Callbacks = {
		first: undefined,
		total: elementsLength,
		started: 0,
		completed: 0,
		begin: isFunction(options.begin) && options.begin,
		complete: isFunction(options.complete) && options.complete,
		progress: isFunction(options.progress) && options.progress,
		resolver: promiseData.resolver
	},
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
			easing: optionsEasing,
			//element: element,
			elements: elements,
			ellapsedTime: 0,
			loop: optionsLoop,
			mobileHA: optionsMobileHA,
			properties: propertiesMap as VelocityProperties,
			queue: options.queue === false ? false : isString(options.queue) ? options.queue : VelocityStatic.defaults.queue,
			repeat: optionsRepeat,
			repeatAgain: optionsRepeat,
			timeStart: 0,
			//tweens: {},
			visibility: optionsVisibility
		};

	animations = [];
	for (let i = 0, length = elementsLength; i < length; i++) {
		let element = elements[i],
			data = Data(element),
			animation: AnimationCall = Object.assign({
				element: element,
				tweens: {}
			}, rootAnimation);

		// TODO: Remove this and provide better tests
		data.opts = {
			duration: animation.duration,
			easing: animation.easing,
			complete: callbacks.complete
		} as any;
		animations.push(animation);
		VelocityStatic.queue(element, animation, animation.queue);
	}
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
