///<reference path="main.ts" />

/*! VelocityJS.org (2.0.0). (C) 2014-2016 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */

const DURATION_DEFAULT = 400;
const EASING_DEFAULT = "swing";

function Velocity() {
	console.log("testing")
}

interface HTMLElement {
	velocity: any;
}

interface VelocityState {
	/* Detect mobile devices to determine if mobileHA should be turned on. */
	isMobile: boolean,
	/* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
	isAndroid: boolean,
	isGingerbread: boolean,
	isChrome: boolean,
	isFirefox: boolean,
	/* Create a cached element for re-use when checking for CSS property prefixes. */
	prefixElement: HTMLElement,
	/* Cache every prefix match to avoid repeating lookups. */
	prefixMatches: {},
	/* Cache the anchor used for animating window scrolling. */
	scrollAnchor: Window | HTMLElement | Node,
	/* Cache the browser-specific property names associated with the scroll anchor. */
	scrollPropertyLeft: string,
	scrollPropertyTop: string,
	/* Keep track of whether our RAF tick is running. */
	isTicking: boolean,
	/* Container for every in-progress call to Velocity. */
	calls: any[]
}

interface VelocityData {
	isSVG?: boolean;
	transformCache?: any;
	computedStyle?: CSSStyleDeclaration;
}

namespace Velocity {
	/* Container for page-wide Velocity state data. */
	export var State: VelocityState = {
		/* Detect mobile devices to determine if mobileHA should be turned on. */
		isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		/* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
		isAndroid: /Android/i.test(navigator.userAgent),
		isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
		isChrome: (window as any).chrome,
		isFirefox: /Firefox/i.test(navigator.userAgent),
		/* Create a cached element for re-use when checking for CSS property prefixes. */
		prefixElement: document.createElement("div"),
		/* Cache every prefix match to avoid repeating lookups. */
		prefixMatches: {},
		/* Cache the anchor used for animating window scrolling. */
		scrollAnchor: null,
		/* Cache the browser-specific property names associated with the scroll anchor. */
		scrollPropertyLeft: null,
		scrollPropertyTop: null,
		/* Keep track of whether our RAF tick is running. */
		isTicking: false,
		/* Container for every in-progress call to Velocity. */
		calls: []
	};

	if (window.pageYOffset !== undefined) {
		State.scrollAnchor = window;
		State.scrollPropertyLeft = "pageXOffset";
		State.scrollPropertyTop = "pageYOffset";
	} else {
		State.scrollAnchor = document.documentElement || document.body.parentNode || document.body;
		State.scrollPropertyLeft = "scrollLeft";
		State.scrollPropertyTop = "scrollTop";
	}

	/* A shim of the jQuery utility functions used by Velocity -- provided by Velocity's optional jQuery shim. */
	//	Utilities: $,
	/* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
	export var Redirects = { /* Manually registered by the user. */ };

	/* Attempt to use ES6 Promises by default. Users can override this with a third-party promises library. */
	export var Promise = (window as any).Promise;

	/* Velocity option defaults, which can be overriden by the user. */
	export var defaults = {
		queue: "",
		duration: DURATION_DEFAULT,
		easing: EASING_DEFAULT,
		begin: undefined,
		complete: undefined,
		progress: undefined,
		display: undefined,
		visibility: undefined,
		loop: false,
		delay: false,
		mobileHA: true,
		/* Advanced: Set to false to prevent property values from being cached between consecutive Velocity-initiated chain calls. */
		_cacheValues: true
	};

	/* A design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache. */
	export var init = function(element) {
		//		$.data(element, "velocity", {
		//			/* Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements. */
		//			isSVG: isSVG(element),
		//			/* Keep track of whether the element is currently being animated by Velocity.
		//			 This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
		//			isAnimating: false,
		//			/* A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
		//			computedStyle: null,
		//			/* Tween data is cached for each animation on the element so that data can be passed across calls --
		//			 in particular, end values are used as subsequent start values in consecutive Velocity calls. */
		//			tweensContainer: null,
		//			/* The full root property values of each CSS hook being animated on this element are cached so that:
		//			 1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
		//			 2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values. */
		//			rootPropertyValueCache: {},
		//			/* A cache for transform updates, which must be manually flushed via CSS.flushTransformCache(). */
		//			transformCache: {}
		//		});
	};

	/* A parallel to jQuery's $.css(), used for getting/setting Velocity's hooked CSS properties. */
	export var hook = null; /* Defined below. */

	/* Velocity-wide animation time remapping for testing purposes. */
	export var mock = false;

	export var version = { major: 1, minor: 3, patch: 0 };

	/* Set to 1 or 2 (most verbose) to output debug info to console. */
	export var debug: boolean | number = false;

	/* rAF shim. Gist: https://gist.github.com/julianshapiro/9497513 */
	var rAFShim = (function() {
		var timeLast = 0;

		// No browser prefixes in supported browsers
		return requestAnimationFrame || function(callback: Function) {
			var timeCurrent = (new Date()).getTime(),
				timeDelta;

			/* Dynamically set delay on a per-tick basis to match 60fps. */
			/* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
			timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
			timeLast = timeCurrent + timeDelta;

			return setTimeout(function() {
				callback(timeCurrent + timeDelta);
			}, timeDelta);
		};
	})();

	/* Array compacting. Copyright Lo-Dash. MIT License: https://github.com/lodash/lodash/blob/master/LICENSE.txt */
	function compactSparseArray(array: any[]) {
		var index = -1,
			length = array ? array.length : 0,
			result = [];

		while (++index < length) {
			var value = array[index];

			if (value) {
				result.push(value);
			}
		}

		return result;
	}

	function sanitizeElements(elements: HTMLElement | HTMLElement[]) {
		/* Unwrap jQuery/Zepto objects. */
		if (isWrapped(elements)) {
			elements = [].slice.call(elements);
			/* Wrap a single element in an array so that $.each() can iterate with the element instead of its node's children. */
		} else if (isNode(elements)) {
			elements = [elements as HTMLElement];
		}
		return elements;
	}

	export var expando = "Velocity" + Date.now();
	export var cache = {};

	/* Shorthand for getting out own data. */
	function Data(element: HTMLElement): VelocityData {
		var response = element[expando];

		/* jQuery <=1.4.2 returns null instead of undefined when no match is found. We normalize this behavior. */
		if (response) {
			return cache[element[expando]];
		}
	}

	export function isString(variable): variable is string {
		return (typeof variable === "string");
	}

	export var isArray = Array.isArray || function(variable): variable is any[] {
		return Object.prototype.toString.call(variable) === "[object Array]";
	}

	export function isFunction(variable): variable is Function {
		return Object.prototype.toString.call(variable) === "[object Function]";
	}

	export function isNode(variable): variable is HTMLElement {
		return variable && variable.nodeType;
	}

	/* Copyright Martin Bohm. MIT License: https://gist.github.com/Tomalak/818a78a226a0738eaade */
	export function isNodeList(variable): variable is HTMLElement[] {
		return typeof variable === "object" &&
			/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(variable)) &&
			variable.length !== undefined &&
			(variable.length === 0 || (typeof variable[0] === "object" && variable[0].nodeType > 0));
	}

	/* Determine if variable is a wrapped jQuery or Zepto element. */
	export function isWrapped(variable): variable is HTMLElement[] {
		return variable && (variable.jquery || ((window as any).Zepto && (window as any).Zepto.zepto.isZ(variable)));
	}

	export function isSVG(variable): variable is SVGElement {
		return (window as any).SVGElement && (variable instanceof (window as any).SVGElement);
	}

	export function isEmptyObject(variable): variable is Object {
		for (var name in variable) {
			return false;
		}
		return true;
	}

	/**************
	 Easing
	 **************/

	/* Step easing generator. */
	function generateStep(steps) {
		return function(p) {
			return Math.round(p * steps) * (1 / steps);
		};
	}

	/* Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License */
	function generateBezier(mX1: number, mY1?: number, mX2?: number, mY2?: number) {
		var NEWTON_ITERATIONS = 4,
			NEWTON_MIN_SLOPE = 0.001,
			SUBDIVISION_PRECISION = 0.0000001,
			SUBDIVISION_MAX_ITERATIONS = 10,
			kSplineTableSize = 11,
			kSampleStepSize = 1.0 / (kSplineTableSize - 1.0),
			float32ArraySupported = "Float32Array" in window;

		/* Must contain four arguments. */
		if (arguments.length !== 4) {
			return false;
		}

		/* Arguments must be numbers. */
		for (var i = 0; i < 4; ++i) {
			if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
				return false;
			}
		}

		/* X values must be in the [0, 1] range. */
		mX1 = Math.min(mX1, 1);
		mX2 = Math.min(mX2, 1);
		mX1 = Math.max(mX1, 0);
		mX2 = Math.max(mX2, 0);

		var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

		function A(aA1, aA2) {
			return 1.0 - 3.0 * aA2 + 3.0 * aA1;
		}
		function B(aA1, aA2) {
			return 3.0 * aA2 - 6.0 * aA1;
		}
		function C(aA1) {
			return 3.0 * aA1;
		}

		function calcBezier(aT, aA1, aA2) {
			return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
		}

		function getSlope(aT, aA1, aA2) {
			return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
		}

		function newtonRaphsonIterate(aX, aGuessT) {
			for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
				var currentSlope = getSlope(aGuessT, mX1, mX2);

				if (currentSlope === 0.0) {
					return aGuessT;
				}

				var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
				aGuessT -= currentX / currentSlope;
			}

			return aGuessT;
		}

		function calcSampleValues() {
			for (var i = 0; i < kSplineTableSize; ++i) {
				mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
			}
		}

		function binarySubdivide(aX, aA, aB) {
			var currentX, currentT, i = 0;

			do {
				currentT = aA + (aB - aA) / 2.0;
				currentX = calcBezier(currentT, mX1, mX2) - aX;
				if (currentX > 0.0) {
					aB = currentT;
				} else {
					aA = currentT;
				}
			} while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

			return currentT;
		}

		function getTForX(aX) {
			var intervalStart = 0.0,
				currentSample = 1,
				lastSample = kSplineTableSize - 1;

			for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
				intervalStart += kSampleStepSize;
			}

			--currentSample;

			var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]),
				guessForT = intervalStart + dist * kSampleStepSize,
				initialSlope = getSlope(guessForT, mX1, mX2);

			if (initialSlope >= NEWTON_MIN_SLOPE) {
				return newtonRaphsonIterate(aX, guessForT);
			} else if (initialSlope === 0.0) {
				return guessForT;
			} else {
				return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
			}
		}

		var _precomputed = false;

		function precompute() {
			_precomputed = true;
			if (mX1 !== mY1 || mX2 !== mY2) {
				calcSampleValues();
			}
		}

		var f = function(aX) {
			if (!_precomputed) {
				precompute();
			}
			if (mX1 === mY1 && mX2 === mY2) {
				return aX;
			}
			if (aX === 0) {
				return 0;
			}
			if (aX === 1) {
				return 1;
			}

			return calcBezier(getTForX(aX), mY1, mY2);
		};

		f.getControlPoints = function() {
			return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }];
		};

		var str = "generateBezier(" + [mX1, mY1, mX2, mY2] + ")";
		f.toString = function() {
			return str;
		};

		return f;
	}

	/* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
	/* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
	 then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
	var generateSpringRK4 = (function() {
		function springAccelerationForState(state) {
			return (-state.tension * state.x) - (state.friction * state.v);
		}

		function springEvaluateStateWithDerivative(initialState, dt, derivative) {
			var state = {
				x: initialState.x + derivative.dx * dt,
				v: initialState.v + derivative.dv * dt,
				tension: initialState.tension,
				friction: initialState.friction
			};

			return { dx: state.v, dv: springAccelerationForState(state) };
		}

		function springIntegrateState(state, dt) {
			var a = {
				dx: state.v,
				dv: springAccelerationForState(state)
			},
				b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
				c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
				d = springEvaluateStateWithDerivative(state, dt, c),
				dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
				dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

			state.x = state.x + dxdt * dt;
			state.v = state.v + dvdt * dt;

			return state;
		}

		return function springRK4Factory(tension: number, friction: number, duration?: number): number {

			var initState = {
				x: -1,
				v: 0,
				tension: null,
				friction: null
			},
				path: number[] = [0],
				time_lapsed = 0,
				tolerance = 1 / 10000,
				DT = 16 / 1000,
				have_duration, dt, last_state;

			tension = parseFloat(tension as any) || 500;
			friction = parseFloat(friction as any) || 20;
			duration = duration || null;

			initState.tension = tension;
			initState.friction = friction;

			have_duration = duration !== null;

			/* Calculate the actual time it takes for this animation to complete with the provided conditions. */
			if (have_duration) {
				/* Run the simulation without a duration. */
				time_lapsed = springRK4Factory(tension, friction);
				/* Compute the adjusted time delta. */
				dt = time_lapsed / duration * DT;
			} else {
				dt = DT;
			}

			while (true) {
				/* Next/step function .*/
				last_state = springIntegrateState(last_state || initState, dt);
				/* Store the position. */
				path.push(1 + last_state.x);
				time_lapsed += 16;
				/* If the change threshold is reached, break. */
				if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
					break;
				}
			}

			/* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
			 computed path and returns a snapshot of the position according to a given percentComplete. */
			return !have_duration ? time_lapsed : function(percentComplete: number):number {
				return path[(percentComplete * (path.length - 1)) | 0];
			};
		};
	} ());

	/* jQuery easings. */
	export var Easings = {
		linear: function(p) {
			return p;
		},
		swing: function(p) {
			return 0.5 - Math.cos(p * Math.PI) / 2;
		},
		/* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
		spring: function(p) {
			return 1 - (Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6));
		}
	};

	/* CSS3 and Robert Penner easings. */
	[
		["ease", [0.25, 0.1, 0.25, 1.0]],
		["ease-in", [0.42, 0.0, 1.00, 1.0]],
		["ease-out", [0.00, 0.0, 0.58, 1.0]],
		["ease-in-out", [0.42, 0.0, 0.58, 1.0]],
		["easeInSine", [0.47, 0, 0.745, 0.715]],
		["easeOutSine", [0.39, 0.575, 0.565, 1]],
		["easeInOutSine", [0.445, 0.05, 0.55, 0.95]],
		["easeInQuad", [0.55, 0.085, 0.68, 0.53]],
		["easeOutQuad", [0.25, 0.46, 0.45, 0.94]],
		["easeInOutQuad", [0.455, 0.03, 0.515, 0.955]],
		["easeInCubic", [0.55, 0.055, 0.675, 0.19]],
		["easeOutCubic", [0.215, 0.61, 0.355, 1]],
		["easeInOutCubic", [0.645, 0.045, 0.355, 1]],
		["easeInQuart", [0.895, 0.03, 0.685, 0.22]],
		["easeOutQuart", [0.165, 0.84, 0.44, 1]],
		["easeInOutQuart", [0.77, 0, 0.175, 1]],
		["easeInQuint", [0.755, 0.05, 0.855, 0.06]],
		["easeOutQuint", [0.23, 1, 0.32, 1]],
		["easeInOutQuint", [0.86, 0, 0.07, 1]],
		["easeInExpo", [0.95, 0.05, 0.795, 0.035]],
		["easeOutExpo", [0.19, 1, 0.22, 1]],
		["easeInOutExpo", [1, 0, 0, 1]],
		["easeInCirc", [0.6, 0.04, 0.98, 0.335]],
		["easeOutCirc", [0.075, 0.82, 0.165, 1]],
		["easeInOutCirc", [0.785, 0.135, 0.15, 0.86]]
	].forEach(function(easingArray: string[]) {
		Easings[easingArray[0]] = generateBezier.apply(null, easingArray[1]);
	})

	/* Determine the appropriate easing type given an easing input. */
	function getEasing(value, duration) {
		var easing = value;

		/* The easing option can either be a string that references a pre-registered easing,
		 or it can be a two-/four-item array of integers to be converted into a bezier/spring function. */
		if (isString(value)) {
			/* Ensure that the easing has been assigned to jQuery's Velocity.Easings object. */
			if (!Velocity.Easings[value]) {
				easing = false;
			}
		} else if (isArray(value) && value.length === 1) {
			easing = generateStep(value);
		} else if (isArray(value) && value.length === 2) {
			/* springRK4 must be passed the animation's duration. */
			/* Note: If the springRK4 array contains non-numbers, generateSpringRK4() returns an easing
			 function generated with default tension and friction values. */
			easing = generateSpringRK4(value.concat([duration]));
		} else if (isArray(value) && value.length === 4) {
			/* Note: If the bezier array contains non-numbers, generateBezier() returns false. */
			easing = generateBezier(value);
		} else {
			easing = false;
		}

		/* Revert to the Velocity-wide default easing type, or fall back to "swing" (which is also jQuery's default)
		 if the Velocity-wide default has been incorrectly modified. */
		if (easing === false) {
			if (Easings[defaults.easing]) {
				easing = defaults.easing;
			} else {
				easing = EASING_DEFAULT;
			}
		}

		return easing;
	}


	/*****************
	 CSS Stack
	 Made global for unit testing
	 *****************/

	/* The CSS object is a highly condensed and performant CSS stack that fully replaces jQuery's.
	 It handles the validation, getting, and setting of both standard CSS properties and CSS property hooks. */
	/* Note: A "CSS" shorthand is aliased so that our code is easier to read. */
	export namespace CSS {
		/*************
		 RegEx
		 *************/

		export var RegEx = {
			isHex: /^#([A-f\d]{3}){1,2}$/i,
			/* Unwrap a property value's surrounding text, e.g. "rgba(4, 3, 2, 1)" ==> "4, 3, 2, 1" and "rect(4px 3px 2px 1px)" ==> "4px 3px 2px 1px". */
			valueUnwrap: /^[A-z]+\((.*)\)$/i,
			wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
			/* Split a multi-value property into an array of subvalues, e.g. "rgba(4, 3, 2, 1) 4px 3px 2px 1px" ==> [ "rgba(4, 3, 2, 1)", "4px", "3px", "2px", "1px" ]. */
			valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/ig
		};
		/************
		 Lists
		 ************/

		export var Lists = {
			colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
			transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
			transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"]
		}
		/************
		 Hooks
		 ************/

		/* Hooks allow a subproperty (e.g. "boxShadowBlur") of a compound-value CSS property
		 (e.g. "boxShadow: X Y Blur Spread Color") to be animated as if it were a discrete property. */
		/* Note: Beyond enabling fine-grained property animation, hooking is necessary since Velocity only
		 tweens properties with single numeric values; unlike CSS transitions, Velocity does not interpolate compound-values. */
		export var Hooks = {
			/********************
			 Registration
			 ********************/

			/* Templates are a concise way of indicating which subproperties must be individually registered for each compound-value CSS property. */
			/* Each template consists of the compound-value's base name, its constituent subproperty names, and those subproperties' default values. */
			templates: {
				"textShadow": ["Color X Y Blur", "black 0px 0px 0px"],
				"boxShadow": ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
				"clip": ["Top Right Bottom Left", "0px 0px 0px 0px"],
				"backgroundPosition": ["X Y", "0% 0%"],
				"transformOrigin": ["X Y Z", "50% 50% 0px"],
				"perspectiveOrigin": ["X Y", "50% 50%"]
			},
			/* A "registered" hook is one that has been converted from its template form into a live,
			 tweenable property. It contains data to associate it with its root property. */
			registered: {
				/* Note: A registered hook looks like this ==> textShadowBlur: [ "textShadow", 3 ],
				 which consists of the subproperty's name, the associated root property's name,
				 and the subproperty's position in the root's value. */
			},
			/* Convert the templates into individual hooks then append them to the registered object above. */
			register: function() {
				/* Color hooks registration: Colors are defaulted to white -- as opposed to black -- since colors that are
				 currently set to "transparent" default to their respective template below when color-animated,
				 and white is typically a closer match to transparent than black is. An exception is made for text ("color"),
				 which is almost always set closer to black than white. */
				for (var i = 0; i < Lists.colors.length; i++) {
					var rgbComponents = (Lists.colors[i] === "color") ? "0 0 0 1" : "255 255 255 1";
					Hooks.templates[Lists.colors[i]] = ["Red Green Blue Alpha", rgbComponents];
				}

				var rootProperty,
					hookTemplate,
					hookNames;

				/* Hook registration. */
				for (rootProperty in Hooks.templates) {
					hookTemplate = Hooks.templates[rootProperty];
					hookNames = hookTemplate[0].split(" ");

					for (var j in hookNames) {
						var fullHookName = rootProperty + hookNames[j],
							hookPosition = j;

						/* For each hook, register its full name (e.g. textShadowBlur) with its root property (e.g. textShadow)
						 and the hook's position in its template's default value string. */
						Hooks.registered[fullHookName] = [rootProperty, hookPosition];
					}
				}
			},
			/*****************************
			 Injection and Extraction
			 *****************************/

			/* Look up the root property associated with the hook (e.g. return "textShadow" for "textShadowBlur"). */
			/* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
			getRoot: function(property) {
				var hookData = Hooks.registered[property];

				if (hookData) {
					return hookData[0];
				} else {
					/* If there was no hook match, return the property name untouched. */
					return property;
				}
			},
			/* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that
			 the targeted hook can be injected or extracted at its standard position. */
			cleanRootPropertyValue: function(rootProperty, rootPropertyValue) {
				/* If the rootPropertyValue is wrapped with "rgb()", "clip()", etc., remove the wrapping to normalize the value before manipulation. */
				if (RegEx.valueUnwrap.test(rootPropertyValue)) {
					rootPropertyValue = rootPropertyValue.match(RegEx.valueUnwrap)[1];
				}

				/* If rootPropertyValue is a CSS null-value (from which there's inherently no hook value to extract),
				 default to the root's default value as defined in Hooks.templates. */
				/* Note: CSS null-values include "none", "auto", and "transparent". They must be converted into their
				 zero-values (e.g. textShadow: "none" ==> textShadow: "0px 0px 0px black") for hook manipulation to proceed. */
				if (Values.isCSSNullValue(rootPropertyValue)) {
					rootPropertyValue = Hooks.templates[rootProperty][1];
				}

				return rootPropertyValue;
			},
			/* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
			extractValue: function(fullHookName, rootPropertyValue) {
				var hookData = Hooks.registered[fullHookName];

				if (hookData) {
					var hookRoot = hookData[0],
						hookPosition = hookData[1];

					rootPropertyValue = Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

					/* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
					return rootPropertyValue.toString().match(RegEx.valueSplit)[hookPosition];
				} else {
					/* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
					return rootPropertyValue;
				}
			},
			/* Inject the hook's value into its root property's value. This is used to piece back together the root property
			 once Velocity has updated one of its individually hooked values through tweening. */
			injectValue: function(fullHookName, hookValue, rootPropertyValue) {
				var hookData = Hooks.registered[fullHookName];

				if (hookData) {
					var hookRoot = hookData[0],
						hookPosition = hookData[1],
						rootPropertyValueParts,
						rootPropertyValueUpdated;

					rootPropertyValue = Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

					/* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue,
					 then reconstruct the rootPropertyValue string. */
					rootPropertyValueParts = rootPropertyValue.toString().match(RegEx.valueSplit);
					rootPropertyValueParts[hookPosition] = hookValue;
					rootPropertyValueUpdated = rootPropertyValueParts.join(" ");

					return rootPropertyValueUpdated;
				} else {
					/* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
					return rootPropertyValue;
				}
			}
		};

		/*******************
		 Normalizations
		 *******************/

		/* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
		 and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
		export var Normalizations = {
			/* Normalizations are passed a normalization target (either the property's name, its extracted value, or its injected value),
			 the targeted element (which may need to be queried), and the targeted property value. */
			registered: {
				clip: function(action: string, element: HTMLElement, propertyValue: string) {
					switch (action) {
						case "name":
							return "clip";
						/* Clip needs to be unwrapped and stripped of its commas during extraction. */
						case "extract":
							var extracted;

							/* If Velocity also extracted this value, skip extraction. */
							if (RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
								extracted = propertyValue;
							} else {
								/* Remove the "rect()" wrapper. */
								extracted = propertyValue.toString().match(RegEx.valueUnwrap);

								/* Strip off commas. */
								extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
							}

							return extracted;
						/* Clip needs to be re-wrapped during injection. */
						case "inject":
							return "rect(" + propertyValue + ")";
					}
				},
				blur: function(action: string, element: HTMLElement, propertyValue: string): string {
					switch (action) {
						case "name":
							return Velocity.State.isFirefox ? "filter" : "-webkit-filter";

						case "extract":
							var extracted: string | number = parseFloat(propertyValue);

							/* If extracted is NaN, meaning the value isn't already extracted. */
							if (!(extracted || extracted === 0)) {
								var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);

								/* If the filter string had a blur component, return just the blur value and unit type. */
								if (blurComponent) {
									extracted = blurComponent[1];
									/* If the component doesn't exist, default blur to 0. */
								} else {
									extracted = 0;
								}
							}
							return String(extracted);

						/* Blur needs to be re-wrapped during injection. */
						case "inject":
							/* For the blur effect to be fully de-applied, it needs to be set to "none" instead of 0. */
							if (!parseFloat(propertyValue)) {
								return "none";
							}
							return "blur(" + propertyValue + ")";
					}
				},
				opacity: function(action: string, element: HTMLElement, propertyValue: string) {
					switch (action) {
						case "name":
							return "opacity";
						case "extract":
							return propertyValue;
						case "inject":
							return propertyValue;
					}
				}
			}
		};

		/*****************************
		 Batched Registrations
		 *****************************/

		/* Note: Batched normalizations extend the Normalizations.registered object. */
		export function register() {

			/*****************
			 Transforms
			 *****************/

			/* Transforms are the subproperties contained by the CSS "transform" property. Transforms must undergo normalization
			 so that they can be referenced in a properties map by their individual names. */
			/* Note: When transforms are "set", they are actually assigned to a per-element transformCache. When all transform
			 setting is complete complete, flushTransformCache() must be manually called to flush the values to the DOM.
			 Transform setting is batched in this way to improve performance: the transform style only needs to be updated
			 once when multiple transform subproperties are being animated simultaneously. */
			/* Note: IE9 and Android Gingerbread have support for 2D -- but not 3D -- transforms. Since animating unsupported
			 transform properties results in the browser ignoring the *entire* transform string, we prevent these 3D values
			 from being normalized for these browsers so that tweening skips these properties altogether
			 (since it will ignore them as being unsupported by the browser.) */
			if (!Velocity.State.isGingerbread) {
				/* Note: Since the standalone CSS "perspective" property and the CSS transform "perspective" subproperty
				 share the same name, the latter is given a unique token within Velocity: "transformPerspective". */
				Lists.transformsBase = Lists.transformsBase.concat(Lists.transforms3D);
			}

			for (var i = 0; i < Lists.transformsBase.length; i++) {
				/* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
				 paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
				(function() {
					var transformName = Lists.transformsBase[i];

					CSS.Normalizations.registered[transformName] = function(type, element, propertyValue) {
						switch (type) {
							/* The normalized property name is the parent "transform" property -- the property that is actually set in CSS. */
							case "name":
								return "transform";
							/* Transform values are cached onto a per-element transformCache object. */
							case "extract":
								/* If this transform has yet to be assigned a value, return its null value. */
								if (Data(element) === undefined || Data(element).transformCache[transformName] === undefined) {
									/* Scale Lists.transformsBase default to 1 whereas all other transform properties default to 0. */
									return /^scale/i.test(transformName) ? 1 : 0;
									/* When transform values are set, they are wrapped in parentheses as per the CSS spec.
									 Thus, when extracting their values (for tween calculations), we strip off the parentheses. */
								}
								return Data(element).transformCache[transformName].replace(/[()]/g, "");
							case "inject":
								var invalid = false;

								/* If an individual transform property contains an unsupported unit type, the browser ignores the *entire* transform property.
								 Thus, protect users from themselves by skipping setting for transform values supplied with invalid unit types. */
								/* Switch on the base transform type; ignore the axis by removing the last letter from the transform's name. */
								switch (transformName.substr(0, transformName.length - 1)) {
									/* Whitelist unit types for each transform. */
									case "translate":
										invalid = !/(%|px|em|rem|vw|vh|\d)$/i.test(propertyValue);
										break;
									/* Since an axis-free "scale" property is supported as well, a little hack is used here to detect it by chopping off its last letter. */
									case "scal":
									case "scale":
										/* Chrome on Android has a bug in which scaled elements blur if their initial scale
										 value is below 1 (which can happen with forcefeeding). Thus, we detect a yet-unset scale property
										 and ensure that its first value is always 1. More info: http://stackoverflow.com/questions/10417890/css3-animations-with-transform-causes-blurred-elements-on-webkit/10417962#10417962 */
										if (Velocity.State.isAndroid && Data(element).transformCache[transformName] === undefined && propertyValue < 1) {
											propertyValue = 1;
										}

										invalid = !/(\d)$/i.test(propertyValue);
										break;
									case "skew":
										invalid = !/(deg|\d)$/i.test(propertyValue);
										break;
									case "rotate":
										invalid = !/(deg|\d)$/i.test(propertyValue);
										break;
								}

								if (!invalid) {
									/* As per the CSS spec, wrap the value in parentheses. */
									Data(element).transformCache[transformName] = "(" + propertyValue + ")";
								}

								/* Although the value is set on the transformCache object, return the newly-updated value for the calling code to process as normal. */
								return Data(element).transformCache[transformName];
						}
					};
				})();
			}

			/*************
			 Colors
			 *************/

			/* Since Velocity only animates a single numeric value per property, color animation is achieved by hooking the individual RGBA components of CSS color properties.
			 Accordingly, color values must be normalized (e.g. "#ff0000", "red", and "rgb(255, 0, 0)" ==> "255 0 0 1") so that their components can be injected/extracted by CSS.Hooks logic. */
			for (var j = 0; j < Lists.colors.length; j++) {
				/* Wrap the dynamically generated normalization function in a new scope so that colorName's value is paired with its respective function.
				 (Otherwise, all functions would take the final for loop's colorName.) */
				(function() {
					var colorName = Lists.colors[j];

					CSS.Normalizations.registered[colorName] = function(type, element, propertyValue) {
						switch (type) {
							case "name":
								return colorName;
							/* Convert all color values into the rgb format. */
							case "extract":
								var extracted;

								/* If the color is already in its hookable form (e.g. "255 255 255 1") due to having been previously extracted, skip extraction. */
								if (RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
									extracted = propertyValue;
								} else {
									var converted,
										colorNames = {
											black: "rgb(0, 0, 0)",
											blue: "rgb(0, 0, 255)",
											gray: "rgb(128, 128, 128)",
											green: "rgb(0, 128, 0)",
											red: "rgb(255, 0, 0)",
											white: "rgb(255, 255, 255)"
										};

									/* Convert color names to rgb. */
									if (/^[A-z]+$/i.test(propertyValue)) {
										if (colorNames[propertyValue] !== undefined) {
											converted = colorNames[propertyValue];
										} else {
											/* If an unmatched color name is provided, default to black. */
											converted = colorNames.black;
										}
										/* Convert hex values to rgb. */
									} else if (RegEx.isHex.test(propertyValue)) {
										converted = "rgb(" + Values.hexToRgb(propertyValue).join(" ") + ")";
										/* If the provided color doesn't match any of the accepted color formats, default to black. */
									} else if (!(/^rgba?\(/i.test(propertyValue))) {
										converted = colorNames.black;
									}

									/* Remove the surrounding "rgb/rgba()" string then replace commas with spaces and strip
									 repeated spaces (in case the value included spaces to begin with). */
									extracted = (converted || propertyValue).toString().match(RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ");
								}

								/* So long as this isn't <=IE8, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
								if (extracted.split(" ").length === 3) {
									extracted += " 1";
								}

								return extracted;
							case "inject":
								propertyValue += " 1";

								/* Re-insert the browser-appropriate wrapper("rgb/rgba()"), insert commas, and strip off decimal units
								 on all values but the fourth (R, G, and B only accept whole numbers). */
								return "rgba(" + propertyValue.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")";
						}
					};
				})();
			}
		};
		/************************
		 CSS Property Names
		 ************************/

		export var Names = {
			/* Camelcase a property name into its JavaScript notation (e.g. "background-color" ==> "backgroundColor").
			 Camelcasing is used to normalize property names between and across calls. */
			camelCase: function(property) {
				return property.replace(/-(\w)/g, function(match, subMatch) {
					return subMatch.toUpperCase();
				});
			},
			/* For SVG elements, some properties (namely, dimensional ones) are GET/SET via the element's HTML attributes (instead of via CSS styles). */
			SVGAttribute: function(property) {
				var SVGAttributes = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";

				/* Certain browsers require an SVG transform to be applied as an attribute. (Otherwise, application via CSS is preferable due to 3D support.) */
				if (Velocity.State.isAndroid && !Velocity.State.isChrome) {
					SVGAttributes += "|transform";
				}

				return new RegExp("^(" + SVGAttributes + ")$", "i").test(property);
			},
			/* Determine whether a property should be set with a vendor prefix. */
			/* If a prefixed version of the property exists, return it. Otherwise, return the original property name.
			 If the property is not at all supported by the browser, return a false flag. */
			prefixCheck: function(property) {
				/* If this property has already been checked, return the cached value. */
				if (Velocity.State.prefixMatches[property]) {
					return [Velocity.State.prefixMatches[property], true];
				} else {
					var vendors = ["", "Webkit", "Moz", "ms", "O"];

					for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
						var propertyPrefixed;

						if (i === 0) {
							propertyPrefixed = property;
						} else {
							/* Capitalize the first letter of the property to conform to JavaScript vendor prefix notation (e.g. webkitFilter). */
							propertyPrefixed = vendors[i] + property.replace(/^\w/, function(match) {
								return match.toUpperCase();
							});
						}

						/* Check if the browser supports this property as prefixed. */
						if (isString(Velocity.State.prefixElement.style[propertyPrefixed])) {
							/* Cache the match. */
							Velocity.State.prefixMatches[property] = propertyPrefixed;

							return [propertyPrefixed, true];
						}
					}

					/* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
					return [property, false];
				}
			}
		};

		/************************
		 CSS Property Values
		 ************************/

		export var Values = {
			/* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
			hexToRgb: function(hex) {
				var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
					longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
					rgbParts;

				hex = hex.replace(shortformRegex, function(m, r, g, b) {
					return r + r + g + g + b + b;
				});

				rgbParts = longformRegex.exec(hex);

				return rgbParts ? [parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16)] : [0, 0, 0];
			},
			isCSSNullValue: function(value) {
				/* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
				 Thus, we check for both falsiness and these special strings. */
				/* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
				 templates as defined as Hooks (for the sake of hook injection/extraction). */
				/* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
				return (!value || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
			},
			/* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
			getUnitType: function(property) {
				if (/^(rotate|skew)/i.test(property)) {
					return "deg";
				} else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
					/* The above properties are unitless. */
					return "";
				} else {
					/* Default to px for all other properties. */
					return "px";
				}
			},
			/* HTML elements default to an associated display type when they're not set to display:none. */
			/* Note: This function is used for correctly setting the non-"none" display value in certain Velocity redirects, such as fadeIn/Out. */
			getDisplayType: function(element) {
				var tagName = element && element.tagName.toString().toLowerCase();

				if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
					return "inline";
				} else if (/^(li)$/i.test(tagName)) {
					return "list-item";
				} else if (/^(tr)$/i.test(tagName)) {
					return "table-row";
				} else if (/^(table)$/i.test(tagName)) {
					return "table";
				} else if (/^(tbody)$/i.test(tagName)) {
					return "table-row-group";
					/* Default to "block" when no match is found. */
				} else {
					return "block";
				}
			},
			/* The class add/remove functions are used to temporarily apply a "velocity-animating" class to elements while they're animating. */
			addClass: function(element, className) {
				if (element.classList) {
					element.classList.add(className);
				} else {
					element.className += (element.className.length ? " " : "") + className;
				}
			},
			removeClass: function(element, className) {
				if (element.classList) {
					element.classList.remove(className);
				} else {
					element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
				}
			}
		};

		/****************************
		 Style Getting & Setting
		 ****************************/

		/* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
		export function getPropertyValue(element: HTMLElement, property: string, rootPropertyValue?: string, forceStyleLookup?: boolean) {
			/* Get an element's computed property value. */
			/* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
			 style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
			 *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
			function computePropertyValue(element: HTMLElement, property: string): string | number {
				/* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
				 element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
				 offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
				 We subtract border and padding to get the sum of interior + scrollbar. */
				var computedValue = "0";

				/* Browsers do not return height and width values for elements that are set to display:"none". Thus, we temporarily
				 toggle display to the element type's default value. */
				var toggleDisplay = false;

				if (/^(width|height)$/.test(property) && getPropertyValue(element, "display") === 0) {
					toggleDisplay = true;
					setPropertyValue(element, "display", Values.getDisplayType(element));
				}

				var revertDisplay = function() {
					if (toggleDisplay) {
						setPropertyValue(element, "display", "none");
					}
				};

				if (!forceStyleLookup) {
					if (property === "height" && getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
						var contentBoxHeight = element.offsetHeight
							- (parseFloat(getPropertyValue(element, "borderTopWidth")) || 0)
							- (parseFloat(getPropertyValue(element, "borderBottomWidth")) || 0)
							- (parseFloat(getPropertyValue(element, "paddingTop")) || 0)
							- (parseFloat(getPropertyValue(element, "paddingBottom")) || 0);
						revertDisplay();

						return contentBoxHeight;
					} else if (property === "width" && getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
						var contentBoxWidth = element.offsetWidth
							- (parseFloat(getPropertyValue(element, "borderLeftWidth")) || 0)
							- (parseFloat(getPropertyValue(element, "borderRightWidth")) || 0)
							- (parseFloat(getPropertyValue(element, "paddingLeft")) || 0)
							- (parseFloat(getPropertyValue(element, "paddingRight")) || 0);
						revertDisplay();

						return contentBoxWidth;
					}
				}

				var computedStyle: CSSStyleDeclaration;

				/* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf
				 of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
				if (Data(element) === undefined) {
					computedStyle = window.getComputedStyle(element, null); /* GET */
					/* If the computedStyle object has yet to be cached, do so now. */
				} else if (!Data(element).computedStyle) {
					computedStyle = Data(element).computedStyle = window.getComputedStyle(element, null); /* GET */
					/* If computedStyle is cached, use it. */
				} else {
					computedStyle = Data(element).computedStyle;
				}

				/* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
				 Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
				 So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
				if (property === "borderColor") {
					property = "borderTopColor";
				}

				/* IE9 has a bug in which the "filter" property must be accessed from computedStyle using the getPropertyValue method
				 instead of a direct property lookup. The getPropertyValue method is slower than a direct lookup, which is why we avoid it by default. */
				computedValue = computedStyle[property];

				/* Fall back to the property's style value (if defined) when computedValue returns nothing,
				 which can happen when the element hasn't been painted. */
				if (computedValue === "" || computedValue === null) {
					computedValue = element.style[property];
				}

				revertDisplay();

				/* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
				 defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
				 effect as being set to 0, so no conversion is necessary.) */
				/* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
				 property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
				 to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
				if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
					var position = computePropertyValue(element, "position"); /* GET */

					/* For absolute positioning, jQuery's $.position() only returns values for top and left;
					 right and bottom will have their "auto" value reverted to 0. */
					/* Note: A jQuery object must be created here since jQuery doesn't have a low-level alias for $.position().
					 Not a big deal since we're currently in a GET batch anyway. */
					if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
						/* Note: jQuery strips the pixel unit from its returned values; we re-add it here to conform with computePropertyValue's behavior. */
						computedValue = $(element).position()[property] + "px"; /* GET */
					}
				}

				return computedValue;
			}

			var propertyValue;

			/* If this is a hooked property (e.g. "clipLeft" instead of the root property of "clip"),
			 extract the hook's value from a normalized rootPropertyValue using Hooks.extractValue(). */
			if (Hooks.registered[property]) {
				var hook = property,
					hookRoot = Hooks.getRoot(hook);

				/* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM),
				 query the DOM for the root property's value. */
				if (rootPropertyValue === undefined) {
					/* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
					rootPropertyValue = getPropertyValue(element, Names.prefixCheck(hookRoot)[0]); /* GET */
				}

				/* If this root has a normalization registered, peform the associated normalization extraction. */
				if (Normalizations.registered[hookRoot]) {
					rootPropertyValue = Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
				}

				/* Extract the hook's value. */
				propertyValue = Hooks.extractValue(hook, rootPropertyValue);

				/* If this is a normalized property (e.g. "opacity" becomes "filter" in <=IE8) or "translateX" becomes "transform"),
				 normalize the property's name and value, and handle the special case of transforms. */
				/* Note: Normalizing a property is mutually exclusive from hooking a property since hook-extracted values are strictly
				 numerical and therefore do not require normalization extraction. */
			} else if (Normalizations.registered[property]) {
				var normalizedPropertyName,
					normalizedPropertyValue;

				normalizedPropertyName = Normalizations.registered[property]("name", element);

				/* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache.
				 At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
				 This is because parsing 3D transform matrices is not always accurate and would bloat our codebase;
				 thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
				if (normalizedPropertyName !== "transform") {
					normalizedPropertyValue = computePropertyValue(element, Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

					/* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
					if (Values.isCSSNullValue(normalizedPropertyValue) && Hooks.templates[property]) {
						normalizedPropertyValue = Hooks.templates[property][1];
					}
				}

				propertyValue = Normalizations.registered[property]("extract", element, normalizedPropertyValue);
			}

			/* If a (numeric) value wasn't produced via hook extraction or normalization, query the DOM. */
			if (!/^[\d-]/.test(propertyValue)) {
				/* For SVG elements, dimensional properties (which SVGAttribute() detects) are tweened via
				 their HTML attribute values instead of their CSS style values. */
				var data = Data(element);

				if (data && data.isSVG && Names.SVGAttribute(property)) {
					/* Since the height/width attribute values must be set manually, they don't reflect computed values.
					 Thus, we use use getBBox() to ensure we always get values for elements with undefined height/width attributes. */
					if (/^(height|width)$/i.test(property)) {
						/* Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM. */
						try {
							propertyValue = (element as any).getBBox()[property];
						} catch (error) {
							propertyValue = 0;
						}
						/* Otherwise, access the attribute value directly. */
					} else {
						propertyValue = element.getAttribute(property);
					}
				} else {
					propertyValue = computePropertyValue(element, Names.prefixCheck(property)[0]); /* GET */
				}
			}

			/* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values),
			 convert CSS null-values to an integer of value 0. */
			if (Values.isCSSNullValue(propertyValue)) {
				propertyValue = 0;
			}

			if (debug >= 2) {
				console.log("Get " + property + ": " + propertyValue);
			}

			return propertyValue;
		};

		/* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
		export function setPropertyValue(element: HTMLElement, property: string, propertyValue?: string, rootPropertyValue?: string, scrollData?) {
			var propertyName = property;

			/* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
			if (property === "scroll") {
				/* If a container option is present, scroll the container instead of the browser window. */
				if (scrollData.container) {
					scrollData.container["scroll" + scrollData.direction] = propertyValue;
					/* Otherwise, Velocity defaults to scrolling the browser window. */
				} else {
					if (scrollData.direction === "Left") {
						window.scrollTo(propertyValue as any, scrollData.alternateValue); // Leverage implicit conversion
					} else {
						window.scrollTo(scrollData.alternateValue, propertyValue as any); // Leverage implicit conversion
					}
				}
			} else {
				/* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
				 Thus, for now, we merely cache transforms being SET. */
				if (Normalizations.registered[property] && Normalizations.registered[property]("name", element) === "transform") {
					/* Perform a normalization injection. */
					/* Note: The normalization logic handles the transformCache updating. */
					Normalizations.registered[property]("inject", element, propertyValue);

					propertyName = "transform";
					propertyValue = Data(element).transformCache[property];
				} else {
					/* Inject hooks. */
					if (Hooks.registered[property]) {
						var hookName = property,
							hookRoot = Hooks.getRoot(property);

						/* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
						rootPropertyValue = rootPropertyValue || getPropertyValue(element, hookRoot); /* GET */

						propertyValue = Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
						property = hookRoot;
					}

					/* Normalize names and values. */
					if (Normalizations.registered[property]) {
						propertyValue = Normalizations.registered[property]("inject", element, propertyValue);
						property = Normalizations.registered[property]("name", element);
					}

					/* Assign the appropriate vendor prefix before performing an official style update. */
					propertyName = Names.prefixCheck(property)[0];

					var data = Data(element);

					if (data && data.isSVG && Names.SVGAttribute(property)) {
						/* Note: For SVG attributes, vendor-prefixed property names are never used. */
						/* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
						element.setAttribute(property, propertyValue);
					} else {
						element.style[propertyName] = propertyValue;
					}

					if (Velocity.debug >= 2) {
						console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
					}
				}
			}

			/* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
			return [propertyName, propertyValue];
		};

		/* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
		/* Note: Velocity applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
		export function flushTransformCache(element) {
			var transformString = "",
				data = Data(element);

			/* Certain browsers require that SVG transforms be applied as an attribute. However, the SVG transform attribute takes a modified version of CSS's transform string
			 (units are dropped and, except for skewX/Y, subproperties are merged into their master property -- e.g. scaleX and scaleY are merged into scale(X Y). */
			if (Velocity.State.isAndroid && !Velocity.State.isChrome && data && data.isSVG) {
				/* Since transform values are stored in their parentheses-wrapped form, we use a helper function to strip out their numeric values.
				 Further, SVG transform properties only take unitless (representing pixels) values, so it's okay that parseFloat() strips the unit suffixed to the float value. */
				var getTransformFloat = function(transformProperty) {
					return parseFloat(getPropertyValue(element, transformProperty));
				};

				/* Create an object to organize all the transforms that we'll apply to the SVG element. To keep the logic simple,
				 we process *all* transform properties -- even those that may not be explicitly applied (since they default to their zero-values anyway). */
				var SVGTransforms = {
					translate: [getTransformFloat("translateX"), getTransformFloat("translateY")],
					skewX: [getTransformFloat("skewX")], skewY: [getTransformFloat("skewY")],
					/* If the scale property is set (non-1), use that value for the scaleX and scaleY values
					 (this behavior mimics the result of animating all these properties at once on HTML elements). */
					scale: getTransformFloat("scale") !== 1 ? [getTransformFloat("scale"), getTransformFloat("scale")] : [getTransformFloat("scaleX"), getTransformFloat("scaleY")],
					/* Note: SVG's rotate transform takes three values: rotation degrees followed by the X and Y values
					 defining the rotation's origin point. We ignore the origin values (default them to 0). */
					rotate: [getTransformFloat("rotateZ"), 0, 0]
				};

				/* Iterate through the transform properties in the user-defined property map order.
				 (This mimics the behavior of non-SVG transform animation.) */
				$.each(Data(element).transformCache, function(transformName) {
					/* Except for with skewX/Y, revert the axis-specific transform subproperties to their axis-free master
					 properties so that they match up with SVG's accepted transform properties. */
					if (/^translate/i.test(transformName)) {
						transformName = "translate";
					} else if (/^scale/i.test(transformName)) {
						transformName = "scale";
					} else if (/^rotate/i.test(transformName)) {
						transformName = "rotate";
					}

					/* Check that we haven't yet deleted the property from the SVGTransforms container. */
					if (SVGTransforms[transformName]) {
						/* Append the transform property in the SVG-supported transform format. As per the spec, surround the space-delimited values in parentheses. */
						transformString += transformName + "(" + SVGTransforms[transformName].join(" ") + ")" + " ";

						/* After processing an SVG transform property, delete it from the SVGTransforms container so we don't
						 re-insert the same master property if we encounter another one of its axis-specific properties. */
						delete SVGTransforms[transformName];
					}
				});
			} else {
				var transformValue,
					perspective;

				/* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
				$.each(Data(element).transformCache, function(transformName) {
					transformValue = Data(element).transformCache[transformName];

					/* Transform's perspective subproperty must be set first in order to take effect. Store it temporarily. */
					if (transformName === "transformPerspective") {
						perspective = transformValue;
						return true;
					}

					transformString += transformName + transformValue + " ";
				});

				/* If present, set the perspective subproperty first. */
				if (perspective) {
					transformString = "perspective" + perspective + " " + transformString;
				}
			}

			setPropertyValue(element, "transform", transformString);
		};
	};
}