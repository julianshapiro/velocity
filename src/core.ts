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
function VelocityFn(this: VelocityElements | void, ...__args: any[]): VelocityResult {
	const
		/**
		 * A shortcut to the default options.
		 */
		defaults = VelocityStatic.defaults,
		/**
		 * Shortcut to arguments for file size.
		 */
		_arguments = arguments,
		/**
		 * Cache of the first argument - this is used often enough to be saved.
		 */
		args0 = _arguments[0] as VelocityObjectArgs,
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
		syntacticSugar = isPlainObject(args0) && (args0.p || ((isPlainObject(args0.properties) && !(args0.properties as any).names) || isString(args0.properties)));
	let
		/**
		 *  When Velocity is called via the utility function (Velocity()),
		 * elements are explicitly passed in as the first parameter. Thus,
		 * argument positioning varies.
		 */
		argumentIndex: number = 0,
		/**
		 * The list of elements, extended with Promise and Velocity.
		 */
		elements: VelocityResult,
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
		 * Options supplied, this will be mapped and validated into
		 * <code>options</code>.
		 */
		optionsMap: VelocityOptions,
		/**
		 * If called via a chain then this contains the <b>last</b> calls
		 * animations. If this does not have a value then any access to the
		 * element's animations needs to be to the currently-running ones.
		 */
		animations: AnimationCall[],
		/**
		 * The promise that is returned.
		 */
		promise: Promise<VelocityResult>,
		// Used when the animation is finished
		resolver: (value?: VelocityResult) => void,
		// Used when there was an issue with one or more of the Velocity arguments
		rejecter: (reason: any) => void;

	//console.log("Velocity", _arguments)
	// First get the elements, and the animations connected to the last call if
	// this is chained.
	// TODO: Clean this up a bit
	// TODO: Throw error if the chain is called with elements as the first argument. isVelocityResult(this) && ( (isNode(arg0) || isWrapped(arg0)) && arg0 == this)
	if (isNode(this)) {
		// This is from a chain such as document.getElementById("").velocity(...)
		elements = [this as HTMLorSVGElement] as VelocityResult;
	} else if (isWrapped(this)) {
		// This might be a chain from something else, but if chained from a
		// previous Velocity() call then grab the animations it's related to.
		elements = Object.assign([], this as HTMLorSVGElement[]) as VelocityResult;
		if (isVelocityResult(this)) {
			animations = (this as VelocityResult).velocity.animations;
		}
	} else if (syntacticSugar) {
		elements = Object.assign([], args0.elements || args0.e) as VelocityResult;
		argumentIndex++;
	} else if (isNode(args0)) {
		elements = Object.assign([], [args0]) as VelocityResult;
		argumentIndex++;
	} else if (isWrapped(args0)) {
		elements = Object.assign([], args0) as VelocityResult;
		argumentIndex++;
	}
	// Allow elements to be chained.
	if (elements) {
		defineProperty(elements, "velocity", VelocityFn.bind(elements));
		if (animations) {
			defineProperty(elements.velocity, "animations", animations);
		}
	}
	// Next get the propertiesMap and options.
	if (syntacticSugar) {
		propertiesMap = getValue(args0.properties, args0.p);
	} else {
		// TODO: Should be possible to call Velocity("pauseAll") - currently not possible
		propertiesMap = _arguments[argumentIndex++] as string | VelocityProperties;
	}
	// Get any options map passed in as arguments first, expand any direct
	// options if possible.
	const isReverse = propertiesMap === "reverse",
		isAction = !isReverse && isString(propertiesMap),
		opts = syntacticSugar ? getValue(args0.options, args0.o) : _arguments[argumentIndex];

	if (isPlainObject(opts)) {
		optionsMap = opts;
	}
	// Create the promise if supported and wanted.
	if (Promise && getValue(optionsMap && optionsMap.promise, defaults.promise)) {
		promise = new Promise(function(_resolve, _reject) {
			rejecter = _reject;
			// IMPORTANT:
			// If a resolver tries to run on a Promise then it will wait until
			// that Promise resolves - but in this case we're running on our own
			// Promise, so need to make sure it's not seen as one. Setting these
			// values to <code>undefined</code> for the duration of the resolve.
			// Due to being an async call, they should be back to "normal"
			// before the <code>.then()</code> function gets called.
			resolver = function(args: VelocityResult) {
				if (isVelocityResult(args)) {
					const _then = args && args.then;

					if (_then) {
						args.then = undefined; // Preserving enumeration etc
					}
					_resolve(args);
					if (_then) {
						args.then = _then;
					}
				} else {
					_resolve(args);
				}
			};
		});
		if (elements) {
			defineProperty(elements, "then", promise.then.bind(promise));
			defineProperty(elements, "catch", promise.catch.bind(promise));
			if ((promise as any).finally) {
				// Semi-standard
				defineProperty(elements, "finally", (promise as any).finally.bind(promise));
			}
		}
	}
	const promiseRejectEmpty: boolean = getValue(optionsMap && optionsMap.promiseRejectEmpty, defaults.promiseRejectEmpty);

	if (promise) {
		if (!elements && !isAction) {
			if (promiseRejectEmpty) {
				rejecter("Velocity: No elements supplied, if that is deliberate then pass `promiseRejectEmpty:false` as an option. Aborting.");
			} else {
				resolver();
			}
		} else if (!propertiesMap) {
			if (promiseRejectEmpty) {
				rejecter("Velocity: No properties supplied, if that is deliberate then pass `promiseRejectEmpty:false` as an option. Aborting.");
			} else {
				resolver();
			}
		}
	}
	if ((!elements && !isAction) || !propertiesMap) {
		return promise as any;
	}

	// NOTE: Can't use isAction here due to type inference - there are callbacks
	// between so the type isn't considered safe.
	if (isAction) {
		const args: any[] = [],
			promiseHandler: VelocityPromise = promise && {
				_promise: promise,
				_resolver: resolver,
				_rejecter: rejecter
			};

		while (argumentIndex < _arguments.length) {
			args.push(_arguments[argumentIndex++]);
		}

		// Velocity's behavior is categorized into "actions". If a string is
		// passed in instead of a propertiesMap then that will call a function
		// to do something special to the animation linked.
		// There is one special case - "reverse" - which is handled differently,
		// by being stored on the animation and then expanded when the animation
		// starts.
		const action = (propertiesMap as string).replace(/\..*$/, ""),
			callback = VelocityStatic.Actions[action] || VelocityStatic.Actions["default"];

		if (callback) {
			const result = callback(args, elements, promiseHandler, propertiesMap as string);

			if (result !== undefined) {
				return result;
			}
		} else {
			console.warn("VelocityJS: Unknown action:", propertiesMap);
		}
	} else if (isPlainObject(propertiesMap) || isReverse) {
		/**
		 * The options for this set of animations.
		 */
		const options: StrictVelocityOptions = {};
		let isSync = defaults.sync;

		// Private options first - set as non-enumerable, and starting with an
		// underscore so we can filter them out.
		if (promise) {
			defineProperty(options, "_promise", promise);
			defineProperty(options, "_rejecter", rejecter);
			defineProperty(options, "_resolver", resolver);
		}
		defineProperty(options, "_ready", 0);
		defineProperty(options, "_started", 0);
		defineProperty(options, "_completed", 0);
		defineProperty(options, "_total", 0);

		// Now check the optionsMap
		if (isPlainObject(optionsMap)) {
			options.duration = getValue(validateDuration(optionsMap.duration), defaults.duration);
			options.delay = getValue(validateDelay(optionsMap.delay), defaults.delay);
			// Need the extra fallback here in case it supplies an invalid
			// easing that we need to overrride with the default.
			options.easing = validateEasing(getValue(optionsMap.easing, defaults.easing), options.duration) || validateEasing(defaults.easing, options.duration);
			options.loop = getValue(validateLoop(optionsMap.loop), defaults.loop);
			options.repeat = options.repeatAgain = getValue(validateRepeat(optionsMap.repeat), defaults.repeat);
			if (optionsMap.speed != null) {
				options.speed = getValue(validateSpeed(optionsMap.speed), 1);
			}
			if (isBoolean(optionsMap.promise)) {
				options.promise = optionsMap.promise;
			}
			options.queue = getValue(validateQueue(optionsMap.queue), defaults.queue);
			if (optionsMap.mobileHA && !VelocityStatic.State.isGingerbread) {
				/* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
				 on animating elements. HA is removed from the element at the completion of its animation. */
				/* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
				/* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
				options.mobileHA = true;
			}
			if (!isReverse) {
				if (optionsMap.display != null) {
					(propertiesMap as VelocityProperties).display = optionsMap.display as string;
					console.error("Deprecated 'options.display' used, this is now a property:", optionsMap.display);
				}
				if (optionsMap.visibility != null) {
					(propertiesMap as VelocityProperties).visibility = optionsMap.visibility as string;
					console.error("Deprecated 'options.visibility' used, this is now a property:", optionsMap.visibility);
				}
			}
			// TODO: Allow functional options for different options per element
			const optionsBegin = validateBegin(optionsMap.begin),
				optionsComplete = validateComplete(optionsMap.complete),
				optionsProgress = validateProgress(optionsMap.progress),
				optionsSync = validateSync(optionsMap.sync);

			if (optionsBegin != null) {
				options.begin = optionsBegin;
			}
			if (optionsComplete != null) {
				options.complete = optionsComplete;
			}
			if (optionsProgress != null) {
				options.progress = optionsProgress;
			}
			if (optionsSync != null) {
				isSync = optionsSync;
			}
		} else if (!syntacticSugar) {
			// Expand any direct options if possible.
			const duration = validateDuration(_arguments[argumentIndex], true);
			let offset = 0;

			if (duration !== undefined) {
				offset++;
				options.duration = duration;
			}
			if (!isFunction(_arguments[argumentIndex + offset])) {
				// Despite coming before Complete, we can't pass a fn easing
				const easing = validateEasing(_arguments[argumentIndex + offset], getValue(options && validateDuration(options.duration), defaults.duration) as number, true);

				if (easing !== undefined) {
					offset++;
					options.easing = easing;
				}
			}
			const complete = validateComplete(_arguments[argumentIndex + offset], true);

			if (complete !== undefined) {
				options.complete = complete;
			}
			options.loop = defaults.loop;
			options.repeat = options.repeatAgain = defaults.repeat;
		}

		if (isReverse && options.queue === false) {
			throw new Error("VelocityJS: Cannot reverse a queue:false animation.");
		}

		/* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
		 In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
		/* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
		 the call array is pushed to VelocityStatic.State.calls for live processing by the requestAnimationFrame tick. */

		const rootAnimation: AnimationCall = {
			_prev: undefined,
			_next: undefined,
			_flags: isSync ? AnimationFlags.SYNC : 0,
			options: options,
			percentComplete: 0,
			//element: element,
			elements: elements,
			ellapsedTime: 0,
			timeStart: 0
		};

		animations = [];
		for (let index = 0; index < elements.length; index++) {
			const element = elements[index];
			let flags = 0;

			if (isNode(element)) { // TODO: This needs to check for valid animation targets, not just Elements
				if (isReverse) {
					const lastAnimation = Data(element).lastAnimationList[options.queue as string];

					propertiesMap = lastAnimation && lastAnimation.tweens;
					if (!propertiesMap) {
						console.error("VelocityJS: Attempting to reverse an animation on an element with no previous animation:", element);
						continue;
					}
					flags |= AnimationFlags.REVERSE & ~(lastAnimation._flags & AnimationFlags.REVERSE);
				}
				const tweens = createEmptyObject(),
					animation: AnimationCall = Object.assign({
						element: element,
						tweens: tweens
					}, rootAnimation);

				options._total++;
				animation._flags |= flags;
				animations.push(animation);
				if (isReverse) {
					// In this case we're using the previous animation, so
					// it will be expanded correctly when that one runs.
					animation.tweens = propertiesMap as any;
				} else {
					VelocityStatic.expandProperties(animation, propertiesMap);
				}
				VelocityStatic.queue(element, animation, options.queue);
			}
		}
		if (VelocityStatic.State.isTicking === false) {
			// If the animation tick isn't running, start it. (Velocity shuts it
			// off when there are no active calls to process.)
			VelocityStatic.tick();
		}
		if (animations) {
			defineProperty(elements.velocity, "animations", animations);
		}
	}
	/***************
	 Chaining
	 ***************/

	/* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */
	return elements || promise as any;
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

/******************
 Unsupported
 ******************/

if (IE <= 8) {
	throw new Error("VelocityJS cannot run on Internet Explorer 8 or earlier");
}

/******************
 Frameworks
 ******************/

interface Window {
	jQuery: {fn?: any};
	Zepto: {fn?: any};
	Velocity: any;
}

if (window === this) {
	/*
	 * Both jQuery and Zepto allow their $.fn object to be extended to allow
	 * wrapped elements to be subjected to plugin calls. If either framework is
	 * loaded, register a "velocity" extension pointing to Velocity's core
	 * animate() method. Velocity also registers itself onto a global container
	 * (window.jQuery || window.Zepto || window) so that certain features are
	 * accessible beyond just a per-element scope. Accordingly, Velocity can
	 * both act on wrapped DOM elements and stand alone for targeting raw DOM
	 * elements.
	 */
	const patch = VelocityStatic.patch,
		jQuery = window.jQuery,
		Zepto = window.Zepto;

	patch(window, true);
	patch(Element && Element.prototype);
	patch(NodeList && NodeList.prototype);
	patch(HTMLCollection && HTMLCollection.prototype);

	patch(jQuery, true);
	patch(jQuery && jQuery.fn);

	patch(Zepto, true);
	patch(Zepto && Zepto.fn);
}

/******************
 Known Issues
 ******************/

/* The CSS spec mandates that the translateX/Y/Z transforms are %-relative to the element itself -- not its parent.
 Velocity, however, doesn't make this distinction. Thus, converting to or from the % unit with these subproperties
 will produce an inaccurate conversion value. The same issue exists with the cx/cy attributes of SVG circles and ellipses. */
