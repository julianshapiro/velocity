/*! VelocityJS.org (2.0.0). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */

/******************
 Velocity.js
 ******************/

interface Document {
	documentMode: any; // IE
}

function Velocity(...args: any[]) {
	var opts: VelocityOptions;

	/******************
	 Call Chain
	 ******************/

	/* Logic for determining what to return to the call stack when exiting out of Velocity. */
	function getChain() {
		var promise = promiseData.promise,
			output = elementsWrapped; // || elements;

		/* If we are using the utility function, attempt to return this call's promise. If no promise library was detected,
		 default to null instead of returning the targeted elements so that utility function's return value is standardized. */
		if (output) {
			defineProperty(output, "velocity", Velocity.bind(output));
			if (promise) {
				defineProperty(output, "then", promise.then.bind(promise), true);
				defineProperty(output, "catch", promise.catch.bind(promise), true);
			}
			return output;
		} else {
			return promise || null;
		}
	}

	/*************************
	 Arguments Assignment
	 *************************/

	/* To allow for expressive CoffeeScript code, Velocity supports an alternative syntax in which "elements" (or "e"), "properties" (or "p"), and "options" (or "o")
	 objects are defined on a container object that's passed in as Velocity's sole argument. */
	/* Note: Some browsers automatically populate arguments with a "properties" object. We detect it by checking for its default "names" property. */
	var syntacticSugar = (arguments[0] && (arguments[0].p || ((isPlainObject(arguments[0].properties) && !arguments[0].properties.names) || isString(arguments[0].properties)))),
		/* Whether Velocity was called via the utility function (as opposed to on a jQuery/Zepto object). */
		isUtility: boolean = !isWrapped(this),
		/* When Velocity is called via the utility function ($.Velocity()/Velocity()), elements are explicitly
		 passed in as the first parameter. Thus, argument positioning varies. We normalize them here. */
		elementsWrapped: HTMLorSVGElement[],
		argumentIndex: number,
		elements: HTMLorSVGElement[],
		propertiesMap: string | {[property: string]: any},
		options: VelocityOptions,
		promiseData = {
			promise: null as Promise<any>,
			resolver: null,
			rejecter: null
		};

	if (isUtility) {
		/* Raw elements are being animated via the utility function. */
		argumentIndex = 1;
		elements = syntacticSugar ? (arguments[0].elements || arguments[0].e) : arguments[0];
	} else {
		/* Detect jQuery/Zepto/Native elements being animated via .velocity() method. */
		argumentIndex = 0;
		elements = this;
		elementsWrapped = this;
	}

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

	if (syntacticSugar) {
		propertiesMap = arguments[0].properties || arguments[0].p;
		options = arguments[0].options || arguments[0].o;
	} else {
		propertiesMap = arguments[argumentIndex];
		options = arguments[argumentIndex + 1];
	}
	elements = sanitizeElements(elements);

	if (!elements) {
		if (promiseData.promise) {
			if (!propertiesMap || !options || options.promiseRejectEmpty !== false) {
				promiseData.rejecter();
			} else {
				promiseData.resolver();
			}
		}
		return getChain();
	}

	/* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
	 single raw DOM element is passed in (which doesn't contain a length property). */
	var elementsLength = elements.length,
		elementsIndex = 0;

	/***************************
	 Argument Overloading
	 ***************************/

	/* Support is included for jQuery's argument overloading: $.animate(propertyMap [, duration] [, easing] [, complete]).
	 Overloading is detected by checking for the absence of an object being passed into options. */
	/* Note: The stop/finish/pause/resume actions do not accept animation options, and are therefore excluded from this check. */
	if (!/^(stop|finish|finishAll|pause|resume)$/i.test(propertiesMap as string) && !isPlainObject(options)) {
		/* The utility function shifts all arguments one position to the right, so we adjust for that offset. */
		var startingArgumentPosition = argumentIndex + 1;

		options = {};

		/* Iterate through all options arguments */
		for (var i = startingArgumentPosition; i < arguments.length; i++) {
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
	var action;

	switch (propertiesMap) {
		case "scroll":
			action = "scroll";
			break;

		case "reverse":
			action = "reverse";
			break;

		case "pause":

			/*******************
			 Action: Pause
			 *******************/

			var currentTime = (new Date()).getTime();

			/* Handle delay timers */
			elements.forEach(function(element) {
				pauseDelayOnElement(element, currentTime);
			});

			/* Pause and Resume are call-wide (not on a per element basis). Thus, calling pause or resume on a 
			 single element will cause any calls that contain tweens for that element to be paused/resumed
			 as well. */
			var queueName = options === undefined ? "" : options,
				activeCall = Velocity.State.first;

			/* Iterate through all calls and pause any that contain any of our elements */
			for (; activeCall; activeCall = activeCall.next) {
				if (activeCall.paused !== true) {
					/* Iterate through the active call's targeted elements. */
					activeCall.elements.some(function(activeElement) {
						if (queueName !== true && (activeCall.options.queue !== queueName) && !(options === undefined && activeCall.options.queue === false)) {
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

		case "resume":
			/*******************
			 Action: Resume
			 *******************/

			/* Handle delay timers */
			elements.forEach(function(element) {
				resumeDelayOnElement(element, currentTime);
			});

			/* Pause and Resume are call-wide (not on a per elemnt basis). Thus, calling pause or resume on a 
			 single element will cause any calls that containt tweens for that element to be paused/resumed
			 as well. */

			/* Iterate through all calls and pause any that contain any of our elements */
			var queueName = options === undefined ? "" : options,
				activeCall = Velocity.State.first;

			/* Iterate through all calls and pause any that contain any of our elements */
			for (; activeCall; activeCall = activeCall.next) {
				if (activeCall.paused !== false) {
					/* Iterate through the active call's targeted elements. */
					activeCall.elements.some(function(activeElement) {
						if (queueName !== true && (activeCall.options.queue !== queueName) && !(options === undefined && activeCall.options.queue === false)) {
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

		case "finish":
		case "finishAll":
		case "stop":
			/*******************
			 Action: Stop
			 *******************/

			/* Clear the currently-active delay on each targeted element. */
			elements.forEach(function(element) {
				if (Data(element) && Data(element).delayTimer) {
					/* Stop the timer from triggering its cached next() function. */
					clearTimeout(Data(element).delayTimer.setTimeout);

					/* Manually call the next() function so that the subsequent queue items can progress. */
					if (Data(element).delayTimer.next) {
						Data(element).delayTimer.next();
					}

					delete Data(element).delayTimer;
				}

				/* If we want to finish everything in the queue, we have to iterate through it
				 and call each function. This will make them active calls below, which will
				 cause them to be applied via the duration setting. */
				if (propertiesMap === "finishAll" && (options === true || isString(options))) {
					/* Iterate through the items in the element's queue. */
					$.each($.queue(element, isString(options) ? options : ""), function(_, item) {
						/* The queue array can contain an "inprogress" string, which we skip. */
						if (isFunction(item)) {
							item();
						}
					});

					/* Clearing the $.queue() array is achieved by resetting it to []. */
					$.queue(element, isString(options) ? options : "", []);
				}
			});

			var callsToStop: AnimationCall[] = [];

			/* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
			 been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
			 is stopped, the next item in its animation queue is immediately triggered. */
			/* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
			 or a custom queue string can be passed in. */
			/* Note: The stop command runs prior to Velocity's Queueing phase since its behavior is intended to take effect *immediately*,
			 regardless of the element's current queue state. */

			/* Iterate through every active call. */
			var queueName = (options === undefined) ? "" : options,
				activeCall = Velocity.State.first

			/* Iterate through all calls and pause any that contain any of our elements */
			for (; activeCall; activeCall = activeCall.next) {
				/* Iterate through the active call's targeted elements. */
				activeCall.elements.forEach(function(activeElement) {
					/* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
					 clear calls associated with the relevant queue. */
					/* Call stopping logic works as follows:
					 - options === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
					 - options === undefined --> stop current queue:"" call and all queue:false calls.
					 - options === false --> stop only queue:false calls.
					 - options === "custom" --> stop current queue:"custom" call, including remaining queued ones (there is no functionality to only clear the currently-running queue:"custom" call). */
					var queueName = (options === undefined) ? "" : options;

					if (queueName !== true && (activeCall.options.queue !== queueName) && !(options === undefined && activeCall.options.queue === false)) {
						return true;
					}

					/* Iterate through the calls targeted by the stop command. */
					elements.forEach(function(element) {
						/* Check that this call was applied to the target element. */
						if (element === activeElement) {
							/* Optionally clear the remaining queued calls. If we're doing "finishAll" this won't find anything,
							 due to the queue-clearing above. */
							if (options === true || isString(options)) {
								/* Iterate through the items in the element's queue. */
								$.each($.queue(element, isString(options) ? options : ""), function(_, item) {
									/* The queue array can contain an "inprogress" string, which we skip. */
									if (isFunction(item)) {
										/* Pass the item's callback a flag indicating that we want to abort from the queue call.
										 (Specifically, the queue will resolve the call's associated promise then abort.)  */
										item(null, true);
									}
								});

								/* Clearing the $.queue() array is achieved by resetting it to []. */
								$.queue(element, isString(options) ? options : "", []);
							}

							if (propertiesMap === "stop") {
								/* Since "reverse" uses cached start values (the previous call's endValues), these values must be
								 changed to reflect the final value that the elements were actually tweened to. */
								/* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
								 object. Also, queue:false animations can't be reversed. */
								var data = Data(element);
								if (data && data.tweensContainer && queueName !== false) {
									$.each(data.tweensContainer, function(m, activeTween) {
										activeTween.endValue = activeTween.currentValue;
									});
								}

								callsToStop.push(activeCall);
							} else if (propertiesMap === "finish" || propertiesMap === "finishAll") {
								/* To get active tweens to finish immediately, we forcefully shorten their durations to 1ms so that
								 they finish upon the next rAf tick then proceed with normal call completion logic. */
								activeCall.options.duration = 1;
							}
						}
					});
				});

			}

			/* Prematurely call completeCall() on each matched active call. Pass an additional flag for "stop" to indicate
			 that the complete callback and display:none setting should be skipped since we're completing prematurely. */
			if (propertiesMap === "stop") {
				callsToStop.forEach(function(activeCall) {
					completeCall(activeCall, true);
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
			} else if (isString(propertiesMap) && Velocity.Redirects[propertiesMap]) {
				opts = _assign({}, options);

				var durationOriginal = parseFloat(opts.duration as string),
					delayOriginal = parseFloat(opts.delay as string) || 0;

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
					Velocity.Redirects[propertiesMap as string].call(element, element, opts || {}, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
				});

				/* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
				 (The performance overhead up to this point is virtually non-existant.) */
				/* Note: The jQuery call chain is kept intact by returning the complete element set. */
				return getChain();
			} else {
				var abortError = "Velocity: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.";

				if (promiseData.promise) {
					promiseData.rejecter(new Error(abortError));
				} else if (window.console) {
					console.log(abortError);
				}

				return getChain();
			}
	}

	/**************************
	 Call-Wide Variables
	 **************************/

	/* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all elements
	 being animated in a single Velocity call. Calculating unit ratios necessitates DOM querying and updating, and is therefore
	 avoided (via caching) wherever possible. This container is call-wide instead of page-wide to avoid the risk of using stale
	 conversion metrics across Velocity animations that are not immediately consecutively chained. */
	var callUnitConversionData = {
		lastParent: null,
		lastPosition: null,
		lastFontSize: null,
		lastPercentToPxWidth: null,
		lastPercentToPxHeight: null,
		lastEmToPx: null,
		remToPx: null,
		vwToPx: null,
		vhToPx: null
	};

	/* A container for all the ensuing tween data and metadata associated with this call. This container gets pushed to the page-wide
	 Velocity.State.calls array that is processed during animation ticking. */
	var call: TweensContainer[] = [];

	/************************
	 Element Processing
	 ************************/

	/* Element processing consists of three parts -- data processing that cannot go stale and data processing that *can* go stale (i.e. third-party style modifications):
	 1) Pre-Queueing: Element-wide variables, including the element's data storage, are instantiated. Call options are prepared. If triggered, the Stop action is executed.
	 2) Queueing: The logic that runs once this call has reached its point of execution in the element's $.queue() stack. Most logic is placed here to avoid risking it becoming stale.
	 3) Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
	 `elementArrayIndex` allows passing index of the element in the original array to value functions.
	 If `elementsIndex` were used instead the index would be determined by the elements' per-element queue.
	 */
	function processElement(element: HTMLorSVGElement, elementArrayIndex) {

		/*************************
		 Part I: Pre-Queueing
		 *************************/

		/***************************
		 Element-Wide Variables
		 ***************************/

		var /* The runtime opts object is the extension of the current call's options and Velocity's page-wide option defaults. */
			opts: VelocityOptions = _assign({}, Velocity.defaults, options),
			/* A container for the processed data associated with each property in the propertyMap.
			 (Each property in the map produces its own "tween".) */
			tweensContainer: TweensContainer = {},
			elementUnitConversionData;

		/******************
		 Element Init
		 ******************/

		if (Data(element) === undefined) {
			Velocity.init(element);
		}

		/******************
		 Option: Delay
		 ******************/

		/* Since queue:false doesn't respect the item's existing queue, we avoid injecting its delay here (it's set later on). */
		/* Note: Velocity rolls its own delay function since jQuery doesn't have a utility alias for $.fn.delay()
		 (and thus requires jQuery element creation, which we avoid since its overhead includes DOM querying). */
		if (parseFloat(opts.delay as string) && opts.queue !== false) {
			$.queue(element, opts.queue, function(next) {
				/* This is a flag used to indicate to the upcoming completeCall() function that this queue entry was initiated by Velocity. See completeCall() for further details. */
				(Velocity as any).velocityQueueEntryFlag = true;

				/* The ensuing queue item (which is assigned to the "next" argument that $.queue() automatically passes in) will be triggered after a setTimeout delay.
				 The setTimeout is stored so that it can be subjected to clearTimeout() if this animation is prematurely stopped via Velocity's "stop" command, and
				 delayBegin/delayTime is used to ensure we can "pause" and "resume" a tween that is still mid-delay. */

				/* Temporarily store delayed elements to facilite access for global pause/resume */
				var callIndex = Velocity.State.delayedElements.count++;
				Velocity.State.delayedElements[callIndex] = element;

				var delayComplete = (function(index) {
					return function() {
						/* Clear the temporary element */
						Velocity.State.delayedElements[index] = false;

						/* Finally, issue the call */
						next();
					};
				})(callIndex);


				Data(element).delayBegin = (new Date()).getTime();
				Data(element).delay = parseFloat(opts.delay as string);
				Data(element).delayTimer = {
					setTimeout: setTimeout(next, parseFloat(opts.delay as string)),
					next: delayComplete
				};
			});
		}

		/*********************
		 Option: Duration
		 *********************/

		/* Support for jQuery's named durations. */
		switch (opts.duration.toString().toLowerCase()) {
			case "fast":
				opts.duration = 200;
				break;

			case "normal":
				opts.duration = DURATION_DEFAULT;
				break;

			case "slow":
				opts.duration = 600;
				break;

			default:
				/* Remove the potential "ms" suffix and default to 1 if the user is attempting to set a duration of 0 (in order to produce an immediate style change). */
				opts.duration = parseFloat(opts.duration as string) || 1;
		}

		/************************
		 Global Option: Mock
		 ************************/

		if (Velocity.mock !== false) {
			/* In mock mode, all animations are forced to 1ms so that they occur immediately upon the next rAF tick.
			 Alternatively, a multiplier can be passed in to time remap all delays and durations. */
			if (Velocity.mock === true) {
				opts.duration = opts.delay = 1;
			} else {
				opts.duration *= parseFloat(Velocity.mock) || 1;
				opts.delay = parseFloat(opts.delay as string) * parseFloat(Velocity.mock) || 1;
			}
		}

		/*******************
		 Option: Easing
		 *******************/

		opts.easing = getEasing(opts.easing, opts.duration);

		/**********************
		 Option: Callbacks
		 **********************/

		/* Callbacks must functions. Otherwise, default to null. */
		if (opts.begin && !isFunction(opts.begin)) {
			opts.begin = null;
		}

		if (opts.progress && !isFunction(opts.progress)) {
			opts.progress = null;
		}

		if (opts.complete && !isFunction(opts.complete)) {
			opts.complete = null;
		}

		/*********************************
		 Option: Display & Visibility
		 *********************************/

		/* Refer to Velocity's documentation (VelocityJS.org/#displayAndVisibility) for a description of the display and visibility options' behavior. */
		/* Note: We strictly check for undefined instead of falsiness because display accepts an empty string value. */
		if (opts.display !== undefined && opts.display !== null) {
			opts.display = opts.display.toString().toLowerCase();

			/* Users can pass in a special "auto" value to instruct Velocity to set the element to its default display value. */
			if (opts.display === "auto") {
				opts.display = vCSS.Values.getDisplayType(element);
			}
		}

		if (opts.visibility !== undefined && opts.visibility !== null) {
			opts.visibility = opts.visibility.toString().toLowerCase();
		}

		/**********************
		 Option: mobileHA
		 **********************/

		/* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
		 on animating elements. HA is removed from the element at the completion of its animation. */
		/* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
		/* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
		opts.mobileHA = (opts.mobileHA && Velocity.State.isMobile && !Velocity.State.isGingerbread);

		/***********************
		 Part II: Queueing
		 ***********************/

		/* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
		 In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
		/* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
		 the call array is pushed to Velocity.State.calls for live processing by the requestAnimationFrame tick. */
		function buildQueue() {
			var data: ElementData,
				lastTweensContainer;

			/*******************
			 Option: Begin
			 *******************/

			/* The begin callback is fired once per call -- not once per elemenet -- and is passed the full raw DOM element set as both its context and its first argument. */
			if (opts.begin && elementsIndex === 0) {
				/* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
				try {
					opts.begin.call(elements, elements);
				} catch (error) {
					setTimeout(function() {
						throw error;
					}, 1);
				}
			}

			/*****************************************
			 Tween Data Construction (for Scroll)
			 *****************************************/

			/* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Velocity as if it were a standard CSS property animation. */
			if (action === "scroll") {
				/* The scroll action uniquely takes an optional "offset" option -- specified in pixels -- that offsets the targeted scroll position. */
				var scrollDirection = (/^x$/i.test(opts.axis) ? "Left" : "Top"),
					scrollOffset = parseFloat(opts.offset as any as string) || 0,
					scrollPositionCurrent,
					scrollPositionCurrentAlternate,
					scrollPositionEnd;

				/* Scroll also uniquely takes an optional "container" option, which indicates the parent element that should be scrolled --
				 as opposed to the browser window itself. This is useful for scrolling toward an element that's inside an overflowing parent element. */
				if (opts.container) {
					/* Ensure that either a jQuery object or a raw DOM element was passed in. */
					if (isWrapped(opts.container) || isNode(opts.container)) {
						/* Extract the raw DOM element from the jQuery wrapper. */
						opts.container = opts.container[0] || opts.container;
						/* Note: Unlike other properties in Velocity, the browser's scroll position is never cached since it so frequently changes
						 (due to the user's natural interaction with the page). */
						scrollPositionCurrent = opts.container["scroll" + scrollDirection]; /* GET */

						/* $.position() values are relative to the container's currently viewable area (without taking into account the container's true dimensions
						 -- say, for example, if the container was not overflowing). Thus, the scroll end value is the sum of the child element's position *and*
						 the scroll container's current scroll position. */
						scrollPositionEnd = (scrollPositionCurrent + $(element).position()[scrollDirection.toLowerCase()]) + scrollOffset; /* GET */
						/* If a value other than a jQuery object or a raw DOM element was passed in, default to null so that this option is ignored. */
					} else {
						opts.container = null;
					}
				} else {
					/* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using
					 the appropriate cached property names (which differ based on browser type). */
					scrollPositionCurrent = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + scrollDirection]]; /* GET */
					/* When scrolling the browser window, cache the alternate axis's current value since window.scrollTo() doesn't let us change only one value at a time. */
					scrollPositionCurrentAlternate = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + (scrollDirection === "Left" ? "Top" : "Left")]]; /* GET */

					/* Unlike $.position(), $.offset() values are relative to the browser window's true dimensions -- not merely its currently viewable area --
					 and therefore end values do not need to be compounded onto current values. */
					scrollPositionEnd = $(element).offset()[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
				}

				/* Since there's only one format that scroll's associated tweensContainer can take, we create it manually. */
				tweensContainer = {
					scroll: {
						rootPropertyValue: false,
						startValue: scrollPositionCurrent,
						currentValue: scrollPositionCurrent,
						endValue: scrollPositionEnd,
						unitType: "",
						easing: opts.easing,
						scrollData: {
							container: opts.container,
							direction: scrollDirection,
							alternateValue: scrollPositionCurrentAlternate
						}
					},
					element: element
				};

				if (Velocity.debug) {
					console.log("tweensContainer (scroll): ", (tweensContainer as any).scroll, element);
				}

				/******************************************
				 Tween Data Construction (for Reverse)
				 ******************************************/

				/* Reverse acts like a "start" action in that a property map is animated toward. The only difference is
				 that the property map used for reverse is the inverse of the map used in the previous call. Thus, we manipulate
				 the previous call to construct our new map: use the previous map's end values as our new map's start values. Copy over all other data. */
				/* Note: Reverse can be directly called via the "reverse" parameter, or it can be indirectly triggered via the loop option. (Loops are composed of multiple reverses.) */
				/* Note: Reverse calls do not need to be consecutively chained onto a currently-animating element in order to operate on cached values;
				 there is no harm to reverse being called on a potentially stale data cache since reverse's behavior is simply defined
				 as reverting to the element's values as they were prior to the previous *Velocity* call. */
			} else if (action === "reverse") {
				data = Data(element);

				/* Abort if there is no prior animation data to reverse to. */
				if (!data) {
					return;
				}

				if (!data.tweensContainer) {
					/* Dequeue the element so that this queue entry releases itself immediately, allowing subsequent queue entries to run. */
					$.dequeue(element, opts.queue);

					return;
				} else {
					/*********************
					 Options Parsing
					 *********************/

					/* If the element was hidden via the display option in the previous call,
					 revert display to "auto" prior to reversal so that the element is visible again. */
					if (data.opts.display === "none") {
						data.opts.display = "auto";
					}

					if (data.opts.visibility === "hidden") {
						data.opts.visibility = "visible";
					}

					/* If the loop option was set in the previous call, disable it so that "reverse" calls aren't recursively generated.
					 Further, remove the previous call's callback options; typically, users do not want these to be refired. */
					data.opts.loop = false;
					data.opts.begin = null;
					data.opts.complete = null;

					/* Since we're extending an opts object that has already been extended with the defaults options object,
					 we remove non-explicitly-defined properties that are auto-assigned values. */
					if (!options.easing) {
						delete opts.easing;
					}

					if (!options.duration) {
						delete opts.duration;
					}

					/* The opts object used for reversal is an extension of the options object optionally passed into this
					 reverse call plus the options used in the previous Velocity call. */
					opts = _assign({}, data.opts, opts);

					/*************************************
					 Tweens Container Reconstruction
					 *************************************/

					/* Create a deep copy (indicated via the true flag) of the previous call's tweensContainer. */
					lastTweensContainer = $.extend(true, {}, data ? data.tweensContainer : null);

					/* Manipulate the previous tweensContainer by replacing its end values and currentValues with its start values. */
					for (var lastTween in lastTweensContainer) {
						/* In addition to tween data, tweensContainers contain an element property that we ignore here. */
						if (lastTweensContainer.hasOwnProperty(lastTween) && lastTween !== "element") {
							var lastStartValue = lastTweensContainer[lastTween].startValue;

							lastTweensContainer[lastTween].startValue = lastTweensContainer[lastTween].currentValue = lastTweensContainer[lastTween].endValue;
							lastTweensContainer[lastTween].endValue = lastStartValue;

							/* Easing is the only option that embeds into the individual tween data (since it can be defined on a per-property basis).
							 Accordingly, every property's easing value must be updated when an options object is passed in with a reverse call.
							 The side effect of this extensibility is that all per-property easing values are forcefully reset to the new value. */
							if (!isEmptyObject(options)) {
								lastTweensContainer[lastTween].easing = opts.easing;
							}

							if (Velocity.debug) {
								console.log("reverse tweensContainer (" + lastTween + "): " + JSON.stringify(lastTweensContainer[lastTween]), element);
							}
						}
					}

					tweensContainer = lastTweensContainer;
				}

				/*****************************************
				 Tween Data Construction (for Start)
				 *****************************************/

			} else if (action === "start") {

				/*************************
				 Value Transferring
				 *************************/

				/* If this queue entry follows a previous Velocity-initiated queue entry *and* if this entry was created
				 while the element was in the process of being animated by Velocity, then this current call is safe to use
				 the end values from the prior call as its start values. Velocity attempts to perform this value transfer
				 process whenever possible in order to avoid requerying the DOM. */
				/* If values aren't transferred from a prior call and start values were not forcefed by the user (more on this below),
				 then the DOM is queried for the element's current values as a last resort. */
				/* Note: Conversely, animation reversal (and looping) *always* perform inter-call value transfers; they never requery the DOM. */

				data = Data(element);

				/* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale)
				 to transfer over end values to use as start values. If it's set to true and there is a previous
				 Velocity call to pull values from, do so. */
				if (data && data.tweensContainer && data.isAnimating === true) {
					lastTweensContainer = data.tweensContainer;
				}

				/***************************
				 Tween Data Calculation
				 ***************************/

				/* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
				/* Property map values can either take the form of 1) a single value representing the end value,
				 or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
				 The optional third parameter is a forcefed startValue to be used instead of querying the DOM for
				 the element's current value. Read Velocity's docmentation to learn more about forcefeeding: VelocityJS.org/#forcefeeding */
				var parsePropertyValue = function(valueData: any, skipResolvingEasing?: boolean) {
					var endValue, easing, startValue;

					/* If we have a function as the main argument then resolve it first, in case it returns an array that needs to be split */
					if (isFunction(valueData)) {
						valueData = valueData.call(element, elementArrayIndex, elementsLength);
					}

					/* Handle the array format, which can be structured as one of three potential overloads:
					 A) [ endValue, easing, startValue ], B) [ endValue, easing ], or C) [ endValue, startValue ] */
					if (Array.isArray(valueData)) {
						/* endValue is always the first item in the array. Don't bother validating endValue's value now
						 since the ensuing property cycling logic does that. */
						endValue = valueData[0];

						/* Two-item array format: If the second item is a number, function, or hex string, treat it as a
						 start value since easings can only be non-hex strings or arrays. */
						if ((!Array.isArray(valueData[1]) && /^[\d-]/.test(valueData[1])) || isFunction(valueData[1]) || vCSS.RegEx.isHex.test(valueData[1])) {
							startValue = valueData[1];
							/* Two or three-item array: If the second item is a non-hex string easing name or an array, treat it as an easing. */
						} else if ((isString(valueData[1]) && !vCSS.RegEx.isHex.test(valueData[1]) && Velocity.Easings[valueData[1]]) || Array.isArray(valueData[1])) {
							easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1], opts.duration);

							/* Don't bother validating startValue's value now since the ensuing property cycling logic inherently does that. */
							startValue = valueData[2];
						} else {
							startValue = valueData[1] || valueData[2];
						}
						/* Handle the single-value format. */
					} else {
						endValue = valueData;
					}

					/* Default to the call's easing if a per-property easing type was not defined. */
					if (!skipResolvingEasing) {
						easing = easing || opts.easing;
					}

					/* If functions were passed in as values, pass the function the current element as its context,
					 plus the element's index and the element set's size as arguments. Then, assign the returned value. */
					if (isFunction(endValue)) {
						endValue = endValue.call(element, elementArrayIndex, elementsLength);
					}

					if (isFunction(startValue)) {
						startValue = startValue.call(element, elementArrayIndex, elementsLength);
					}

					/* Allow startValue to be left as undefined to indicate to the ensuing code that its value was not forcefed. */
					return [endValue || 0, easing, startValue];
				};

				var fixPropertyValue = function(property, valueData) {
					/* In case this property is a hook, there are circumstances where we will intend to work on the hook's root property and not the hooked subproperty. */
					var rootProperty = vCSS.Hooks.getRoot(property),
						rootPropertyValue = false,
						/* Parse out endValue, easing, and startValue from the property's data. */
						endValue = valueData[0],
						easing = valueData[1],
						startValue = valueData[2],
						pattern;

					/**************************
					 Start Value Sourcing
					 **************************/

					/* Other than for the dummy tween property, properties that are not supported by the browser (and do not have an associated normalization) will
					 inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead.
					 Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */
					/* Note: Since SVG elements have some of their properties directly applied as HTML attributes,
					 there is no way to check for their explicit browser support, and so we skip skip this check for them. */
					if ((!data || !data.isSVG) && rootProperty !== "tween" && vCSS.Names.prefixCheck(rootProperty)[1] === false && vCSS.Normalizations.registered[rootProperty] === undefined) {
						if (Velocity.debug) {
							console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");
						}
						return;
					}

					/* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being
					 animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
					 a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
					if (((opts.display !== undefined && opts.display !== null && opts.display !== "none") || (opts.visibility !== undefined && opts.visibility !== "hidden")) && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
						startValue = 0;
					}

					/* If values have been transferred from the previous Velocity call, extract the endValue and rootPropertyValue
					 for all of the current call's properties that were *also* animated in the previous call. */
					/* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
					if ((opts as any)._cacheValues && lastTweensContainer && lastTweensContainer[property]) {
						if (startValue === undefined) {
							startValue = lastTweensContainer[property].endValue + lastTweensContainer[property].unitType;
						}

						/* The previous call's rootPropertyValue is extracted from the element's data cache since that's the
						 instance of rootPropertyValue that gets freshly updated by the tweening process, whereas the rootPropertyValue
						 attached to the incoming lastTweensContainer is equal to the root property's value prior to any tweening. */
						rootPropertyValue = data.rootPropertyValueCache[rootProperty];
						/* If values were not transferred from a previous Velocity call, query the DOM as needed. */
					} else {
						/* Handle hooked properties. */
						if (vCSS.Hooks.registered[property]) {
							if (startValue === undefined) {
								rootPropertyValue = vCSS.getPropertyValue(element, rootProperty); /* GET */
								/* Note: The following getPropertyValue() call does not actually trigger a DOM query;
								 getPropertyValue() will extract the hook from rootPropertyValue. */
								startValue = vCSS.getPropertyValue(element, property, rootPropertyValue as any);
								/* If startValue is already defined via forcefeeding, do not query the DOM for the root property's value;
								 just grab rootProperty's zero-value template from vCSS.Hooks. This overwrites the element's actual
								 root property value (if one is set), but this is acceptable since the primary reason users forcefeed is
								 to avoid DOM queries, and thus we likewise avoid querying the DOM for the root property's value. */
							} else {
								/* Grab this hook's zero-value template, e.g. "0px 0px 0px black". */
								rootPropertyValue = vCSS.Hooks.templates[rootProperty][1];
							}
							/* Handle non-hooked properties that haven't already been defined via forcefeeding. */
						} else if (startValue === undefined) {
							startValue = vCSS.getPropertyValue(element, property); /* GET */
						}
					}

					/**************************
					 Value Data Extraction
					 **************************/

					var separatedValue,
						endValueUnitType,
						startValueUnitType,
						operator: boolean | string = false;

					/* Separates a property value into its numeric value and its unit type. */
					var separateValue = function(property, value) {
						var unitType,
							numericValue;

						numericValue = (value || "0")
							.toString()
							.toLowerCase()
							/* Match the unit type at the end of the value. */
							.replace(/[%A-z]+$/, function(match) {
								/* Grab the unit type. */
								unitType = match;

								/* Strip the unit type off of value. */
								return "";
							});

						/* If no unit type was supplied, assign one that is appropriate for this property (e.g. "deg" for rotateZ or "px" for width). */
						if (!unitType) {
							unitType = vCSS.Values.getUnitType(property);
						}

						return [numericValue, unitType];
					};

					if (startValue !== endValue && isString(startValue) && isString(endValue)) {
						pattern = "";
						var iStart = 0, // index in startValue
							iEnd = 0, // index in endValue
							aStart = [], // array of startValue numbers
							aEnd = [], // array of endValue numbers
							inCalc = 0, // Keep track of being inside a "calc()" so we don't duplicate it
							inRGB = 0, // Keep track of being inside an RGB as we can't use fractional values
							inRGBA = 0; // Keep track of being inside an RGBA as we must pass fractional for the alpha channel

						startValue = vCSS.Hooks.fixColors(startValue);
						endValue = vCSS.Hooks.fixColors(endValue);
						while (iStart < startValue.length && iEnd < endValue.length) {
							var cStart = startValue[iStart],
								cEnd = endValue[iEnd];

							if (/[\d\.-]/.test(cStart) && /[\d\.-]/.test(cEnd)) {
								var tStart = cStart, // temporary character buffer
									tEnd = cEnd, // temporary character buffer
									dotStart = ".", // Make sure we can only ever match a single dot in a decimal
									dotEnd = "."; // Make sure we can only ever match a single dot in a decimal

								while (++iStart < startValue.length) {
									cStart = startValue[iStart];
									if (cStart === dotStart) {
										dotStart = ".."; // Can never match two characters
									} else if (!/\d/.test(cStart)) {
										break;
									}
									tStart += cStart;
								}
								while (++iEnd < endValue.length) {
									cEnd = endValue[iEnd];
									if (cEnd === dotEnd) {
										dotEnd = ".."; // Can never match two characters
									} else if (!/\d/.test(cEnd)) {
										break;
									}
									tEnd += cEnd;
								}
								var uStart = vCSS.Hooks.getUnit(startValue, iStart), // temporary unit type
									uEnd = vCSS.Hooks.getUnit(endValue, iEnd); // temporary unit type

								iStart += uStart.length;
								iEnd += uEnd.length;
								if (uStart === uEnd) {
									// Same units
									if (tStart === tEnd) {
										// Same numbers, so just copy over
										pattern += tStart + uStart;
									} else {
										// Different numbers, so store them
										pattern += "{" + aStart.length + (inRGB ? "!" : "") + "}" + uStart;
										aStart.push(parseFloat(tStart));
										aEnd.push(parseFloat(tEnd));
									}
								} else {
									// Different units, so put into a "calc(from + to)" and animate each side to/from zero
									var nStart = parseFloat(tStart),
										nEnd = parseFloat(tEnd);

									pattern += (inCalc < 5 ? "calc" : "") + "("
										+ (nStart ? "{" + aStart.length + (inRGB ? "!" : "") + "}" : "0") + uStart
										+ " + "
										+ (nEnd ? "{" + (aStart.length + (nStart ? 1 : 0)) + (inRGB ? "!" : "") + "}" : "0") + uEnd
										+ ")";
									if (nStart) {
										aStart.push(nStart);
										aEnd.push(0);
									}
									if (nEnd) {
										aStart.push(0);
										aEnd.push(nEnd);
									}
								}
							} else if (cStart === cEnd) {
								pattern += cStart;
								iStart++;
								iEnd++;
								// Keep track of being inside a calc()
								if (inCalc === 0 && cStart === "c"
									|| inCalc === 1 && cStart === "a"
									|| inCalc === 2 && cStart === "l"
									|| inCalc === 3 && cStart === "c"
									|| inCalc >= 4 && cStart === "("
								) {
									inCalc++;
								} else if ((inCalc && inCalc < 5)
									|| inCalc >= 4 && cStart === ")" && --inCalc < 5) {
									inCalc = 0;
								}
								// Keep track of being inside an rgb() / rgba()
								if (inRGB === 0 && cStart === "r"
									|| inRGB === 1 && cStart === "g"
									|| inRGB === 2 && cStart === "b"
									|| inRGB === 3 && cStart === "a"
									|| inRGB >= 3 && cStart === "("
								) {
									if (inRGB === 3 && cStart === "a") {
										inRGBA = 1;
									}
									inRGB++;
								} else if (inRGBA && cStart === ",") {
									if (++inRGBA > 3) {
										inRGB = inRGBA = 0;
									}
								} else if ((inRGBA && inRGB < (inRGBA ? 5 : 4))
									|| inRGB >= (inRGBA ? 4 : 3) && cStart === ")" && --inRGB < (inRGBA ? 5 : 4)) {
									inRGB = inRGBA = 0;
								}
							} else {
								inCalc = 0;
								// TODO: changing units, fixing colours
								break;
							}
						}
						if (iStart !== startValue.length || iEnd !== endValue.length) {
							if (Velocity.debug) {
								console.error("Trying to pattern match mis-matched strings [\"" + endValue + "\", \"" + startValue + "\"]");
							}
							pattern = undefined;
						}
						if (pattern) {
							if (aStart.length) {
								if (Velocity.debug) {
									console.log("Pattern found \"" + pattern + "\" -> ", aStart, aEnd, "[" + startValue + "," + endValue + "]");
								}
								startValue = aStart;
								endValue = aEnd;
								endValueUnitType = startValueUnitType = "";
							} else {
								pattern = undefined;
							}
						}
					}

					if (!pattern) {
						/* Separate startValue. */
						separatedValue = separateValue(property, startValue);
						startValue = separatedValue[0];
						startValueUnitType = separatedValue[1];

						/* Separate endValue, and extract a value operator (e.g. "+=", "-=") if one exists. */
						separatedValue = separateValue(property, endValue);
						endValue = separatedValue[0].replace(/^([+-\/*])=/, function(match, subMatch) {
							operator = subMatch;

							/* Strip the operator off of the value. */
							return "";
						});
						endValueUnitType = separatedValue[1];

						/* Parse float values from endValue and startValue. Default to 0 if NaN is returned. */
						startValue = parseFloat(startValue) || 0;
						endValue = parseFloat(endValue) || 0;

						/***************************************
						 Property-Specific Value Conversion
						 ***************************************/

						/* Custom support for properties that don't actually accept the % unit type, but where pollyfilling is trivial and relatively foolproof. */
						if (endValueUnitType === "%") {
							/* A %-value fontSize/lineHeight is relative to the parent's fontSize (as opposed to the parent's dimensions),
							 which is identical to the em unit's behavior, so we piggyback off of that. */
							if (/^(fontSize|lineHeight)$/.test(property)) {
								/* Convert % into an em decimal value. */
								endValue = endValue / 100;
								endValueUnitType = "em";
								/* For scaleX and scaleY, convert the value into its decimal format and strip off the unit type. */
							} else if (/^scale/.test(property)) {
								endValue = endValue / 100;
								endValueUnitType = "";
								/* For RGB components, take the defined percentage of 255 and strip off the unit type. */
							} else if (/(Red|Green|Blue)$/i.test(property)) {
								endValue = (endValue / 100) * 255;
								endValueUnitType = "";
							}
						}
					}

					/***************************
					 Unit Ratio Calculation
					 ***************************/

					/* When queried, the browser returns (most) CSS property values in pixels. Therefore, if an endValue with a unit type of
					 %, em, or rem is animated toward, startValue must be converted from pixels into the same unit type as endValue in order
					 for value manipulation logic (increment/decrement) to proceed. Further, if the startValue was forcefed or transferred
					 from a previous call, startValue may also not be in pixels. Unit conversion logic therefore consists of two steps:
					 1) Calculating the ratio of %/em/rem/vh/vw relative to pixels
					 2) Converting startValue into the same unit of measurement as endValue based on these ratios. */
					/* Unit conversion ratios are calculated by inserting a sibling node next to the target node, copying over its position property,
					 setting values with the target unit type then comparing the returned pixel value. */
					/* Note: Even if only one of these unit types is being animated, all unit ratios are calculated at once since the overhead
					 of batching the SETs and GETs together upfront outweights the potential overhead
					 of layout thrashing caused by re-querying for uncalculated ratios for subsequently-processed properties. */
					/* Todo: Shift this logic into the calls' first tick instance so that it's synced with RAF. */
					var calculateUnitRatios = function() {

						/************************
						 Same Ratio Checks
						 ************************/

						/* The properties below are used to determine whether the element differs sufficiently from this call's
						 previously iterated element to also differ in its unit conversion ratios. If the properties match up with those
						 of the prior element, the prior element's conversion ratios are used. Like most optimizations in Velocity,
						 this is done to minimize DOM querying. */
						var sameRatioIndicators = {
							myParent: element.parentNode || document.body, /* GET */
							position: vCSS.getPropertyValue(element, "position"), /* GET */
							fontSize: vCSS.getPropertyValue(element, "fontSize") /* GET */
						},
							/* Determine if the same % ratio can be used. % is based on the element's position value and its parent's width and height dimensions. */
							samePercentRatio = ((sameRatioIndicators.position === callUnitConversionData.lastPosition) && (sameRatioIndicators.myParent === callUnitConversionData.lastParent)),
							/* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
							sameEmRatio = (sameRatioIndicators.fontSize === callUnitConversionData.lastFontSize);

						/* Store these ratio indicators call-wide for the next element to compare against. */
						callUnitConversionData.lastParent = sameRatioIndicators.myParent;
						callUnitConversionData.lastPosition = sameRatioIndicators.position;
						callUnitConversionData.lastFontSize = sameRatioIndicators.fontSize;

						/***************************
						 Element-Specific Units
						 ***************************/

						/* Note: IE8 rounds to the nearest pixel when returning CSS values, thus we perform conversions using a measurement
						 of 100 (instead of 1) to give our ratios a precision of at least 2 decimal values. */
						var measurement = 100,
							unitRatios: {[key: string]: any} = {};

						if (!sameEmRatio || !samePercentRatio) {
							var dummy = data && data.isSVG ? document.createElementNS("http://www.w3.org/2000/svg", "rect") : document.createElement("div");

							Velocity.init(dummy);
							sameRatioIndicators.myParent.appendChild(dummy);

							/* To accurately and consistently calculate conversion ratios, the element's cascaded overflow and box-sizing are stripped.
							 Similarly, since width/height can be artificially constrained by their min-/max- equivalents, these are controlled for as well. */
							/* Note: Overflow must be also be controlled for per-axis since the overflow property overwrites its per-axis values. */
							$.each(["overflow", "overflowX", "overflowY"], function(i, property) {
								vCSS.setPropertyValue(dummy, property, "hidden");
							});
							vCSS.setPropertyValue(dummy, "position", sameRatioIndicators.position);
							vCSS.setPropertyValue(dummy, "fontSize", sameRatioIndicators.fontSize);
							vCSS.setPropertyValue(dummy, "boxSizing", "content-box");

							/* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. */
							$.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function(i, property) {
								vCSS.setPropertyValue(dummy, property, measurement + "%");
							});
							/* paddingLeft arbitrarily acts as our proxy property for the em ratio. */
							vCSS.setPropertyValue(dummy, "paddingLeft", measurement + "em");

							/* Divide the returned value by the measurement to get the ratio between 1% and 1px. Default to 1 since working with 0 can produce Infinite. */
							unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth = (parseFloat(vCSS.getPropertyValue(dummy, "width", null, true)) || 1) / measurement; /* GET */
							unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight = (parseFloat(vCSS.getPropertyValue(dummy, "height", null, true)) || 1) / measurement; /* GET */
							unitRatios.emToPx = callUnitConversionData.lastEmToPx = (parseFloat(vCSS.getPropertyValue(dummy, "paddingLeft")) || 1) / measurement; /* GET */

							sameRatioIndicators.myParent.removeChild(dummy);
						} else {
							unitRatios.emToPx = callUnitConversionData.lastEmToPx;
							unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth;
							unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight;
						}

						/***************************
						 Element-Agnostic Units
						 ***************************/

						/* Whereas % and em ratios are determined on a per-element basis, the rem unit only needs to be checked
						 once per call since it's exclusively dependant upon document.body's fontSize. If this is the first time
						 that calculateUnitRatios() is being run during this call, remToPx will still be set to its default value of null,
						 so we calculate it now. */
						if (callUnitConversionData.remToPx === null) {
							/* Default to browsers' default fontSize of 16px in the case of 0. */
							callUnitConversionData.remToPx = parseFloat(vCSS.getPropertyValue(document.body, "fontSize")) || 16; /* GET */
						}

						/* Similarly, viewport units are %-relative to the window's inner dimensions. */
						if (callUnitConversionData.vwToPx === null) {
							callUnitConversionData.vwToPx = window.innerWidth / 100; /* GET */
							callUnitConversionData.vhToPx = window.innerHeight / 100; /* GET */
						}

						unitRatios.remToPx = callUnitConversionData.remToPx;
						unitRatios.vwToPx = callUnitConversionData.vwToPx;
						unitRatios.vhToPx = callUnitConversionData.vhToPx;

						if (Velocity.debug >= 1) {
							console.log("Unit ratios: " + JSON.stringify(unitRatios), element);
						}
						return unitRatios;
					};

					/********************
					 Unit Conversion
					 ********************/

					/* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
					if (/[\/*]/.test(operator as any as string)) {
						endValueUnitType = startValueUnitType;
						/* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType
						 is a relative unit (%, em, rem), the values set during tweening will continue to be accurately relative even if the metrics they depend
						 on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
						 would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
						/* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnit */
					} else if ((startValueUnitType !== endValueUnitType) && startValue !== 0) {
						/* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used for tween values to remain accurate. */
						/* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively
						 match the underlying metrics if they change, but this is acceptable since we're animating toward invisibility instead of toward visibility,
						 which remains past the point of the animation's completion. */
						if (endValue === 0) {
							endValueUnitType = startValueUnitType;
						} else {
							/* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing).
							 If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
							elementUnitConversionData = elementUnitConversionData || calculateUnitRatios();

							/* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
							/* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element. */
							var axis = (/margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property) || property === "x") ? "x" : "y";

							/* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process:
							 1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit type. */
							switch (startValueUnitType) {
								case "%":
									/* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions.
									 Velocity does not include a special conversion process to account for this behavior. Therefore, animating translateX/Y from a % value
									 to a non-% value will produce an incorrect start value. Fortunately, this sort of cross-unit conversion is rarely done by users in practice. */
									startValue *= (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
									break;

								case "px":
									/* px acts as our midpoint in the unit conversion process; do nothing. */
									break;

								default:
									startValue *= elementUnitConversionData[startValueUnitType + "ToPx"];
							}

							/* Invert the px ratios to convert into to the target unit. */
							switch (endValueUnitType) {
								case "%":
									startValue *= 1 / (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
									break;

								case "px":
									/* startValue is already in px, do nothing; we're done. */
									break;

								default:
									startValue *= 1 / elementUnitConversionData[endValueUnitType + "ToPx"];
							}
						}
					}

					/*********************
					 Relative Values
					 *********************/

					/* Operator logic must be performed last since it requires unit-normalized start and end values. */
					/* Note: Relative *percent values* do not behave how most people think; while one would expect "+=50%"
					 to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
					 50 points is added on top of the current % value. */
					switch (operator as any as string) {
						case "+":
							endValue = startValue + endValue;
							break;

						case "-":
							endValue = startValue - endValue;
							break;

						case "*":
							endValue = startValue * endValue;
							break;

						case "/":
							endValue = startValue / endValue;
							break;
					}

					/**************************
					 tweensContainer Push
					 **************************/

					/* Construct the per-property tween object, and push it to the element's tweensContainer. */
					tweensContainer[property] = {
						rootPropertyValue: rootPropertyValue,
						startValue: startValue,
						currentValue: startValue,
						endValue: endValue,
						unitType: endValueUnitType,
						easing: easing
					};
					if (pattern) {
						tweensContainer[property].pattern = pattern;
					}

					if (Velocity.debug) {
						console.log("tweensContainer (" + property + "): " + JSON.stringify(tweensContainer[property]), element);
					}
				};

				/* Create a tween out of each property, and append its associated data to tweensContainer. */
				for (var property in propertiesMap as {}) {

					if (!propertiesMap.hasOwnProperty(property)) {
						continue;
					}
					/* The original property name's format must be used for the parsePropertyValue() lookup,
					 but we then use its camelCase styling to normalize it for manipulation. */
					var propertyName = vCSS.Names.camelCase(property),
						valueData = parsePropertyValue(propertiesMap[property]);

					/* Find shorthand color properties that have been passed a hex string. */
					/* Would be quicker to use vCSS.Lists.colors.includes() if possible */
					if (_inArray(vCSS.Lists.colors, propertyName)) {
						/* Parse the value data for each shorthand. */
						var endValue = valueData[0],
							easing = valueData[1],
							startValue = valueData[2];

						if (vCSS.RegEx.isHex.test(endValue)) {
							/* Convert the hex strings into their RGB component arrays. */
							var colorComponents = ["Red", "Green", "Blue"],
								endValueRGB = vCSS.Values.hexToRgb(endValue),
								startValueRGB = startValue ? vCSS.Values.hexToRgb(startValue) : undefined;

							/* Inject the RGB component tweens into propertiesMap. */
							for (var i = 0; i < colorComponents.length; i++) {
								var dataArray = [endValueRGB[i]];

								if (easing) {
									dataArray.push(easing);
								}

								if (startValueRGB !== undefined) {
									dataArray.push(startValueRGB[i]);
								}

								fixPropertyValue(propertyName + colorComponents[i], dataArray);
							}
							/* If we have replaced a shortcut color value then don't update the standard property name */
							continue;
						}
					}
					fixPropertyValue(propertyName, valueData);
				}

				/* Along with its property data, store a reference to the element itself onto tweensContainer. */
				tweensContainer.element = element;
			}

			/*****************
			 Call Push
			 *****************/

			/* Note: tweensContainer can be empty if all of the properties in this call's property map were skipped due to not
			 being supported by the browser. The element property is used for checking that the tweensContainer has been appended to. */
			if (tweensContainer.element) {
				/* Apply the "velocity-animating" indicator class. */
				vCSS.Values.addClass(element, "velocity-animating");

				/* The call array houses the tweensContainers for each element being animated in the current call. */
				call.push(tweensContainer);

				data = Data(element);

				if (data) {
					/* Store the tweensContainer and options if we're working on the default effects queue, so that they can be used by the reverse command. */
					if (opts.queue === "") {
						data.tweensContainer = tweensContainer as any;
						data.opts = opts;
					}
					/* Switch on the element's animating flag. */
					data.isAnimating = true;
				}

				/* Once the final element in this call's element set has been processed, push the call array onto
				 Velocity.State.calls for the animation tick to immediately begin processing. */
				if (elementsIndex === elementsLength - 1) {
					/* Add the current call plus its associated metadata (the element set and the call's options) onto the global call container.
					 Anything on this call container is subjected to tick() processing. */
					var last = Velocity.State.last,
						next: AnimationCall = Velocity.State.last = {
							next: undefined, // Setting here as we know it'll be needed
							prev: Velocity.State.last,
							call: call,
							elements: elements,
							options: opts,
							resolver: promiseData.resolver
						};

					if (last) {
						last.next = next;
					} else {
						Velocity.State.first = next;
					}

					/* If the animation tick isn't running, start it. (Velocity shuts it off when there are no active calls to process.) */
					if (Velocity.State.isTicking === false) {
						Velocity.State.isTicking = true;

						/* Start the tick loop. */
						tick();
					}
				} else {
					elementsIndex++;
				}
			}
		}

		/* When the queue option is set to false, the call skips the element's queue and fires immediately. */
		if (opts.queue === false) {
			/* Since this buildQueue call doesn't respect the element's existing queue (which is where a delay option would have been appended),
			 we manually inject the delay property here with an explicit setTimeout. */
			if (opts.delay) {

				/* Temporarily store delayed elements to facilitate access for global pause/resume */
				var callIndex = Velocity.State.delayedElements.count++;
				Velocity.State.delayedElements[callIndex] = element;

				var delayComplete = (function(index) {
					return function() {
						/* Clear the temporary element */
						Velocity.State.delayedElements[index] = false;

						/* Finally, issue the call */
						buildQueue();
					};
				})(callIndex);

				Data(element).delayBegin = (new Date()).getTime();
				Data(element).delay = parseFloat(opts.delay as string);
				Data(element).delayTimer = {
					setTimeout: setTimeout(buildQueue, parseFloat(opts.delay as string)),
					next: delayComplete
				};
			} else {
				buildQueue();
			}
			/* Otherwise, the call undergoes element queueing as normal. */
			/* Note: To interoperate with jQuery, Velocity uses jQuery's own $.queue() stack for queuing logic. */
		} else {
			$.queue(element, opts.queue, function(next, clearQueue) {
				/* If the clearQueue flag was passed in by the stop command, resolve this call's promise. (Promises can only be resolved once,
				 so it's fine if this is repeatedly triggered for each element in the associated call.) */
				if (clearQueue === true) {
					if (promiseData.promise) {
						promiseData.resolver(elements);
					}

					/* Do not continue with animation queueing. */
					return true;
				}

				/* This flag indicates to the upcoming completeCall() function that this queue entry was initiated by Velocity.
				 See completeCall() for further details. */
				(Velocity as any).velocityQueueEntryFlag = true;

				buildQueue();
			});
		}

		/*********************
		 Auto-Dequeuing
		 *********************/

		/* As per jQuery's $.queue() behavior, to fire the first non-custom-queue entry on an element, the element
		 must be dequeued if its queue stack consists *solely* of the current call. (This can be determined by checking
		 for the "inprogress" item that jQuery prepends to active queue stack arrays.) Regardless, whenever the element's
		 queue is further appended with additional items -- including $.delay()'s or even $.animate() calls, the queue's
		 first entry is automatically fired. This behavior contrasts that of custom queues, which never auto-fire. */
		/* Note: When an element set is being subjected to a non-parallel Velocity call, the animation will not begin until
		 each one of the elements in the set has reached the end of its individually pre-existing queue chain. */
		/* Note: Unfortunately, most people don't fully grasp jQuery's powerful, yet quirky, $.queue() function.
		 Lean more here: http://stackoverflow.com/questions/1058158/can-somebody-explain-jquery-queue-to-me */
		if ((opts.queue === "" || opts.queue === "fx") && $.queue(element)[0] !== "inprogress") {
			$.dequeue(element);
		}
	}

	/**************************
	 Element Set Iteration
	 **************************/

	/* If the "nodeType" property exists on the elements variable, we're animating a single element.
	 Place it in an array so that $.each() can iterate over it. */
	elements.forEach(function(element, index) {
		/* Ensure each element in a set has a nodeType (is a real element) to avoid throwing errors. */
		if (isNode(element)) {
			processElement(element, index);
		}
	});

	/******************
	 Option: Loop
	 ******************/

	/* The loop option accepts an integer indicating how many times the element should loop between the values in the
	 current call's properties map and the element's property values prior to this call. */
	/* Note: The loop option's logic is performed here -- after element processing -- because the current call needs
	 to undergo its queue insertion prior to the loop option generating its series of constituent "reverse" calls,
	 which chain after the current call. Two reverse calls (two "alternations") constitute one loop. */
	var loop = isBoolean(options.loop) ? 0 : Math.floor(options.loop) || 0;

	if (loop > 0) {
		/* Since the logic for the reverse action occurs inside Queueing and therefore this call's options object
		 isn't parsed until then as well, the current call's delay option must be explicitly passed into the reverse
		 call so that the delay logic that occurs inside *Pre-Queueing* can process it. */
		var reverseOptions: VelocityOptions = {
			delay: options.delay || Velocity.defaults.delay,
			progress: options.progress
		};

		while (--loop) {
			Velocity(elements, "reverse", reverseOptions);
			Velocity(elements, "reverse", reverseOptions);
		}

		reverseOptions.display = options.display;
		reverseOptions.visibility = options.visibility;
		reverseOptions.complete = options.complete;
		Velocity(elements, "reverse", reverseOptions);
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
 - Queueing: The logic that runs once the call has reached its point of execution in the element's $.queue() stack.
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
		for (var i = 7; i > 4; i--) {
			var div = document.createElement("div");

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

var $ = jQuery,
	global: any = this as Window,
	isJQuery = false;

if (global.fn && global.fn.jquery) {
	$ = global;
	isJQuery = true;
} else {
	$ = jQuery;
}

/*************
 State
 *************/

namespace Velocity {
	/* For legacy support, also expose the literal animate method. */
	export var animate = Velocity;

	/* Container for page-wide Velocity state data. */
	export namespace State {
		export var
			isClient = window && window instanceof Window,
			/* Detect mobile devices to determine if mobileHA should be turned on. */
			isMobile = isClient && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			/* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
			isAndroid = isClient && /Android/i.test(navigator.userAgent),
			isGingerbread = isClient && /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
			isChrome = isClient && (window as any).chrome,
			isFirefox = isClient && /Firefox/i.test(navigator.userAgent),
			/* Create a cached element for re-use when checking for CSS property prefixes. */
			prefixElement = isClient && document.createElement("div"),
			/* Cache every prefix match to avoid repeating lookups. */
			prefixMatches = {},
			/* Retrieve the appropriate scroll anchor and property name for the browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY */
			windowScrollAnchor = isClient && window.pageYOffset !== undefined,
			/* Cache the anchor used for animating window scrolling. */
			scrollAnchor = windowScrollAnchor ? window : (!isClient || document.documentElement || document.body.parentNode || document.body),
			/* Cache the browser-specific property names associated with the scroll anchor. */
			scrollPropertyLeft = windowScrollAnchor ? "pageXOffset" : "scrollLeft",
			scrollPropertyTop = windowScrollAnchor ? "pageYOffset" : "scrollTop",
			/* Keep track of whether our RAF tick is running. */
			isTicking = false,
			/* Container for every in-progress call to Velocity. */
			first: AnimationCall,
			last: AnimationCall,
			delayedElements = {
				count: 0
			}
	};

	/* Velocity's custom CSS stack. Made global for unit testing. */
	export var CSS = vCSS;

	/* A shim of the jQuery utility functions used by Velocity -- provided by Velocity's optional jQuery shim. */
	export var Utilities = $;

	/* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
	export var Redirects = {/* Manually registered by the user. */};


	/***********************
	 Packaged Redirects
	 ***********************/

	/* slideUp, slideDown */
	["Down", "Up"].forEach(function(direction) {
		Redirects["slide" + direction] = function(element: HTMLorSVGElement, options: VelocityOptions, elementsIndex: number, elementsSize, elements: HTMLorSVGElement[], promiseData) {
			var opts: ElementData = _assign({}, options) as ElementData,
				begin = opts.begin,
				complete = opts.complete,
				inlineValues = {},
				computedValues = {
					height: "",
					marginTop: "",
					marginBottom: "",
					paddingTop: "",
					paddingBottom: ""
				};

			if (opts.display === undefined) {
				/* Show the element before slideDown begins and hide the element after slideUp completes. */
				/* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */
				opts.display = (direction === "Down" ? (vCSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block") : "none");
			}

			opts.begin = function() {
				/* If the user passed in a begin callback, fire it now. */
				if (elementsIndex === 0 && begin) {
					begin.call(elements, elements);
				}

				/* Cache the elements' original vertical dimensional property values so that we can animate back to them. */
				for (var property in computedValues) {
					if (!computedValues.hasOwnProperty(property)) {
						continue;
					}
					inlineValues[property] = element.style[property];

					/* For slideDown, use forcefeeding to animate all vertical properties from 0. For slideUp,
					 use forcefeeding to start from computed values and animate down to 0. */
					var propertyValue = vCSS.getPropertyValue(element, property);
					computedValues[property] = (direction === "Down") ? [propertyValue, 0] : [0, propertyValue];
				}

				/* Force vertical overflow content to clip so that sliding works as expected. */
				(inlineValues as any).overflow = element.style.overflow;
				element.style.overflow = "hidden";
			};

			opts.complete = function() {
				/* Reset element to its pre-slide inline values once its slide animation is complete. */
				for (var property in inlineValues) {
					if (inlineValues.hasOwnProperty(property)) {
						element.style[property] = inlineValues[property];
					}
				}

				/* If the user passed in a complete callback, fire it now. */
				if (elementsIndex === elementsSize - 1) {
					if (complete) {
						complete.call(elements, elements);
					}
					if (promiseData) {
						promiseData.resolver(elements);
					}
				}
			};

			(Velocity as any)(element, computedValues, opts);
		};
	});

	/* fadeIn, fadeOut */
	["In", "Out"].forEach(function(direction) {
		Redirects["fade" + direction] = function(element: HTMLorSVGElement, options: VelocityOptions, elementsIndex: number, elementsSize, elements: HTMLorSVGElement[], promiseData) {
			var opts: ElementData = _assign({}, options) as ElementData,
				complete = opts.complete,
				propertiesMap = {
					opacity: (direction === "In") ? 1 : 0
				};

			/* Since redirects are triggered individually for each element in the animated set, avoid repeatedly triggering
			 callbacks by firing them only when the final element has been reached. */
			if (elementsIndex !== 0) {
				opts.begin = null;
			}
			if (elementsIndex !== elementsSize - 1) {
				opts.complete = null;
			} else {
				opts.complete = function() {
					if (complete) {
						complete.call(elements, elements);
					}
					if (promiseData) {
						promiseData.resolver(elements);
					}
				};
			}

			/* If a display was passed in, use it. Otherwise, default to "none" for fadeOut or the element-specific default for fadeIn. */
			/* Note: We allow users to pass in "null" to skip display setting altogether. */
			if (opts.display === undefined) {
				opts.display = (direction === "In" ? "auto" : "none");
			}

			(Velocity as any)(this, propertiesMap, opts);
		};
	});

	export var Easings: {[name: string]: any} = {
		/* jQuery easings. */
		linear: function(p) {
			return p;
		},
		swing: function(p) {
			return 0.5 - Math.cos(p * Math.PI) / 2;
		},
		/* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
		spring: function(p) {
			return 1 - (Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6));
		},
		/* Common names */
		ease: generateBezier(0.25, 0.1, 0.25, 1.0),
		easeIn: generateBezier(0.42, 0.0, 1.00, 1.0),
		easeOut: generateBezier(0.00, 0.0, 0.58, 1.0),
		easeInOut: generateBezier(0.42, 0.0, 0.58, 1.0),
		easeInSine: generateBezier(0.47, 0, 0.745, 0.715),
		easeOutSine: generateBezier(0.39, 0.575, 0.565, 1),
		easeInOutSine: generateBezier(0.445, 0.05, 0.55, 0.95),
		easeInQuad: generateBezier(0.55, 0.085, 0.68, 0.53),
		easeOutQuad: generateBezier(0.25, 0.46, 0.45, 0.94),
		easeInOutQuad: generateBezier(0.455, 0.03, 0.515, 0.955),
		easeInCubic: generateBezier(0.55, 0.055, 0.675, 0.19),
		easeOutCubic: generateBezier(0.215, 0.61, 0.355, 1),
		easeInOutCubic: generateBezier(0.645, 0.045, 0.355, 1),
		easeInQuart: generateBezier(0.895, 0.03, 0.685, 0.22),
		easeOutQuart: generateBezier(0.165, 0.84, 0.44, 1),
		easeInOutQuart: generateBezier(0.77, 0, 0.175, 1),
		easeInQuint: generateBezier(0.755, 0.05, 0.855, 0.06),
		easeOutQuint: generateBezier(0.23, 1, 0.32, 1),
		easeInOutQuint: generateBezier(0.86, 0, 0.07, 1),
		easeInExpo: generateBezier(0.95, 0.05, 0.795, 0.035),
		easeOutExpo: generateBezier(0.19, 1, 0.22, 1),
		easeInOutExpo: generateBezier(1, 0, 0, 1),
		easeInCirc: generateBezier(0.6, 0.04, 0.98, 0.335),
		easeOutCirc: generateBezier(0.075, 0.82, 0.165, 1),
		easeInOutCirc: generateBezier(0.785, 0.135, 0.15, 0.86),
		/* Dashed names */
		"ease-in": generateBezier(0.42, 0.0, 1.00, 1.0),
		"ease-out": generateBezier(0.00, 0.0, 0.58, 1.0),
		"ease-in-out": generateBezier(0.42, 0.0, 0.58, 1.0),

	};

	/* Velocity option defaults, which can be overriden by the user. */
	export var defaults: VelocityOptions = {
		queue: "",
		duration: DURATION_DEFAULT,
		easing: EASING_DEFAULT,
		loop: false,
		delay: false,
		mobileHA: true,
		/* Advanced: Set to false to prevent property values from being cached between consecutive Velocity-initiated chain calls. */
		_cacheValues: true,
		/* Advanced: Set to false if the promise should always resolve on empty element lists. */
		promiseRejectEmpty: true
	};

	/* A design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache. */
	export function init(element) {
		$.data(element, "velocity", {
			/* Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements. */
			isSVG: isSVG(element),
			/* Keep track of whether the element is currently being animated by Velocity.
			 This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
			isAnimating: false,
			/* A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
			computedStyle: null,
			/* Tween data is cached for each animation on the element so that data can be passed across calls --
			 in particular, end values are used as subsequent start values in consecutive Velocity calls. */
			tweensContainer: null,
			/* The full root property values of each CSS hook being animated on this element are cached so that:
			 1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
			 2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values. */
			rootPropertyValueCache: {},
			/* A cache for transform updates, which must be manually flushed via vCSS.flushTransformCache(). */
			transformCache: {}
		});
	}

	/* A parallel to jQuery's $.css(), used for getting/setting Velocity's hooked CSS properties. */
	export function hook(elements: HTMLorSVGElement[], arg2, arg3) {
		var value;

		elements = sanitizeElements(elements);

		elements.forEach(function(element) {
			/* Initialize Velocity's per-element data cache if this element hasn't previously been animated. */
			if (Data(element) === undefined) {
				Velocity.init(element);
			}

			/* Get property value. If an element set was passed in, only return the value for the first element. */
			if (arg3 === undefined) {
				if (value === undefined) {
					value = vCSS.getPropertyValue(element, arg2);
				}
				/* Set property value. */
			} else {
				/* sPV returns an array of the normalized propertyName/propertyValue pair used to update the DOM. */
				var adjustedSet = vCSS.setPropertyValue(element, arg2, arg3);

				/* Transform properties don't automatically set. They have to be flushed to the DOM. */
				if (adjustedSet[0] === "transform") {
					vCSS.flushTransformCache(element);
				}

				value = adjustedSet;
			}
		});

		return value;
	};

	/* Velocity-wide animation time remapping for testing purposes. */
	export var mock = false;

	export var version = {major: 1, minor: 5, patch: 0};

	/* Set to 1 or 2 (most verbose) to output debug info to console. */
	export var debug = false as boolean | number;

	/* Use rAF high resolution timestamp when available */
	export var timestamp = true;

	/* Pause all animations */
	export function pauseAll(queueName) {
		var currentTime = (new Date()).getTime(),
			activeCall = Velocity.State.first;

		for (; activeCall; activeCall = activeCall.next) {
			/* If we have a queueName and this call is not on that queue, skip */
			if (queueName !== undefined && ((activeCall.options.queue !== queueName) || (activeCall.options.queue === false))) {
				continue;
			}
			/* Set call to paused */
			activeCall.paused = true;
		}
		/* Pause timers on any currently delayed calls */
		$.each(Velocity.State.delayedElements, function(k, element) {
			if (!element) {
				return;
			}
			pauseDelayOnElement(element, currentTime);
		});
	};

	/* Resume all animations */
	export function resumeAll(queueName) {
		var currentTime = (new Date()).getTime(),
			activeCall = Velocity.State.first;

		for (; activeCall; activeCall = activeCall.next) {
			/* If we have a queueName and this call is not on that queue, skip */
			if (queueName !== undefined && ((activeCall.options.queue !== queueName) || (activeCall.options.queue === false))) {
				continue;
			}

			/* Set call to resumed if it was paused */
			if (activeCall.paused === true) {
				activeCall.paused = false;
			}
		}
		/* Resume timers on any currently delayed calls */
		$.each(Velocity.State.delayedElements, function(k, element) {
			if (!element) {
				return;
			}
			resumeDelayOnElement(element, currentTime);
		});
	}
};

/* Shorthand alias for jQuery's $.data() utility. */
function Data(element): ElementData {
	/* Hardcode a reference to the plugin name. */
	var response = $.data(element, "velocity");

	/* jQuery <=1.4.2 returns null instead of undefined when no match is found. We normalize this behavior. */
	return response === null ? undefined : response;
}

/**************
 Delay Timer
 **************/

function pauseDelayOnElement(element: HTMLorSVGElement, currentTime: number) {
	/* Check for any delay timers, and pause the set timeouts (while preserving time data)
	 to be resumed when the "resume" command is issued */
	var data = Data(element);

	if (data && data.delayTimer && !data.delayPaused) {
		data.delayRemaining = data.delay - currentTime + data.delayBegin;
		data.delayPaused = true;
		clearTimeout(data.delayTimer.setTimeout);
	}
}

function resumeDelayOnElement(element: HTMLorSVGElement, currentTime: number) {
	/* Check for any paused timers and resume */
	var data = Data(element);

	if (data && data.delayTimer && data.delayPaused) {
		/* If the element was mid-delay, re initiate the timeout with the remaining delay */
		data.delayPaused = false;
		data.delayTimer.setTimeout = setTimeout(data.delayTimer.next, data.delayRemaining);
	}
}

/*****************
 CSS Stack
 *****************/

/* Register hooks and normalizations. */
vCSS.Hooks.register();
vCSS.Normalizations.register();

/*****************
 Animation
 *****************/


/**************
 Timing
 **************/

/* Ticker function. */
var ticker = rAFShim;

/* Inactive browser tabs pause rAF, which results in all active animations immediately sprinting to their completion states when the tab refocuses.
 To get around this, we dynamically switch rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus. We skip this for mobile
 devices to avoid wasting battery power on inactive tabs. */
/* Note: Tab focus detection doesn't work on older versions of IE, but that's okay since they don't support rAF to begin with. */
if (!Velocity.State.isMobile && document.hidden !== undefined) {
	var updateTicker = function() {
		/* Reassign the rAF function (which the global tick() function uses) based on the tab's focus state. */
		if (document.hidden) {
			ticker = function(callback: any) {
				/* The tick function needs a truthy first argument in order to pass its internal timestamp check. */
				return setTimeout(function() {
					callback(true);
				}, 16);
			};

			/* The rAF loop has been paused by the browser, so we manually restart the tick. */
			tick();
		} else {
			ticker = rAFShim;
		}
	};

	/* Page could be sitting in the background at this time (i.e. opened as new tab) so making sure we use correct ticker from the start */
	updateTicker();

	/* And then run check again every time visibility changes */
	document.addEventListener("visibilitychange", updateTicker);
}

/************
 Tick
 ************/

/* Note: All calls to Velocity are pushed to the Velocity.State.calls array, which is fully iterated through upon each tick. */
function tick(timestamp?: number | boolean) {
	/* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
	 We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
	 the browser's next tick sync time occurs, which results in the first elements subjected to Velocity
	 calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
	 the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
	 by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
	if (timestamp) {
		/* We normally use RAF's high resolution timestamp but as it can be significantly offset when the browser is
		 under high stress we give the option for choppiness over allowing the browser to drop huge chunks of frames.
		 We use performance.now() and shim it if it doesn't exist for when the tab is hidden. */
		var timeCurrent = Velocity.timestamp && timestamp !== true ? timestamp : performance.now(),
			activeCall = Velocity.State.first

		/********************
		 Call Iteration
		 ********************/

		/* Iterate through each active call. */
		for (; activeCall; activeCall = activeCall.next) {
			/************************
			 Call-Wide Variables
			 ************************/
			var call = activeCall.call,
				opts = activeCall.options,
				timeStart = activeCall.timeStart,
				firstTick = !!timeStart,
				tweenDummyValue = null;

			/* If timeStart is undefined, then this is the first time that this call has been processed by tick().
			 We assign timeStart now so that its value is as close to the real animation start time as possible.
			 (Conversely, had timeStart been defined when this call was added to Velocity.State.calls, the delay
			 between that time and now would cause the first few frames of the tween to be skipped since
			 percentComplete is calculated relative to timeStart.) */
			/* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
			 first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
			 same style value as the element's current value. */
			if (!timeStart) {
				timeStart = activeCall.timeStart = timeCurrent - 16;
			}

			/* If a pause key is present, skip processing unless it has been set to resume */
			if (activeCall.paused === true) {
				continue;
			} else if (activeCall.paused === false) {
				/* Update the time start to accomodate the paused completion amount */
				timeStart = activeCall.timeStart = Math.round(timeCurrent - activeCall.ellapsedTime - 16);

				/* Remove pause key after processing */
				activeCall.paused = undefined;
			}

			/* The tween's completion percentage is relative to the tween's start time, not the tween's start value
			 (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
			 Accordingly, we ensure that percentComplete does not exceed 1. */
			var millisecondsEllapsed = activeCall.ellapsedTime = timeCurrent - timeStart,
				percentComplete = Math.min((millisecondsEllapsed) / (opts.duration as number), 1);

			/**********************
			 Element Iteration
			 **********************/

			/* For every call, iterate through each of the elements in its set. */
			for (var j = 0, callLength = call.length; j < callLength; j++) {
				var tweensContainer = call[j],
					element = tweensContainer.element;

				/* Check to see if this element has been deleted midway through the animation by checking for the
				 continued existence of its data cache. If it's gone, or the element is currently paused, skip animating this element. */
				if (!Data(element)) {
					continue;
				}

				var transformPropertyExists = false;

				/**********************************
				 Display & Visibility Toggling
				 **********************************/

				/* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
				 (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
				if (opts.display !== undefined && opts.display !== null && opts.display !== "none") {
					if (opts.display === "flex") {
						var flexValues = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];

						$.each(flexValues, function(i, flexValue) {
							vCSS.setPropertyValue(element, "display", flexValue);
						});
					}

					vCSS.setPropertyValue(element, "display", opts.display);
				}

				/* Same goes with the visibility option, but its "none" equivalent is "hidden". */
				if (opts.visibility !== undefined && opts.visibility !== "hidden") {
					vCSS.setPropertyValue(element, "visibility", opts.visibility);
				}

				/************************
				 Property Iteration
				 ************************/

				/* For every element, iterate through each property. */
				for (var property in tweensContainer) {
					/* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
					if (tweensContainer.hasOwnProperty(property) && property !== "element") {
						var tween = tweensContainer[property],
							currentValue,
							/* Easing can either be a pre-genereated function or a string that references a pre-registered easing
							 on the Velocity.Easings object. In either case, return the appropriate easing *function*. */
							easing = isString(tween.easing) ? Velocity.Easings[tween.easing] : tween.easing;

						/******************************
						 Current Value Calculation
						 ******************************/

						if (isString(tween.pattern)) {
							var patternReplace = percentComplete === 1 ?
								function($0, index, round) {
									var result = tween.endValue[index];

									return round ? Math.round(result) : result;
								} :
								function($0, index, round) {
									var startValue = tween.startValue[index],
										tweenDelta = tween.endValue[index] - startValue,
										result = startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));

									return round ? Math.round(result) : result;
								};

							currentValue = tween.pattern.replace(/{(\d+)(!)?}/g, patternReplace);
						} else if (percentComplete === 1) {
							/* If this is the last tick pass (if we've reached 100% completion for this tween),
							 ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
							currentValue = tween.endValue;
						} else {
							/* Otherwise, calculate currentValue based on the current delta from startValue. */
							var tweenDelta = tween.endValue - tween.startValue;

							currentValue = tween.startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));
							/* If no value change is occurring, don't proceed with DOM updating. */
						}
						if (!firstTick && (currentValue === tween.currentValue)) {
							continue;
						}

						tween.currentValue = currentValue;

						/* If we're tweening a fake 'tween' property in order to log transition values, update the one-per-call variable so that
						 it can be passed into the progress callback. */
						if (property === "tween") {
							tweenDummyValue = currentValue;
						} else {
							/******************
							 Hooks: Part I
							 ******************/
							var hookRoot;

							/* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
							 for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
							 rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
							 updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
							 subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
							if (vCSS.Hooks.registered[property]) {
								hookRoot = vCSS.Hooks.getRoot(property);

								var rootPropertyValueCache = Data(element).rootPropertyValueCache[hookRoot];

								if (rootPropertyValueCache) {
									tween.rootPropertyValue = rootPropertyValueCache;
								}
							}

							/*****************
							 DOM Update
							 *****************/

							/* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
							/* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
							var adjustedSetData = vCSS.setPropertyValue(element, /* SET */
								property,
								tween.currentValue + (IE < 9 && parseFloat(currentValue) === 0 ? "" : tween.unitType),
								tween.rootPropertyValue,
								tween.scrollData);

							/*******************
							 Hooks: Part II
							 *******************/

							/* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
							if (vCSS.Hooks.registered[property]) {
								/* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
								if (vCSS.Normalizations.registered[hookRoot]) {
									Data(element).rootPropertyValueCache[hookRoot] = vCSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
								} else {
									Data(element).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
								}
							}

							/***************
							 Transforms
							 ***************/

							/* Flag whether a transform property is being animated so that flushTransformCache() can be triggered once this tick pass is complete. */
							if (adjustedSetData[0] === "transform") {
								transformPropertyExists = true;
							}

						}
					}
				}

				/****************
				 mobileHA
				 ****************/

				/* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
				 It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
				if (opts.mobileHA) {
					/* Don't set the null transform hack if we've already done so. */
					if (Data(element).transformCache.translate3d === undefined) {
						/* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
						Data(element).transformCache.translate3d = "(0px, 0px, 0px)";

						transformPropertyExists = true;
					}
				}

				if (transformPropertyExists) {
					vCSS.flushTransformCache(element);
				}
			}

			/* The non-"none" display value is only applied to an element once -- when its associated call is first ticked through.
			 Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
			if (opts.display !== undefined && opts.display !== "none") {
				opts.display = false;
			}
			if (opts.visibility !== undefined && opts.visibility !== "hidden") {
				opts.visibility = false;
			}

			/* Pass the elements and the timing data (percentComplete, msRemaining, timeStart, tweenDummyValue) into the progress callback. */
			if (opts.progress) {
				opts.progress.call(activeCall.elements,
					activeCall.elements,
					percentComplete,
					Math.max(0, (timeStart + (opts.duration as number)) - timeCurrent),
					timeStart,
					tweenDummyValue);
			}

			/* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
			if (percentComplete === 1) {
				completeCall(activeCall);
			}
		}
	}

	/* Note: completeCall() sets the isTicking flag to false when the last call on Velocity.State.calls has completed. */
	if (Velocity.State.isTicking) {
		ticker(tick);
	}
}

/**********************
 Call Completion
 **********************/

/* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
function completeCall(activeCall: AnimationCall, isStopped?: boolean) {
	// TODO: Check if it's not been completed already

	/* Pull the metadata from the call. */
	var call = activeCall.call,
		elements = activeCall.elements,
		opts = activeCall.options,
		resolver = activeCall.resolver;

	/*************************
	 Element Finalization
	 *************************/

	for (var i = 0, callLength = call.length; i < callLength; i++) {
		var element = call[i].element;

		/* If the user set display to "none" (intending to hide the element), set it now that the animation has completed. */
		/* Note: display:none isn't set when calls are manually stopped (via Velocity("stop"). */
		/* Note: Display gets ignored with "reverse" calls and infinite loops, since this behavior would be undesirable. */
		if (!isStopped && !opts.loop) {
			if (opts.display === "none") {
				vCSS.setPropertyValue(element, "display", opts.display);
			}

			if (opts.visibility === "hidden") {
				vCSS.setPropertyValue(element, "visibility", opts.visibility);
			}
		}

		/* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run
		 a non-Velocity-initiated entry, turn off the isAnimating flag. A non-Velocity-initiatied queue entry's logic might alter
		 an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
		 we check for the existence of our special Velocity.queueEntryFlag declaration, which minifiers won't rename since the flag
		 is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
		var data = Data(element);

		if ((opts.loop !== true || isStopped) && ($.queue(element)[1] === undefined || !/\.velocityQueueEntryFlag/i.test($.queue(element)[1]))) {
			/* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
			if (data) {
				data.isAnimating = false;
				/* Clear the element's rootPropertyValueCache, which will become stale. */
				data.rootPropertyValueCache = {};

				var transformHAPropertyExists = false;
				/* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
				$.each(vCSS.Lists.transforms3D, function(i, transformName) {
					var defaultValue = /^scale/.test(transformName) ? 1 : 0,
						currentValue = data.transformCache[transformName];

					if (data.transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
						transformHAPropertyExists = true;

						delete data.transformCache[transformName];
					}
				});

				/* Mobile devices have hardware acceleration removed at the end of the animation in order to avoid hogging the GPU's memory. */
				if (opts.mobileHA) {
					transformHAPropertyExists = true;
					delete data.transformCache.translate3d;
				}

				/* Flush the subproperty removals to the DOM. */
				if (transformHAPropertyExists) {
					vCSS.flushTransformCache(element);
				}

				/* Remove the "velocity-animating" indicator class. */
				vCSS.Values.removeClass(element, "velocity-animating");
			}
		}

		/*********************
		 Option: Complete
		 *********************/

		/* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
		/* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
		if (!isStopped && opts.complete && !opts.loop && (i === callLength - 1)) {
			/* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
			try {
				opts.complete.call(elements, elements);
			} catch (error) {
				setTimeout(function() {
					throw error;
				}, 1);
			}
		}

		/**********************
		 Promise Resolving
		 **********************/

		/* Note: Infinite loops don't return promises. */
		if (resolver && opts.loop !== true) {
			resolver(elements);
		}

		/****************************
		 Option: Loop (Infinite)
		 ****************************/

		if (data && opts.loop === true && !isStopped) {
			/* If a rotateX/Y/Z property is being animated by 360 deg with loop:true, swap tween start/end values to enable
			 continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */
			$.each(data.tweensContainer, function(propertyName, tweenContainer) {
				if (/^rotate/.test(propertyName) && ((parseFloat(tweenContainer.startValue) - parseFloat(tweenContainer.endValue)) % 360 === 0)) {
					var oldStartValue = tweenContainer.startValue;

					tweenContainer.startValue = tweenContainer.endValue;
					tweenContainer.endValue = oldStartValue;
				}

				if (/^backgroundPosition/.test(propertyName) && parseFloat(tweenContainer.endValue) === 100 && tweenContainer.unitType === "%") {
					tweenContainer.endValue = 0;
					tweenContainer.startValue = 100;
				}
			});

			(Velocity as any)(element, "reverse", {loop: true, delay: opts.delay});
		}

		/***************
		 Dequeueing
		 ***************/

		/* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
		 which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
		 $.dequeue() must still be called in order to completely clear jQuery's animation queue. */
		if (opts.queue !== false) {
			$.dequeue(element, opts.queue);
		}
	}

	/************************
	 Calls Array Cleanup
	 ************************/

	/* Since this call is complete, set it to false so that the rAF tick skips it. This array is later compacted via compactSparseArray().
	 (For performance reasons, the call is set to false instead of being deleted from the array: http://www.html5rocks.com/en/tutorials/speed/v8/) */
	if (Velocity.State.first === activeCall) {
		Velocity.State.first = activeCall.next;
	} else if (activeCall.prev) {
		activeCall.prev.next = activeCall.next;
	}
	if (Velocity.State.last === activeCall) {
		Velocity.State.last = activeCall.prev;
	} else if (activeCall.next) {
		activeCall.next.prev = activeCall.prev;
	}
	activeCall.next = activeCall.prev = undefined;

	Velocity.State.isTicking = !!Velocity.State.first;
}

/******************
 Frameworks
 ******************/

// Global call
global.Velocity = Velocity;

if (window === global) {
	/* Both jQuery and Zepto allow their $.fn object to be extended to allow wrapped elements to be subjected to plugin calls.
	 If either framework is loaded, register a "velocity" extension pointing to Velocity's core animate() method.  Velocity
	 also registers itself onto a global container (window.jQuery || window.Zepto || window) so that certain features are
	 accessible beyond just a per-element scope. Accordingly, Velocity can both act on wrapped DOM elements and stand alone
	 for targeting raw DOM elements. */
	defineProperty(window.jQuery, "Velocity", Velocity);
	defineProperty(window.jQuery && window.jQuery.fn, "velocity", Velocity);
	defineProperty(window.Zepto, "Velocity", Velocity);
	defineProperty(window.Zepto && window.Zepto.fn, "velocity", Velocity);

	defineProperty(Element && Element.prototype, "velocity", Velocity);
	defineProperty(NodeList && NodeList.prototype, "velocity", Velocity);
	defineProperty(HTMLCollection && HTMLCollection.prototype, "velocity", Velocity);
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
