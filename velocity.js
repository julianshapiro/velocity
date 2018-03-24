/*! VelocityJS.org (2.0.2) (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('velocity-animate', [], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		root['Velocity'] = factory();
	}
}(this, function() {

var __assign = this && this.__assign || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Constants and defaults. These values should never change without a MINOR
 * version bump.
 */
//["completeCall", "CSS", "State", "getEasing", "Easings", "data", "debug", "defaults", "hook", "init", "mock", "pauseAll", "queue", "dequeue", "freeAnimationCall", "Redirects", "RegisterEffect", "resumeAll", "RunSequence", "lastTick", "tick", "timestamp", "expandTween", "version"]
var PUBLIC_MEMBERS = [ "version", "RegisterEffect", "style", "patch", "timestamp" ];

/**
 * Without this it will only un-prefix properties that have a valid "normal"
 * version.
 */ var ALL_VENDOR_PREFIXES = true;

var DURATION_FAST = 200;

var DURATION_NORMAL = 400;

var DURATION_SLOW = 600;

var FUZZY_MS_PER_SECOND = 980;

var DEFAULT_CACHE = true;

var DEFAULT_DELAY = 0;

var DEFAULT_DURATION = DURATION_NORMAL;

var DEFAULT_EASING = "swing";

var DEFAULT_FPSLIMIT = 60;

var DEFAULT_LOOP = 0;

var DEFAULT_PROMISE = true;

var DEFAULT_PROMISE_REJECT_EMPTY = true;

var DEFAULT_QUEUE = "";

var DEFAULT_REPEAT = 0;

var DEFAULT_SPEED = 1;

var DEFAULT_SYNC = true;

var CLASSNAME = "velocity-animating";

var Duration = {
    fast: DURATION_FAST,
    normal: DURATION_NORMAL,
    slow: DURATION_SLOW
};

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Runtime type checking methods.
 */ function isBoolean(variable) {
    return variable === true || variable === false;
}

function isNumber(variable) {
    return typeof variable === "number";
}

/**
 * Faster way to parse a string/number as a number https://jsperf.com/number-vs-parseint-vs-plus/3
 * @param variable The given string or number
 * @returns {variable is number} Returns boolean true if it is a number, false otherwise
 */ function isNumberWhenParsed(variable) {
    return !isNaN(Number(variable));
}

function isString(variable) {
    return typeof variable === "string";
}

function isFunction(variable) {
    return Object.prototype.toString.call(variable) === "[object Function]";
}

function isNode(variable) {
    return !!(variable && variable.nodeType);
}

function isVelocityResult(variable) {
    return variable && isNumber(variable.length) && isFunction(variable.velocity);
}

function propertyIsEnumerable(object, property) {
    return Object.prototype.propertyIsEnumerable.call(object, property);
}

/* Determine if variable is an array-like wrapped jQuery, Zepto or similar element, or even a NodeList etc. */
/* NOTE: HTMLFormElements also have a length. */ function isWrapped(variable) {
    return variable && variable !== window && isNumber(variable.length) && !isString(variable) && !isFunction(variable) && !isNode(variable) && (variable.length === 0 || isNode(variable[0]));
}

function isSVG(variable) {
    return SVGElement && variable instanceof SVGElement;
}

function isPlainObject(variable) {
    if (!variable || typeof variable !== "object" || variable.nodeType || Object.prototype.toString.call(variable) !== "[object Object]") {
        return false;
    }
    var proto = Object.getPrototypeOf(variable);
    return !proto || proto.hasOwnProperty("constructor") && proto.constructor === Object;
}

function isEmptyObject(variable) {
    for (var name_1 in variable) {
        if (variable.hasOwnProperty(name_1)) {
            return false;
        }
    }
    return true;
}

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
/**
 * Creates an empty object without any prototype chain.
 */ function createEmptyObject() {
    return Object.create(null);
}

/**
 * The <strong><code>defineProperty()</code></strong> function provides a
 * shortcut to defining a property that cannot be accidentally iterated across.
 */ function defineProperty(proto, name, value) {
    if (proto) {
        Object.defineProperty(proto, name, {
            configurable: true,
            writable: true,
            value: value
        });
    }
}

/**
 * Shim to get the current milliseconds - on anything except old IE it'll use
 * Date.now() and save creating an object. If that doesn't exist then it'll
 * create one that gets GC.
 */ var _now = Date.now ? Date.now : function() {
    return new Date().getTime();
};

/**
 * Shim for Object.assign on IE, based on:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
 */ var _objectAssign = Object.assign || function(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object");
    }
    var to = Object(target);
    for (var index = 0; index < sources.length; index++) {
        var nextSource = sources[index];
        if (nextSource != null) {
            for (var nextKey in nextSource) {
                // Avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
    }
    return to;
};

/**
 * Shim for "string".startsWith on IE, based on:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
 */ var _startsWith = String.prototype.startsWith ? function(str, searchString, position) {
    return str.startsWith(searchString, position);
} : function(str, searchString, position) {
    return str.substr(!position || position < 0 ? 0 : +position, searchString.length) === searchString;
};

/**
 * Check whether a value belongs to an array
 * https://jsperf.com/includes-vs-indexof-vs-while-loop/6
 * @param array The given array
 * @param value The given element to check if it is part of the array
 * @returns {boolean} True if it exists, false otherwise
 */ function _inArray(array, value) {
    var i = 0;
    while (i < array.length) {
        if (array[i++] === value) {
            return true;
        }
    }
    return false;
}

/**
 * Convert an element or array-like element list into an array if needed.
 */ function sanitizeElements(elements) {
    if (isNode(elements)) {
        return [ elements ];
    }
    return elements;
}

function getValue(args) {
    for (var i = 0, _args = arguments; i < _args.length; i++) {
        var _arg = _args[i];
        if (_arg !== undefined && _arg === _arg) {
            return _arg;
        }
    }
}

/**
 * Add a single className to an Element.
 */ function addClass(element, className) {
    if (element instanceof Element) {
        if (element.classList) {
            element.classList.add(className);
        } else {
            removeClass(element, className);
            element.className += (element.className.length ? " " : "") + className;
        }
    }
}

/**
 * Remove a single className from an Element.
 */ function removeClass(element, className) {
    if (element instanceof Element) {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            // TODO: Need some jsperf tests on performance - can we get rid of the regex and maybe use split / array manipulation?
            element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className + "(\\s|$)", "gi"), " ");
        }
    }
}

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Actions that can be performed by passing a string instead of a propertiesMap.
 */ var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Actions cannot be replaced if they are internal (hasOwnProperty is false
     * but they still exist). Otherwise they can be replaced by users.
     *
     * All external method calls should be using actions rather than sub-calls
     * of Velocity itself.
     */
    VelocityStatic.Actions = createEmptyObject();
    /**
     * Used to register an action. This should never be called by users
     * directly, instead it should be called via  an action:<br/>
     * <code>Velocity("registerAction", "name", VelocityActionFn);</code>
     *
     * @private
     */    function registerAction(args, internal) {
        var name = args[0], callback = args[1];
        if (!isString(name)) {
            console.warn("VelocityJS: Trying to set 'registerAction' name to an invalid value:", name);
        } else if (!isFunction(callback)) {
            console.warn("VelocityJS: Trying to set 'registerAction' callback to an invalid value:", name, callback);
        } else if (VelocityStatic.Actions[name] && !propertyIsEnumerable(VelocityStatic.Actions, name)) {
            console.warn("VelocityJS: Trying to override internal 'registerAction' callback", name);
        } else if (internal === true) {
            defineProperty(VelocityStatic.Actions, name, callback);
        } else {
            VelocityStatic.Actions[name] = callback;
        }
    }
    VelocityStatic.registerAction = registerAction;
    registerAction([ "registerAction", registerAction ], true);
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Finish all animation.
 */ var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Check if an animation should be finished, and if so we set the tweens to
     * the final value for it, then call complete.
     */
    function checkAnimationShouldBeFinished(animation, queueName, defaultQueue) {
        VelocityStatic.validateTweens(animation);
        if (queueName === undefined || queueName === getValue(animation.queue, animation.options.queue, defaultQueue)) {
            if (!(animation._flags & 4 /* STARTED */)) {
                // Copied from tick.ts - ensure that the animation is completely
                // valid and run begin() before complete().
                var options = animation.options;
                // The begin callback is fired once per call, not once per
                // element, and is passed the full raw DOM element set as both
                // its context and its first argument.
                                if (options._started++ === 0) {
                    options._first = animation;
                    if (options.begin) {
                        // Pass to an external fn with a try/catch block for optimisation
                        VelocityStatic.callBegin(animation);
                        // Only called once, even if reversed or repeated
                                                options.begin = undefined;
                    }
                }
                animation._flags |= 4 /* STARTED */;
            }
            for (var property in animation.tweens) {
                var tween_1 = animation.tweens[property], sequence = tween_1.sequence, pattern = sequence.pattern;
                var currentValue = "", i = 0;
                if (pattern) {
                    var endValues = sequence[sequence.length - 1];
                    for (;i < pattern.length; i++) {
                        var endValue = endValues[i];
                        currentValue += endValue == null ? pattern[i] : endValue;
                    }
                }
                VelocityStatic.CSS.setPropertyValue(animation.element, property, currentValue, tween_1.fn);
            }
            VelocityStatic.completeCall(animation);
        }
    }
    /**
     * When the finish action is triggered, the elements' currently active call is
     * immediately finished. When an element is finished, the next item in its
     * animation queue is immediately triggered. If passed via a chained call
     * then this will only target the animations in that call, and not the
     * elements linked to it.
     *
     * A queue name may be passed in to specify that only animations on the
     * named queue are finished. The default queue is named "". In addition the
     * value of `false` is allowed for the queue name.
     *
     * An final argument may be passed in to clear an element's remaining queued
     * calls. This may only be the value `true`.
     */    function finish(args, elements, promiseHandler) {
        var queueName = validateQueue(args[0], true), defaultQueue = VelocityStatic.defaults.queue, finishAll = args[queueName === undefined ? 0 : 1] === true;
        if (isVelocityResult(elements) && elements.velocity.animations) {
            for (var i = 0, animations = elements.velocity.animations; i < animations.length; i++) {
                checkAnimationShouldBeFinished(animations[i], queueName, defaultQueue);
            }
        } else {
            var activeCall = VelocityStatic.State.first, nextCall = void 0;
            while (activeCall = VelocityStatic.State.firstNew) {
                VelocityStatic.validateTweens(activeCall);
            }
            for (activeCall = VelocityStatic.State.first; activeCall && (finishAll || activeCall !== VelocityStatic.State.firstNew); activeCall = nextCall || VelocityStatic.State.firstNew) {
                nextCall = activeCall._next;
                if (!elements || _inArray(elements, activeCall.element)) {
                    checkAnimationShouldBeFinished(activeCall, queueName, defaultQueue);
                }
            }
        }
        if (promiseHandler) {
            if (isVelocityResult(elements) && elements.velocity.animations && elements.then) {
                elements.then(promiseHandler._resolver);
            } else {
                promiseHandler._resolver(elements);
            }
        }
    }
    VelocityStatic.registerAction([ "finish", finish ], true);
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get or set a value from one or more running animations.
 */ var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Used to map getters for the various AnimationFlags.
     */
    var animationFlags = {
        isExpanded: 1 /* EXPANDED */ ,
        isReady: 2 /* READY */ ,
        isStarted: 4 /* STARTED */ ,
        isStopped: 8 /* STOPPED */ ,
        isPaused: 16 /* PAUSED */ ,
        isSync: 32 /* SYNC */ ,
        isReverse: 64
 /* REVERSE */    };
    /**
     * Get or set an option or running AnimationCall data value. If there is no
     * value passed then it will get, otherwise we will set.
     *
     * NOTE: When using "get" this will not touch the Promise as it is never
     * returned to the user.
     */    function option(args, elements, promiseHandler, action) {
        var key = args[0], queue = action.indexOf(".") >= 0 ? action.replace(/^.*\./, "") : undefined, queueName = queue === "false" ? false : validateQueue(queue, true);
        var animations, value = args[1];
        if (!key) {
            console.warn("VelocityJS: Cannot access a non-existant key!");
            return null;
        }
        // If we're chaining the return value from Velocity then we are only
        // interested in the values related to that call
                if (isVelocityResult(elements) && elements.velocity.animations) {
            animations = elements.velocity.animations;
        } else {
            animations = [];
            for (var activeCall = VelocityStatic.State.first; activeCall; activeCall = activeCall._next) {
                if (elements.indexOf(activeCall.element) >= 0 && getValue(activeCall.queue, activeCall.options.queue) === queueName) {
                    animations.push(activeCall);
                }
            }
            // If we're dealing with multiple elements that are pointing at a
            // single running animation, then instead treat them as a single
            // animation.
                        if (elements.length > 1 && animations.length > 1) {
                var i = 1, options = animations[0].options;
                while (i < animations.length) {
                    if (animations[i++].options !== options) {
                        options = null;
                        break;
                    }
                }
                // TODO: this needs to check that they're actually a sync:true animation to merge the results, otherwise the individual values may be different
                                if (options) {
                    animations = [ animations[0] ];
                }
            }
        }
        // GET
                if (value === undefined) {
            var result = [], flag = animationFlags[key];
            for (var i = 0; i < animations.length; i++) {
                if (flag === undefined) {
                    // A normal key to get.
                    result.push(getValue(animations[i][key], animations[i].options[key]));
                } else {
                    // A flag that we're checking against.
                    result.push((animations[i]._flags & flag) === 0);
                }
            }
            if (elements.length === 1 && animations.length === 1) {
                // If only a single animation is found and we're only targetting a
                // single element, then return the value directly
                return result[0];
            }
            return result;
        }
        // SET
                var isPercentComplete;
        switch (key) {
          case "cache":
            value = validateCache(value);
            break;

          case "begin":
            value = validateBegin(value);
            break;

          case "complete":
            value = validateComplete(value);
            break;

          case "delay":
            value = validateDelay(value);
            break;

          case "duration":
            value = validateDuration(value);
            break;

          case "fpsLimit":
            value = validateFpsLimit(value);
            break;

          case "loop":
            value = validateLoop(value);
            break;

          case "percentComplete":
            isPercentComplete = true;
            value = parseFloat(value);
            break;

          case "repeat":
          case "repeatAgain":
            value = validateRepeat(value);
            break;

          default:
            if (key[0] !== "_") {
                var num = parseFloat(value);
                if (value == num) {
                    value = num;
                }
                break;
            }

            // deliberate fallthrough
                      case "queue":
          case "promise":
          case "promiseRejectEmpty":
          case "easing":
          case "started":
            console.warn("VelocityJS: Trying to set a read-only key:", key);
            return;
        }
        if (value === undefined || value !== value) {
            console.warn("VelocityJS: Trying to set an invalid value:", key, "=", value, "(" + args[1] + ")");
            return null;
        }
        for (var i = 0; i < animations.length; i++) {
            var animation = animations[i];
            if (isPercentComplete) {
                animation.timeStart = VelocityStatic.lastTick - getValue(animation.duration, animation.options.duration, VelocityStatic.defaults.duration) * value;
            } else {
                animation[key] = value;
            }
        }
        if (promiseHandler) {
            if (isVelocityResult(elements) && elements.velocity.animations && elements.then) {
                elements.then(promiseHandler._resolver);
            } else {
                promiseHandler._resolver(elements);
            }
        }
    }
    VelocityStatic.registerAction([ "option", option ], true);
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Pause and resume animation.
 */ var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Check if an animation should be paused / resumed.
     */
    function checkAnimation(animation, queueName, defaultQueue, isPaused) {
        if (queueName === undefined || queueName === getValue(animation.queue, animation.options.queue, defaultQueue)) {
            if (isPaused) {
                animation._flags |= 16 /* PAUSED */;
            } else {
                animation._flags &= ~16 /* PAUSED */;
            }
        }
    }
    /**
     * Pause and Resume are call-wide (not on a per element basis). Thus, calling pause or resume on a
     * single element will cause any calls that contain tweens for that element to be paused/resumed
     * as well.
     */
    function pauseResume(args, elements, promiseHandler, action) {
        var isPaused = action.indexOf("pause") === 0, queue = action.indexOf(".") >= 0 ? action.replace(/^.*\./, "") : undefined, queueName = queue === "false" ? false : validateQueue(args[0]), defaultQueue = VelocityStatic.defaults.queue;
        if (isVelocityResult(elements) && elements.velocity.animations) {
            for (var i = 0, animations = elements.velocity.animations; i < animations.length; i++) {
                checkAnimation(animations[i], queueName, defaultQueue, isPaused);
            }
        } else {
            var activeCall = VelocityStatic.State.first;
            while (activeCall) {
                if (!elements || _inArray(elements, activeCall.element)) {
                    checkAnimation(activeCall, queueName, defaultQueue, isPaused);
                }
                activeCall = activeCall._next;
            }
        }
        if (promiseHandler) {
            if (isVelocityResult(elements) && elements.velocity.animations && elements.then) {
                elements.then(promiseHandler._resolver);
            } else {
                promiseHandler._resolver(elements);
            }
        }
    }
    VelocityStatic.registerAction([ "pause", pauseResume ], true);
    VelocityStatic.registerAction([ "resume", pauseResume ], true);
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Actions that can be performed by passing a string instead of a propertiesMap.
 */ var VelocityStatic;

(function(VelocityStatic) {
    VelocityStatic.registerAction([ "reverse", function(args, elements, promiseHandler, action) {
        // TODO: Code needs to split out before here - but this is needed to prevent it being overridden
        throw new SyntaxError("VelocityJS: The 'reverse' action is private.");
    } ], true);
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Stop animation.
 */ var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Check if an animation should be stopped, and if so then set the STOPPED
     * flag on it, then call complete.
     */
    function checkAnimationShouldBeStopped(animation, queueName, defaultQueue) {
        VelocityStatic.validateTweens(animation);
        if (queueName === undefined || queueName === getValue(animation.queue, animation.options.queue, defaultQueue)) {
            animation._flags |= 8 /* STOPPED */;
            VelocityStatic.completeCall(animation);
        }
    }
    /**
     * When the stop action is triggered, the elements' currently active call is
     * immediately stopped. When an element is stopped, the next item in its
     * animation queue is immediately triggered. If passed via a chained call
     * then this will only target the animations in that call, and not the
     * elements linked to it.
     *
     * A queue name may be passed in to specify that only animations on the
     * named queue are stopped. The default queue is named "". In addition the
     * value of `false` is allowed for the queue name.
     *
     * An final argument may be passed in to clear an element's remaining queued
     * calls. This may only be the value `true`.
     *
     * Note: The stop command runs prior to Velocity's Queueing phase since its
     * behavior is intended to take effect *immediately*, regardless of the
     * element's current queue state.
     */    function stop(args, elements, promiseHandler, action) {
        var queueName = validateQueue(args[0], true), defaultQueue = VelocityStatic.defaults.queue, finishAll = args[queueName === undefined ? 0 : 1] === true;
        if (isVelocityResult(elements) && elements.velocity.animations) {
            for (var i = 0, animations = elements.velocity.animations; i < animations.length; i++) {
                checkAnimationShouldBeStopped(animations[i], queueName, defaultQueue);
            }
        } else {
            var activeCall = VelocityStatic.State.first, nextCall = void 0;
            while (activeCall = VelocityStatic.State.firstNew) {
                VelocityStatic.validateTweens(activeCall);
            }
            for (activeCall = VelocityStatic.State.first; activeCall && (finishAll || activeCall !== VelocityStatic.State.firstNew); activeCall = nextCall || VelocityStatic.State.firstNew) {
                nextCall = activeCall._next;
                if (!elements || _inArray(elements, activeCall.element)) {
                    checkAnimationShouldBeStopped(activeCall, queueName, defaultQueue);
                }
            }
        }
        if (promiseHandler) {
            if (isVelocityResult(elements) && elements.velocity.animations && elements.then) {
                elements.then(promiseHandler._resolver);
            } else {
                promiseHandler._resolver(elements);
            }
        }
    }
    VelocityStatic.registerAction([ "stop", stop ], true);
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get or set a property from one or more elements.
 */ var VelocityStatic;

(function(VelocityStatic) {
    function style(elements, property, value) {
        return styleAction([ property, value ], elements);
    }
    VelocityStatic.style = style;
    /**
     * Get or set a style of Nomralised property value on one or more elements.
     * If there is no value passed then it will get, otherwise we will set.
     *
     * NOTE: When using "get" this will not touch the Promise as it is never
     * returned to the user.
     *
     * This can fail to set, and will reject the Promise if it does so.
     *
     * Velocity(elements, "style", "property", "value") => elements;
     * Velocity(elements, "style", {"property": "value", ...}) => elements;
     * Velocity(element, "style", "property") => "value";
     * Velocity(elements, "style", "property") => ["value", ...];
     */    function styleAction(args, elements, promiseHandler, action) {
        var property = args[0], value = args[1];
        if (!property) {
            console.warn("VelocityJS: Cannot access a non-existant property!");
            return null;
        }
        // GET
                if (value === undefined && !isPlainObject(property)) {
            // If only a single animation is found and we're only targetting a
            // single element, then return the value directly
            if (elements.length === 1) {
                return VelocityStatic.CSS.fixColors(VelocityStatic.CSS.getPropertyValue(elements[0], property));
            }
            var result = [];
            for (var i = 0; i < elements.length; i++) {
                result.push(VelocityStatic.CSS.fixColors(VelocityStatic.CSS.getPropertyValue(elements[i], property)));
            }
            return result;
        }
        // SET
                var error;
        if (isPlainObject(property)) {
            for (var propertyName in property) {
                for (var i = 0; i < elements.length; i++) {
                    var value_1 = property[propertyName];
                    if (isString(value_1) || isNumber(value_1)) {
                        VelocityStatic.CSS.setPropertyValue(elements[i], propertyName, property[propertyName]);
                    } else {
                        error = (error ? error + ", " : "") + "Cannot set a property '" + propertyName + "' to an unknown type: " + typeof value_1;
                        console.warn("VelocityJS: Cannot set a property '" + propertyName + "' to an unknown type:", value_1);
                    }
                }
            }
        } else if (isString(value) || isNumber(value)) {
            for (var i = 0; i < elements.length; i++) {
                VelocityStatic.CSS.setPropertyValue(elements[i], property, String(value));
            }
        } else {
            error = "Cannot set a property '" + property + "' to an unknown type: " + typeof value;
            console.warn("VelocityJS: Cannot set a property '" + property + "' to an unknown type:", value);
        }
        if (promiseHandler) {
            if (error) {
                promiseHandler._rejecter(error);
            } else if (isVelocityResult(elements) && elements.velocity.animations && elements.then) {
                elements.then(promiseHandler._resolver);
            } else {
                promiseHandler._resolver(elements);
            }
        }
    }
    VelocityStatic.registerAction([ "style", styleAction ], true);
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get or set a property from one or more elements.
 */ var VelocityStatic;

(function(VelocityStatic) {
    function tween(elements, percentComplete, properties, property, easing) {
        return tweenAction(arguments, elements);
    }
    VelocityStatic.tween = tween;
    /**
     *
     */    function tweenAction(args, elements, promiseHandler, action) {
        var requireForcefeeding;
        if (!elements) {
            if (!args.length) {
                console.info('Velocity(<element>, "tween", percentComplete, property, end | [end, <easing>, <start>], <easing>) => value\n' + 'Velocity(<element>, "tween", percentComplete, {property: end | [end, <easing>, <start>], ...}, <easing>) => {property: value, ...}');
                return null;
            }
            elements = [ document.body ];
            requireForcefeeding = true;
        } else if (elements.length !== 1) {
            // TODO: Allow more than a single element to return an array of results
            throw new Error("VelocityJS: Cannot tween more than one element!");
        }
        var percentComplete = args[0], fakeAnimation = {
            elements: elements,
            element: elements[0],
            queue: false,
            options: {
                duration: 1e3
            },
            tweens: null
        }, result = {};
        var properties = args[1], singleResult, maybeSequence, easing = args[2], count = 0;
        if (isString(args[1])) {
            if (VelocityStatic.Sequences && VelocityStatic.Sequences[args[1]]) {
                maybeSequence = VelocityStatic.Sequences[args[1]];
                properties = {};
                easing = args[2];
            } else {
                singleResult = true;
                properties = (_a = {}, _a[args[1]] = args[2], _a);
                easing = args[3];
            }
        } else if (Array.isArray(args[1])) {
            singleResult = true;
            properties = {
                tween: args[1]
            };
            easing = args[2];
        }
        if (!isNumber(percentComplete) || percentComplete < 0 || percentComplete > 1) {
            throw new Error("VelocityJS: Must tween a percentage from 0 to 1!");
        }
        if (!isPlainObject(properties)) {
            throw new Error("VelocityJS: Cannot tween an invalid property!");
        }
        if (requireForcefeeding) {
            for (var property in properties) {
                if (properties.hasOwnProperty(property) && (!Array.isArray(properties[property]) || properties[property].length < 2)) {
                    throw new Error("VelocityJS: When not supplying an element you must force-feed values: " + property);
                }
            }
        }
        var activeEasing = validateEasing(getValue(easing, VelocityStatic.defaults.easing), DEFAULT_DURATION);
        if (maybeSequence) {
            VelocityStatic.expandSequence(fakeAnimation, maybeSequence);
        } else {
            VelocityStatic.expandProperties(fakeAnimation, properties);
        }
        for (var property in fakeAnimation.tweens) {
            // For every element, iterate through each property.
            var tween_2 = fakeAnimation.tweens[property], sequence = tween_2.sequence, pattern = sequence.pattern;
            var currentValue = "", i = 0;
            count++;
            if (pattern) {
                var easingComplete = (tween_2.easing || activeEasing)(percentComplete, 0, 1, property), best = 0;
                for (var i_1 = 0; i_1 < sequence.length - 1; i_1++) {
                    if (sequence[i_1].percent < easingComplete) {
                        best = i_1;
                    }
                }
                var tweenFrom = sequence[best], tweenTo = sequence[best + 1] || tweenFrom, tweenPercent = (percentComplete - tweenFrom.percent) / (tweenTo.percent - tweenFrom.percent), easing_1 = tweenTo.easing || VelocityStatic.Easing.linearEasing;
                //console.log("tick", percentComplete, tweenPercent, best, tweenFrom, tweenTo, sequence)
                                for (;i < pattern.length; i++) {
                    var startValue = tweenFrom[i];
                    if (startValue == null) {
                        currentValue += pattern[i];
                    } else {
                        var endValue = tweenTo[i];
                        if (startValue === endValue) {
                            currentValue += startValue;
                        } else {
                            // All easings must deal with numbers except for our internal ones.
                            var result_1 = easing_1(tweenPercent, startValue, endValue, property);
                            currentValue += pattern[i] === true ? Math.round(result_1) : result_1;
                        }
                    }
                }
                result[property] = currentValue;
            }
        }
        if (singleResult && count === 1) {
            for (var property in result) {
                if (result.hasOwnProperty(property)) {
                    return result[property];
                }
            }
        }
        return result;
        var _a;
    }
    VelocityStatic.registerAction([ "tween", tweenAction ], true);
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Container for page-wide Velocity state data.
     */
    var State;
    (function(State) {
        /**
         * Detect if this is a NodeJS or web browser
         */
        State.isClient = window && window === window.window, 
        /**
         * Detect mobile devices to determine if mobileHA should be turned
         * on.
         */
        State.isMobile = State.isClient && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), 
        /**
         * The mobileHA option's behavior changes on older Android devices
         * (Gingerbread, versions 2.3.3-2.3.7).
         */
        State.isAndroid = State.isClient && /Android/i.test(navigator.userAgent), 
        /**
         * The mobileHA option's behavior changes on older Android devices
         * (Gingerbread, versions 2.3.3-2.3.7).
         */
        State.isGingerbread = State.isClient && /Android 2\.3\.[3-7]/i.test(navigator.userAgent), 
        /**
         * Chrome browser
         */
        State.isChrome = State.isClient && window.chrome, 
        /**
         * Firefox browser
         */
        State.isFirefox = State.isClient && /Firefox/i.test(navigator.userAgent), 
        /**
         * Create a cached element for re-use when checking for CSS property
         * prefixes.
         */
        State.prefixElement = State.isClient && document.createElement("div"), 
        /**
         * Retrieve the appropriate scroll anchor and property name for the
         * browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY
         */
        State.windowScrollAnchor = State.isClient && window.pageYOffset !== undefined, 
        /**
         * Cache the anchor used for animating window scrolling.
         */
        State.scrollAnchor = State.windowScrollAnchor ? window : !State.isClient || document.documentElement || document.body.parentNode || document.body, 
        /**
         * Cache the browser-specific property names associated with the
         * scroll anchor.
         */
        State.scrollPropertyLeft = State.windowScrollAnchor ? "pageXOffset" : "scrollLeft", 
        /**
         * Cache the browser-specific property names associated with the
         * scroll anchor.
         */
        State.scrollPropertyTop = State.windowScrollAnchor ? "pageYOffset" : "scrollTop", 
        /**
         * The className we add / remove when animating.
         */
        State.className = CLASSNAME, 
        /**
         * Keep track of whether our RAF tick is running.
         */
        State.isTicking = false;
    })(State = VelocityStatic.State || (VelocityStatic.State = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="../state.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /**
         * Cache every camelCase match to avoid repeating lookups.
         */
        var cache = createEmptyObject();
        /**
         * Camelcase a property name into its JavaScript notation (e.g.
         * "background-color" ==> "backgroundColor"). Camelcasing is used to
         * normalize property names between and across calls.
         */        function camelCase(property) {
            var fixed = cache[property];
            if (fixed) {
                return fixed;
            }
            return cache[property] = property.replace(/-([a-z])/g, function($, letter) {
                return letter.toUpperCase();
            });
        }
        CSS.camelCase = camelCase;
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /**
         * This is the list of color names -> rgb values. The object is in here so
         * that the actual name conversion can be in a separate file and not
         * included for custom builds.
         */
        CSS.ColorNames = createEmptyObject();
        /**
         * Convert a hex list to an rgba value. Designed to be used in replace.
         */        function makeRGBA(ignore, r, g, b) {
            return "rgba(" + parseInt(r, 16) + "," + parseInt(g, 16) + "," + parseInt(b, 16) + ",1)";
        }
        var rxColor6 = /#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/gi, rxColor3 = /#([a-f\d])([a-f\d])([a-f\d])/gi, rxColorName = /(rgba?\(\s*)?(\b[a-z]+\b)/g, rxRGB = /rgb(a?)\(([^\)]+)\)/gi, rxSpaces = /\s+/g;
        /**
         * Replace any css colour name with its rgba() value. It is possible to use
         * the name within an "rgba(blue, 0.4)" string this way.
         */        function fixColors(str) {
            return str.replace(rxColor6, makeRGBA).replace(rxColor3, function($0, r, g, b) {
                return makeRGBA($0, r + r, g + g, b + b);
            }).replace(rxColorName, function($0, $1, $2) {
                if (CSS.ColorNames[$2]) {
                    return ($1 ? $1 : "rgba(") + CSS.ColorNames[$2] + ($1 ? "" : ",1)");
                }
                return $0;
            }).replace(rxRGB, function($0, $1, $2) {
                return "rgba(" + $2.replace(rxSpaces, "") + ($1 ? "" : ",1") + ")";
            });
        }
        CSS.fixColors = fixColors;
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="fixColors.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        // Converting from hex as it makes for a smaller file.
        // TODO: When build system changes to webpack, make this one optional.
        var colorValues = {
            aliceblue: 15792383,
            antiquewhite: 16444375,
            aqua: 65535,
            aquamarine: 8388564,
            azure: 15794175,
            beige: 16119260,
            bisque: 16770244,
            black: 0,
            blanchedalmond: 16772045,
            blue: 255,
            blueviolet: 9055202,
            brown: 10824234,
            burlywood: 14596231,
            cadetblue: 6266528,
            chartreuse: 8388352,
            chocolate: 13789470,
            coral: 16744272,
            cornflowerblue: 6591981,
            cornsilk: 16775388,
            crimson: 14423100,
            cyan: 65535,
            darkblue: 139,
            darkcyan: 35723,
            darkgoldenrod: 12092939,
            darkgray: 11119017,
            darkgrey: 11119017,
            darkgreen: 25600,
            darkkhaki: 12433259,
            darkmagenta: 9109643,
            darkolivegreen: 5597999,
            darkorange: 16747520,
            darkorchid: 10040012,
            darkred: 9109504,
            darksalmon: 15308410,
            darkseagreen: 9419919,
            darkslateblue: 4734347,
            darkslategray: 3100495,
            darkslategrey: 3100495,
            darkturquoise: 52945,
            darkviolet: 9699539,
            deeppink: 16716947,
            deepskyblue: 49151,
            dimgray: 6908265,
            dimgrey: 6908265,
            dodgerblue: 2003199,
            firebrick: 11674146,
            floralwhite: 16775920,
            forestgreen: 2263842,
            fuchsia: 16711935,
            gainsboro: 14474460,
            ghostwhite: 16316671,
            gold: 16766720,
            goldenrod: 14329120,
            gray: 8421504,
            grey: 8421504,
            green: 32768,
            greenyellow: 11403055,
            honeydew: 15794160,
            hotpink: 16738740,
            indianred: 13458524,
            indigo: 4915330,
            ivory: 16777200,
            khaki: 15787660,
            lavender: 15132410,
            lavenderblush: 16773365,
            lawngreen: 8190976,
            lemonchiffon: 16775885,
            lightblue: 11393254,
            lightcoral: 15761536,
            lightcyan: 14745599,
            lightgoldenrodyellow: 16448210,
            lightgray: 13882323,
            lightgrey: 13882323,
            lightgreen: 9498256,
            lightpink: 16758465,
            lightsalmon: 16752762,
            lightseagreen: 2142890,
            lightskyblue: 8900346,
            lightslategray: 7833753,
            lightslategrey: 7833753,
            lightsteelblue: 11584734,
            lightyellow: 16777184,
            lime: 65280,
            limegreen: 3329330,
            linen: 16445670,
            magenta: 16711935,
            maroon: 8388608,
            mediumaquamarine: 6737322,
            mediumblue: 205,
            mediumorchid: 12211667,
            mediumpurple: 9662683,
            mediumseagreen: 3978097,
            mediumslateblue: 8087790,
            mediumspringgreen: 64154,
            mediumturquoise: 4772300,
            mediumvioletred: 13047173,
            midnightblue: 1644912,
            mintcream: 16121850,
            mistyrose: 16770273,
            moccasin: 16770229,
            navajowhite: 16768685,
            navy: 128,
            oldlace: 16643558,
            olive: 8421376,
            olivedrab: 7048739,
            orange: 16753920,
            orangered: 16729344,
            orchid: 14315734,
            palegoldenrod: 15657130,
            palegreen: 10025880,
            paleturquoise: 11529966,
            palevioletred: 14381203,
            papayawhip: 16773077,
            peachpuff: 16767673,
            peru: 13468991,
            pink: 16761035,
            plum: 14524637,
            powderblue: 11591910,
            purple: 8388736,
            rebeccapurple: 6697881,
            red: 16711680,
            rosybrown: 12357519,
            royalblue: 4286945,
            saddlebrown: 9127187,
            salmon: 16416882,
            sandybrown: 16032864,
            seagreen: 3050327,
            seashell: 16774638,
            sienna: 10506797,
            silver: 12632256,
            skyblue: 8900331,
            slateblue: 6970061,
            slategray: 7372944,
            slategrey: 7372944,
            snow: 16775930,
            springgreen: 65407,
            steelblue: 4620980,
            tan: 13808780,
            teal: 32896,
            thistle: 14204888,
            tomato: 16737095,
            turquoise: 4251856,
            violet: 15631086,
            wheat: 16113331,
            white: 16777215,
            whitesmoke: 16119285,
            yellow: 16776960,
            yellowgreen: 10145074
        };
        for (var name_2 in colorValues) {
            if (colorValues.hasOwnProperty(name_2)) {
                var color = colorValues[name_2];
                CSS.ColorNames[name_2] = Math.floor(color / 65536) + "," + Math.floor(color / 256 % 256) + "," + color % 256;
            }
        }
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        // TODO: This is still a complete mess
        function computePropertyValue(element, property) {
            var data = Data(element), 
            // If computedStyle is cached, use it.
            computedStyle = data && data.computedStyle ? data.computedStyle : window.getComputedStyle(element, null);
            var computedValue = 0;
            if (data && !data.computedStyle) {
                data.computedStyle = computedStyle;
            }
            if (property === "width" || property === "height") {
                // Browsers do not return height and width values for elements
                // that are set to display:"none". Thus, we temporarily toggle
                // display to the element type's default value.
                var toggleDisplay = getPropertyValue(element, "display") === "none";
                // When box-sizing isn't set to border-box, height and width
                // style values are incorrectly computed when an element's
                // scrollbars are visible (which expands the element's
                // dimensions). Thus, we defer to the more accurate
                // offsetHeight/Width property, which includes the total
                // dimensions for interior, border, padding, and scrollbar. We
                // subtract border and padding to get the sum of interior +
                // scrollbar.
                // TODO: offsetHeight does not exist on SVGElement
                                if (toggleDisplay) {
                    CSS.setPropertyValue(element, "display", "auto");
                }
                computedValue = VelocityStatic.augmentDimension(element, property, true);
                if (toggleDisplay) {
                    CSS.setPropertyValue(element, "display", "none");
                }
                return String(computedValue);
            }
            /* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
             Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
             So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
            /* TODO: There is a borderColor normalisation in legacy/ - figure out where this is needed... */            computedValue = computedStyle[property];
            /* Fall back to the property's style value (if defined) when computedValue returns nothing,
             which can happen when the element hasn't been painted. */            if (!computedValue) {
                computedValue = element.style[property];
            }
            /* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
             defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
             effect as being set to 0, so no conversion is necessary.) */
            /* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
             property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
             to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */            if (computedValue === "auto") {
                switch (property) {
                  case "top":
                  case "left":
                    var topLeft = true;

                  case "right":
                  case "bottom":
                    var position = getPropertyValue(element, "position");
 /* GET */                    if (position === "fixed" || topLeft && position === "absolute") {
                        // Note: this has no pixel unit on its returned values,
                        // we re-add it here to conform with
                        // computePropertyValue's behavior.
                        computedValue = element.getBoundingClientRect[property] + "px";
 /* GET */                        break;
                    }

                    // Deliberate fallthrough!
                                      default:
                    computedValue = "0px";
                    break;
                }
            }
            return computedValue ? String(computedValue) : "";
        }
        CSS.computePropertyValue = computePropertyValue;
        /**
         * Get a property value. This will grab via the cache if it exists, then
         * via any normalisations.
         */        function getPropertyValue(element, propertyName, fn, skipCache) {
            var data = Data(element);
            var propertyValue;
            if (VelocityStatic.NoCacheNormalizations.has(propertyName)) {
                skipCache = true;
            }
            if (!skipCache && data && data.cache[propertyName] != null) {
                propertyValue = data.cache[propertyName];
            } else {
                fn = fn || VelocityStatic.getNormalization(element, propertyName);
                if (fn) {
                    propertyValue = fn(element);
                    if (data) {
                        data.cache[propertyName] = propertyValue;
                    }
                }
            }
            if (VelocityStatic.debug >= 2) {
                console.info("Get " + propertyName + ": " + propertyValue);
            }
            return propertyValue;
        }
        CSS.getPropertyValue = getPropertyValue;
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /**
         * All possible units in CSS. Used to recognise units when parsing tweens.
         */
        var Units = [ "%", "em", "ex", "ch", "rem", "vw", "vh", "vmin", "vmax", "cm", "mm", "Q", "in", "pc", "pt", "px", "deg", "grad", "rad", "turn", "s", "ms" ];
        /**
         * Get the current unit for this property. Only used when parsing tweens
         * to check if the unit is changing between the start and end values.
         */        function getUnit(property, start) {
            start = start || 0;
            if (property[start] && property[start] !== " ") {
                for (var i = 0, units = Units; i < units.length; i++) {
                    var unit = units[i];
                    var j = 0;
                    do {
                        if (j >= unit.length) {
                            return unit;
                        }
                        if (unit[j] !== property[start + j]) {
                            break;
                        }
                    } while (++j);
                }
            }
            return "";
        }
        CSS.getUnit = getUnit;
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /**
         * The singular setPropertyValue, which routes the logic for all
         * normalizations.
         */
        function setPropertyValue(element, propertyName, propertyValue, fn) {
            var data = Data(element);
            if (data && data.cache[propertyName] !== propertyValue) {
                // By setting it to undefined we force a true "get" later
                data.cache[propertyName] = propertyValue || undefined;
                fn = fn || VelocityStatic.getNormalization(element, propertyName);
                if (fn) {
                    fn(element, propertyValue);
                }
                if (VelocityStatic.debug >= 2) {
                    console.info("Set " + propertyName + ": " + propertyValue, element);
                }
            }
        }
        CSS.setPropertyValue = setPropertyValue;
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
var VelocityStatic;

(function(VelocityStatic) {
    var Easing;
    (function(Easing) {
        Easing.Easings = createEmptyObject();
        /**
         * Used to register a easing. This should never be called by users
         * directly, instead it should be called via an action:<br/>
         * <code>Velocity("registerEasing", "name", VelocityEasingFn);</code>
         *
         * @private
         */        function registerEasing(args) {
            var name = args[0], callback = args[1];
            if (!isString(name)) {
                console.warn("VelocityJS: Trying to set 'registerEasing' name to an invalid value:", name);
            } else if (!isFunction(callback)) {
                console.warn("VelocityJS: Trying to set 'registerEasing' callback to an invalid value:", name, callback);
            } else if (Easing.Easings[name]) {
                console.warn("VelocityJS: Trying to override 'registerEasing' callback", name);
            } else {
                Easing.Easings[name] = callback;
            }
        }
        Easing.registerEasing = registerEasing;
        VelocityStatic.registerAction([ "registerEasing", registerEasing ], true);
        /**
         * Linear easing, used for sequence parts that don't have an actual easing
         * function.
         */        function linearEasing(percentComplete, startValue, endValue, property) {
            return startValue + percentComplete * (endValue - startValue);
        }
        Easing.linearEasing = linearEasing;
        // Basic easings.
                registerEasing([ "linear", linearEasing ]);
        registerEasing([ "swing", function(percentComplete, startValue, endValue) {
            return startValue + (.5 - Math.cos(percentComplete * Math.PI) / 2) * (endValue - startValue);
        } ]);
        /* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */        registerEasing([ "spring", function(percentComplete, startValue, endValue) {
            return startValue + (1 - Math.cos(percentComplete * 4.5 * Math.PI) * Math.exp(-percentComplete * 6)) * (endValue - startValue);
        } ]);
    })(Easing = VelocityStatic.Easing || (VelocityStatic.Easing = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Back easings, based on code from https://github.com/yuichiroharai/easeplus-velocity
 */
var VelocityStatic;

(function(VelocityStatic) {
    var Easing;
    (function(Easing) {
        function registerBackIn(name, amount) {
            Easing.registerEasing([ name, function(percentComplete, startValue, endValue) {
                if (percentComplete === 0) {
                    return startValue;
                }
                if (percentComplete === 1) {
                    return endValue;
                }
                return Math.pow(percentComplete, 2) * ((amount + 1) * percentComplete - amount) * (endValue - startValue);
            } ]);
        }
        Easing.registerBackIn = registerBackIn;
        function registerBackOut(name, amount) {
            Easing.registerEasing([ name, function(percentComplete, startValue, endValue) {
                if (percentComplete === 0) {
                    return startValue;
                }
                if (percentComplete === 1) {
                    return endValue;
                }
                return (Math.pow(--percentComplete, 2) * ((amount + 1) * percentComplete + amount) + 1) * (endValue - startValue);
            } ]);
        }
        Easing.registerBackOut = registerBackOut;
        function registerBackInOut(name, amount) {
            amount *= 1.525;
            Easing.registerEasing([ name, function(percentComplete, startValue, endValue) {
                if (percentComplete === 0) {
                    return startValue;
                }
                if (percentComplete === 1) {
                    return endValue;
                }
                return ((percentComplete *= 2) < 1 ? Math.pow(percentComplete, 2) * ((amount + 1) * percentComplete - amount) : Math.pow(percentComplete -= 2, 2) * ((amount + 1) * percentComplete + amount) + 2) * .5 * (endValue - startValue);
            } ]);
        }
        Easing.registerBackInOut = registerBackInOut;
        registerBackIn("easeInBack", 1.7);
        registerBackOut("easeOutBack", 1.7);
        registerBackInOut("easeInOutBack", 1.7);
        // TODO: Expose these as actions to register custom easings?
        })(Easing = VelocityStatic.Easing || (VelocityStatic.Easing = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License
 */
var VelocityStatic;

(function(VelocityStatic) {
    var Easing;
    (function(Easing) {
        /**
         * Fix to a range of <code>0 <= num <= 1</code>.
         */
        function fixRange(num) {
            return Math.min(Math.max(num, 0), 1);
        }
        function A(aA1, aA2) {
            return 1 - 3 * aA2 + 3 * aA1;
        }
        function B(aA1, aA2) {
            return 3 * aA2 - 6 * aA1;
        }
        function C(aA1) {
            return 3 * aA1;
        }
        function calcBezier(aT, aA1, aA2) {
            return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
        }
        function getSlope(aT, aA1, aA2) {
            return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
        }
        function generateBezier(mX1, mY1, mX2, mY2) {
            var NEWTON_ITERATIONS = 4, NEWTON_MIN_SLOPE = .001, SUBDIVISION_PRECISION = 1e-7, SUBDIVISION_MAX_ITERATIONS = 10, kSplineTableSize = 11, kSampleStepSize = 1 / (kSplineTableSize - 1), float32ArraySupported = "Float32Array" in window;
            /* Must contain four arguments. */            if (arguments.length !== 4) {
                return;
            }
            /* Arguments must be numbers. */            for (var i = 0; i < 4; ++i) {
                if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
                    return;
                }
            }
            /* X values must be in the [0, 1] range. */            mX1 = fixRange(mX1);
            mX2 = fixRange(mX2);
            var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
            function newtonRaphsonIterate(aX, aGuessT) {
                for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
                    var currentSlope = getSlope(aGuessT, mX1, mX2);
                    if (currentSlope === 0) {
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
                    currentT = aA + (aB - aA) / 2;
                    currentX = calcBezier(currentT, mX1, mX2) - aX;
                    if (currentX > 0) {
                        aB = currentT;
                    } else {
                        aA = currentT;
                    }
                } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
                return currentT;
            }
            function getTForX(aX) {
                var intervalStart = 0, currentSample = 1, lastSample = kSplineTableSize - 1;
                for (;currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
                    intervalStart += kSampleStepSize;
                }
                --currentSample;
                var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]), guessForT = intervalStart + dist * kSampleStepSize, initialSlope = getSlope(guessForT, mX1, mX2);
                if (initialSlope >= NEWTON_MIN_SLOPE) {
                    return newtonRaphsonIterate(aX, guessForT);
                } else if (initialSlope === 0) {
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
            var f = function(percentComplete, startValue, endValue, property) {
                if (!_precomputed) {
                    precompute();
                }
                if (percentComplete === 0) {
                    return startValue;
                }
                if (percentComplete === 1) {
                    return endValue;
                }
                if (mX1 === mY1 && mX2 === mY2) {
                    return startValue + percentComplete * (endValue - startValue);
                }
                return startValue + calcBezier(getTForX(percentComplete), mY1, mY2) * (endValue - startValue);
            };
            f.getControlPoints = function() {
                return [ {
                    x: mX1,
                    y: mY1
                }, {
                    x: mX2,
                    y: mY2
                } ];
            };
            var str = "generateBezier(" + [ mX1, mY1, mX2, mY2 ] + ")";
            f.toString = function() {
                return str;
            };
            return f;
        }
        Easing.generateBezier = generateBezier;
        /* Common easings */        var easeIn = generateBezier(.42, 0, 1, 1), easeOut = generateBezier(0, 0, .58, 1), easeInOut = generateBezier(.42, 0, .58, 1);
        Easing.registerEasing([ "ease", generateBezier(.25, .1, .25, 1) ]);
        Easing.registerEasing([ "easeIn", easeIn ]);
        Easing.registerEasing([ "ease-in", easeIn ]);
        Easing.registerEasing([ "easeOut", easeOut ]);
        Easing.registerEasing([ "ease-out", easeOut ]);
        Easing.registerEasing([ "easeInOut", easeInOut ]);
        Easing.registerEasing([ "ease-in-out", easeInOut ]);
        Easing.registerEasing([ "easeInSine", generateBezier(.47, 0, .745, .715) ]);
        Easing.registerEasing([ "easeOutSine", generateBezier(.39, .575, .565, 1) ]);
        Easing.registerEasing([ "easeInOutSine", generateBezier(.445, .05, .55, .95) ]);
        Easing.registerEasing([ "easeInQuad", generateBezier(.55, .085, .68, .53) ]);
        Easing.registerEasing([ "easeOutQuad", generateBezier(.25, .46, .45, .94) ]);
        Easing.registerEasing([ "easeInOutQuad", generateBezier(.455, .03, .515, .955) ]);
        Easing.registerEasing([ "easeInCubic", generateBezier(.55, .055, .675, .19) ]);
        Easing.registerEasing([ "easeOutCubic", generateBezier(.215, .61, .355, 1) ]);
        Easing.registerEasing([ "easeInOutCubic", generateBezier(.645, .045, .355, 1) ]);
        Easing.registerEasing([ "easeInQuart", generateBezier(.895, .03, .685, .22) ]);
        Easing.registerEasing([ "easeOutQuart", generateBezier(.165, .84, .44, 1) ]);
        Easing.registerEasing([ "easeInOutQuart", generateBezier(.77, 0, .175, 1) ]);
        Easing.registerEasing([ "easeInQuint", generateBezier(.755, .05, .855, .06) ]);
        Easing.registerEasing([ "easeOutQuint", generateBezier(.23, 1, .32, 1) ]);
        Easing.registerEasing([ "easeInOutQuint", generateBezier(.86, 0, .07, 1) ]);
        Easing.registerEasing([ "easeInExpo", generateBezier(.95, .05, .795, .035) ]);
        Easing.registerEasing([ "easeOutExpo", generateBezier(.19, 1, .22, 1) ]);
        Easing.registerEasing([ "easeInOutExpo", generateBezier(1, 0, 0, 1) ]);
        Easing.registerEasing([ "easeInCirc", generateBezier(.6, .04, .98, .335) ]);
        Easing.registerEasing([ "easeOutCirc", generateBezier(.075, .82, .165, 1) ]);
        Easing.registerEasing([ "easeInOutCirc", generateBezier(.785, .135, .15, .86) ]);
    })(Easing = VelocityStatic.Easing || (VelocityStatic.Easing = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Bounce easings, based on code from https://github.com/yuichiroharai/easeplus-velocity
 */
var VelocityStatic;

(function(VelocityStatic) {
    var Easing;
    (function(Easing) {
        function easeOutBounce(percentComplete) {
            if (percentComplete < 1 / 2.75) {
                return 7.5625 * percentComplete * percentComplete;
            }
            if (percentComplete < 2 / 2.75) {
                return 7.5625 * (percentComplete -= 1.5 / 2.75) * percentComplete + .75;
            }
            if (percentComplete < 2.5 / 2.75) {
                return 7.5625 * (percentComplete -= 2.25 / 2.75) * percentComplete + .9375;
            }
            return 7.5625 * (percentComplete -= 2.625 / 2.75) * percentComplete + .984375;
        }
        function easeInBounce(percentComplete) {
            return 1 - easeOutBounce(1 - percentComplete);
        }
        Easing.registerEasing([ "easeInBounce", function(percentComplete, startValue, endValue) {
            if (percentComplete === 0) {
                return startValue;
            }
            if (percentComplete === 1) {
                return endValue;
            }
            return easeInBounce(percentComplete) * (endValue - startValue);
        } ]);
        Easing.registerEasing([ "easeOutBounce", function(percentComplete, startValue, endValue) {
            if (percentComplete === 0) {
                return startValue;
            }
            if (percentComplete === 1) {
                return endValue;
            }
            return easeOutBounce(percentComplete) * (endValue - startValue);
        } ]);
        Easing.registerEasing([ "easeInOutBounce", function(percentComplete, startValue, endValue) {
            if (percentComplete === 0) {
                return startValue;
            }
            if (percentComplete === 1) {
                return endValue;
            }
            return (percentComplete < .5 ? easeInBounce(percentComplete * 2) * .5 : easeOutBounce(percentComplete * 2 - 1) * .5 + .5) * (endValue - startValue);
        } ]);
    })(Easing = VelocityStatic.Easing || (VelocityStatic.Easing = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Elastic easings, based on code from https://github.com/yuichiroharai/easeplus-velocity
 */
var VelocityStatic;

(function(VelocityStatic) {
    var Easing;
    (function(Easing) {
        var pi2 = Math.PI * 2;
        function registerElasticIn(name, amplitude, period) {
            Easing.registerEasing([ name, function(percentComplete, startValue, endValue) {
                if (percentComplete === 0) {
                    return startValue;
                }
                if (percentComplete === 1) {
                    return endValue;
                }
                return -(amplitude * Math.pow(2, 10 * (percentComplete -= 1)) * Math.sin((percentComplete - period / pi2 * Math.asin(1 / amplitude)) * pi2 / period)) * (endValue - startValue);
            } ]);
        }
        Easing.registerElasticIn = registerElasticIn;
        function registerElasticOut(name, amplitude, period) {
            Easing.registerEasing([ name, function(percentComplete, startValue, endValue) {
                if (percentComplete === 0) {
                    return startValue;
                }
                if (percentComplete === 1) {
                    return endValue;
                }
                return (amplitude * Math.pow(2, -10 * percentComplete) * Math.sin((percentComplete - period / pi2 * Math.asin(1 / amplitude)) * pi2 / period) + 1) * (endValue - startValue);
            } ]);
        }
        Easing.registerElasticOut = registerElasticOut;
        function registerElasticInOut(name, amplitude, period) {
            Easing.registerEasing([ name, function(percentComplete, startValue, endValue) {
                if (percentComplete === 0) {
                    return startValue;
                }
                if (percentComplete === 1) {
                    return endValue;
                }
                var s = period / pi2 * Math.asin(1 / amplitude);
                percentComplete = percentComplete * 2 - 1;
                return (percentComplete < 0 ? -.5 * (amplitude * Math.pow(2, 10 * percentComplete) * Math.sin((percentComplete - s) * pi2 / period)) : amplitude * Math.pow(2, -10 * percentComplete) * Math.sin((percentComplete - s) * pi2 / period) * .5 + 1) * (endValue - startValue);
            } ]);
        }
        Easing.registerElasticInOut = registerElasticInOut;
        registerElasticIn("easeInElastic", 1, .3);
        registerElasticOut("easeOutElastic", 1, .3);
        registerElasticInOut("easeInOutElastic", 1, .3 * 1.5);
        // TODO: Expose these as actions to register custom easings?
        })(Easing = VelocityStatic.Easing || (VelocityStatic.Easing = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
var VelocityStatic;

(function(VelocityStatic) {
    var Easing;
    (function(Easing) {
        /* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
        /* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
         then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
        function springAccelerationForState(state) {
            return -state.tension * state.x - state.friction * state.v;
        }
        function springEvaluateStateWithDerivative(initialState, dt, derivative) {
            var state = {
                x: initialState.x + derivative.dx * dt,
                v: initialState.v + derivative.dv * dt,
                tension: initialState.tension,
                friction: initialState.friction
            };
            return {
                dx: state.v,
                dv: springAccelerationForState(state)
            };
        }
        function springIntegrateState(state, dt) {
            var a = {
                dx: state.v,
                dv: springAccelerationForState(state)
            }, b = springEvaluateStateWithDerivative(state, dt * .5, a), c = springEvaluateStateWithDerivative(state, dt * .5, b), d = springEvaluateStateWithDerivative(state, dt, c), dxdt = 1 / 6 * (a.dx + 2 * (b.dx + c.dx) + d.dx), dvdt = 1 / 6 * (a.dv + 2 * (b.dv + c.dv) + d.dv);
            state.x = state.x + dxdt * dt;
            state.v = state.v + dvdt * dt;
            return state;
        }
        function generateSpringRK4(tension, friction, duration) {
            var initState = {
                x: -1,
                v: 0,
                tension: parseFloat(tension) || 500,
                friction: parseFloat(friction) || 20
            }, path = [ 0 ], time_lapsed = 0, tolerance = 1 / 1e4, DT = 16 / 1e3, have_duration = duration != null, // deliberate "==", as undefined == null != 0
            dt, last_state;
            /* Calculate the actual time it takes for this animation to complete with the provided conditions. */            if (have_duration) {
                /* Run the simulation without a duration. */
                time_lapsed = generateSpringRK4(initState.tension, initState.friction);
                /* Compute the adjusted time delta. */                dt = time_lapsed / duration * DT;
            } else {
                dt = DT;
            }
            while (true) {
                /* Next/step function .*/
                last_state = springIntegrateState(last_state || initState, dt);
                /* Store the position. */                path.push(1 + last_state.x);
                time_lapsed += 16;
                /* If the change threshold is reached, break. */                if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
                    break;
                }
            }
            /* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
             computed path and returns a snapshot of the position according to a given percentComplete. */            return !have_duration ? time_lapsed : function(percentComplete, startValue, endValue) {
                if (percentComplete === 0) {
                    return startValue;
                }
                if (percentComplete === 1) {
                    return endValue;
                }
                return startValue + path[percentComplete * (path.length - 1) | 0] * (endValue - startValue);
            };
        }
        Easing.generateSpringRK4 = generateSpringRK4;
    })(Easing = VelocityStatic.Easing || (VelocityStatic.Easing = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details
 *
 * Step easing generator.
 */
var VelocityStatic;

(function(VelocityStatic) {
    var Easing;
    (function(Easing) {
        var cache = {};
        function generateStep(steps) {
            var fn = cache[steps];
            if (fn) {
                return fn;
            }
            return cache[steps] = function(percentComplete, startValue, endValue) {
                if (percentComplete === 0) {
                    return startValue;
                }
                if (percentComplete === 1) {
                    return endValue;
                }
                return startValue + Math.round(percentComplete * steps) * (1 / steps) * (endValue - startValue);
            };
        }
        Easing.generateStep = generateStep;
    })(Easing = VelocityStatic.Easing || (VelocityStatic.Easing = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Easings to act on strings, either set at the start or at the end depending on
 * need.
 */
var VelocityStatic;

(function(VelocityStatic) {
    var Easing;
    (function(Easing) {
        /**
         * Easing function that sets to the specified value immediately after the
         * animation starts.
         */
        Easing.registerEasing([ "at-start", function(percentComplete, startValue, endValue) {
            return percentComplete === 0 ? startValue : endValue;
        } ]);
        /**
         * Easing function that sets to the specified value while the animation is
         * running.
         */        Easing.registerEasing([ "during", function(percentComplete, startValue, endValue) {
            return percentComplete === 0 || percentComplete === 1 ? startValue : endValue;
        } ]);
        /**
         * Easing function that sets to the specified value when the animation ends.
         */        Easing.registerEasing([ "at-end", function(percentComplete, startValue, endValue) {
            return percentComplete === 1 ? endValue : startValue;
        } ]);
    })(Easing = VelocityStatic.Easing || (VelocityStatic.Easing = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="../actions/_all.d.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Normalisations are used when getting or setting a (normally css compound
 * properties) value that can have a different order in different browsers.
 *
 * It can also be used to extend and create specific properties that otherwise
 * don't exist (such as for scrolling, or inner/outer dimensions).
 */
var VelocityStatic;

(function(VelocityStatic) {
    /**
     * The highest type index for finding the best normalization for a property.
     */
    VelocityStatic.MaxType = -1;
    /**
     * Unlike "actions", normalizations can always be replaced by users.
     */    VelocityStatic.Normalizations = [];
    /**
     * Store a cross-reference to units to be added to specific normalization
     * functions if the user supplies a unit-less number.
     *
     * This is pretty much confined to adding "px" to several css properties.
     */    VelocityStatic.NormalizationUnits = createEmptyObject();
    /**
     * Any normalisations that should never be cached are listed here.
     * Faster than an array - https://jsperf.com/array-includes-and-find-methods-vs-set-has
     */    VelocityStatic.NoCacheNormalizations = new Set();
    /**
     * An array of classes used for the per-class normalizations. This
     * translates into a bitwise enum for quick cross-reference, and so that
     * the element doesn't need multiple <code>instanceof</code> calls every
     * frame.
     */    VelocityStatic.constructors = [];
    /**
     * Used to register a normalization. This should never be called by users
     * directly, instead it should be called via an action:<br/>
     * <code>Velocity("registerNormalization", Element, "name", VelocityNormalizationsFn[, false]);</code>
     *
     * The fourth argument can be an explicit <code>false</code>, which prevents
     * the property from being cached. Please note that this can be dangerous
     * for performance!
     *
     * @private
     */    function registerNormalization(args) {
        var constructor = args[0], name = args[1], callback = args[2];
        if (isString(constructor) || !(constructor instanceof Object)) {
            console.warn("VelocityJS: Trying to set 'registerNormalization' constructor to an invalid value:", constructor);
        } else if (!isString(name)) {
            console.warn("VelocityJS: Trying to set 'registerNormalization' name to an invalid value:", name);
        } else if (!isFunction(callback)) {
            console.warn("VelocityJS: Trying to set 'registerNormalization' callback to an invalid value:", name, callback);
        } else {
            var index = VelocityStatic.constructors.indexOf(constructor), nextArg = 3;
            if (index < 0) {
                VelocityStatic.MaxType = index = VelocityStatic.constructors.push(constructor) - 1;
                VelocityStatic.Normalizations[index] = createEmptyObject();
            }
            VelocityStatic.Normalizations[index][name] = callback;
            if (isString(args[nextArg])) {
                var unit = args[nextArg++], units = VelocityStatic.NormalizationUnits[unit];
                if (!units) {
                    units = VelocityStatic.NormalizationUnits[unit] = [];
                }
                units.push(callback);
            }
            if (args[nextArg] === false) {
                VelocityStatic.NoCacheNormalizations.add(name);
            }
        }
    }
    VelocityStatic.registerNormalization = registerNormalization;
    /**
     * Used to check if a normalisation exists on a specific class.
     */    function hasNormalization(args) {
        var constructor = args[0], name = args[1];
        var index = VelocityStatic.constructors.indexOf(constructor);
        return !!VelocityStatic.Normalizations[index][name];
    }
    VelocityStatic.hasNormalization = hasNormalization;
    /**
     * Get the unit to add to a unitless number based on the normalization used.
     */    function getNormalizationUnit(fn) {
        for (var unit in VelocityStatic.NormalizationUnits) {
            if (_inArray(VelocityStatic.NormalizationUnits[unit], fn)) {
                return unit;
            }
        }
        return "";
    }
    VelocityStatic.getNormalizationUnit = getNormalizationUnit;
    /**
     * Get the normalization for an element and propertyName combination. This
     * value should be cached at asking time, as it may change if the user adds
     * more normalizations.
     */    function getNormalization(element, propertyName) {
        var data = Data(element);
        var fn;
        for (var index = VelocityStatic.MaxType, types = data.types; !fn && index >= 0; index--) {
            if (types & 1 << index) {
                fn = VelocityStatic.Normalizations[index][propertyName];
            }
        }
        return fn;
    }
    VelocityStatic.getNormalization = getNormalization;
    VelocityStatic.registerAction([ "registerNormalization", registerNormalization ]);
    VelocityStatic.registerAction([ "hasNormalization", hasNormalization ]);
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="../normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /**
         * Get/set an attribute.
         */
        function getAttribute(name) {
            return function(element, propertyValue) {
                if (propertyValue === undefined) {
                    return element.getAttribute(name);
                }
                element.setAttribute(name, propertyValue);
            };
        }
        var base = document.createElement("div"), rxSubtype = /^SVG(.*)Element$/, rxElement = /Element$/;
        Object.getOwnPropertyNames(window).forEach(function(globals) {
            var subtype = rxSubtype.exec(globals);
            if (subtype && subtype[1] !== "SVG") {
                try {
                    var element = subtype[1] ? document.createElementNS("http://www.w3.org/2000/svg", (subtype[1] || "svg").toLowerCase()) : document.createElement("svg"), constructor = element.constructor;
                    for (var attribute in element) {
                        var value = element[attribute];
                        if (isString(attribute) && !(attribute[0] === "o" && attribute[1] === "n") && attribute !== attribute.toUpperCase() && !rxElement.test(attribute) && !(attribute in base) && !isFunction(value)) {
                            // TODO: Should this all be set on the generic SVGElement, it would save space and time, but not as powerful
                            VelocityStatic.registerNormalization([ constructor, attribute, getAttribute(attribute) ]);
                        }
                    }
                } catch (e) {
                    console.error("VelocityJS: Error when trying to identify SVG attributes on " + globals + ".", e);
                }
            }
        });
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="../normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /**
         * Get/set the width or height.
         */
        function getDimension(name) {
            return function(element, propertyValue) {
                if (propertyValue === undefined) {
                    // Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM.
                    try {
                        return element.getBBox()[name] + "px";
                    } catch (e) {
                        return "0px";
                    }
                }
                element.setAttribute(name, propertyValue);
            };
        }
        VelocityStatic.registerNormalization([ SVGElement, "width", getDimension("width") ]);
        VelocityStatic.registerNormalization([ SVGElement, "height", getDimension("height") ]);
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Figure out the dimensions for this width / height based on the
     * potential borders and whether we care about them.
     */
    function augmentDimension(element, name, wantInner) {
        var isBorderBox = VelocityStatic.CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === "border-box";
        if (isBorderBox === wantInner) {
            // in box-sizing mode, the CSS width / height accessors already
            // give the outerWidth / outerHeight.
            var sides = name === "width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ], fields = [ "padding" + sides[0], "padding" + sides[1], "border" + sides[0] + "Width", "border" + sides[1] + "Width" ];
            var i = void 0, value = void 0, augment = 0;
            for (i = 0; i < fields.length; i++) {
                value = parseFloat(VelocityStatic.CSS.getPropertyValue(element, fields[i]));
                if (!isNaN(value)) {
                    augment += value;
                }
            }
            return wantInner ? -augment : augment;
        }
        return 0;
    }
    VelocityStatic.augmentDimension = augmentDimension;
    /**
     * Get/set the inner/outer dimension.
     */    function getDimension(name, wantInner) {
        return function(element, propertyValue) {
            if (propertyValue === undefined) {
                return augmentDimension(element, name, wantInner) + "px";
            }
            VelocityStatic.CSS.setPropertyValue(element, name, parseFloat(propertyValue) - augmentDimension(element, name, wantInner) + "px");
        };
    }
    VelocityStatic.registerNormalization([ Element, "innerWidth", getDimension("width", true) ]);
    VelocityStatic.registerNormalization([ Element, "innerHeight", getDimension("height", true) ]);
    VelocityStatic.registerNormalization([ Element, "outerWidth", getDimension("width", false) ]);
    VelocityStatic.registerNormalization([ Element, "outerHeight", getDimension("height", false) ]);
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    VelocityStatic.inlineRx = /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|let|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i, 
    VelocityStatic.listItemRx = /^(li)$/i, VelocityStatic.tableRowRx = /^(tr)$/i, VelocityStatic.tableRx = /^(table)$/i, 
    VelocityStatic.tableRowGroupRx = /^(tbody)$/i;
    function display(element, propertyValue) {
        var style = element.style;
        if (propertyValue === undefined) {
            return VelocityStatic.CSS.computePropertyValue(element, "display");
        }
        if (propertyValue === "auto") {
            var nodeName = element && element.nodeName, data = Data(element);
            if (VelocityStatic.inlineRx.test(nodeName)) {
                propertyValue = "inline";
            } else if (VelocityStatic.listItemRx.test(nodeName)) {
                propertyValue = "list-item";
            } else if (VelocityStatic.tableRowRx.test(nodeName)) {
                propertyValue = "table-row";
            } else if (VelocityStatic.tableRx.test(nodeName)) {
                propertyValue = "table";
            } else if (VelocityStatic.tableRowGroupRx.test(nodeName)) {
                propertyValue = "table-row-group";
            } else {
                // Default to "block" when no match is found.
                propertyValue = "block";
            }
            // IMPORTANT: We need to do this as getPropertyValue bypasses the
            // Normalisation when it exists in the cache.
                        data.cache["display"] = propertyValue;
        }
        style.display = propertyValue;
    }
    VelocityStatic.registerNormalization([ Element, "display", display ]);
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    function clientWidth(element, propertyValue) {
        if (propertyValue == null) {
            return element.clientWidth + "px";
        }
    }
    function scrollWidth(element, propertyValue) {
        if (propertyValue == null) {
            return element.scrollWidth + "px";
        }
    }
    function clientHeight(element, propertyValue) {
        if (propertyValue == null) {
            return element.clientHeight + "px";
        }
    }
    function scrollHeight(element, propertyValue) {
        if (propertyValue == null) {
            return element.scrollHeight + "px";
        }
    }
    function scroll(direction, end) {
        return function(element, propertyValue) {
            if (propertyValue == null) {
                // Make sure we have these values cached.
                VelocityStatic.CSS.getPropertyValue(element, "client" + direction, null, true);
                VelocityStatic.CSS.getPropertyValue(element, "scroll" + direction, null, true);
                VelocityStatic.CSS.getPropertyValue(element, "scroll" + end, null, true);
                return element["scroll" + end] + "px";
            }
            //		console.log("setScrollTop", propertyValue)
                        var value = parseFloat(propertyValue), unit = propertyValue.replace(String(value), "");
            switch (unit) {
              case "":
              case "px":
                element["scroll" + end] = value;
                break;

              case "%":
                var client = parseFloat(VelocityStatic.CSS.getPropertyValue(element, "client" + direction)), scroll_1 = parseFloat(VelocityStatic.CSS.getPropertyValue(element, "scroll" + direction));
                //				console.log("setScrollTop percent", scrollHeight, clientHeight, value, Math.max(0, scrollHeight - clientHeight) * value / 100)
                                element["scroll" + end] = Math.max(0, scroll_1 - client) * value / 100;
            }
        };
    }
    VelocityStatic.registerNormalization([ HTMLElement, "scroll", scroll("Height", "Top"), false ]);
    VelocityStatic.registerNormalization([ HTMLElement, "scrollTop", scroll("Height", "Top"), false ]);
    VelocityStatic.registerNormalization([ HTMLElement, "scrollLeft", scroll("Width", "Left"), false ]);
    VelocityStatic.registerNormalization([ HTMLElement, "scrollWidth", scrollWidth ]);
    VelocityStatic.registerNormalization([ HTMLElement, "clientWidth", clientWidth ]);
    VelocityStatic.registerNormalization([ HTMLElement, "scrollHeight", scrollHeight ]);
    VelocityStatic.registerNormalization([ HTMLElement, "clientHeight", clientHeight ]);
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * This handles all CSS style properties. With browser prefixed properties it
 * will register a version that handles setting (and getting) both the prefixed
 * and non-prefixed version.
 */ var VelocityStatic;

(function(VelocityStatic) {
    /**
     * An RegExp pattern for the following list of css words using
     * http://kemio.com.ar/tools/lst-trie-re.php to generate:
     *
     * blockSize
     * borderBottomLeftRadius
     * borderBottomRightRadius
     * borderBottomWidth
     * borderImageOutset
     * borderImageWidth
     * borderLeftWidth
     * borderRadius
     * borderRightWidth
     * borderSpacing
     * borderTopLeftRadius
     * borderTopRightRadius
     * borderTopWidth
     * borderWidth
     * bottom
     * columnGap
     * columnRuleWidth
     * columnWidth
     * flexBasis
     * fontSize
     * gridColumnGap
     * gridGap
     * gridRowGap
     * height
     * inlineSize
     * left
     * letterSpacing
     * margin
     * marginBottom
     * marginLeft
     * marginRight
     * marginTop
     * maxBlockSize
     * maxHeight
     * maxInlineSize
     * maxWidth
     * minBlockSize
     * minHeight
     * minInlineSize
     * minWidth
     * objectPosition
     * outlineOffset
     * outlineWidth
     * padding
     * paddingBottom
     * paddingLeft
     * paddingRight
     * paddingTop
     * perspective
     * right
     * shapeMargin
     * strokeDashoffset
     * strokeWidth
     * textIndent
     * top
     * transformOrigin
     * width
     * wordSpacing
     */
    var rxAddPx = /^(b(lockSize|o(rder(Bottom(LeftRadius|RightRadius|Width)|Image(Outset|Width)|LeftWidth|R(adius|ightWidth)|Spacing|Top(LeftRadius|RightRadius|Width)|Width)|ttom))|column(Gap|RuleWidth|Width)|f(lexBasis|ontSize)|grid(ColumnGap|Gap|RowGap)|height|inlineSize|le(ft|tterSpacing)|m(a(rgin(Bottom|Left|Right|Top)|x(BlockSize|Height|InlineSize|Width))|in(BlockSize|Height|InlineSize|Width))|o(bjectPosition|utline(Offset|Width))|p(adding(Bottom|Left|Right|Top)|erspective)|right|s(hapeMargin|troke(Dashoffset|Width))|t(extIndent|op|ransformOrigin)|w(idth|ordSpacing))$/;
    /**
     * Return a Normalisation that can be used to set / get a prefixed style
     * property.
     */    function getSetPrefixed(propertyName, unprefixed) {
        return function(element, propertyValue) {
            if (propertyValue === undefined) {
                return VelocityStatic.CSS.computePropertyValue(element, propertyName) || VelocityStatic.CSS.computePropertyValue(element, unprefixed);
            }
            element.style[propertyName] = element.style[unprefixed] = propertyValue;
        };
    }
    /**
     * Return a Normalisation that can be used to set / get a style property.
     */    function getSetStyle(propertyName) {
        return function(element, propertyValue) {
            if (propertyValue === undefined) {
                return VelocityStatic.CSS.computePropertyValue(element, propertyName);
            }
            element.style[propertyName] = propertyValue;
        };
    }
    /**
     * Vendor prefixes. Chrome / Safari, Firefox, IE / Edge, Opera.
     */    var rxVendors = /^(webkit|moz|ms|o)[A-Z]/, prefixElement = VelocityStatic.State.prefixElement;
    for (var propertyName in prefixElement.style) {
        if (rxVendors.test(propertyName)) {
            var unprefixed = propertyName.replace(/^[a-z]+([A-Z])/, function($, letter) {
                return letter.toLowerCase();
            });
            if (ALL_VENDOR_PREFIXES || isString(prefixElement.style[unprefixed])) {
                var addUnit = rxAddPx.test(unprefixed) ? "px" : undefined;
                VelocityStatic.registerNormalization([ Element, unprefixed, getSetPrefixed(propertyName, unprefixed), addUnit ]);
            }
        } else if (!VelocityStatic.hasNormalization([ Element, propertyName ])) {
            var addUnit = rxAddPx.test(propertyName) ? "px" : undefined;
            VelocityStatic.registerNormalization([ Element, propertyName, getSetStyle(propertyName), addUnit ]);
        }
    }
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    /**
     * A fake normalization used to allow the "tween" property easy access.
     */
    function getSetTween(element, propertyValue) {
        if (propertyValue === undefined) {
            return "";
        }
    }
    VelocityStatic.registerNormalization([ Element, "tween", getSetTween ]);
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Call Completion
 */ var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Call the complete method of an animation in a separate function so it can
     * benefit from JIT compiling while still having a try/catch block.
     */
    function callComplete(activeCall) {
        try {
            var elements = activeCall.elements;
            activeCall.options.complete.call(elements, elements, activeCall);
        } catch (error) {
            setTimeout(function() {
                throw error;
            }, 1);
        }
    }
    /**
     * Complete an animation. This might involve restarting (for loop or repeat
     * options). Once it is finished we also check for any callbacks or Promises
     * that need updating.
     */    function completeCall(activeCall) {
        //		console.log("complete", activeCall)
        // TODO: Check if it's not been completed already
        var options = activeCall.options, queue = getValue(activeCall.queue, options.queue), isLoop = getValue(activeCall.loop, options.loop, VelocityStatic.defaults.loop), isRepeat = getValue(activeCall.repeat, options.repeat, VelocityStatic.defaults.repeat), isStopped = activeCall._flags & 8 /* STOPPED */;
        if (!isStopped && (isLoop || isRepeat)) {
            ////////////////////
            // Option: Loop   //
            // Option: Repeat //
            ////////////////////
            if (isRepeat && isRepeat !== true) {
                activeCall.repeat = isRepeat - 1;
            } else if (isLoop && isLoop !== true) {
                activeCall.loop = isLoop - 1;
                activeCall.repeat = getValue(activeCall.repeatAgain, options.repeatAgain, VelocityStatic.defaults.repeatAgain);
            }
            if (isLoop) {
                activeCall._flags ^= 64 /* REVERSE */;
            }
            if (queue !== false) {
                // Can't be called when stopped so no need for an extra check.
                Data(activeCall.element).lastFinishList[queue] = activeCall.timeStart + getValue(activeCall.duration, options.duration, VelocityStatic.defaults.duration);
            }
            activeCall.timeStart = activeCall.ellapsedTime = activeCall.percentComplete = 0;
            activeCall._flags &= ~4 /* STARTED */;
        } else {
            var element = activeCall.element, data = Data(element);
            if (!--data.count && !isStopped) {
                ////////////////////////
                // Feature: Classname //
                ////////////////////////
                removeClass(element, VelocityStatic.State.className);
            }
            //////////////////////
            // Option: Complete //
            //////////////////////
            // If this is the last animation in this list then we can check for
            // and complete calls or Promises.
            // TODO: When deleting an element we need to adjust these values.
                        if (options && ++options._completed === options._total) {
                if (!isStopped && options.complete) {
                    // We don't call the complete if the animation is stopped,
                    // and we clear the key to prevent it being called again.
                    callComplete(activeCall);
                    options.complete = null;
                }
                var resolver = options._resolver;
                if (resolver) {
                    // Fulfil the Promise
                    resolver(activeCall.elements);
                    delete options._resolver;
                }
            }
            ///////////////////
            // Option: Queue //
            ///////////////////
                        if (queue !== false) {
                // We only do clever things with queues...
                if (!isStopped) {
                    // If we're not stopping an animation, we need to remember
                    // what time it finished so that the next animation in
                    // sequence gets the correct start time.
                    data.lastFinishList[queue] = activeCall.timeStart + getValue(activeCall.duration, options.duration, VelocityStatic.defaults.duration);
                }
                // Start the next animation in sequence, or delete the queue if
                // this was the last one.
                                VelocityStatic.dequeue(element, queue);
            }
            // Cleanup any pointers, and remember the last animation etc.
                        VelocityStatic.freeAnimationCall(activeCall);
        }
    }
    VelocityStatic.completeCall = completeCall;
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
/**
 * Get (and create) the internal data store for an element.
 */
function Data(element) {
    // Use a string member so Uglify doesn't mangle it.
    var data = element["velocityData"];
    if (data) {
        return data;
    }
    var types = 0;
    for (var index = 0, constructors = VelocityStatic.constructors; index < constructors.length; index++) {
        if (element instanceof constructors[index]) {
            types |= 1 << index;
        }
    }
    // Do it this way so it errors on incorrect data.
        var newData = {
        types: types,
        count: 0,
        computedStyle: null,
        cache: createEmptyObject(),
        queueList: createEmptyObject(),
        lastAnimationList: createEmptyObject(),
        lastFinishList: createEmptyObject()
    };
    Object.defineProperty(element, "velocityData", {
        value: newData
    });
    return newData;
}

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Set to true, 1 or 2 (most verbose) to output debug info to console.
     */
    VelocityStatic.debug = false;
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity option defaults, which can be overriden by the user.
 */
var VelocityStatic;

(function(VelocityStatic) {
    // NOTE: Add the variable here, then add the default state in "reset" below.
    var _cache, _begin, _complete, _delay, _duration, _easing, _fpsLimit, _loop, _minFrameTime, _promise, _promiseRejectEmpty, _queue, _repeat, _speed, _sync;
    VelocityStatic.defaults = {
        mobileHA: true
    };
    // IMPORTANT: Make sure any new defaults get added to the actions/set.ts list
        Object.defineProperties(VelocityStatic.defaults, {
        reset: {
            enumerable: true,
            value: function() {
                _cache = DEFAULT_CACHE;
                _begin = undefined;
                _complete = undefined;
                _delay = DEFAULT_DELAY;
                _duration = DEFAULT_DURATION;
                _easing = validateEasing(DEFAULT_EASING, DEFAULT_DURATION);
                _fpsLimit = DEFAULT_FPSLIMIT;
                _loop = DEFAULT_LOOP;
                _minFrameTime = FUZZY_MS_PER_SECOND / DEFAULT_FPSLIMIT;
                _promise = DEFAULT_PROMISE;
                _promiseRejectEmpty = DEFAULT_PROMISE_REJECT_EMPTY;
                _queue = DEFAULT_QUEUE;
                _repeat = DEFAULT_REPEAT;
                _speed = DEFAULT_SPEED;
                _sync = DEFAULT_SYNC;
            }
        },
        cache: {
            enumerable: true,
            get: function() {
                return _cache;
            },
            set: function(value) {
                value = validateCache(value);
                if (value !== undefined) {
                    _cache = value;
                }
            }
        },
        begin: {
            enumerable: true,
            get: function() {
                return _begin;
            },
            set: function(value) {
                value = validateBegin(value);
                if (value !== undefined) {
                    _begin = value;
                }
            }
        },
        complete: {
            enumerable: true,
            get: function() {
                return _complete;
            },
            set: function(value) {
                value = validateComplete(value);
                if (value !== undefined) {
                    _complete = value;
                }
            }
        },
        delay: {
            enumerable: true,
            get: function() {
                return _delay;
            },
            set: function(value) {
                value = validateDelay(value);
                if (value !== undefined) {
                    _delay = value;
                }
            }
        },
        duration: {
            enumerable: true,
            get: function() {
                return _duration;
            },
            set: function(value) {
                value = validateDuration(value);
                if (value !== undefined) {
                    _duration = value;
                }
            }
        },
        easing: {
            enumerable: true,
            get: function() {
                return _easing;
            },
            set: function(value) {
                value = validateEasing(value, _duration);
                if (value !== undefined) {
                    _easing = value;
                }
            }
        },
        fpsLimit: {
            enumerable: true,
            get: function() {
                return _fpsLimit;
            },
            set: function(value) {
                value = validateFpsLimit(value);
                if (value !== undefined) {
                    _fpsLimit = value;
                    _minFrameTime = FUZZY_MS_PER_SECOND / value;
                }
            }
        },
        loop: {
            enumerable: true,
            get: function() {
                return _loop;
            },
            set: function(value) {
                value = validateLoop(value);
                if (value !== undefined) {
                    _loop = value;
                }
            }
        },
        minFrameTime: {
            enumerable: true,
            get: function() {
                return _minFrameTime;
            }
        },
        promise: {
            enumerable: true,
            get: function() {
                return _promise;
            },
            set: function(value) {
                value = validatePromise(value);
                if (value !== undefined) {
                    _promise = value;
                }
            }
        },
        promiseRejectEmpty: {
            enumerable: true,
            get: function() {
                return _promiseRejectEmpty;
            },
            set: function(value) {
                value = validatePromiseRejectEmpty(value);
                if (value !== undefined) {
                    _promiseRejectEmpty = value;
                }
            }
        },
        queue: {
            enumerable: true,
            get: function() {
                return _queue;
            },
            set: function(value) {
                value = validateQueue(value);
                if (value !== undefined) {
                    _queue = value;
                }
            }
        },
        repeat: {
            enumerable: true,
            get: function() {
                return _repeat;
            },
            set: function(value) {
                value = validateRepeat(value);
                if (value !== undefined) {
                    _repeat = value;
                }
            }
        },
        speed: {
            enumerable: true,
            get: function() {
                return _speed;
            },
            set: function(value) {
                value = validateSpeed(value);
                if (value !== undefined) {
                    _speed = value;
                }
            }
        },
        sync: {
            enumerable: true,
            get: function() {
                return _sync;
            },
            set: function(value) {
                value = validateSync(value);
                if (value !== undefined) {
                    _sync = value;
                }
            }
        }
    });
    VelocityStatic.defaults.reset();
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity-wide animation time remapping for testing purposes.
 */
var VelocityStatic;

(function(VelocityStatic) {
    /**
     * In mock mode, all animations are forced to complete immediately upon the
     * next rAF tick. If there are further animations queued then they will each
     * take one single frame in turn. Loops and repeats will be disabled while
     * <code>mock = true</code>.
     */
    VelocityStatic.mock = false;
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */
var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Used to patch any object to allow Velocity chaining. In order to chain an
     * object must either be treatable as an array - with a <code>.length</code>
     * property, and each member a Node, or a Node directly.
     *
     * By default Velocity will try to patch <code>window</code>,
     * <code>jQuery</code>, <code>Zepto</code>, and several classes that return
     * Nodes or lists of Nodes.
     *
     * @public
     */
    function patch(proto, global) {
        try {
            defineProperty(proto, (global ? "V" : "v") + "elocity", VelocityFn);
        } catch (e) {
            console.warn("VelocityJS: Error when trying to add prototype.", e);
        }
    }
    VelocityStatic.patch = patch;
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="data.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * AnimationCall queue
 */
var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Simple queue management. Un-named queue is directly within the element data,
     * named queue is within an object within it.
     */
    function animate(animation) {
        var prev = VelocityStatic.State.last;
        animation._prev = prev;
        animation._next = undefined;
        if (prev) {
            prev._next = animation;
        } else {
            VelocityStatic.State.first = animation;
        }
        VelocityStatic.State.last = animation;
        if (!VelocityStatic.State.firstNew) {
            VelocityStatic.State.firstNew = animation;
        }
        var element = animation.element, data = Data(element);
        if (!data.count++) {
            ////////////////////////
            // Feature: Classname //
            ////////////////////////
            addClass(element, VelocityStatic.State.className);
        }
    }
    /**
     * Add an item to an animation queue.
     */    function queue(element, animation, queue) {
        var data = Data(element);
        if (queue !== false) {
            // Store the last animation added so we can use it for the
            // beginning of the next one.
            data.lastAnimationList[queue] = animation;
        }
        if (queue === false) {
            animate(animation);
        } else {
            if (!isString(queue)) {
                queue = "";
            }
            var last = data.queueList[queue];
            if (!last) {
                if (last === null) {
                    data.queueList[queue] = animation;
                } else {
                    data.queueList[queue] = null;
                    animate(animation);
                }
            } else {
                while (last._next) {
                    last = last._next;
                }
                last._next = animation;
                animation._prev = last;
            }
        }
    }
    VelocityStatic.queue = queue;
    /**
     * Start the next animation on this element's queue (named or default).
     *
     * @returns the next animation that is starting.
     */    function dequeue(element, queue, skip) {
        if (queue !== false) {
            if (!isString(queue)) {
                queue = "";
            }
            var data = Data(element), animation = data.queueList[queue];
            if (animation) {
                data.queueList[queue] = animation._next || null;
                if (!skip) {
                    animate(animation);
                }
            } else if (animation === null) {
                delete data.queueList[queue];
            }
            return animation;
        }
    }
    VelocityStatic.dequeue = dequeue;
    /**
     * Remove an animation from the active animation list. If it has a queue set
     * then remember it as the last animation for that queue, and free the one
     * that was previously there. If the animation list is completely empty then
     * mark us as finished.
     */    function freeAnimationCall(animation) {
        var next = animation._next, prev = animation._prev, queue = animation.queue == null ? animation.options.queue : animation.queue;
        if (VelocityStatic.State.firstNew === animation) {
            VelocityStatic.State.firstNew = next;
        }
        if (VelocityStatic.State.first === animation) {
            VelocityStatic.State.first = next;
        } else if (prev) {
            prev._next = next;
        }
        if (VelocityStatic.State.last === animation) {
            VelocityStatic.State.last = prev;
        } else if (next) {
            next._prev = prev;
        }
        if (queue) {
            var data = Data(animation.element);
            if (data) {
                animation._next = animation._prev = undefined;
            }
        }
    }
    VelocityStatic.freeAnimationCall = freeAnimationCall;
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    /* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
    VelocityStatic.Redirects = {};
    /***********************
     Packaged Redirects
     ***********************/
    /* slideUp, slideDown */    [ "Down", "Up" ].forEach(function(direction) {
        VelocityStatic.Redirects["slide" + direction] = function(element, options, elementsIndex, elementsSize, elements, resolver) {
            var opts = __assign({}, options), begin = opts.begin, complete = opts.complete, inlineValues = {}, computedValues = {
                height: "",
                marginTop: "",
                marginBottom: "",
                paddingTop: "",
                paddingBottom: ""
            };
            if (opts.display === undefined) {
                var isInline = VelocityStatic.inlineRx.test(element.nodeName.toLowerCase());
                /* Show the element before slideDown begins and hide the element after slideUp completes. */
                /* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */                opts.display = direction === "Down" ? isInline ? "inline-block" : "block" : "none";
            }
            opts.begin = function() {
                /* If the user passed in a begin callback, fire it now. */
                if (elementsIndex === 0 && begin) {
                    begin.call(elements, elements);
                }
                /* Cache the elements' original vertical dimensional property values so that we can animate back to them. */                for (var property in computedValues) {
                    if (!computedValues.hasOwnProperty(property)) {
                        continue;
                    }
                    inlineValues[property] = element.style[property];
                    /* For slideDown, use forcefeeding to animate all vertical properties from 0. For slideUp,
                     use forcefeeding to start from computed values and animate down to 0. */                    var propertyValue = VelocityStatic.CSS.getPropertyValue(element, property);
                    computedValues[property] = direction === "Down" ? [ propertyValue, 0 ] : [ 0, propertyValue ];
                }
                /* Force vertical overflow content to clip so that sliding works as expected. */                inlineValues.overflow = element.style.overflow;
                element.style.overflow = "hidden";
            };
            opts.complete = function() {
                /* Reset element to its pre-slide inline values once its slide animation is complete. */
                for (var property in inlineValues) {
                    if (inlineValues.hasOwnProperty(property)) {
                        element.style[property] = inlineValues[property];
                    }
                }
                /* If the user passed in a complete callback, fire it now. */                if (elementsIndex === elementsSize - 1) {
                    if (complete) {
                        complete.call(elements, elements);
                    }
                    if (resolver) {
                        resolver(elements);
                    }
                }
            };
            VelocityFn(element, computedValues, opts);
        };
    });
    /* fadeIn, fadeOut */    [ "In", "Out" ].forEach(function(direction) {
        VelocityStatic.Redirects["fade" + direction] = function(element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = __assign({}, options), complete = opts.complete, propertiesMap = {
                opacity: direction === "In" ? 1 : 0
            };
            /* Since redirects are triggered individually for each element in the animated set, avoid repeatedly triggering
             callbacks by firing them only when the final element has been reached. */            if (elementsIndex !== 0) {
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
            /* Note: We allow users to pass in "null" to skip display setting altogether. */            if (opts.display === undefined) {
                opts.display = direction === "In" ? "auto" : "none";
            }
            VelocityFn(this, propertiesMap, opts);
        };
    });
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Effect Registration
 */
var VelocityStatic;

(function(VelocityStatic) {
    /* Animate the expansion/contraction of the elements' parent's height for In/Out effects. */
    function animateParentHeight(elements, direction, totalDuration, stagger) {
        var totalHeightDelta = 0, parentNode;
        /* Sum the total height (including padding and margin) of all targeted elements. */        
        /* Sum the total height (including padding and margin) of all targeted elements. */
        (elements.nodeType ? [ elements ] : elements).forEach(function(element, i) {
            if (stagger) {
                /* Increase the totalDuration by the successive delay amounts produced by the stagger option. */
                totalDuration += i * stagger;
            }
            parentNode = element.parentNode;
            var propertiesToSum = [ "height", "paddingTop", "paddingBottom", "marginTop", "marginBottom" ];
            /* If box-sizing is border-box, the height already includes padding and margin */            if (VelocityStatic.CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === "border-box") {
                propertiesToSum = [ "height" ];
            }
            propertiesToSum.forEach(function(property) {
                totalHeightDelta += parseFloat(VelocityStatic.CSS.getPropertyValue(element, property));
            });
        });
        /* Animate the parent element's height adjustment (with a varying duration multiplier for aesthetic benefits). */
        // TODO: Get this typesafe again
                VelocityFn(parentNode, {
            height: (direction === "In" ? "+" : "-") + "=" + totalHeightDelta
        }, {
            queue: false,
            easing: "ease-in-out",
            duration: totalDuration * (direction === "In" ? .6 : 1)
        });
    }
    /* Note: RegisterUI is a legacy name. */    function RegisterEffect(effectName, properties) {
        /* Register a custom redirect for each effect. */
        VelocityStatic.Redirects[effectName] = function(element, redirectOptions, elementsIndex, elementsSize, elements, resolver, loop) {
            var finalElement = elementsIndex === elementsSize - 1, totalDuration = 0;
            loop = loop || properties.loop;
            if (typeof properties.defaultDuration === "function") {
                properties.defaultDuration = properties.defaultDuration.call(elements, elements);
            } else {
                properties.defaultDuration = parseFloat(properties.defaultDuration);
            }
            /* Get the total duration used, so we can share it out with everything that doesn't have a duration */            for (var callIndex = 0; callIndex < properties.calls.length; callIndex++) {
                var durationPercentage = properties.calls[callIndex][1];
                if (typeof durationPercentage === "number") {
                    totalDuration += durationPercentage;
                }
            }
            var shareDuration = totalDuration >= 1 ? 0 : properties.calls.length ? (1 - totalDuration) / properties.calls.length : 1;
            var _loop_1 = function(callIndex) {
                var call = properties.calls[callIndex], propertyMap = call[0], redirectDuration = 1e3, durationPercentage = call[1], callOptions = call[2] || {}, opts = {};
                if (redirectOptions.duration !== undefined) {
                    redirectDuration = redirectOptions.duration;
                } else if (properties.defaultDuration !== undefined) {
                    redirectDuration = properties.defaultDuration;
                }
                /* Assign the whitelisted per-call options. */                opts.duration = redirectDuration * (typeof durationPercentage === "number" ? durationPercentage : shareDuration);
                opts.queue = redirectOptions.queue || "";
                opts.easing = callOptions.easing || "ease";
                opts.delay = parseFloat(callOptions.delay) || 0;
                opts.loop = !properties.loop && callOptions.loop;
                opts.cache = callOptions.cache || true;
                /* Special processing for the first effect call. */                if (callIndex === 0) {
                    /* If a delay was passed into the redirect, combine it with the first call's delay. */
                    opts.delay += parseFloat(redirectOptions.delay) || 0;
                    if (elementsIndex === 0) {
                        opts.begin = function() {
                            /* Only trigger a begin callback on the first effect call with the first element in the set. */
                            if (redirectOptions.begin) {
                                redirectOptions.begin.call(elements, elements);
                            }
                            var direction = effectName.match(/(In|Out)$/);
                            /* Make "in" transitioning elements invisible immediately so that there's no FOUC between now
                             and the first RAF tick. */                            if (direction && direction[0] === "In" && propertyMap.opacity !== undefined) {
                                (elements.nodeType ? [ elements ] : elements).forEach(function(element) {
                                    VelocityStatic.CSS.setPropertyValue(element, "opacity", 0);
                                });
                            }
                            /* Only trigger animateParentHeight() if we're using an In/Out transition. */                            if (redirectOptions.animateParentHeight && direction) {
                                animateParentHeight(elements, direction[0], redirectDuration + opts.delay, redirectOptions.stagger);
                            }
                        };
                    }
                    /* If the user isn't overriding the display option, default to "auto" for "In"-suffixed transitions. */
                    //					if (redirectOptions.display !== null) {
                    //						if (redirectOptions.display !== undefined && redirectOptions.display !== "none") {
                    //							opts.display = redirectOptions.display;
                    //						} else if (/In$/.test(effectName)) {
                    //							/* Inline elements cannot be subjected to transforms, so we switch them to inline-block. */
                    //							let defaultDisplay = CSS.Values.getDisplayType(element);
                    //							opts.display = (defaultDisplay === "inline") ? "inline-block" : defaultDisplay;
                    //						}
                    //					}
                                        if (redirectOptions.visibility && redirectOptions.visibility !== "hidden") {
                        opts.visibility = redirectOptions.visibility;
                    }
                }
                /* Special processing for the last effect call. */                if (callIndex === properties.calls.length - 1) {
                    /* Append promise resolving onto the user's redirect callback. */
                    var injectFinalCallbacks_1 = function() {
                        if ((redirectOptions.display === undefined || redirectOptions.display === "none") && /Out$/.test(effectName)) {
                            (elements.nodeType ? [ elements ] : elements).forEach(function(element) {
                                VelocityStatic.CSS.setPropertyValue(element, "display", "none");
                            });
                        }
                        if (redirectOptions.complete) {
                            redirectOptions.complete.call(elements, elements);
                        }
                        if (resolver) {
                            resolver(elements || element);
                        }
                    };
                    opts.complete = function() {
                        if (loop) {
                            VelocityStatic.Redirects[effectName](element, redirectOptions, elementsIndex, elementsSize, elements, resolver, loop === true ? true : Math.max(0, loop - 1));
                        }
                        if (properties.reset) {
                            for (var resetProperty in properties.reset) {
                                if (!properties.reset.hasOwnProperty(resetProperty)) {
                                    continue;
                                }
                                var resetValue = properties.reset[resetProperty];
                                /* Format each non-array value in the reset property map to [ value, value ] so that changes apply
                                 immediately and DOM querying is avoided (via forcefeeding). */
                                /* Note: Don't forcefeed hooks, otherwise their hook roots will be defaulted to their null values. */
                                // TODO: Fix this
                                //								if (CSS.Hooks.registered[resetProperty] === undefined && (typeof resetValue === "string" || typeof resetValue === "number")) {
                                //									properties.reset[resetProperty] = [properties.reset[resetProperty], properties.reset[resetProperty]];
                                //								}
                                                        }
                            /* So that the reset values are applied instantly upon the next rAF tick, use a zero duration and parallel queueing. */                            var resetOptions = {
                                duration: 0,
                                queue: false
                            };
                            /* Since the reset option uses up the complete callback, we trigger the user's complete callback at the end of ours. */                            if (finalElement) {
                                resetOptions.complete = injectFinalCallbacks_1;
                            }
                            VelocityFn(element, properties.reset, resetOptions);
                            /* Only trigger the user's complete callback on the last effect call with the last element in the set. */                        } else if (finalElement) {
                            injectFinalCallbacks_1();
                        }
                    };
                    if (redirectOptions.visibility === "hidden") {
                        opts.visibility = redirectOptions.visibility;
                    }
                }
                VelocityFn(element, propertyMap, opts);
            };
            /* Iterate through each effect's call array. */            for (var callIndex = 0; callIndex < properties.calls.length; callIndex++) {
                _loop_1(callIndex);
            }
        };
        /* Return the Velocity object so that RegisterUI calls can be chained. */        return VelocityFn;
    }
    VelocityStatic.RegisterEffect = RegisterEffect;
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Tweens
 */
var VelocityStatic;

(function(VelocityStatic) {
    var rxHex = /^#([A-f\d]{3}){1,2}$/i;
    var commands = new Map();
    commands.set("function", function(value, element, elements, elementArrayIndex, propertyName, tween) {
        return value.call(element, elementArrayIndex, elements.length);
    });
    commands.set("number", function(value, element, elements, elementArrayIndex, propertyName, tween) {
        return value + VelocityStatic.getNormalizationUnit(tween.fn);
    });
    commands.set("string", function(value, element, elements, elementArrayIndex, propertyName, tween) {
        return VelocityStatic.CSS.fixColors(value);
    });
    commands.set("undefined", function(value, element, elements, elementArrayIndex, propertyName, tween) {
        return VelocityStatic.CSS.fixColors(VelocityStatic.CSS.getPropertyValue(element, propertyName, tween.fn) || "");
    });
    /**
     * Expand a VelocityProperty argument into a valid sparse Tween array. This
     * pre-allocates the array as it is then the correct size and slightly
     * faster to access.
     */    function expandProperties(animation, properties) {
        var tweens = animation.tweens = createEmptyObject(), elements = animation.elements, element = animation.element, elementArrayIndex = elements.indexOf(element), data = Data(element), queue = getValue(animation.queue, animation.options.queue), duration = getValue(animation.options.duration, VelocityStatic.defaults.duration);
        for (var property in properties) {
            var propertyName = VelocityStatic.CSS.camelCase(property);
            var valueData = properties[property], fn = VelocityStatic.getNormalization(element, propertyName);
            if (!fn && propertyName !== "tween") {
                if (VelocityStatic.debug) {
                    console.log("Skipping [" + property + "] due to a lack of browser support.");
                }
                continue;
            }
            if (valueData == null) {
                if (VelocityStatic.debug) {
                    console.log("Skipping [" + property + "] due to no value supplied.");
                }
                continue;
            }
            var tween_3 = tweens[propertyName] = createEmptyObject();
            var endValue = void 0, startValue = void 0;
            tween_3.fn = fn;
            if (isFunction(valueData)) {
                // If we have a function as the main argument then resolve
                // it first, in case it returns an array that needs to be
                // split.
                valueData = valueData.call(element, elementArrayIndex, elements.length, elements);
            }
            if (Array.isArray(valueData)) {
                // valueData is an array in the form of
                // [ endValue, [, easing] [, startValue] ]
                var arr1 = valueData[1], arr2 = valueData[2];
                endValue = valueData[0];
                if (isString(arr1) && (/^[\d-]/.test(arr1) || rxHex.test(arr1)) || isFunction(arr1) || isNumber(arr1)) {
                    startValue = arr1;
                } else if (isString(arr1) && VelocityStatic.Easing.Easings[arr1] || Array.isArray(arr1)) {
                    tween_3.easing = validateEasing(arr1, duration);
                    startValue = arr2;
                } else {
                    startValue = arr1 || arr2;
                }
            } else {
                endValue = valueData;
            }
            tween_3.end = commands.get(typeof endValue)(endValue, element, elements, elementArrayIndex, propertyName, tween_3);
            if (startValue != null || (queue === false || data.queueList[queue] === undefined)) {
                tween_3.start = commands.get(typeof startValue)(startValue, element, elements, elementArrayIndex, propertyName, tween_3);
                explodeTween(propertyName, tween_3, duration);
            }
        }
    }
    VelocityStatic.expandProperties = expandProperties;
    // TODO: Needs a better match for "translate3d" etc - a number must be preceded by some form of break...
        var rxToken = /((?:[+\-*/]=)?(?:[+-]?\d*\.\d+|[+-]?\d+)[a-z%]*|(?:.(?!$|[+-]?\d|[+\-*/]=[+-]?\d))+.|.)/g, rxNumber = /^([+\-*/]=)?([+-]?\d*\.\d+|[+-]?\d+)(.*)$/;
    /**
     * Find a pattern between multiple strings, return a VelocitySequence with
     * the pattern and the tokenised values.
     *
     * If number then animate.
     * If a string then must match.
     * If units then convert between them by wrapping in a calc().
     * - If already in a calc then nest another layer.
     * If in an rgba() then the first three numbers are rounded.
     */    function findPattern(parts, propertyName) {
        var partsLength = parts.length, tokens = [], indexes = [];
        var numbers;
        // First tokenise the strings - these have all values, we will pull
        // numbers later.
                for (var part = 0; part < partsLength; part++) {
            if (isString(parts[part])) {
                tokens[part] = _objectAssign([], parts[part].match(rxToken));
                indexes[part] = 0;
                // If it matches more than one thing then we've got a number.
                                numbers = numbers || tokens[part].length > 1;
                //console.log("tokens:", parts[part], tokens[part])
                        } else {
                // We have an incomplete lineup, it will get tried again later...
                return;
            }
        }
        var sequence = [], pattern = sequence.pattern = [], addString = function(text) {
            if (isString(pattern[pattern.length - 1])) {
                pattern[pattern.length - 1] += text;
            } else if (text) {
                pattern.push(text);
                for (var part = 0; part < partsLength; part++) {
                    sequence[part].push(null);
                }
            }
        }, returnStringType = function() {
            if (numbers || pattern.length > 1) {
                //console.error("Velocity: Trying to pattern match mis-matched strings " + propertyName + ":", parts);
                return;
            }
            var isDisplay = propertyName === "display", isVisibility = propertyName === "visibility";
            for (var part = 0; part < partsLength; part++) {
                var value = parts[part];
                sequence[part][0] = value;
                // Don't care about duration...
                                sequence[part].easing = validateEasing(isDisplay && value === "none" || isVisibility && value === "hidden" || !isDisplay && !isVisibility ? "at-end" : "at-start", 400);
            }
            pattern[0] = false;
            return sequence;
        };
        var more = true;
        for (var part = 0; part < partsLength; part++) {
            sequence[part] = [];
        }
        while (more) {
            var bits = [], units = [];
            var text = void 0, unitless = false, numbers_1 = false;
            for (var part = 0; part < partsLength; part++) {
                var index = indexes[part]++, token = tokens[part][index];
                if (token) {
                    var num = token.match(rxNumber);
 // [ignore, change, number, unit]
                                        if (num) {
                        // It's a number, possibly with a += change and unit.
                        if (text) {
                            return returnStringType();
                        }
                        var digits = parseFloat(num[2]), unit = num[3], change = num[1] ? num[1][0] + unit : undefined, changeOrUnit = change || unit;
                        if (!_inArray(units, changeOrUnit)) {
                            // Will be an empty string at the least.
                            units.push(changeOrUnit);
                        }
                        if (!unit) {
                            if (digits) {
                                numbers_1 = true;
                            } else {
                                unitless = true;
                            }
                        }
                        bits[part] = change ? [ digits, changeOrUnit, true ] : [ digits, changeOrUnit ];
                    } else if (bits.length) {
                        return returnStringType();
                    } else {
                        // It's a string.
                        if (!text) {
                            text = token;
                        } else if (text !== token) {
                            return returnStringType();
                        }
                    }
                } else if (!part) {
                    for (;part < partsLength; part++) {
                        var index_1 = indexes[part]++, token_1 = tokens[part][index_1];
                        if (token_1) {
                            return returnStringType();
                        }
                    }
                    // IMPORTANT: This is the exit point.
                                        more = false;
                    break;
                } else {
                    // Different
                    return;
                }
            }
            if (text) {
                addString(text);
            } else if (units.length) {
                if (units.length === 2 && unitless && !numbers_1) {
                    // If we only have two units, and one is empty, and it's only empty on "0", then treat us as having one unit
                    units.splice(units[0] ? 1 : 0, 1);
                }
                if (units.length === 1) {
                    // All the same units, so append number then unit.
                    var unit = units[0], firstLetter = unit[0];
                    if (firstLetter === "+" || firstLetter === "-" || firstLetter === "*" || firstLetter === "/") {
                        if (propertyName) {
                            console.error("Velocity: The first property must not contain a relative function " + propertyName + ":", parts);
                        }
                        return;
                    }
                    pattern.push(false);
                    for (var part = 0; part < partsLength; part++) {
                        sequence[part].push(bits[part][0]);
                    }
                    addString(unit);
                } else {
                    // Multiple units, so must be inside a calc.
                    addString("calc(");
                    var patternCalc = pattern.length - 1;
 // Store the beginning of our calc.
                                        for (var i = 0; i < units.length; i++) {
                        var unit = units[i];
                        var firstLetter = unit[0], isComplex = firstLetter === "*" || firstLetter === "/", isMaths = isComplex || firstLetter === "+" || firstLetter === "-";
                        if (isComplex) {
                            // TODO: Not sure this should be done automatically!
                            pattern[patternCalc] += "(";
                            addString(")");
                        }
                        if (i) {
                            addString(" " + (isMaths ? firstLetter : "+") + " ");
                        }
                        pattern.push(false);
                        for (var part = 0; part < partsLength; part++) {
                            var bit = bits[part], value = bit[1] === unit ? bit[0] : bit.length === 3 ? sequence[part - 1][sequence[part - 1].length - 1] : isComplex ? 1 : 0;
                            sequence[part].push(value);
                        }
                        addString(isMaths ? unit.substring(1) : unit);
                    }
                    addString(")");
                }
            }
        }
        // We've got here, so a valid sequence - now check and fix RGB rounding
        // and calc() nesting...
        // TODO: Nested calc(a + calc(b + c)) -> calc(a + (b + c))
                for (var i = 0, inRGB = 0; i < pattern.length; i++) {
            var text = pattern[i];
            if (isString(text)) {
                if (inRGB && text.indexOf(",") >= 0) {
                    inRGB++;
                } else if (text.indexOf("rgb") >= 0) {
                    inRGB = 1;
                }
            } else if (inRGB) {
                if (inRGB < 4) {
                    pattern[i] = true;
                } else {
                    inRGB = 0;
                }
            }
        }
        return sequence;
    }
    VelocityStatic.findPattern = findPattern;
    /**
     * Convert a string-based tween with start and end strings, into a pattern
     * based tween with arrays.
     */    function explodeTween(propertyName, tween, duration, starting) {
        var startValue = tween.start, endValue = tween.end;
        if (!isString(endValue) || !isString(startValue)) {
            return;
        }
        var sequence = findPattern([ startValue, endValue ], propertyName);
        if (!sequence && starting) {
            // This little piece will take a startValue, split out the
            // various numbers in it, then copy the endValue into the
            // startValue while replacing the numbers in it to match the
            // original start numbers as a repeating sequence.
            // Finally this function will run again with the new
            // startValue and a now matching pattern.
            var startNumbers_1 = startValue.match(/\d\.?\d*/g) || [ "0" ], count_1 = startNumbers_1.length, index_2 = 0;
            sequence = findPattern([ endValue.replace(/\d+\.?\d*/g, function() {
                return startNumbers_1[index_2++ % count_1];
            }), endValue ], propertyName);
        }
        if (sequence) {
            if (VelocityStatic.debug) {
                console.log("Velocity: Sequence found:", sequence);
            }
            sequence[0].percent = 0;
            sequence[1].percent = 1;
            tween.sequence = sequence;
            switch (tween.easing) {
              case VelocityStatic.Easing.Easings["at-start"]:
              case VelocityStatic.Easing.Easings["during"]:
              case VelocityStatic.Easing.Easings["at-end"]:
                sequence[0].easing = sequence[1].easing = tween.easing;
            }
        }
    }
    /**
     * Expand all queued animations that haven't gone yet
     *
     * This will automatically expand the properties map for any recently added
     * animations so that the start and end values are correct.
     */    function validateTweens(activeCall) {
        // This might be called on an already-ready animation
        if (VelocityStatic.State.firstNew === activeCall) {
            VelocityStatic.State.firstNew = activeCall._next;
        }
        // Check if we're actually already ready
                if (activeCall._flags & 1 /* EXPANDED */) {
            return;
        }
        var element = activeCall.element, tweens = activeCall.tweens, duration = getValue(activeCall.options.duration, VelocityStatic.defaults.duration);
        for (var propertyName in tweens) {
            var tween_4 = tweens[propertyName];
            if (tween_4.start == null) {
                // Get the start value as it's not been passed in
                var startValue = VelocityStatic.CSS.getPropertyValue(activeCall.element, propertyName);
                if (isString(startValue)) {
                    tween_4.start = VelocityStatic.CSS.fixColors(startValue);
                    explodeTween(propertyName, tween_4, duration, true);
                } else if (!Array.isArray(startValue)) {
                    console.warn("bad type", tween_4, propertyName, startValue);
                }
            }
            if (VelocityStatic.debug) {
                console.log("tweensContainer (" + propertyName + "): " + JSON.stringify(tween_4), element);
            }
        }
        activeCall._flags |= 1 /* EXPANDED */;
    }
    VelocityStatic.validateTweens = validateTweens;
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="./tweens.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */ var VelocityStatic;

(function(VelocityStatic) {
    VelocityStatic.Sequences = createEmptyObject();
    var rxPercents = /(\d*\.\d+|\d+\.?|from|to)/g;
    function expandSequence(animation, sequence) {
        var tweens = animation.tweens = createEmptyObject(), element = animation.element;
        for (var propertyName in sequence.tweens) {
            var fn = VelocityStatic.getNormalization(element, propertyName);
            if (!fn && propertyName !== "tween") {
                if (VelocityStatic.debug) {
                    console.log("Skipping [" + propertyName + "] due to a lack of browser support.");
                }
                continue;
            }
            tweens[propertyName] = {
                fn: fn,
                sequence: sequence.tweens[propertyName]
            };
        }
    }
    VelocityStatic.expandSequence = expandSequence;
    /**
     * Used to register a sequence. This should never be called by users
     * directly, instead it should be called via an action:<br/>
     * <code>Velocity("registerSequence", "name", VelocitySequence);</code>
     *
     * @private
     */    function registerSequence(args) {
        if (isPlainObject(args[0])) {
            for (var name_3 in args[0]) {
                registerSequence([ name_3, args[0][name_3] ]);
            }
        } else if (isString(args[0])) {
            var name_4 = args[0], sequence = args[1];
            if (!isString(name_4)) {
                console.warn("VelocityJS: Trying to set 'registerSequence' name to an invalid value:", name_4);
            } else if (!isPlainObject(sequence)) {
                console.warn("VelocityJS: Trying to set 'registerSequence' sequence to an invalid value:", name_4, sequence);
            } else {
                if (VelocityStatic.Sequences[name_4]) {
                    console.warn("VelocityJS: Replacing named sequence:", name_4);
                }
                var percents_1 = {}, steps_1 = new Array(100), properties = [], percentages = [], sequenceList = VelocityStatic.Sequences[name_4] = createEmptyObject(), duration = validateDuration(sequence.duration);
                sequenceList.tweens = createEmptyObject();
                if (isNumber(duration)) {
                    sequenceList.duration = duration;
                }
                for (var part in sequence) {
                    var keys = String(part).match(rxPercents);
                    if (keys) {
                        percentages.push(part);
                        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                            var key = keys_1[_i];
                            var percent = key === "from" ? 0 : key === "to" ? 100 : parseFloat(key);
                            if (percent < 0 || percent > 100) {
                                console.warn("VelocityJS: Trying to use an invalid value as a percentage (0 <= n <= 100):", name_4, percent);
                            } else if (isNaN(percent)) {
                                console.warn("VelocityJS: Trying to use an invalid number as a percentage:", name_4, part, key);
                            } else {
                                if (!percents_1[String(percent)]) {
                                    percents_1[String(percent)] = [];
                                }
                                percents_1[String(percent)].push(part);
                                for (var property in sequence[part]) {
                                    if (!_inArray(properties, property)) {
                                        properties.push(property);
                                    }
                                }
                            }
                        }
                    }
                }
                var orderedPercents = Object.keys(percents_1).sort(function(a, b) {
                    var a1 = parseFloat(a), b1 = parseFloat(b);
                    return a1 > b1 ? 1 : a1 < b1 ? -1 : 0;
                });
                orderedPercents.forEach(function(key) {
                    steps_1.push.apply(percents_1[key]);
                });
                for (var _a = 0, properties_1 = properties; _a < properties_1.length; _a++) {
                    var property = properties_1[_a];
                    var parts = [], propertyName = VelocityStatic.CSS.camelCase(property);
                    for (var _b = 0, orderedPercents_1 = orderedPercents; _b < orderedPercents_1.length; _b++) {
                        var key = orderedPercents_1[_b];
                        for (var _c = 0, _d = percents_1[key]; _c < _d.length; _c++) {
                            var value = _d[_c];
                            var properties_2 = sequence[value];
                            if (properties_2[propertyName]) {
                                parts.push(isString(properties_2[propertyName]) ? properties_2[propertyName] : properties_2[propertyName][0]);
                            }
                        }
                    }
                    if (parts.length) {
                        var realSequence = VelocityStatic.findPattern(parts, propertyName);
                        var index = 0;
                        if (realSequence) {
                            for (var _e = 0, orderedPercents_2 = orderedPercents; _e < orderedPercents_2.length; _e++) {
                                var key = orderedPercents_2[_e];
                                for (var _f = 0, _g = percents_1[key]; _f < _g.length; _f++) {
                                    var value = _g[_f];
                                    var originalProperty = sequence[value][propertyName];
                                    if (originalProperty) {
                                        if (Array.isArray(originalProperty) && originalProperty.length > 1 && (isString(originalProperty[1]) || Array.isArray(originalProperty[1]))) {
                                            realSequence[index].easing = validateEasing(originalProperty[1], sequenceList.duration || DEFAULT_DURATION);
                                        }
                                        realSequence[index++].percent = parseFloat(key) / 100;
                                    }
                                }
                            }
                            sequenceList.tweens[propertyName] = realSequence;
                        }
                    }
                }
                //console.log("sequence", name, sequenceList)
                        }
        }
    }
    VelocityStatic.registerSequence = registerSequence;
    VelocityStatic.registerAction([ "registerSequence", registerSequence ], true);
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="state.ts" />
///<reference path="easing/easings.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Tick
 */
var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Call the begin method of an animation in a separate function so it can
     * benefit from JIT compiling while still having a try/catch block.
     */
    function callBegin(activeCall) {
        try {
            var elements = activeCall.elements;
            activeCall.options.begin.call(elements, elements, activeCall);
        } catch (error) {
            setTimeout(function() {
                throw error;
            }, 1);
        }
    }
    VelocityStatic.callBegin = callBegin;
    /**
     * Call the progress method of an animation in a separate function so it can
     * benefit from JIT compiling while still having a try/catch block.
     */    function callProgress(activeCall, timeCurrent) {
        try {
            var elements = activeCall.elements, percentComplete = activeCall.percentComplete, options = activeCall.options, tweenValue = activeCall.tween;
            activeCall.options.progress.call(elements, elements, percentComplete, Math.max(0, activeCall.timeStart + (activeCall.duration != null ? activeCall.duration : options.duration != null ? options.duration : VelocityStatic.defaults.duration) - timeCurrent), tweenValue !== undefined ? tweenValue : String(percentComplete * 100), activeCall);
        } catch (error) {
            setTimeout(function() {
                throw error;
            }, 1);
        }
    }
    function asyncCallbacks() {
        var activeCall, nextCall;
        // Callbacks and complete that might read the DOM again.
        // Progress callback
                for (activeCall = firstProgress; activeCall; activeCall = nextCall) {
            nextCall = activeCall._nextProgress;
            // Pass to an external fn with a try/catch block for optimisation
                        callProgress(activeCall, VelocityStatic.lastTick);
        }
        // Complete animations, including complete callback or looping
                for (activeCall = firstComplete; activeCall; activeCall = nextCall) {
            nextCall = activeCall._nextComplete;
            /* If this call has finished tweening, pass it to complete() to handle call cleanup. */            VelocityStatic.completeCall(activeCall);
        }
    }
    /**************
     Timing
     **************/    var FRAME_TIME = 1e3 / 60, 
    /**
    * Shim for window.performance in case it doesn't exist
    */
    performance = function() {
        var perf = window.performance || {};
        if (typeof perf.now !== "function") {
            var nowOffset_1 = perf.timing && perf.timing.navigationStart ? perf.timing.navigationStart : _now();
            perf.now = function() {
                return _now() - nowOffset_1;
            };
        }
        return perf;
    }(), 
    /**
     * Proxy function for when rAF is not available.
     *
     * This should hopefully never be used as the browsers often throttle
     * this to less than one frame per second in the background, making it
     * completely unusable.
     */
    rAFProxy = function(callback) {
        return setTimeout(callback, Math.max(0, FRAME_TIME - (performance.now() - VelocityStatic.lastTick)));
    }, 
    /**
     * Either requestAnimationFrame, or a shim for it.
     */
    rAFShim = window.requestAnimationFrame || rAFProxy;
    /**
     * Set if we are currently inside a tick() to prevent double-calling.
     */    var ticking, 
    /**
     * A background WebWorker that sends us framerate messages when we're in
     * the background. Without this we cannot maintain frame accuracy.
     */
    worker, 
    /**
     * The first animation with a Progress callback.
     */
    firstProgress, 
    /**
     * The first animation with a Complete callback.
     */
    firstComplete;
    /**
     * The time that the last animation frame ran at. Set from tick(), and used
     * for missing rAF (ie, when not in focus etc).
     */    VelocityStatic.lastTick = 0;
    /**
     * WebWorker background function.
     *
     * When we're in the background this will send us a msg every tick, when in
     * the foreground it won't.
     *
     * When running in the background the browser reduces allowed CPU etc, so
     * we raun at 30fps instead of 60fps.
     */    function workerFn() {
        var _this = this;
        var interval;
        this.onmessage = function(e) {
            if (e.data === true) {
                if (!interval) {
                    interval = setInterval(function() {
                        _this.postMessage(true);
                    }, 1e3 / 30);
                }
            } else if (e.data === false) {
                if (interval) {
                    clearInterval(interval);
                    interval = 0;
                }
            } else {
                _this.postMessage(e.data);
            }
        };
    }
    try {
        // Create the worker - this might not be supported, hence the try/catch.
        worker = new Worker(URL.createObjectURL(new Blob([ "(" + workerFn + ")()" ])));
        // Whenever the worker sends a message we tick()
                worker.onmessage = function(e) {
            if (e.data === true) {
                tick();
            } else {
                asyncCallbacks();
            }
        };
        // And watch for going to the background to start the WebWorker running.
                if (!VelocityStatic.State.isMobile && document.hidden !== undefined) {
            document.addEventListener("visibilitychange", function() {
                worker.postMessage(VelocityStatic.State.isTicking && document.hidden);
            });
        }
    } catch (e) {
        /*
         * WebWorkers are not supported in this format. This can happen in IE10
         * where it can't create one from a blob this way. We fallback, but make
         * no guarantees towards accuracy in this case.
         */}
    /**
     * Called on every tick, preferably through rAF. This is reponsible for
     * initialising any new animations, then starting any that need starting.
     * Finally it will expand any tweens and set the properties relating to
     * them. If there are any callbacks relating to the animations then they
     * will attempt to call at the end (with the exception of "begin").
     */    function tick(timestamp) {
        if (ticking) {
            // Should never happen - but if we've swapped back from hidden to
            // visibile then we want to make sure
            return;
        }
        ticking = true;
        /* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
         We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
         the browser's next tick sync time occurs, which results in the first elements subjected to Velocity
         calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
         the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
         by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */        if (timestamp !== false) {
            var timeCurrent = performance.now(), deltaTime = VelocityStatic.lastTick ? timeCurrent - VelocityStatic.lastTick : FRAME_TIME, defaultSpeed = VelocityStatic.defaults.speed, defaultEasing = VelocityStatic.defaults.easing, defaultDuration = VelocityStatic.defaults.duration;
            var activeCall = void 0, nextCall = void 0, lastProgress = void 0, lastComplete = void 0;
            firstProgress = null;
            firstComplete = null;
            if (deltaTime >= VelocityStatic.defaults.minFrameTime || !VelocityStatic.lastTick) {
                VelocityStatic.lastTick = timeCurrent;
                /********************
                 Call Iteration
                 ********************/
                // Expand any tweens that might need it.
                                while (activeCall = VelocityStatic.State.firstNew) {
                    VelocityStatic.validateTweens(activeCall);
                }
                // Iterate through each active call.
                                for (activeCall = VelocityStatic.State.first; activeCall && activeCall !== VelocityStatic.State.firstNew; activeCall = activeCall._next) {
                    var element = activeCall.element;
                    var data = void 0;
                    // Check to see if this element has been deleted midway
                    // through the animation. If it's gone then end this
                    // animation.
                                        if (!element.parentNode || !(data = Data(element))) {
                        // TODO: Remove safely - decrease count, delete data, remove from arrays
                        VelocityStatic.freeAnimationCall(activeCall);
                        continue;
                    }
                    // Don't bother getting until we can use these.
                                        var options = activeCall.options, flags = activeCall._flags;
                    var timeStart = activeCall.timeStart;
                    // If this is the first time that this call has been
                    // processed by tick() then we assign timeStart now so that
                    // it's value is as close to the real animation start time
                    // as possible.
                                        if (!timeStart) {
                        var queue_1 = activeCall.queue != null ? activeCall.queue : options.queue;
                        timeStart = timeCurrent - deltaTime;
                        if (queue_1 !== false) {
                            timeStart = Math.max(timeStart, data.lastFinishList[queue_1] || 0);
                        }
                        activeCall.timeStart = timeStart;
                    }
                    // If this animation is paused then skip processing unless
                    // it has been set to resume.
                                        if (flags & 16 /* PAUSED */) {
                        // Update the time start to accomodate the paused
                        // completion amount.
                        activeCall.timeStart += deltaTime;
                        continue;
                    }
                    // Check if this animation is ready - if it's synced then it
                    // needs to wait for all other animations in the sync
                                        if (!(flags & 2 /* READY */)) {
                        activeCall._flags |= 2 /* READY */;
                        options._ready++;
                    }
                }
                // Need to split the loop, as ready sync animations must all get
                // the same start time.
                                for (activeCall = VelocityStatic.State.first; activeCall && activeCall !== VelocityStatic.State.firstNew; activeCall = nextCall) {
                    var flags = activeCall._flags;
                    nextCall = activeCall._next;
                    if (!(flags & 2 /* READY */) || flags & 16 /* PAUSED */) {
                        continue;
                    }
                    var options = activeCall.options;
                    if (flags & 32 /* SYNC */ && options._ready < options._total) {
                        activeCall.timeStart += deltaTime;
                        continue;
                    }
                    var speed = activeCall.speed != null ? activeCall.speed : options.speed != null ? options.speed : defaultSpeed;
                    var timeStart = activeCall.timeStart;
                    // Don't bother getting until we can use these.
                                        if (!(flags & 4 /* STARTED */)) {
                        var delay = activeCall.delay != null ? activeCall.delay : options.delay;
                        // Make sure anything we've delayed doesn't start
                        // animating yet, there might still be an active delay
                        // after something has been un-paused
                                                if (delay) {
                            if (timeStart + delay / speed > timeCurrent) {
                                continue;
                            }
                            activeCall.timeStart = timeStart += delay / (delay > 0 ? speed : 1);
                        }
                        activeCall._flags |= 4 /* STARTED */;
                        // The begin callback is fired once per call, not once
                        // per element, and is passed the full raw DOM element
                        // set as both its context and its first argument.
                                                if (options._started++ === 0) {
                            options._first = activeCall;
                            if (options.begin) {
                                // Pass to an external fn with a try/catch block for optimisation
                                callBegin(activeCall);
                                // Only called once, even if reversed or repeated
                                                                options.begin = undefined;
                            }
                        }
                    }
                    if (speed !== 1) {
                        // On the first frame we may have a shorter delta
                        var delta = Math.min(deltaTime, timeCurrent - timeStart);
                        activeCall.timeStart = timeStart += delta * (1 - speed);
                    }
                    if (options._first === activeCall && options.progress) {
                        activeCall._nextProgress = undefined;
                        if (lastProgress) {
                            lastProgress._nextProgress = lastProgress = activeCall;
                        } else {
                            firstProgress = lastProgress = activeCall;
                        }
                    }
                    var activeEasing = activeCall.easing != null ? activeCall.easing : options.easing != null ? options.easing : defaultEasing, millisecondsEllapsed = activeCall.ellapsedTime = timeCurrent - timeStart, duration = activeCall.duration != null ? activeCall.duration : options.duration != null ? options.duration : defaultDuration, percentComplete = activeCall.percentComplete = VelocityStatic.mock ? 1 : Math.min(millisecondsEllapsed / duration, 1), tweens = activeCall.tweens, reverse = flags & 64 /* REVERSE */;
                    if (percentComplete === 1) {
                        activeCall._nextComplete = undefined;
                        if (lastComplete) {
                            lastComplete._nextComplete = lastComplete = activeCall;
                        } else {
                            firstComplete = lastComplete = activeCall;
                        }
                    }
                    for (var property in tweens) {
                        // For every element, iterate through each property.
                        var tween_5 = tweens[property], sequence = tween_5.sequence, pattern = sequence.pattern;
                        var currentValue = "", i = 0;
                        if (pattern) {
                            var easingComplete = (tween_5.easing || activeEasing)(percentComplete, 0, 1, property), best = 0;
                            for (var i_2 = 0; i_2 < sequence.length - 1; i_2++) {
                                if (sequence[i_2].percent < easingComplete) {
                                    best = i_2;
                                }
                            }
                            var tweenFrom = sequence[best], tweenTo = sequence[best + 1] || tweenFrom, tweenPercent = (percentComplete - tweenFrom.percent) / (tweenTo.percent - tweenFrom.percent), easing = tweenTo.easing || VelocityStatic.Easing.linearEasing;
                            //console.log("tick", percentComplete, tweenPercent, best, tweenFrom, tweenTo, sequence)
                                                        for (;i < pattern.length; i++) {
                                var startValue = tweenFrom[i];
                                if (startValue == null) {
                                    currentValue += pattern[i];
                                } else {
                                    var endValue = tweenTo[i];
                                    if (startValue === endValue) {
                                        currentValue += startValue;
                                    } else {
                                        // All easings must deal with numbers except for our internal ones.
                                        var result = easing(reverse ? 1 - tweenPercent : tweenPercent, startValue, endValue, property);
                                        currentValue += pattern[i] === true ? Math.round(result) : result;
                                    }
                                }
                            }
                            if (property !== "tween") {
                                if (percentComplete === 1 && _startsWith(currentValue, "calc(0 + ")) {
                                    currentValue = currentValue.replace(/^calc\(0[^\d]* \+ ([^\(\)]+)\)$/, "$1");
                                }
                                // TODO: To solve an IE<=8 positioning bug, the unit type must be dropped when setting a property value of 0 - add normalisations to legacy
                                                                VelocityStatic.CSS.setPropertyValue(activeCall.element, property, currentValue, tween_5.fn);
                            } else {
                                // Skip the fake 'tween' property as that is only
                                // passed into the progress callback.
                                activeCall.tween = currentValue;
                            }
                        } else {
                            console.warn("VelocityJS: Missing pattern:", property, JSON.stringify(tween_5[property]));
                            delete tweens[property];
                        }
                    }
                }
                if (firstProgress || firstComplete) {
                    if (document.hidden) {
                        asyncCallbacks();
                    } else if (worker) {
                        worker.postMessage("");
                    } else {
                        setTimeout(asyncCallbacks, 1);
                    }
                }
            }
        }
        if (VelocityStatic.State.first) {
            VelocityStatic.State.isTicking = true;
            if (!document.hidden) {
                rAFShim(tick);
            } else if (!worker) {
                rAFProxy(tick);
            } else if (timestamp === false) {
                // Make sure we turn on the messages.
                worker.postMessage(true);
            }
        } else {
            VelocityStatic.State.isTicking = false;
            VelocityStatic.lastTick = 0;
            if (document.hidden && worker) {
                // Make sure we turn off the messages.
                worker.postMessage(false);
            }
        }
        ticking = false;
    }
    VelocityStatic.tick = tick;
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Use rAF high resolution timestamp when available.
 */ var VelocityStatic;

(function(VelocityStatic) {
    VelocityStatic.timestamp = true;
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Validation functions used for various types of data that can be supplied.
 * All errors are reported in the non-minified version for development. If a
 * validation fails then it should return <code>undefined</code>.
 */
/**
 * Parse a duration value and return an ms number. Optionally return a
 * default value if the number is not valid.
 */
function parseDuration(duration, def) {
    if (isNumber(duration)) {
        return duration;
    }
    if (isString(duration)) {
        return Duration[duration.toLowerCase()] || parseFloat(duration.replace("ms", "").replace("s", "000"));
    }
    return def == null ? undefined : parseDuration(def);
}

/**
 * Validate a <code>cache</code> option.
 * @private
 */ function validateCache(value) {
    if (isBoolean(value)) {
        return value;
    }
    if (value != null) {
        console.warn("VelocityJS: Trying to set 'cache' to an invalid value:", value);
    }
}

/**
 * Validate a <code>begin</code> option.
 * @private
 */ function validateBegin(value) {
    if (isFunction(value)) {
        return value;
    }
    if (value != null) {
        console.warn("VelocityJS: Trying to set 'begin' to an invalid value:", value);
    }
}

/**
 * Validate a <code>complete</code> option.
 * @private
 */ function validateComplete(value, noError) {
    if (isFunction(value)) {
        return value;
    }
    if (value != null && !noError) {
        console.warn("VelocityJS: Trying to set 'complete' to an invalid value:", value);
    }
}

/**
 * Validate a <code>delay</code> option.
 * @private
 */ function validateDelay(value) {
    var parsed = parseDuration(value);
    if (!isNaN(parsed)) {
        return parsed;
    }
    if (value != null) {
        console.error("VelocityJS: Trying to set 'delay' to an invalid value:", value);
    }
}

/**
 * Validate a <code>duration</code> option.
 * @private
 */ function validateDuration(value, noError) {
    var parsed = parseDuration(value);
    if (!isNaN(parsed) && parsed >= 0) {
        return parsed;
    }
    if (value != null && !noError) {
        console.error("VelocityJS: Trying to set 'duration' to an invalid value:", value);
    }
}

/**
 * Validate a <code>easing</code> option.
 * @private
 */ function validateEasing(value, duration, noError) {
    var Easing = VelocityStatic.Easing;
    if (isString(value)) {
        // Named easing
        return Easing.Easings[value];
    }
    if (isFunction(value)) {
        return value;
    }
    if (Array.isArray(value)) {
        if (value.length === 1) {
            // Steps
            return Easing.generateStep(value[0]);
        }
        if (value.length === 2) {
            // springRK4 must be passed the animation's duration.
            // Note: If the springRK4 array contains non-numbers,
            // generateSpringRK4() returns an easing function generated with
            // default tension and friction values.
            return Easing.generateSpringRK4(value[0], value[1], duration);
        }
        if (value.length === 4) {
            // Note: If the bezier array contains non-numbers, generateBezier()
            // returns undefined.
            return Easing.generateBezier.apply(null, value) || false;
        }
    }
    if (value != null && !noError) {
        console.error("VelocityJS: Trying to set 'easing' to an invalid value:", value);
    }
}

/**
 * Validate a <code>fpsLimit</code> option.
 * @private
 */ function validateFpsLimit(value) {
    if (value === false) {
        return 0;
    } else {
        var parsed = parseInt(value, 10);
        if (!isNaN(parsed) && parsed >= 0) {
            return Math.min(parsed, 60);
        }
    }
    if (value != null) {
        console.warn("VelocityJS: Trying to set 'fpsLimit' to an invalid value:", value);
    }
}

/**
 * Validate a <code>loop</code> option.
 * @private
 */ function validateLoop(value) {
    if (value === false) {
        return 0;
    } else if (value === true) {
        return true;
    } else {
        var parsed = parseInt(value, 10);
        if (!isNaN(parsed) && parsed >= 0) {
            return parsed;
        }
    }
    if (value != null) {
        console.warn("VelocityJS: Trying to set 'loop' to an invalid value:", value);
    }
}

/**
 * Validate a <code>progress</code> option.
 * @private
 */ function validateProgress(value) {
    if (isFunction(value)) {
        return value;
    }
    if (value != null) {
        console.warn("VelocityJS: Trying to set 'progress' to an invalid value:", value);
    }
}

/**
 * Validate a <code>promise</code> option.
 * @private
 */ function validatePromise(value) {
    if (isBoolean(value)) {
        return value;
    }
    if (value != null) {
        console.warn("VelocityJS: Trying to set 'promise' to an invalid value:", value);
    }
}

/**
 * Validate a <code>promiseRejectEmpty</code> option.
 * @private
 */ function validatePromiseRejectEmpty(value) {
    if (isBoolean(value)) {
        return value;
    }
    if (value != null) {
        console.warn("VelocityJS: Trying to set 'promiseRejectEmpty' to an invalid value:", value);
    }
}

/**
 * Validate a <code>queue</code> option.
 * @private
 */ function validateQueue(value, noError) {
    if (value === false || isString(value)) {
        return value;
    }
    if (value != null && !noError) {
        console.warn("VelocityJS: Trying to set 'queue' to an invalid value:", value);
    }
}

/**
 * Validate a <code>repeat</code> option.
 * @private
 */ function validateRepeat(value) {
    if (value === false) {
        return 0;
    } else if (value === true) {
        return true;
    } else {
        var parsed = parseInt(value, 10);
        if (!isNaN(parsed) && parsed >= 0) {
            return parsed;
        }
    }
    if (value != null) {
        console.warn("VelocityJS: Trying to set 'repeat' to an invalid value:", value);
    }
}

/**
 * Validate a <code>speed</code> option.
 * @private
 */ function validateSpeed(value) {
    if (isNumber(value)) {
        return value;
    }
    if (value != null) {
        console.error("VelocityJS: Trying to set 'speed' to an invalid value:", value);
    }
}

/**
 * Validate a <code>sync</code> option.
 * @private
 */ function validateSync(value) {
    if (isBoolean(value)) {
        return value;
    }
    if (value != null) {
        console.error("VelocityJS: Trying to set 'sync' to an invalid value:", value);
    }
}

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Velocity version (should grab from package.json during build).
 */ var VelocityStatic;

(function(VelocityStatic) {
    VelocityStatic.version = "2.0.2";
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Core "Velocity" function.
 */
function VelocityFn() {
    var __args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        __args[_i] = arguments[_i];
    }
    var 
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
    args0 = _arguments[0], 
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
    syntacticSugar = isPlainObject(args0) && (args0.p || (isPlainObject(args0.properties) && !args0.properties.names || isString(args0.properties)));
    var 
    /**
     *  When Velocity is called via the utility function (Velocity()),
     * elements are explicitly passed in as the first parameter. Thus,
     * argument positioning varies.
     */
    argumentIndex = 0, 
    /**
     * The list of elements, extended with Promise and Velocity.
     */
    elements, 
    /**
     * The properties being animated. This can be a string, in which case it
     * is either a function for these elements, or it is a "named" animation
     * sequence to use instead. Named sequences start with either "callout."
     * or "transition.". When used as a callout the values will be reset
     * after finishing. When used as a transtition then there is no special
     * handling after finishing.
     */
    propertiesMap, 
    /**
     * Options supplied, this will be mapped and validated into
     * <code>options</code>.
     */
    optionsMap, 
    /**
     * If called via a chain then this contains the <b>last</b> calls
     * animations. If this does not have a value then any access to the
     * element's animations needs to be to the currently-running ones.
     */
    animations, 
    /**
     * The promise that is returned.
     */
    promise, 
    // Used when the animation is finished
    resolver, 
    // Used when there was an issue with one or more of the Velocity arguments
    rejecter;
    //console.log("Velocity", _arguments)
    // First get the elements, and the animations connected to the last call if
    // this is chained.
    // TODO: Clean this up a bit
    // TODO: Throw error if the chain is called with elements as the first argument. isVelocityResult(this) && ( (isNode(arg0) || isWrapped(arg0)) && arg0 == this)
        if (isNode(this)) {
        // This is from a chain such as document.getElementById("").velocity(...)
        elements = [ this ];
    } else if (isWrapped(this)) {
        // This might be a chain from something else, but if chained from a
        // previous Velocity() call then grab the animations it's related to.
        elements = _objectAssign([], this);
        if (isVelocityResult(this)) {
            animations = this.velocity.animations;
        }
    } else if (syntacticSugar) {
        elements = _objectAssign([], args0.elements || args0.e);
        argumentIndex++;
    } else if (isNode(args0)) {
        elements = _objectAssign([], [ args0 ]);
        argumentIndex++;
    } else if (isWrapped(args0)) {
        elements = _objectAssign([], args0);
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
        propertiesMap = _arguments[argumentIndex++];
    }
    // Get any options map passed in as arguments first, expand any direct
    // options if possible.
        var isReverse = propertiesMap === "reverse", isAction = !isReverse && isString(propertiesMap), maybeSequence = isAction && VelocityStatic.Sequences[propertiesMap], opts = syntacticSugar ? getValue(args0.options, args0.o) : _arguments[argumentIndex];
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
                        resolver = function(args) {
                if (isVelocityResult(args)) {
                    var _then = args && args.then;
                    if (_then) {
                        args.then = undefined;
 // Preserving enumeration etc
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
            if (promise.finally) {
                // Semi-standard
                defineProperty(elements, "finally", promise.finally.bind(promise));
            }
        }
    }
    var promiseRejectEmpty = getValue(optionsMap && optionsMap.promiseRejectEmpty, defaults.promiseRejectEmpty);
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
    if (!elements && !isAction || !propertiesMap) {
        return promise;
    }
    // NOTE: Can't use isAction here due to type inference - there are callbacks
    // between so the type isn't considered safe.
        if (isAction) {
        var args = [], promiseHandler = promise && {
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
                var action = propertiesMap.replace(/\..*$/, ""), callback = VelocityStatic.Actions[action];
        if (callback) {
            var result = callback(args, elements, promiseHandler, propertiesMap);
            if (result !== undefined) {
                return result;
            }
            return elements || promise;
        } else if (!maybeSequence) {
            console.error("VelocityJS: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.");
            return;
        }
    }
    var hasValidDuration;
    if (isPlainObject(propertiesMap) || isReverse || maybeSequence) {
        /**
         * The options for this set of animations.
         */
        var options = {};
        var isSync = defaults.sync;
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
            var validDuration = validateDuration(optionsMap.duration);
            hasValidDuration = validDuration !== undefined;
            options.duration = getValue(validDuration, defaults.duration);
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
                    propertiesMap.display = optionsMap.display;
                    console.error("Deprecated 'options.display' used, this is now a property:", optionsMap.display);
                }
                if (optionsMap.visibility != null) {
                    propertiesMap.visibility = optionsMap.visibility;
                    console.error("Deprecated 'options.visibility' used, this is now a property:", optionsMap.visibility);
                }
            }
            // TODO: Allow functional options for different options per element
                        var optionsBegin = validateBegin(optionsMap.begin), optionsComplete = validateComplete(optionsMap.complete), optionsProgress = validateProgress(optionsMap.progress), optionsSync = validateSync(optionsMap.sync);
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
            var validDuration = validateDuration(_arguments[argumentIndex], true);
            var offset = 0;
            hasValidDuration = validDuration !== undefined;
            if (validDuration !== undefined) {
                offset++;
                options.duration = validDuration;
            }
            if (!isFunction(_arguments[argumentIndex + offset])) {
                // Despite coming before Complete, we can't pass a fn easing
                var easing = validateEasing(_arguments[argumentIndex + offset], getValue(options && validateDuration(options.duration), defaults.duration), true);
                if (easing !== undefined) {
                    offset++;
                    options.easing = easing;
                }
            }
            var complete = validateComplete(_arguments[argumentIndex + offset], true);
            if (complete !== undefined) {
                options.complete = complete;
            }
            options.loop = defaults.loop;
            options.repeat = options.repeatAgain = defaults.repeat;
        }
        if (isReverse && options.queue === false) {
            throw new Error("VelocityJS: Cannot reverse a queue:false animation.");
        }
        if (maybeSequence && !hasValidDuration && maybeSequence.duration) {
            options.duration = maybeSequence.duration;
        }
        /* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
         In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
        /* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
         the call array is pushed to VelocityStatic.State.calls for live processing by the requestAnimationFrame tick. */        var rootAnimation = {
            _prev: undefined,
            _next: undefined,
            _flags: isSync ? 32 /* SYNC */ : 0,
            options: options,
            percentComplete: 0,
            //element: element,
            elements: elements,
            ellapsedTime: 0,
            timeStart: 0
        };
        animations = [];
        for (var index = 0; index < elements.length; index++) {
            var element = elements[index];
            var flags = 0;
            if (isNode(element)) {
                if (isReverse) {
                    var lastAnimation = Data(element).lastAnimationList[options.queue];
                    propertiesMap = lastAnimation && lastAnimation.tweens;
                    if (!propertiesMap) {
                        console.error("VelocityJS: Attempting to reverse an animation on an element with no previous animation:", element);
                        continue;
                    }
                    flags |= 64 /* REVERSE */ & ~(lastAnimation._flags & 64 /* REVERSE */);
                }
                var animation = _objectAssign({
                    element: element
                }, rootAnimation);
                options._total++;
                animation._flags |= flags;
                animations.push(animation);
                if (maybeSequence) {
                    VelocityStatic.expandSequence(animation, maybeSequence);
                } else if (isReverse) {
                    // In this case we're using the previous animation, so
                    // it will be expanded correctly when that one runs.
                    animation.tweens = propertiesMap;
                } else {
                    animation.tweens = createEmptyObject();
                    VelocityStatic.expandProperties(animation, propertiesMap);
                }
                VelocityStatic.queue(element, animation, options.queue);
            }
        }
        if (VelocityStatic.State.isTicking === false) {
            // If the animation tick isn't running, start it. (Velocity shuts it
            // off when there are no active calls to process.)
            VelocityStatic.tick(false);
        }
        if (animations) {
            defineProperty(elements.velocity, "animations", animations);
        }
    }
    /***************
     Chaining
     ***************/
    /* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */    return elements || promise;
}

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
var IE = function() {
    if (document.documentMode) {
        return document.documentMode;
    } else {
        for (var i = 7; i > 4; i--) {
            var div = document.createElement("div");
            div.innerHTML = "\x3c!--[if IE " + i + "]><span></span><![endif]--\x3e";
            if (div.getElementsByTagName("span").length) {
                div = null;
                return i;
            }
        }
    }
    return undefined;
}();

/******************
 Unsupported
 ******************/ if (IE <= 8) {
    throw new Error("VelocityJS cannot run on Internet Explorer 8 or earlier");
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
    var patch = VelocityStatic.patch, jQuery = window.jQuery, Zepto = window.Zepto;
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
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */ var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "bounce", {
            duration: 1e3,
            "0,100%": {
                transformOrigin: "center bottom"
            },
            "0%,20%,53%,80%,100%": {
                transform: [ "translate3d(0,0px,0)", "easeOutCubic" ]
            },
            "40%,43%": {
                transform: [ "translate3d(0,-30px,0)", "easeInQuint" ]
            },
            "70%": {
                transform: [ "translate3d(0,-15px,0)", "easeInQuint" ]
            },
            "90%": {
                transform: "translate3d(0,-4px,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "flash", {
            duration: 1e3,
            "0%,50%,100%": {
                opacity: "1"
            },
            "25%,75%": {
                opacity: "0"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "headShake", {
            duration: 1e3,
            easing: "easeInOut",
            "0%": {
                transform: "translateX(0) rotateY(0)"
            },
            "6.5%": {
                transform: "translateX(-6px) rotateY(-9deg)"
            },
            "18.5%": {
                transform: "translateX(5px) rotateY(7deg)"
            },
            "31.5%": {
                transform: "translateX(-3px) rotateY(-5deg)"
            },
            "43.5%": {
                transform: "translateX(2px) rotateY(3deg)"
            },
            "50%": {
                transform: "translateX(0) rotateY(0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "jello", {
            duration: 1e3,
            "0%,100%": {
                transformOrigin: "center"
            },
            "0%,11.1%,100%": {
                transform: "skewX(0) skewY(0)"
            },
            "22.2%": {
                transform: "skewX(-12.5deg) skewY(-12.5deg)"
            },
            "33.3%": {
                transform: "skewX(6.25deg) skewY(6.25deg)"
            },
            "44.4%": {
                transform: "skewX(-3.125deg) skewY(-3.125deg)"
            },
            "55.5%": {
                transform: "skewX(1.5625deg) skewY(1.5625deg)"
            },
            "66.6%": {
                transform: "skewX(-0.78125deg) skewY(-0.78125deg)"
            },
            "77.7%": {
                transform: "skewX(0.390625deg) skewY(0.390625deg)"
            },
            "88.8%": {
                transform: "skewX(-0.1953125deg) skewY(-0.1953125deg)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "pulse", {
            duration: 1e3,
            "0%": {
                transform: "scale3d(1,1,1)"
            },
            "50%": {
                transform: "scale3d(1.05,1.05,1.05)"
            },
            "100%": {
                transform: "scale3d(1,1,1)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rubberBand", {
            duration: 1e3,
            "0%": {
                transform: "scale3d(1,1,1)"
            },
            "30%": {
                transform: "scale3d(1.25,0.75,1)"
            },
            "40%": {
                transform: "scale3d(0.75,1.25,1)"
            },
            "50%": {
                transform: "scale3d(1.15,0.85,1)"
            },
            "65%": {
                transform: "scale3d(0.95,1.05,1)"
            },
            "75%": {
                transform: "scale3d(1.05,0.95,1)"
            },
            "100%": {
                transform: "scale3d(1,1,1)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "shake", {
            duration: 1e3,
            "0%,100%": {
                transform: "translate3d(0,0,0)"
            },
            "10%,30%,50%,70%,90%": {
                transform: "translate3d(-10px,0,0)"
            },
            "20%,40%,60%,80%": {
                transform: "translate3d(10px,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "swing", {
            duration: 1e3,
            "0%,100%": {
                transform: "rotate3d(0,0,1,0deg)",
                transformOrigin: "center"
            },
            "20%": {
                transform: "rotate3d(0,0,1,15deg)"
            },
            "40%": {
                transform: "rotate3d(0,0,1,-10deg)"
            },
            "60%": {
                transform: "rotate3d(0,0,1,5deg)"
            },
            "80%": {
                transform: "rotate3d(0,0,1,-5deg)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "tada", {
            duration: 1e3,
            "0%": {
                transform: "scale3d(1,1,1) rotate3d(0,0,0,0)"
            },
            "10%,20%": {
                transform: "scale3d(0.9,0.9,0.9) rotate3d(0,0,1,-3deg)"
            },
            "30%,50%,70%,90%": {
                transform: "scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)"
            },
            "40%,60%,80%": {
                transform: "scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)"
            },
            "100%": {
                transform: "scale3d(1, 1, 1) rotate3d(0,0,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "wobble", {
            duration: 1e3,
            "0%": {
                transform: "translate3d(0,0,0) rotate3d(0,0,0,0)"
            },
            "15%": {
                transform: "translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)"
            },
            "30%": {
                transform: "translate3d(20%,0,0) rotate3d(0,0,1,3deg)"
            },
            "45%": {
                transform: "translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)"
            },
            "60%": {
                transform: "translate3d(10%,0,0) rotate3d(0,0,1,2deg)"
            },
            "75%": {
                transform: "translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)"
            },
            "100%": {
                transform: "translate3d(0,0,0) rotate3d(0,0,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "bounceIn", {
            duration: 750,
            easing: "easeOutCubic",
            "0%": {
                opacity: "0",
                transform: "scale3d(0.3,0.3,0.3)"
            },
            "20%": {
                transform: "scale3d(1.1,1.1,1.1)"
            },
            "40%": {
                transform: "scale3d(0.9,0.9,0.9)"
            },
            "60%": {
                opacity: "1",
                transform: "scale3d(1.03,1.03,1.03)"
            },
            "80%": {
                transform: "scale3d(0.97,0.97,0.97)"
            },
            "100%": {
                opacity: "1",
                transform: "scale3d(1,1,1)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "bounceInDown", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(0,-3000px,0)"
            },
            "60%": {
                opacity: "1",
                transform: [ "translate3d(0,25px,0)", "easeOutCubic" ]
            },
            "75%": {
                transform: [ "translate3d(0,-10px,0)", "easeOutCubic" ]
            },
            "90%": {
                transform: [ "translate3d(0,5px,0)", "easeOutCubic" ]
            },
            "100%": {
                transform: [ "translate3d(0,0,0)", "easeOutCubic" ]
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "bounceInLeft", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(-3000px,0,0)"
            },
            "60%": {
                opacity: "1",
                transform: [ "translate3d(25px,0,0)", "easeOutCubic" ]
            },
            "75%": {
                transform: [ "translate3d(-10px,0,0)", "easeOutCubic" ]
            },
            "90%": {
                transform: [ "translate3d(5px,0,0)", "easeOutCubic" ]
            },
            "100%": {
                transform: [ "translate3d(0,0,0)", "easeOutCubic" ]
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "bounceInRight", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(3000px,0,0)"
            },
            "60%": {
                opacity: "1",
                transform: [ "translate3d(-25px,0,0)", "easeOutCubic" ]
            },
            "75%": {
                transform: [ "translate3d(10px,0,0)", "easeOutCubic" ]
            },
            "90%": {
                transform: [ "translate3d(-5px,0,0)", "easeOutCubic" ]
            },
            "100%": {
                transform: [ "translate3d(0,0,0)", "easeOutCubic" ]
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "bounceInUp", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(0,3000px,0)"
            },
            "60%": {
                opacity: "1",
                transform: [ "translate3d(0,-25px,0)", "easeOutCubic" ]
            },
            "75%": {
                transform: [ "translate3d(0,10px,0)", "easeOutCubic" ]
            },
            "90%": {
                transform: [ "translate3d(0,-5px,0)", "easeOutCubic" ]
            },
            "100%": {
                transform: [ "translate3d(0,0,0)", "easeOutCubic" ]
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "bounceOut", {
            duration: 750,
            "0%": {
                opacity: "1",
                transform: "scale3d(1,1,1)"
            },
            "20%": {
                transform: "scale3d(0.9,0.9,0.9)"
            },
            "50%,55%": {
                opacity: "1",
                transform: "scale3d(1.1,1.1,1.1)"
            },
            to: {
                opacity: "0",
                transform: "scale3d(0.3,0.3,0.3)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "bounceOutDown", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            },
            "20%": {
                transform: "translate3d(0,10px,0)"
            },
            "40%,45%": {
                opacity: "1",
                transform: "translate3d(0,-20px,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(0,2000px,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "bounceOutLeft", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            },
            "20%": {
                opacity: "1",
                transform: "translate3d(20px,0,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(-2000px,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "bounceOutRight", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            },
            "20%": {
                opacity: "1",
                transform: "translate3d(-20px,0,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(2000px,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "bounceOutUp", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            },
            "20%": {
                transform: "translate3d(0,-10px,0)"
            },
            "40%,45%": {
                opacity: "1",
                transform: "translate3d(0,20px,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(0,-2000px,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeIn", {
            duration: 1e3,
            "0%": {
                opacity: "0"
            },
            "100%": {
                opacity: "1"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeInDown", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(0,-100%,0)"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeInDownBig", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(0,-2000px,0)"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeInLeft", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(-100%,0,0)"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeInLeftBig", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(-2000px,0,0)"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeInRight", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(100%,0,0)"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeInRightBig", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(2000px,0,0)"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeInUp", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(0,100%,0)"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeInUpBig", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(0,2000px,0)"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeOut", {
            duration: 1e3,
            "0%": {
                opacity: "1"
            },
            "100%": {
                opacity: "0"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeOutDown", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(0,100%,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeOutDownBig", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(0,2000px,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeOutLeft", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(-100%,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeOutLeftBig", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(-2000px,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeOutRight", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(100%,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeOutRightBig", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(2000px,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeOutUp", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(0,-100%,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "fadeOutUpBig", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(0,-2000px,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "flip", {
            duration: 1e3,
            "0%,100%": {
                backfaceVisibility: "visible"
            },
            "0%": {
                transform: [ "perspective(400px) translate3d(0,0,0) rotate3d(0,1,0,-360deg) scale3d(1,1,1)", "easeOut" ]
            },
            "40%": {
                transform: [ "perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-190deg) scale3d(1,1,1)", "easeOut" ]
            },
            "50%": {
                transform: [ "perspective(400px) translate3d(0,0,150px) rotate3d(0,1,0,-170deg) scale3d(1,1,1)", "easeIn" ]
            },
            "80%": {
                transform: [ "perspective(400px) translate3d(0,0,0) rotate3d(0,1,0,0) scale3d(0.95,0.95,0.95)", "easeIn" ]
            },
            "100%": {
                transform: [ "perspective(400px) translate3d(0,0,0) rotate3d(0,0,0,0) scale3d(1,1,1)", "ease-in" ]
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "flipInX", {
            duration: 1e3,
            "0%,100%": {
                backfaceVisibility: "visible"
            },
            "0%": {
                opacity: "0",
                transform: "perspective(400px) rotate3d(1,0,0,90deg)"
            },
            "40%": {
                transform: [ "perspective(400px) rotate3d(1,0,0,-20deg)", "easeIn" ]
            },
            "60%": {
                opacity: "1",
                transform: "perspective(400px) rotate3d(1,0,0,10deg)"
            },
            "80%": {
                transform: "perspective(400px) rotate3d(1,0,0,-5deg)"
            },
            "100%": {
                transform: "perspective(400px) rotate3d(1,0,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "flipInY", {
            duration: 1e3,
            "0%,100%": {
                backfaceVisibility: "visible"
            },
            "0%": {
                opacity: "0",
                transform: "perspective(400px) rotate3d(0,1,0,90deg)"
            },
            "40%": {
                transform: [ "perspective(400px) rotate3d(0,1,0,-20deg)", "easeIn" ]
            },
            "60%": {
                opacity: "1",
                transform: "perspective(400px) rotate3d(0,1,0,10deg)"
            },
            "80%": {
                transform: "perspective(400px) rotate3d(0,1,0,-5deg)"
            },
            "100%": {
                transform: "perspective(400px) rotate3d(0,1,0,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "flipOutX", {
            duration: 750,
            "0%,100%": {
                backfaceVisibility: "visible"
            },
            "0%": {
                transform: "perspective(400px) rotate3d(1,0,0,0)"
            },
            "30%": {
                opacity: "1",
                transform: "perspective(400px) rotate3d(1,0,0,-20deg)"
            },
            "100%": {
                opacity: "0",
                transform: "perspective(400px) rotate3d(1,0,0,90deg)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "flipOutY", {
            duration: 750,
            "0%,100%": {
                backfaceVisibility: "visible"
            },
            "0%": {
                transform: "perspective(400px) rotate3d(0,1,0,0)"
            },
            "30%": {
                opacity: "1",
                transform: "perspective(400px) rotate3d(0,1,0,-20deg)"
            },
            "100%": {
                opacity: "0",
                transform: "perspective(400px) rotate3d(0,1,0,90deg)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "lightSpeedIn", {
            duration: 1e3,
            easing: "easeOut",
            "0%": {
                opacity: "0",
                transform: "translate3d(100%,0,0) skewX(-30deg)"
            },
            "60%": {
                opacity: "1",
                transform: "translate3d(40%,0,0) skewX(20deg)"
            },
            "80%": {
                opacity: "1",
                transform: "translate3d(20%,0,0) skewX(-5deg)"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0) skew(0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "lightSpeedOut", {
            duration: 1e3,
            easing: "easeIn",
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0) skewX(0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(100%,0,0) skewX(30deg)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rotateIn", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "rotate3d(0,0,1,-200deg)",
                transformOrigin: "center"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)",
                transformOrigin: "center"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rotateInDownLeft", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "rotate3d(0,0,1,-45deg)",
                transformOrigin: "left bottom"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)",
                transformOrigin: "left bottom"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rotateInDownRight", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "rotate3d(0,0,1,45deg)",
                transformOrigin: "right bottom"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)",
                transformOrigin: "right bottom"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rotateInUpLeft", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "rotate3d(0,0,1,45deg)",
                transformOrigin: "left bottom"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)",
                transformOrigin: "left bottom"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rotateInUpRight", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "rotate3d(0,0,1,-90deg)",
                transformOrigin: "right bottom"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0)",
                transformOrigin: "right bottom"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rotateOut", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)",
                transformOrigin: "center"
            },
            "100%": {
                opacity: "0",
                transform: "rotate3d(0,0,1,200deg)",
                transformOrigin: "center"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rotateOutDownLeft", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)",
                transformOrigin: "left bottom"
            },
            "100%": {
                opacity: "0",
                transform: "rotate3d(0,0,1,45deg)",
                transformOrigin: "left bottom"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rotateOutDownRight", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)",
                transformOrigin: "right bottom"
            },
            "100%": {
                opacity: "0",
                transform: "rotate3d(0,0,1,-45deg)",
                transformOrigin: "right bottom"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rotateOutUpLeft", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)",
                transformOrigin: "left bottom"
            },
            "100%": {
                opacity: "0",
                transform: "rotate3d(0,0,1,-45deg)",
                transformOrigin: "left bottom"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rotateOutUpRight", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0)",
                transformOrigin: "right bottom"
            },
            "100%": {
                opacity: "0",
                transform: "rotate3d(0,0,1,90deg)",
                transformOrigin: "right bottom"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "slideInDown", {
            duration: 1e3,
            "0%": {
                transform: "translate3d(0,-100%,0)",
                visibility: "hidden",
                opacity: "0"
            },
            "100%": {
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "slideInLeft", {
            duration: 1e3,
            "0%": {
                transform: "translate3d(-100%,0,0)",
                visibility: "hidden",
                opacity: "0"
            },
            "100%": {
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "slideInRight", {
            duration: 1e3,
            "0%": {
                transform: "translate3d(100%,0,0)",
                visibility: "hidden",
                opacity: "0"
            },
            "100%": {
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "slideInUp", {
            duration: 1e3,
            "0%": {
                transform: "translate3d(0,100%,0)",
                visibility: "hidden",
                opacity: "0"
            },
            "100%": {
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "slideOutDown", {
            duration: 1e3,
            "0%": {
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            },
            "100%": {
                transform: "translate3d(0,-100%,0)",
                visibility: "hidden",
                opacity: "0"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "slideOutLeft", {
            duration: 1e3,
            "0%": {
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            },
            "100%": {
                transform: "translate3d(-100%,0,0)",
                visibility: "hidden",
                opacity: "0"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "slideOutRight", {
            duration: 1e3,
            "0%": {
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            },
            "100%": {
                transform: "translate3d(100%,0,0)",
                visibility: "hidden",
                opacity: "0"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "slideOutUp", {
            duration: 1e3,
            "0%": {
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            },
            "100%": {
                transform: "translate3d(0,100%,0)",
                visibility: "hidden",
                opacity: "0"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "hinge", {
            duration: 2e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0) rotate3d(0,0,1,0)",
                transformOrigin: "top left"
            },
            "20%,60%": {
                transform: [ "translate3d(0,0,0) rotate3d(0,0,1,80deg)", "easeInOut" ]
            },
            "40%,80%": {
                opacity: "1",
                transform: [ "translate3d(0,0,0) rotate3d(0,0,1,60deg)", "easeInOut" ]
            },
            "100%": {
                opacity: "0",
                transform: [ "translate3d(0,700px,0) rotate3d(0,0,1,80deg)", "easeInOut" ]
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "jackInTheBox", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "scale(0.1) rotate(30deg)",
                transformOrigin: "center bottom"
            },
            "50%": {
                transform: "scale(0.5) rotate(-10deg)"
            },
            "70%": {
                transform: "scale(0.7) rotate(3deg)"
            },
            "100%": {
                opacity: "1",
                transform: "scale(1) rotate(0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rollIn", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "translate3d(-100%,0,0) rotate3d(0,0,1,-120deg)"
            },
            "100%": {
                opacity: "1",
                transform: "translate3d(0,0,0) rotate3d(0,0,1,0)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "rollOut", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "translate3d(0,0,0) rotate3d(0,0,1,0)"
            },
            "100%": {
                opacity: "0",
                transform: "translate3d(100%,0,0) rotate3d(0,0,1,120deg)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "zoomIn", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "scale3d(0.3,0.3,0.3)"
            },
            "50%": {
                opacity: "1"
            },
            "100%": {
                transform: "scale3d(1,1,1)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "zoomInDown", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "scale3d(0.1,0.1,0.1) translate3d(0,-1000px,0)"
            },
            "60%": {
                opacity: "1",
                transform: [ "scale3d(0.475,0.475,0.475) translate3d(0,60px,0)", "easeInCubic" ]
            },
            "100%": {
                transform: [ "scale3d(1,1,1) translate3d(0,0,0)", [ .175, .885, .32, 1 ] ]
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "zoomInLeft", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "scale3d(0.1,0.1,0.1) translate3d(-1000px,0,0)"
            },
            "60%": {
                opacity: "1",
                transform: [ "scale3d(0.475,0.475,0.475) translate3d(10px,0,0)", "easeInCubic" ]
            },
            "100%": {
                transform: [ "scale3d(1,1,1) translate3d(0,0,0)", [ .175, .885, .32, 1 ] ]
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "zoomInRight", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "scale3d(0.1,0.1,0.1) translate3d(1000px,0,0)"
            },
            "60%": {
                opacity: "1",
                transform: [ "scale3d(0.475,0.475,0.475) translate3d(-10px,0,0)", "easeInCubic" ]
            },
            "100%": {
                transform: [ "scale3d(1,1,1) translate3d(0,0,0)", [ .175, .885, .32, 1 ] ]
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "zoomInUp", {
            duration: 1e3,
            "0%": {
                opacity: "0",
                transform: "scale3d(0.1,0.1,0.1) translate3d(0,1000px,0)"
            },
            "60%": {
                opacity: "1",
                transform: [ "scale3d(0.475,0.475,0.475) translate3d(0,-60px,0)", "easeInCubic" ]
            },
            "100%": {
                transform: [ "scale3d(1,1,1) translate3d(0,0,0)", [ .175, .885, .32, 1 ] ]
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "zoomOut", {
            duration: 1e3,
            "0%": {
                transform: "scale3d(1,1,1)"
            },
            "50%": {
                opacity: "1"
            },
            "100%": {
                opacity: "0",
                transform: "scale3d(0.3,0.3,0.3)"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "zoomOutDown", {
            duration: 1e3,
            "0%": {
                transform: "scale3d(1,1,1) translate3d(0,0,0)"
            },
            "40%": {
                opacity: "1",
                transform: [ "scale3d(0.475,0.475,0.475) translate3d(0,60px,0)", [ .55, .055, .675, .19 ] ]
            },
            "100%": {
                opacity: "0",
                transform: [ "scale3d(0.1,0.1,0.1) translate3d(0,-1000px,0)", [ .175, .885, .32, 1 ] ]
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "zoomOutLeft", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "scale(1) translate3d(0,0,0)",
                transformOrigin: "left center"
            },
            "40%": {
                opacity: "1",
                transform: "scale(0.475) translate3d(42px,0,0)"
            },
            "100%": {
                opacity: "0",
                transform: "scale(0.1) translate3d(-2000px,0,0)",
                transformOrigin: "left center"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "zoomOutRight", {
            duration: 1e3,
            "0%": {
                opacity: "1",
                transform: "scale(1) translate3d(0,0,0)",
                transformOrigin: "right center"
            },
            "40%": {
                opacity: "1",
                transform: "scale(0.475) translate3d(-42px, 0, 0)"
            },
            "100%": {
                opacity: "0",
                transform: "scale(0.1) translate3d(2000px, 0, 0)",
                transformOrigin: "right center"
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Based on animate.css: https://github.com/daneden/animate.css
 */
var VelocityStatic;

(function(VelocityStatic) {
    var UI;
    (function(UI) {
        Velocity("registerSequence", "zoomOutUp", {
            duration: 1e3,
            "0%": {
                transform: "scale3d(1,1,1) translate3d(0,0,0)"
            },
            "40%": {
                opacity: "1",
                transform: [ "scale3d(0.475,0.475,0.475) translate3d(0,-60px,0)", [ .55, .055, .675, .19 ] ]
            },
            "100%": {
                opacity: "0",
                transform: [ "scale3d(0.1,0.1,0.1) translate3d(0,1000px,0)", [ .175, .885, .32, 1 ] ]
            }
        });
    })(UI = VelocityStatic.UI || (VelocityStatic.UI = {}));
})(VelocityStatic || (VelocityStatic = {}));

var _loop_2 = function(key) {
    var value = VelocityStatic[key];
    if (isString(value) || isNumber(value) || isBoolean(value)) {
        Object.defineProperty(VelocityFn, key, {
            enumerable: PUBLIC_MEMBERS.indexOf(key) >= 0,
            get: function() {
                return VelocityStatic[key];
            },
            set: function(value) {
                VelocityStatic[key] = value;
            }
        });
    } else {
        Object.defineProperty(VelocityFn, key, {
            enumerable: PUBLIC_MEMBERS.indexOf(key) >= 0,
            get: function() {
                return VelocityStatic[key];
            }
        });
    }
};

///<reference path="../index.d.ts" />
///<reference path="constants.ts" />
///<reference path="types.ts" />
///<reference path="utility.ts" />
///<reference path="Velocity/_all.d.ts" />
///<reference path="core.ts" />
///<reference path="ui/_all.d.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Merge the VelocityStatic namespace onto the Velocity function for external
 * use. This is done as a read-only way. Any attempt to change these values will
 * be allowed.
 */ for (var key in VelocityStatic) {
    _loop_2(key);
}
// console.log("Velocity keys", Object.keys(VelocityStatic));
//# sourceMappingURL=velocity.js.map
//# sourceMappingURL=velocity.js.map
	return VelocityFn;
}));
