/*! VelocityJS.org (2.0.0) (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('Velocity', [], function() {
			return (root['Velocity'] = factory());
		});
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

/*************************
 Velocity jQuery Shim
 *************************/
(function(window) {
    "use strict";
    /***************
     Setup
     ***************/
    /* If jQuery is already loaded, there's no point in loading this shim. */
    if (window.jQuery) {
        return;
    }
    /* jQuery base. */
    var $ = function(selector, context) {
        return new $.fn.init(selector, context);
    };
    /********************
     Private Methods
     ********************/
    /* jQuery */
    $.isWindow = function(obj) {
        /* jshint eqeqeq: false */
        return obj && obj === obj.window;
    };
    /* jQuery */
    $.type = function(obj) {
        if (!obj) {
            return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
    };
    /* jQuery */
    function isArraylike(obj) {
        var length = obj.length, type = $.type(obj);
        if (type === "function" || $.isWindow(obj)) {
            return false;
        }
        if (obj.nodeType === 1 && length) {
            return true;
        }
        return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
    }
    /***************
     $ Methods
     ***************/
    /* jQuery */
    $.each = function(obj, callback, args) {
        var value, i = 0, length = obj.length, isArray = isArraylike(obj);
        if (args) {
            if (isArray) {
                for (;i < length; i++) {
                    value = callback.apply(obj[i], args);
                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (var i_1 in obj) {
                    if (!obj.hasOwnProperty(i_1)) {
                        continue;
                    }
                    value = callback.apply(obj[i_1], args);
                    if (value === false) {
                        break;
                    }
                }
            }
        } else {
            if (isArray) {
                for (;i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);
                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (var i_2 in obj) {
                    if (!obj.hasOwnProperty(i_2)) {
                        continue;
                    }
                    value = callback.call(obj[i_2], i_2, obj[i_2]);
                    if (value === false) {
                        break;
                    }
                }
            }
        }
        return obj;
    };
    /* Custom */
    $.data = function(node, key, value) {
        /* $.getData() */
        if (value === undefined) {
            var getId = node[$.expando], store = getId && cache[getId];
            if (key === undefined) {
                return store;
            } else if (store) {
                if (key in store) {
                    return store[key];
                }
            }
        } else if (key !== undefined) {
            var setId = node[$.expando] || (node[$.expando] = ++$.uuid);
            cache[setId] = cache[setId] || {};
            cache[setId][key] = value;
            return value;
        }
    };
    /* jQuery */
    $.extend = function() {
        var src, copyIsArray, copy, name, options, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (typeof target !== "object" && $.type(target) !== "function") {
            target = {};
        }
        if (i === length) {
            target = this;
            i--;
        }
        for (;i < length; i++) {
            if (options = arguments[i]) {
                for (name in options) {
                    if (!options.hasOwnProperty(name)) {
                        continue;
                    }
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        target[name] = $.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };
    /******************
     $.fn Methods
     ******************/
    /* jQuery */
    $.fn = $.prototype = {
        init: function(selector) {
            /* Just return the element wrapped inside an array; don't proceed with the actual jQuery node wrapping process. */
            if (selector.nodeType) {
                this[0] = selector;
                return this;
            } else {
                throw new Error("Not a DOM node.");
            }
        },
        offset: function() {
            /* jQuery altered code: Dropped disconnected DOM node checking. */
            var box = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : {
                top: 0,
                left: 0
            };
            return {
                top: box.top + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
                left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
            };
        },
        position: function() {
            /* jQuery */
            function offsetParentFn(elem) {
                var offsetParent = elem.offsetParent;
                while (offsetParent && offsetParent.nodeName.toLowerCase() !== "html" && offsetParent.style && offsetParent.style.position === "static") {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || document;
            }
            /* Zepto */
            var elem = this[0], offsetParent = offsetParentFn(elem), offset = this.offset(), parentOffset = /^(?:body|html)$/i.test(offsetParent.nodeName) ? {
                top: 0,
                left: 0
            } : $(offsetParent).offset();
            offset.top -= parseFloat(elem.style.marginTop) || 0;
            offset.left -= parseFloat(elem.style.marginLeft) || 0;
            if (offsetParent.style) {
                parentOffset.top += parseFloat(offsetParent.style.borderTopWidth) || 0;
                parentOffset.left += parseFloat(offsetParent.style.borderLeftWidth) || 0;
            }
            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        }
    };
    /**********************
     Private Variables
     **********************/
    /* For $.data() */
    var cache = {};
    $.expando = "velocity" + new Date().getTime();
    $.uuid = 0;
    /* For $.queue() */
    var class2type = {}, hasOwn = class2type.hasOwnProperty, toString = class2type.toString;
    var types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
    for (var i = 0; i < types.length; i++) {
        class2type["[object " + types[i] + "]"] = types[i].toLowerCase();
    }
    /* Makes $(node) possible, without having to call init. */
    $.fn.init.prototype = $.fn;
    /* Globalize Velocity onto the window, and assign its Utilities property. */
    window.jQuery = $;
})(window);

/*****************
 Constants
 *****************/
var MAJOR = 2;

var MINOR = 0;

var PATCH = 0;

var DURATION_FAST = 200;

var DURATION_DEFAULT = 400;

var DURATION_SLOW = 600;

var EASING_DEFAULT = "swing";

function isBoolean(variable) {
    return variable === true || variable === false;
}

function isNumber(variable) {
    return typeof variable === "number";
}

function isString(variable) {
    return typeof variable === "string";
}

function isFunction(variable) {
    return Object.prototype.toString.call(variable) === "[object Function]";
}

function isNode(variable) {
    return variable && variable.nodeType;
}

/* Determine if variable is an array-like wrapped jQuery, Zepto or similar element, or even a NodeList etc. */
/* NOTE: HTMLFormElements also have a length. */
function isWrapped(variable) {
    return variable && variable !== window && isNumber(variable.length) && !isString(variable) && !isFunction(variable) && !isNode(variable) && (variable.length === 0 || isNode(variable[0]));
}

function isSVG(variable) {
    return window.SVGElement && variable instanceof window.SVGElement;
}

function isPlainObject(variable) {
    if (!variable || String(variable) !== "[object Object]") {
        return false;
    }
    var proto = Object.getPrototypeOf(variable);
    return !proto || proto.hasOwnProperty("constructor") && proto.constructor === Object;
}

function isEmptyObject(variable) {
    for (var name in variable) {
        if (variable.hasOwnProperty(name)) {
            return false;
        }
    }
    return true;
}

/**
 * The <strong><code>defineProperty()</code></strong> function provides a
 * shortcut to defining a property that cannot be accidentally iterated across.
 */
function defineProperty(proto, name, value, force) {
    if (proto && (force || !proto[name])) {
        Object.defineProperty(proto, name, {
            configurable: true,
            writable: true,
            value: value
        });
    }
}

/**
 * Perform a deep copy of an object - also copies children so they're not
 * going to be affected by changing original.
 */
function _deepCopyObject(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object");
    }
    var to = Object(target), source, hasOwnProperty = Object.prototype.hasOwnProperty;
    while (source = sources.shift()) {
        if (source != null) {
            for (var key in source) {
                if (hasOwnProperty.call(source, key)) {
                    var value = source[key];
                    if (Array.isArray(value)) {
                        _deepCopyObject(to[key] = [], value);
                    } else if (isPlainObject(value)) {
                        _deepCopyObject(to[key] = {}, value);
                    } else {
                        to[key] = value;
                    }
                }
            }
        }
    }
    return to;
}

function _position(element) {
    if (element) {
        return element.getBoundingClientRect();
    }
}

/**
 * Shim to get the current milliseconds - on anything except old IE it'll use
 * Date.now() and save creating an object. If that doesn't exist then it'll
 * create one that gets GC.
 */
var _now = Date.now ? Date.now : function() {
    return new Date().getTime();
};

/**
 * Shim for [].includes, can fallback to .indexOf and even manual search for
 * IE < 9
 */
var _inArray = function() {
    if (Array.prototype.includes) {
        return function(arr, val) {
            return arr.includes(val);
        };
    }
    if (Array.prototype.indexOf) {
        return function(arr, val) {
            return arr.indexOf(val) >= 0;
        };
    }
    return function(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                return true;
            }
        }
        return false;
    };
};

/**
 * Convert an element or array-like element list into an actual array
 */
function sanitizeElements(elements) {
    /* Unwrap jQuery/Zepto objects. */
    if (isWrapped(elements)) {
        elements = elements.slice();
    } else if (isNode(elements)) {
        elements = [ elements ];
    }
    return elements;
}

///<reference path="../index.d.ts" />
/**********************
 AnimationCall cache
 **********************/
var VelocityStatic;

(function(VelocityStatic) {
    /**
     * Allow all properties of the AnimationCall objects to be changed, but not
     * removed.
     */
    var defaultUndefinedDescriptor = {
        writable: true,
        enumerable: true,
        value: undefined
    };
    /**
     * Allow all properties of the AnimationCall objects to be changed, but not
     * removed.
     */
    var defaultNumberDescriptor = {
        writable: true,
        enumerable: true,
        value: 0
    };
    /**
     * Initialise an empty AnimationCall object so everything is always in the
     * same order and with the same content.
     */
    var emptyAnimation = {
        begin: defaultUndefinedDescriptor,
        complete: defaultUndefinedDescriptor,
        delay: defaultNumberDescriptor,
        duration: defaultNumberDescriptor,
        easing: defaultUndefinedDescriptor,
        element: defaultUndefinedDescriptor,
        elements: defaultUndefinedDescriptor,
        ellapsedTime: defaultNumberDescriptor,
        loop: defaultUndefinedDescriptor,
        next: defaultUndefinedDescriptor,
        //		options: defaultUndefinedDescriptor,
        paused: defaultUndefinedDescriptor,
        percentComplete: defaultNumberDescriptor,
        prev: defaultUndefinedDescriptor,
        progress: defaultUndefinedDescriptor,
        properties: defaultUndefinedDescriptor,
        queue: defaultUndefinedDescriptor,
        repeat: defaultUndefinedDescriptor,
        resolver: defaultUndefinedDescriptor,
        timeStart: defaultNumberDescriptor,
        tweens: defaultUndefinedDescriptor,
        display: defaultUndefinedDescriptor,
        visibility: defaultUndefinedDescriptor,
        mobileHA: defaultUndefinedDescriptor
    };
    /**
     * Store unused AnimationCall objects, LIFO style, clear when no animations
     * left - used to prevent GC thrashing.
     */
    var cache;
    /**
     * Get an AnimationCall object. If there is an empty one in the cache then
     * grab that one, otherwise create a new one and initialise everything.
     */
    function getAnimationCall() {
        var animation = cache;
        if (animation) {
            cache = animation.next;
            return Object.defineProperties(animation, emptyAnimation);
        }
        return Object.create(null, emptyAnimation);
    }
    VelocityStatic.getAnimationCall = getAnimationCall;
    /**
     * Remove an animation from the active animation list. If it has a queue set
     * then remember it as the last animation for that queue, and free the one
     * that was previously there by adding it to the cached list of
     * AnimationCall elements we store for re-use. If the animation list is
     * completely empty then instead simply clear the cache so the GC can clear
     * the memory.
     */
    function freeAnimationCall(animation) {
        if (VelocityStatic.State.first === animation) {
            VelocityStatic.State.first = animation.next;
        } else if (animation.prev) {
            animation.prev.next = animation.next;
        }
        if (VelocityStatic.State.last === animation) {
            VelocityStatic.State.last = animation.prev;
        } else if (animation.next) {
            animation.next.prev = animation.prev;
        }
        if (animation.queue !== false) {
            var data = Data(animation.element);
            if (data) {
                var lastAnimationList = data.lastAnimationList, lastAnimation = lastAnimationList[animation.queue];
                lastAnimationList[animation.queue] = animation;
                animation = lastAnimation;
            }
        }
        if (!VelocityStatic.State.first) {
            // If there's no running animations, then allow GC to clean up
            // and stop ticking until something else comes along
            VelocityStatic.State.isTicking = false;
            cache = undefined;
        }
    }
    VelocityStatic.freeAnimationCall = freeAnimationCall;
})(VelocityStatic || (VelocityStatic = {}));

/**********************
 Call Completion
 **********************/
var VelocityStatic;

(function(VelocityStatic) {
    /* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
    function completeCall(activeCall, isStopped) {
        //		console.log("complete", activeCall)
        // TODO: Check if it's not been completed already
        /****************************
         Option: Loop || Repeat
         ****************************/
        var isLoop = activeCall.loop, isRepeat = activeCall.repeat;
        if (!isStopped && (isLoop || isRepeat)) {
            if (isLoop && activeCall.loop !== true) {
                activeCall.loop--;
            }
            if (isRepeat && activeCall.repeat !== true) {
                activeCall.repeat--;
            }
            /* If a rotateX/Y/Z property is being animated by 360 deg with loop:true, swap tween start/end values to enable
             continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */
            var tweens = activeCall.tweens;
            if (isLoop) {
                for (var propertyName in tweens) {
                    var tweenContainer = tweens[propertyName], oldStartValue = tweenContainer.startValue;
                    tweenContainer.startValue = tweenContainer.endValue;
                    tweenContainer.endValue = oldStartValue;
                }
            }
            activeCall.timeStart = VelocityStatic.lastTick;
        } else {
            var elements = activeCall.elements, element = activeCall.element, data_1 = Data(element);
            /*************************
             Element Finalization
             *************************/
            /* If the user set display to "none" (intending to hide the element), set it now that the animation has completed. */
            /* Note: display:none isn't set when calls are manually stopped (via Velocity("stop"). */
            /* Note: Display gets ignored with "reverse" calls and infinite loops, since this behavior would be undesirable. */
            if (activeCall.display === "none") {
                VelocityStatic.CSS.setPropertyValue(element, "display", activeCall.display, 1);
            }
            if (activeCall.visibility === "hidden") {
                VelocityStatic.CSS.setPropertyValue(element, "visibility", activeCall.visibility, 1);
            }
            /* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run
             a non-Velocity-initiated entry, turn off the isAnimating flag. A non-Velocity-initiatied queue entry's logic might alter
             an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
             we check for the existence of our special Velocity.queueEntryFlag declaration, which minifiers won't rename since the flag
             is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
            if (isStopped && data_1 && (activeCall.queue === false || data_1.queueList[activeCall.queue])) {
                /* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
                data_1.isAnimating = false;
                /* Clear the element's rootPropertyValueCache, which will become stale. */
                data_1.rootPropertyValueCache = {};
                var transformHAPropertyExists = false;
                /* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
                VelocityStatic.CSS.Lists.transforms3D.forEach(function(transformName) {
                    var defaultValue = /^scale/.test(transformName) ? 1 : 0, currentValue = data_1.transformCache[transformName];
                    if (data_1.transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
                        transformHAPropertyExists = true;
                        delete data_1.transformCache[transformName];
                    }
                });
                /* Mobile devices have hardware acceleration removed at the end of the animation in order to avoid hogging the GPU's memory. */
                if (activeCall.mobileHA) {
                    transformHAPropertyExists = true;
                    delete data_1.transformCache.translate3d;
                }
                /* Flush the subproperty removals to the DOM. */
                if (transformHAPropertyExists) {
                    VelocityStatic.CSS.flushTransformCache(element);
                }
                /* Remove the "velocity-animating" indicator class. */
                VelocityStatic.CSS.Values.removeClass(element, "velocity-animating");
            }
            /*********************
             Option: Complete
             *********************/
            /* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
            /* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
            if (!isStopped && activeCall.complete) {
                /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                try {
                    activeCall.complete.call(elements, elements);
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
            if (activeCall.resolver) {
                activeCall.resolver(elements);
            }
            /***************
             Dequeueing
             ***************/
            /* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
             which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
             dequeue() must still be called in order to completely clear jQuery's animation queue. */
            if (activeCall.queue !== false) {
                dequeue(element, activeCall.queue);
            }
            /************************
             Cleanup
             ************************/
            VelocityStatic.freeAnimationCall(activeCall);
        }
    }
    VelocityStatic.completeCall = completeCall;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
        /* Note: Velocity applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
        function flushTransformCache(element) {
            var transformString = "", data = Data(element);
            /* Certain browsers require that SVG transforms be applied as an attribute. However, the SVG transform attribute takes a modified version of CSS's transform string
             (units are dropped and, except for skewX/Y, subproperties are merged into their master property -- e.g. scaleX and scaleY are merged into scale(X Y). */
            if ((IE || VelocityStatic.State.isAndroid && !VelocityStatic.State.isChrome) && data && data.isSVG) {
                /* Since transform values are stored in their parentheses-wrapped form, we use a helper function to strip out their numeric values.
                 Further, SVG transform properties only take unitless (representing pixels) values, so it's okay that parseFloat() strips the unit suffixed to the float value. */
                var getTransformFloat = function(transformProperty) {
                    return parseFloat(CSS.getPropertyValue(element, transformProperty));
                };
                /* Create an object to organize all the transforms that we'll apply to the SVG element. To keep the logic simple,
                 we process *all* transform properties -- even those that may not be explicitly applied (since they default to their zero-values anyway). */
                var SVGTransforms = {
                    translate: [ getTransformFloat("translateX"), getTransformFloat("translateY") ],
                    skewX: [ getTransformFloat("skewX") ],
                    skewY: [ getTransformFloat("skewY") ],
                    /* If the scale property is set (non-1), use that value for the scaleX and scaleY values
                     (this behavior mimics the result of animating all these properties at once on HTML elements). */
                    scale: getTransformFloat("scale") !== 1 ? [ getTransformFloat("scale"), getTransformFloat("scale") ] : [ getTransformFloat("scaleX"), getTransformFloat("scaleY") ],
                    /* Note: SVG's rotate transform takes three values: rotation degrees followed by the X and Y values
                     defining the rotation's origin point. We ignore the origin values (default them to 0). */
                    rotate: [ getTransformFloat("rotateZ"), 0, 0 ]
                };
                /* Iterate through the transform properties in the user-defined property map order.
                 (This mimics the behavior of non-SVG transform animation.) */
                for (var transformName in Data(element).transformCache) {
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
                }
            } else {
                var transformValue, perspective;
                /* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
                for (var transformName in Data(element).transformCache) {
                    transformValue = Data(element).transformCache[transformName];
                    /* Transform's perspective subproperty must be set first in order to take effect. Store it temporarily. */
                    if (transformName === "transformPerspective") {
                        perspective = transformValue;
                        return true;
                    }
                    /* IE9 only supports one rotation type, rotateZ, which it refers to as "rotate". */
                    if (IE === 9 && transformName === "rotateZ") {
                        transformName = "rotate";
                    }
                    transformString += transformName + transformValue + " ";
                }
                /* If present, set the perspective subproperty first. */
                if (perspective) {
                    transformString = "perspective" + perspective + " " + transformString;
                }
            }
            CSS.setPropertyValue(element, "transform", transformString, 1);
        }
        CSS.flushTransformCache = flushTransformCache;
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /****************************
         Style Getting & Setting
         ****************************/
        /* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        function getPropertyValue(element, property, rootPropertyValue, forceStyleLookup) {
            /* Get an element's computed property value. */
            /* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
             style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
             *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
            function computePropertyValue(element, property) {
                /* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
                 element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
                 offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
                 We subtract border and padding to get the sum of interior + scrollbar. */
                var computedValue = 0;
                /* Browsers do not return height and width values for elements that are set to display:"none". Thus, we temporarily
                 toggle display to the element type's default value. */
                var toggleDisplay = false;
                if (/^(width|height)$/.test(property) && getPropertyValue(element, "display") === 0) {
                    toggleDisplay = true;
                    CSS.setPropertyValue(element, "display", CSS.Values.getDisplayType(element), 1);
                }
                var revertDisplay = function() {
                    if (toggleDisplay) {
                        CSS.setPropertyValue(element, "display", "none", 1);
                    }
                };
                if (!forceStyleLookup) {
                    if (property === "height" && getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                        var contentBoxHeight = element.offsetHeight - (parseFloat(getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(getPropertyValue(element, "paddingBottom")) || 0);
                        revertDisplay();
                        return contentBoxHeight;
                    } else if (property === "width" && getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                        var contentBoxWidth = element.offsetWidth - (parseFloat(getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(getPropertyValue(element, "paddingRight")) || 0);
                        revertDisplay();
                        return contentBoxWidth;
                    }
                }
                var data = Data(element), computedStyle = data && data.computedStyle ? data.computedStyle : window.getComputedStyle(element, null);
                /* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf
                 of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
                if (data && !data.computedStyle) {
                    data.computedStyle = computedStyle;
                }
                /* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
                 Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
                 So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
                if (property === "borderColor") {
                    property = "borderTopColor";
                }
                /* IE9 has a bug in which the "filter" property must be accessed from computedStyle using the getPropertyValue method
                 instead of a direct property lookup. The getPropertyValue method is slower than a direct lookup, which is why we avoid it by default. */
                if (IE === 9 && property === "filter") {
                    computedValue = computedStyle.getPropertyValue(property);
                } else {
                    computedValue = computedStyle[property];
                }
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
                    var position = computePropertyValue(element, "position");
                    /* GET */
                    if (position === "fixed" || position === "absolute" && /top|left/i.test(property)) {
                        /* Note: this has no pixel unit on its returned values; we re-add it here to conform with computePropertyValue's behavior. */
                        computedValue = _position(element)[property] + "px";
                    }
                }
                return computedValue;
            }
            var propertyValue;
            /* If this is a hooked property (e.g. "clipLeft" instead of the root property of "clip"),
             extract the hook's value from a normalized rootPropertyValue using Hooks.extractValue(). */
            if (CSS.Hooks.registered[property]) {
                var hook = property, hookRoot = CSS.Hooks.getRoot(hook);
                /* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM),
                 query the DOM for the root property's value. */
                if (rootPropertyValue === undefined) {
                    /* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
                    rootPropertyValue = getPropertyValue(element, CSS.Names.prefixCheck(hookRoot)[0]);
                }
                /* If this root has a normalization registered, peform the associated normalization extraction. */
                if (CSS.Normalizations.registered[hookRoot]) {
                    rootPropertyValue = CSS.Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
                }
                /* Extract the hook's value. */
                propertyValue = CSS.Hooks.extractValue(hook, rootPropertyValue);
            } else if (CSS.Normalizations.registered[property]) {
                var normalizedPropertyName, normalizedPropertyValue;
                normalizedPropertyName = CSS.Normalizations.registered[property]("name", element);
                /* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache.
                 At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
                 This is because parsing 3D transform matrices is not always accurate and would bloat our codebase;
                 thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
                if (normalizedPropertyName !== "transform") {
                    normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]);
                    /* GET */
                    /* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
                    if (CSS.Values.isCSSNullValue(normalizedPropertyValue) && CSS.Hooks.templates[property]) {
                        normalizedPropertyValue = CSS.Hooks.templates[property][1];
                    }
                }
                propertyValue = CSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
            }
            /* If a (numeric) value wasn't produced via hook extraction or normalization, query the DOM. */
            if (!/^[\d-]/.test(propertyValue)) {
                /* For SVG elements, dimensional properties (which SVGAttribute() detects) are tweened via
                 their HTML attribute values instead of their CSS style values. */
                var data = Data(element);
                if (data && data.isSVG && CSS.Names.SVGAttribute(property)) {
                    /* Since the height/width attribute values must be set manually, they don't reflect computed values.
                     Thus, we use use getBBox() to ensure we always get values for elements with undefined height/width attributes. */
                    if (/^(height|width)$/i.test(property)) {
                        /* Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM. */
                        try {
                            propertyValue = element.getBBox()[property];
                        } catch (error) {
                            propertyValue = 0;
                        }
                    } else {
                        propertyValue = element.getAttribute(property);
                    }
                } else {
                    propertyValue = computePropertyValue(element, CSS.Names.prefixCheck(property)[0]);
                }
            }
            /* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values),
             convert CSS null-values to an integer of value 0. */
            if (CSS.Values.isCSSNullValue(propertyValue)) {
                propertyValue = 0;
            }
            if (VelocityStatic.debug >= 2) {
                console.log("Get " + property + ": " + propertyValue);
            }
            return propertyValue;
        }
        CSS.getPropertyValue = getPropertyValue;
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /************
         Hooks
         ************/
        /* Hooks allow a subproperty (e.g. "boxShadowBlur") of a compound-value CSS property
         (e.g. "boxShadow: X Y Blur Spread Color") to be animated as if it were a discrete property. */
        /* Note: Beyond enabling fine-grained property animation, hooking is necessary since Velocity only
         tweens properties with single numeric values; unlike CSS transitions, Velocity does not interpolate compound-values. */
        var Hooks;
        (function(Hooks) {
            /********************
             Registration
             ********************/
            /* Templates are a concise way of indicating which subproperties must be individually registered for each compound-value CSS property. */
            /* Each template consists of the compound-value's base name, its constituent subproperty names, and those subproperties' default values. */
            Hooks.templates = {
                textShadow: [ "Color X Y Blur", "black 0px 0px 0px" ],
                boxShadow: [ "Color X Y Blur Spread", "black 0px 0px 0px 0px" ],
                clip: [ "Top Right Bottom Left", "0px 0px 0px 0px" ],
                backgroundPosition: [ "X Y", "0% 0%" ],
                transformOrigin: [ "X Y Z", "50% 50% 0px" ],
                perspectiveOrigin: [ "X Y", "50% 50%" ]
            };
            /* A "registered" hook is one that has been converted from its template form into a live,
             tweenable property. It contains data to associate it with its root property. */
            /* Note: A registered hook looks like this ==> textShadowBlur: [ "textShadow", 3 ],
             which consists of the subproperty's name, the associated root property's name,
             and the subproperty's position in the root's value. */
            Hooks.registered = Object.create(null);
            /* Convert the templates into individual hooks then append them to the registered object above. */
            function register() {
                /* Color hooks registration: Colors are defaulted to white -- as opposed to black -- since colors that are
                 currently set to "transparent" default to their respective template below when color-animated,
                 and white is typically a closer match to transparent than black is. An exception is made for text ("color"),
                 which is almost always set closer to black than white. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    var rgbComponents = CSS.Lists.colors[i] === "color" ? "0 0 0 1" : "255 255 255 1";
                    Hooks.templates[CSS.Lists.colors[i]] = [ "Red Green Blue Alpha", rgbComponents ];
                }
                var rootProperty, hookTemplate, hookNames;
                /* In IE, color values inside compound-value properties are positioned at the end the value instead of at the beginning.
                 Thus, we re-arrange the templates accordingly. */
                if (IE) {
                    for (rootProperty in Hooks.templates) {
                        if (!Hooks.templates.hasOwnProperty(rootProperty)) {
                            continue;
                        }
                        hookTemplate = Hooks.templates[rootProperty];
                        hookNames = hookTemplate[0].split(" ");
                        var defaultValues = hookTemplate[1].match(CSS.RegEx.valueSplit);
                        if (hookNames[0] === "Color") {
                            /* Reposition both the hook's name and its default value to the end of their respective strings. */
                            hookNames.push(hookNames.shift());
                            defaultValues.push(defaultValues.shift());
                            /* Replace the existing template for the hook's root property. */
                            Hooks.templates[rootProperty] = [ hookNames.join(" "), defaultValues.join(" ") ];
                        }
                    }
                }
                /* Hook registration. */
                for (rootProperty in Hooks.templates) {
                    if (!Hooks.templates.hasOwnProperty(rootProperty)) {
                        continue;
                    }
                    hookTemplate = Hooks.templates[rootProperty];
                    hookNames = hookTemplate[0].split(" ");
                    for (var j in hookNames) {
                        if (!hookNames.hasOwnProperty(j)) {
                            continue;
                        }
                        var fullHookName = rootProperty + hookNames[j], hookPosition = j;
                        /* For each hook, register its full name (e.g. textShadowBlur) with its root property (e.g. textShadow)
                         and the hook's position in its template's default value string. */
                        Hooks.registered[fullHookName] = [ rootProperty, hookPosition ];
                    }
                }
            }
            Hooks.register = register;
            /*****************************
             Injection and Extraction
             *****************************/
            /* Look up the root property associated with the hook (e.g. return "textShadow" for "textShadowBlur"). */
            /* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
            function getRoot(property) {
                var hookData = Hooks.registered[property];
                if (hookData) {
                    return hookData[0];
                } else {
                    /* If there was no hook match, return the property name untouched. */
                    return property;
                }
            }
            Hooks.getRoot = getRoot;
            function getUnit(str, start) {
                var unit = (str.substr(start || 0, 5).match(/^[a-z%]+/) || [])[0] || "";
                if (unit && _inArray(CSS.Lists.units, unit)) {
                    return unit;
                }
                return "";
            }
            Hooks.getUnit = getUnit;
            /**
             * Replace any css colour name with its rgba() value. It is possible to use
             * the name within an "rgba(blue, 0.4)" string this way.
             */
            function fixColors(str) {
                return str.replace(/(rgba?\(\s*)?(\b[a-z]+\b)/g, function($0, $1, $2) {
                    if (CSS.Lists.colorNames.hasOwnProperty($2)) {
                        return ($1 ? $1 : "rgba(") + CSS.Lists.colorNames[$2] + ($1 ? "" : ",1)");
                    }
                    return $1 + $2;
                });
            }
            Hooks.fixColors = fixColors;
            /* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that
             the targeted hook can be injected or extracted at its standard position. */
            function cleanRootPropertyValue(rootProperty, rootPropertyValue) {
                /* If the rootPropertyValue is wrapped with "rgb()", "clip()", etc., remove the wrapping to normalize the value before manipulation. */
                if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {
                    rootPropertyValue = rootPropertyValue.match(CSS.RegEx.valueUnwrap)[1];
                }
                /* If rootPropertyValue is a CSS null-value (from which there's inherently no hook value to extract),
                 default to the root's default value as defined in vtemplates. */
                /* Note: CSS null-values include "none", "auto", and "transparent". They must be converted into their
                 zero-values (e.g. textShadow: "none" ==> textShadow: "0px 0px 0px black") for hook manipulation to proceed. */
                if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
                    rootPropertyValue = Hooks.templates[rootProperty][1];
                }
                return rootPropertyValue;
            }
            Hooks.cleanRootPropertyValue = cleanRootPropertyValue;
            /* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
            function extractValue(fullHookName, rootPropertyValue) {
                var hookData = Hooks.registered[fullHookName];
                if (hookData) {
                    var hookRoot = hookData[0], hookPosition = hookData[1];
                    rootPropertyValue = cleanRootPropertyValue(hookRoot, rootPropertyValue);
                    /* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
                    return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            }
            Hooks.extractValue = extractValue;
            /* Inject the hook's value into its root property's value. This is used to piece back together the root property
             once Velocity has updated one of its individually hooked values through tweening. */
            function injectValue(fullHookName, hookValue, rootPropertyValue) {
                var hookData = Hooks.registered[fullHookName];
                if (hookData) {
                    var hookRoot = hookData[0], hookPosition = hookData[1], rootPropertyValueParts, rootPropertyValueUpdated;
                    rootPropertyValue = cleanRootPropertyValue(hookRoot, rootPropertyValue);
                    /* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue,
                     then reconstruct the rootPropertyValue string. */
                    rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
                    rootPropertyValueParts[hookPosition] = hookValue;
                    rootPropertyValueUpdated = rootPropertyValueParts.join(" ");
                    return rootPropertyValueUpdated;
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            }
            Hooks.injectValue = injectValue;
        })(Hooks = CSS.Hooks || (CSS.Hooks = {}));
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /************
         Lists
         ************/
        CSS.Lists = {
            colors: [ "fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor" ],
            transformsBase: [ "translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ" ],
            transforms3D: [ "transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY" ],
            units: [ "%", "em", "ex", "ch", "rem", "vw", "vh", "vmin", "vmax", "cm", "mm", "Q", "in", "pc", "pt", "px", "deg", "grad", "rad", "turn", "s", "ms" ],
            colorNames: {
                aliceblue: "240,248,255",
                antiquewhite: "250,235,215",
                aquamarine: "127,255,212",
                aqua: "0,255,255",
                azure: "240,255,255",
                beige: "245,245,220",
                bisque: "255,228,196",
                black: "0,0,0",
                blanchedalmond: "255,235,205",
                blueviolet: "138,43,226",
                blue: "0,0,255",
                brown: "165,42,42",
                burlywood: "222,184,135",
                cadetblue: "95,158,160",
                chartreuse: "127,255,0",
                chocolate: "210,105,30",
                coral: "255,127,80",
                cornflowerblue: "100,149,237",
                cornsilk: "255,248,220",
                crimson: "220,20,60",
                cyan: "0,255,255",
                darkblue: "0,0,139",
                darkcyan: "0,139,139",
                darkgoldenrod: "184,134,11",
                darkgray: "169,169,169",
                darkgrey: "169,169,169",
                darkgreen: "0,100,0",
                darkkhaki: "189,183,107",
                darkmagenta: "139,0,139",
                darkolivegreen: "85,107,47",
                darkorange: "255,140,0",
                darkorchid: "153,50,204",
                darkred: "139,0,0",
                darksalmon: "233,150,122",
                darkseagreen: "143,188,143",
                darkslateblue: "72,61,139",
                darkslategray: "47,79,79",
                darkturquoise: "0,206,209",
                darkviolet: "148,0,211",
                deeppink: "255,20,147",
                deepskyblue: "0,191,255",
                dimgray: "105,105,105",
                dimgrey: "105,105,105",
                dodgerblue: "30,144,255",
                firebrick: "178,34,34",
                floralwhite: "255,250,240",
                forestgreen: "34,139,34",
                fuchsia: "255,0,255",
                gainsboro: "220,220,220",
                ghostwhite: "248,248,255",
                gold: "255,215,0",
                goldenrod: "218,165,32",
                gray: "128,128,128",
                grey: "128,128,128",
                greenyellow: "173,255,47",
                green: "0,128,0",
                honeydew: "240,255,240",
                hotpink: "255,105,180",
                indianred: "205,92,92",
                indigo: "75,0,130",
                ivory: "255,255,240",
                khaki: "240,230,140",
                lavenderblush: "255,240,245",
                lavender: "230,230,250",
                lawngreen: "124,252,0",
                lemonchiffon: "255,250,205",
                lightblue: "173,216,230",
                lightcoral: "240,128,128",
                lightcyan: "224,255,255",
                lightgoldenrodyellow: "250,250,210",
                lightgray: "211,211,211",
                lightgrey: "211,211,211",
                lightgreen: "144,238,144",
                lightpink: "255,182,193",
                lightsalmon: "255,160,122",
                lightseagreen: "32,178,170",
                lightskyblue: "135,206,250",
                lightslategray: "119,136,153",
                lightsteelblue: "176,196,222",
                lightyellow: "255,255,224",
                limegreen: "50,205,50",
                lime: "0,255,0",
                linen: "250,240,230",
                magenta: "255,0,255",
                maroon: "128,0,0",
                mediumaquamarine: "102,205,170",
                mediumblue: "0,0,205",
                mediumorchid: "186,85,211",
                mediumpurple: "147,112,219",
                mediumseagreen: "60,179,113",
                mediumslateblue: "123,104,238",
                mediumspringgreen: "0,250,154",
                mediumturquoise: "72,209,204",
                mediumvioletred: "199,21,133",
                midnightblue: "25,25,112",
                mintcream: "245,255,250",
                mistyrose: "255,228,225",
                moccasin: "255,228,181",
                navajowhite: "255,222,173",
                navy: "0,0,128",
                oldlace: "253,245,230",
                olivedrab: "107,142,35",
                olive: "128,128,0",
                orangered: "255,69,0",
                orange: "255,165,0",
                orchid: "218,112,214",
                palegoldenrod: "238,232,170",
                palegreen: "152,251,152",
                paleturquoise: "175,238,238",
                palevioletred: "219,112,147",
                papayawhip: "255,239,213",
                peachpuff: "255,218,185",
                peru: "205,133,63",
                pink: "255,192,203",
                plum: "221,160,221",
                powderblue: "176,224,230",
                purple: "128,0,128",
                red: "255,0,0",
                rosybrown: "188,143,143",
                royalblue: "65,105,225",
                saddlebrown: "139,69,19",
                salmon: "250,128,114",
                sandybrown: "244,164,96",
                seagreen: "46,139,87",
                seashell: "255,245,238",
                sienna: "160,82,45",
                silver: "192,192,192",
                skyblue: "135,206,235",
                slateblue: "106,90,205",
                slategray: "112,128,144",
                snow: "255,250,250",
                springgreen: "0,255,127",
                steelblue: "70,130,180",
                tan: "210,180,140",
                teal: "0,128,128",
                thistle: "216,191,216",
                tomato: "255,99,71",
                turquoise: "64,224,208",
                violet: "238,130,238",
                wheat: "245,222,179",
                whitesmoke: "245,245,245",
                white: "255,255,255",
                yellowgreen: "154,205,50",
                yellow: "255,255,0"
            }
        };
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /************************
         CSS Property Names
         ************************/
        CSS.Names = {
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
                if (IE || VelocityStatic.State.isAndroid && !VelocityStatic.State.isChrome) {
                    SVGAttributes += "|transform";
                }
                return new RegExp("^(" + SVGAttributes + ")$", "i").test(property);
            },
            /* Determine whether a property should be set with a vendor prefix. */
            /* If a prefixed version of the property exists, return it. Otherwise, return the original property name.
             If the property is not at all supported by the browser, return a false flag. */
            prefixCheck: function(property) {
                /* If this property has already been checked, return the cached value. */
                if (VelocityStatic.State.prefixMatches[property]) {
                    return [ VelocityStatic.State.prefixMatches[property], true ];
                } else {
                    var vendors = [ "", "Webkit", "Moz", "ms", "O" ];
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
                        var prefixElement = VelocityStatic.State.prefixElement;
                        if (prefixElement && isString(prefixElement.style[propertyPrefixed])) {
                            /* Cache the match. */
                            VelocityStatic.State.prefixMatches[property] = propertyPrefixed;
                            return [ propertyPrefixed, true ];
                        }
                    }
                    /* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
                    return [ property, false ];
                }
            }
        };
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /*******************
         Normalizations
         *******************/
        /* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
         and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
        var Normalizations;
        (function(Normalizations) {
            /**************
             Dimensions
             **************/
            function augmentDimension(name, element, wantInner) {
                var isBorderBox = CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === "border-box";
                if (isBorderBox === (wantInner || false)) {
                    /* in box-sizing mode, the CSS width / height accessors already give the outerWidth / outerHeight. */
                    var i, value, augment = 0, sides = name === "width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ], fields = [ "padding" + sides[0], "padding" + sides[1], "border" + sides[0] + "Width", "border" + sides[1] + "Width" ];
                    for (i = 0; i < fields.length; i++) {
                        value = parseFloat(CSS.getPropertyValue(element, fields[i]));
                        if (!isNaN(value)) {
                            augment += value;
                        }
                    }
                    return wantInner ? -augment : augment;
                }
                return 0;
            }
            function getDimension(name, wantInner) {
                return function(type, element, propertyValue) {
                    switch (type) {
                      case "name":
                        return name;

                      case "extract":
                        return parseFloat(propertyValue) + augmentDimension(name, element, wantInner);

                      case "inject":
                        return parseFloat(propertyValue) - augmentDimension(name, element, wantInner) + "px";
                    }
                };
            }
            /* Normalizations are passed a normalization target (either the property's name, its extracted value, or its injected value),
             the targeted element (which may need to be queried), and the targeted property value. */
            Normalizations.registered = {
                clip: function(type, element, propertyValue) {
                    switch (type) {
                      case "name":
                        return "clip";

                      /* Clip needs to be unwrapped and stripped of its commas during extraction. */
                        case "extract":
                        var extracted;
                        /* If Velocity also extracted this value, skip extraction. */
                        if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                            extracted = propertyValue;
                        } else {
                            /* Remove the "rect()" wrapper. */
                            extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);
                            /* Strip off commas. */
                            extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
                        }
                        return extracted;

                      /* Clip needs to be re-wrapped during injection. */
                        case "inject":
                        return "rect(" + propertyValue + ")";
                    }
                },
                blur: function(type, element, propertyValue) {
                    switch (type) {
                      case "name":
                        return VelocityStatic.State.isFirefox ? "filter" : "-webkit-filter";

                      case "extract":
                        var extracted = parseFloat(propertyValue);
                        /* If extracted is NaN, meaning the value isn't already extracted. */
                        if (!(extracted || extracted === 0)) {
                            var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
                            /* If the filter string had a blur component, return just the blur value and unit type. */
                            if (blurComponent) {
                                extracted = blurComponent[1];
                            } else {
                                extracted = 0;
                            }
                        }
                        return extracted;

                      /* Blur needs to be re-wrapped during injection. */
                        case "inject":
                        /* For the blur effect to be fully de-applied, it needs to be set to "none" instead of 0. */
                        if (!parseFloat(propertyValue)) {
                            return "none";
                        } else {
                            return "blur(" + propertyValue + ")";
                        }
                    }
                },
                /* <=IE8 do not support the standard opacity property. They use filter:alpha(opacity=INT) instead. */
                opacity: function(type, element, propertyValue) {
                    if (IE <= 8) {
                        switch (type) {
                          case "name":
                            return "filter";

                          case "extract":
                            /* <=IE8 return a "filter" value of "alpha(opacity=\d{1,3})".
                                 Extract the value and convert it to a decimal value to match the standard CSS opacity property's formatting. */
                            var extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);
                            if (extracted) {
                                /* Convert to decimal value. */
                                propertyValue = extracted[1] / 100;
                            } else {
                                /* When extracting opacity, default to 1 since a null value means opacity hasn't been set. */
                                propertyValue = 1;
                            }
                            return propertyValue;

                          case "inject":
                            /* Opacified elements are required to have their zoom property set to a non-zero value. */
                            element.style.zoom = "1";
                            /* Setting the filter property on elements with certain font property combinations can result in a
                                 highly unappealing ultra-bolding effect. There's no way to remedy this throughout a tween, but dropping the
                                 value altogether (when opacity hits 1) at leasts ensures that the glitch is gone post-tweening. */
                            if (parseFloat(propertyValue) >= 1) {
                                return "";
                            } else {
                                /* As per the filter property's spec, convert the decimal value to a whole number and wrap the value. */
                                return "alpha(opacity=" + parseInt(parseFloat(propertyValue) * 100, 10) + ")";
                            }
                        }
                    } else {
                        switch (type) {
                          case "name":
                            return "opacity";

                          case "extract":
                            return propertyValue;

                          case "inject":
                            return propertyValue;
                        }
                    }
                },
                innerWidth: getDimension("width", true),
                innerHeight: getDimension("height", true),
                outerWidth: getDimension("width"),
                outerHeight: getDimension("height")
            };
            /*****************************
             Batched Registrations
             *****************************/
            /* Note: Batched normalizations extend the vCSS.Normalizations.registered object. */
            function register() {
                /*****************
                 Transforms
                 *****************/
                /* Transforms are the subproperties contained by the CSS "transform" property. Transforms must undergo normalization
                 so that they can be referenced in a properties map by their individual names. */
                /* Note: When transforms are "set", they are actually assigned to a per-element transformCache. When all transform
                 setting is complete complete, vCSS.flushTransformCache() must be manually called to flush the values to the DOM.
                 Transform setting is batched in this way to improve performance: the transform style only needs to be updated
                 once when multiple transform subproperties are being animated simultaneously. */
                /* Note: IE9 and Android Gingerbread have support for 2D -- but not 3D -- transforms. Since animating unsupported
                 transform properties results in the browser ignoring the *entire* transform string, we prevent these 3D values
                 from being normalized for these browsers so that tweening skips these properties altogether
                 (since it will ignore them as being unsupported by the browser.) */
                if ((!IE || IE > 9) && !VelocityStatic.State.isGingerbread) {
                    /* Note: Since the standalone CSS "perspective" property and the CSS transform "perspective" subproperty
                     share the same name, the latter is given a unique token within Velocity: "transformPerspective". */
                    CSS.Lists.transformsBase = CSS.Lists.transformsBase.concat(CSS.Lists.transforms3D);
                }
                for (var i = 0; i < CSS.Lists.transformsBase.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
                     paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
                    (function() {
                        var transformName = CSS.Lists.transformsBase[i];
                        CSS.Normalizations.registered[transformName] = function(type, element, propertyValue) {
                            switch (type) {
                              /* The normalized property name is the parent "transform" property -- the property that is actually set in vCSS. */
                                case "name":
                                return "transform";

                              /* Transform values are cached onto a per-element transformCache object. */
                                case "extract":
                                /* If this transform has yet to be assigned a value, return its null value. */
                                if (Data(element) === undefined || Data(element).transformCache[transformName] === undefined) {
                                    /* Scale vCSS.Lists.transformsBase default to 1 whereas all other transform properties default to 0. */
                                    return /^scale/i.test(transformName) ? 1 : 0;
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
                                    if (VelocityStatic.State.isAndroid && Data(element).transformCache[transformName] === undefined && propertyValue < 1) {
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
            }
            Normalizations.register = register;
        })(Normalizations = CSS.Normalizations || (CSS.Normalizations = {}));
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /*************
         RegEx
         *************/
        CSS.RegEx = {
            isHex: /^#([A-f\d]{3}){1,2}$/i,
            /* Unwrap a property value's surrounding text, e.g. "rgba(4, 3, 2, 1)" ==> "4, 3, 2, 1" and "rect(4px 3px 2px 1px)" ==> "4px 3px 2px 1px". */
            valueUnwrap: /^[A-z]+\((.*)\)$/i,
            wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
            /* Split a multi-value property into an array of subvalues, e.g. "rgba(4, 3, 2, 1) 4px 3px 2px 1px" ==> [ "rgba(4, 3, 2, 1)", "4px", "3px", "2px", "1px" ]. */
            valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
        };
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /****************************
         Style Getting & Setting
         ****************************/
        /* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        function setPropertyValue(element, property, propertyValue, percentComplete, rootPropertyValue, scrollData) {
            var propertyName = property;
            //			if (property === "display") {
            //				if (propertyValue === "none") {
            //					if (percentComplete !== 1) {
            //						element.style[propertyName] = propertyValue;
            //					}
            //					if (propertyValue === "flex") {
            //						var flexValues = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];
            //
            //						flexValues.forEach(function(flexValue) {
            //							CSS.setPropertyValue(element, "display", flexValue, percentComplete);
            //						});
            //					}
            //				}
            //			} else
            if (property === "scroll") {
                /* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
                /* If a container option is present, scroll the container instead of the browser window. */
                if (scrollData.container) {
                    scrollData.container["scroll" + scrollData.direction] = propertyValue;
                } else {
                    if (scrollData.direction === "Left") {
                        window.scrollTo(propertyValue, scrollData.alternateValue);
                    } else {
                        window.scrollTo(scrollData.alternateValue, propertyValue);
                    }
                }
            } else {
                /* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
                 Thus, for now, we merely cache transforms being SET. */
                if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]("name", element) === "transform") {
                    /* Perform a normalization injection. */
                    /* Note: The normalization logic handles the transformCache updating. */
                    CSS.Normalizations.registered[property]("inject", element, propertyValue);
                    propertyName = "transform";
                    propertyValue = Data(element).transformCache[property];
                } else {
                    /* Inject hooks. */
                    if (CSS.Hooks.registered[property]) {
                        var hookName = property, hookRoot = CSS.Hooks.getRoot(property);
                        /* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
                        rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot);
                        /* GET */
                        propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
                        property = hookRoot;
                    }
                    /* Normalize names and values. */
                    if (CSS.Normalizations.registered[property]) {
                        propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
                        property = CSS.Normalizations.registered[property]("name", element);
                    }
                    /* Assign the appropriate vendor prefix before performing an official style update. */
                    propertyName = CSS.Names.prefixCheck(property)[0];
                    /* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
                     Try/catch is avoided for other browsers since it incurs a performance overhead. */
                    if (IE <= 8) {
                        try {
                            element.style[propertyName] = propertyValue;
                        } catch (error) {
                            if (VelocityStatic.debug) {
                                console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]");
                            }
                        }
                    } else {
                        var data = Data(element);
                        if (data && data.isSVG && CSS.Names.SVGAttribute(property)) {
                            /* Note: For SVG attributes, vendor-prefixed property names are never used. */
                            /* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
                            element.setAttribute(property, propertyValue);
                        } else {
                            element.style[propertyName] = propertyValue;
                        }
                    }
                    if (VelocityStatic.debug >= 2) {
                        console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
                    }
                }
            }
            /* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
            return [ propertyName, propertyValue ];
        }
        CSS.setPropertyValue = setPropertyValue;
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        /************************
         CSS Property Values
         ************************/
        CSS.Values = {
            /* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
            hexToRgb: function(hex) {
                var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, rgbParts;
                hex = hex.replace(shortformRegex, function(m, r, g, b) {
                    return r + r + g + g + b + b;
                });
                rgbParts = longformRegex.exec(hex);
                return rgbParts ? [ parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16) ] : [ 0, 0, 0 ];
            },
            isCSSNullValue: function(value) {
                /* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
                 Thus, we check for both falsiness and these special strings. */
                /* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
                 templates as defined as Hooks (for the sake of hook injection/extraction). */
                /* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
                return !value || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value);
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
                } else {
                    return "block";
                }
            },
            /* The class add/remove functions are used to temporarily apply a "velocity-animating" class to elements while they're animating. */
            addClass: function(element, className) {
                if (element) {
                    if (element.classList) {
                        element.classList.add(className);
                    } else if (isString(element.className)) {
                        // Element.className is around 15% faster then set/getAttribute
                        element.className += (element.className.length ? " " : "") + className;
                    } else {
                        // Work around for IE strict mode animating SVG - and anything else that doesn't behave correctly - the same way jQuery does it
                        var currentClass = element.getAttribute(IE <= 7 ? "className" : "class") || "";
                        element.setAttribute("class", currentClass + (currentClass ? " " : "") + className);
                    }
                }
            },
            removeClass: function(element, className) {
                if (element) {
                    if (element.classList) {
                        element.classList.remove(className);
                    } else if (isString(element.className)) {
                        // Element.className is around 15% faster then set/getAttribute
                        // TODO: Need some jsperf tests on performance - can we get rid of the regex and maybe use split / array manipulation?
                        element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
                    } else {
                        // Work around for IE strict mode animating SVG - and anything else that doesn't behave correctly - the same way jQuery does it
                        var currentClass = element.getAttribute(IE <= 7 ? "className" : "class") || "";
                        element.setAttribute("class", currentClass.replace(new RegExp("(^|s)" + className.split(" ").join("|") + "(s|$)", "gi"), " "));
                    }
                }
            }
        };
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    VelocityStatic.data = new WeakMap();
})(VelocityStatic || (VelocityStatic = {}));

function Data(element, value) {
    if (value) {
        VelocityStatic.data.set(element, value);
    } else {
        return VelocityStatic.data.get(element);
    }
}

var VelocityStatic;

(function(VelocityStatic) {
    /* Set to 1 or 2 (most verbose) to output debug info to console. */
    VelocityStatic.debug = false;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    /* Velocity option defaults, which can be overriden by the user. */
    VelocityStatic.defaults = {
        queue: "",
        duration: DURATION_DEFAULT,
        easing: EASING_DEFAULT,
        mobileHA: true,
        /* Advanced: Set to false to prevent property values from being cached between consecutive Velocity-initiated chain calls. */
        cache: true
    };
})(VelocityStatic || (VelocityStatic = {}));

/**************
 Easing
 **************/
/* Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License */
function generateBezier(mX1, mY1, mX2, mY2) {
    var NEWTON_ITERATIONS = 4, NEWTON_MIN_SLOPE = .001, SUBDIVISION_PRECISION = 1e-7, SUBDIVISION_MAX_ITERATIONS = 10, kSplineTableSize = 11, kSampleStepSize = 1 / (kSplineTableSize - 1), float32ArraySupported = "Float32Array" in window;
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

/* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
/* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
 then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
var generateSpringRK4 = function() {
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
    return function springRK4Factory(tension, friction, duration) {
        var initState = {
            x: -1,
            v: 0,
            tension: null,
            friction: null
        }, path = [ 0 ], time_lapsed = 0, tolerance = 1 / 1e4, DT = 16 / 1e3, have_duration, dt, last_state;
        tension = parseFloat(tension) || 500;
        friction = parseFloat(friction) || 20;
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
        return !have_duration ? time_lapsed : function(percentComplete) {
            return path[percentComplete * (path.length - 1) | 0];
        };
    };
}();

/* Step easing generator. */
function generateStep(steps) {
    return function(p) {
        return Math.round(p * steps) * (1 / steps);
    };
}

/* Determine the appropriate easing type given an easing input. */
function getEasing(value, duration) {
    var easing = value;
    /* The easing option can either be a string that references a pre-registered easing,
     or it can be a two-/four-item array of integers to be converted into a bezier/spring function. */
    if (isString(value)) {
        /* Ensure that the easing has been assigned to jQuery's Velocity.Easings object. */
        if (!VelocityStatic.Easings[value]) {
            easing = false;
        }
    } else if (Array.isArray(value)) {
        if (value.length === 1) {
            easing = generateStep(value[0]);
        } else if (value.length === 2) {
            /* springRK4 must be passed the animation's duration. */
            /* Note: If the springRK4 array contains non-numbers, generateSpringRK4() returns an easing
             function generated with default tension and friction values. */
            easing = generateSpringRK4.apply(null, value.concat([ duration ]));
        } else if (value.length === 4) {
            /* Note: If the bezier array contains non-numbers, generateBezier() returns false. */
            easing = generateBezier.apply(null, value);
        } else {
            easing = false;
        }
    } else {
        easing = false;
    }
    /* Revert to the Velocity-wide default easing type, or fall back to "swing" (which is also jQuery's default)
     if the Velocity-wide default has been incorrectly modified. */
    if (easing === false) {
        if (VelocityStatic.Easings[VelocityStatic.defaults.easing]) {
            easing = VelocityStatic.defaults.easing;
        } else {
            easing = EASING_DEFAULT;
        }
    }
    return easing;
}

///<reference path="easing/_all.d.ts" />
var VelocityStatic;

(function(VelocityStatic) {
    VelocityStatic.Easings = {
        /* Basic (same as jQuery) easings. */
        linear: function(p) {
            return p;
        },
        swing: function(p) {
            return .5 - Math.cos(p * Math.PI) / 2;
        },
        /* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
        spring: function(p) {
            return 1 - Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6);
        },
        /* Common names */
        ease: generateBezier(.25, .1, .25, 1),
        easeIn: generateBezier(.42, 0, 1, 1),
        easeOut: generateBezier(0, 0, .58, 1),
        easeInOut: generateBezier(.42, 0, .58, 1),
        easeInSine: generateBezier(.47, 0, .745, .715),
        easeOutSine: generateBezier(.39, .575, .565, 1),
        easeInOutSine: generateBezier(.445, .05, .55, .95),
        easeInQuad: generateBezier(.55, .085, .68, .53),
        easeOutQuad: generateBezier(.25, .46, .45, .94),
        easeInOutQuad: generateBezier(.455, .03, .515, .955),
        easeInCubic: generateBezier(.55, .055, .675, .19),
        easeOutCubic: generateBezier(.215, .61, .355, 1),
        easeInOutCubic: generateBezier(.645, .045, .355, 1),
        easeInQuart: generateBezier(.895, .03, .685, .22),
        easeOutQuart: generateBezier(.165, .84, .44, 1),
        easeInOutQuart: generateBezier(.77, 0, .175, 1),
        easeInQuint: generateBezier(.755, .05, .855, .06),
        easeOutQuint: generateBezier(.23, 1, .32, 1),
        easeInOutQuint: generateBezier(.86, 0, .07, 1),
        easeInExpo: generateBezier(.95, .05, .795, .035),
        easeOutExpo: generateBezier(.19, 1, .22, 1),
        easeInOutExpo: generateBezier(1, 0, 0, 1),
        easeInCirc: generateBezier(.6, .04, .98, .335),
        easeOutCirc: generateBezier(.075, .82, .165, 1),
        easeInOutCirc: generateBezier(.785, .135, .15, .86),
        /* Dashed names */
        "ease-in": generateBezier(.42, 0, 1, 1),
        "ease-out": generateBezier(0, 0, .58, 1),
        "ease-in-out": generateBezier(.42, 0, .58, 1)
    };
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    /* A parallel to jQuery's $.css(), used for getting/setting Velocity's hooked CSS properties. */
    function hook(elements, arg2, arg3) {
        var value;
        elements = sanitizeElements(elements);
        elements.forEach(function(element) {
            /* Initialize Velocity's per-element data cache if this element hasn't previously been animated. */
            if (Data(element) === undefined) {
                VelocityStatic.init(element);
            }
            /* Get property value. If an element set was passed in, only return the value for the first element. */
            if (arg3 === undefined) {
                if (value === undefined) {
                    value = VelocityStatic.CSS.getPropertyValue(element, arg2);
                }
            } else {
                /* sPV returns an array of the normalized propertyName/propertyValue pair used to update the DOM. */
                var adjustedSet = VelocityStatic.CSS.setPropertyValue(element, arg2, arg3, 1);
                /* Transform properties don't automatically set. They have to be flushed to the DOM. */
                if (adjustedSet[0] === "transform") {
                    VelocityStatic.CSS.flushTransformCache(element);
                }
                value = adjustedSet;
            }
        });
        return value;
    }
    VelocityStatic.hook = hook;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    /* A design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache. */
    function init(element) {
        Data(element, {
            /**
             * Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements.
             */
            isSVG: isSVG(element),
            /**
             * Keep track of whether the element is currently being animated by Velocity.
             * This is used to ensure that property values are not transferred between non-consecutive (stale) calls.
             */
            isAnimating: false,
            /**
             * A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle
             */
            computedStyle: null,
            /**
             * The full root property values of each CSS hook being animated on this element are cached so that:
             * 1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
             * 2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values.
             *
             * @deprecated
             */
            rootPropertyValueCache: Object.create(null),
            /**
             * A cache for transform updates, which must be manually flushed via vVelocityStatic.CSS.flushTransformCache().
             *
             * @deprecated
             */
            transformCache: Object.create(null),
            /**
             * The queues and their animations
             */
            queueList: Object.create(null),
            /**
             * The last tweens for use as repetitions
             */
            lastAnimationList: Object.create(null)
        });
    }
    VelocityStatic.init = init;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    /* Velocity-wide animation time remapping for testing purposes. */
    VelocityStatic.mock = false;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    /* Pause all animations */
    function pauseAll(queueName) {
        for (var activeCall = VelocityStatic.State.first; activeCall; activeCall = activeCall.next) {
            /* If we have a queueName and this call is not on that queue, skip */
            if (queueName !== undefined && (activeCall.queue !== queueName || activeCall.queue === false)) {
                continue;
            }
            /* Set call to paused */
            activeCall.paused = true;
        }
    }
    VelocityStatic.pauseAll = pauseAll;
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="data.ts" />
/*
 * Simple queue management. Un-named queue is directly within the element data,
 * named queue is within an object within it.
 */
function animate(animation) {
    var State = VelocityStatic.State, prev = State.last;
    animation.prev = prev;
    animation.next = undefined;
    if (prev) {
        prev.next = animation;
    } else {
        State.first = animation;
    }
    State.last = animation;
    if (!State.firstNew) {
        State.firstNew = animation;
    }
}

/**
 * Add an item to an animation queue.
 */
function queue(element, animation, queue) {
    var data = Data(element), last;
    if (queue === false) {
        animate(animation);
    } else {
        if (!isString(queue)) {
            queue = "";
        }
        last = data.queueList[queue];
        if (!last) {
            if (data.queueList[queue] === null) {
                data.queueList[queue] = animation;
            } else {
                data.queueList[queue] = undefined;
                animate(animation);
            }
        } else {
            while (last.next) {
                last = last.next;
            }
            last.next = animation;
            animation.prev = last;
        }
    }
}

/**
 * Start the next animation on this element's queue (named or default).
 *
 * @returns the next animation that is starting.
 */
function dequeue(element, queue, skip) {
    if (queue !== false) {
        var data = Data(element), animation;
        if (!isString(queue)) {
            queue = "";
        }
        animation = data.queueList[queue];
        if (animation) {
            data.queueList[queue] = animation.next || null;
            if (!skip) {
                animate(animation);
            }
        } else {
            delete data.queueList[queue];
        }
        return animation;
    }
}

var VelocityStatic;

(function(VelocityStatic) {
    /* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
    VelocityStatic.Redirects = {};
    /***********************
     Packaged Redirects
     ***********************/
    /* slideUp, slideDown */
    [ "Down", "Up" ].forEach(function(direction) {
        VelocityStatic.Redirects["slide" + direction] = function(element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = __assign({}, options), begin = opts.begin, complete = opts.complete, inlineValues = {}, computedValues = {
                height: "",
                marginTop: "",
                marginBottom: "",
                paddingTop: "",
                paddingBottom: ""
            };
            if (opts.display === undefined) {
                /* Show the element before slideDown begins and hide the element after slideUp completes. */
                /* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */
                opts.display = direction === "Down" ? VelocityStatic.CSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block" : "none";
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
                    var propertyValue = VelocityStatic.CSS.getPropertyValue(element, property);
                    computedValues[property] = direction === "Down" ? [ propertyValue, 0 ] : [ 0, propertyValue ];
                }
                /* Force vertical overflow content to clip so that sliding works as expected. */
                inlineValues.overflow = element.style.overflow;
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
            Velocity(element, computedValues, opts);
        };
    });
    /* fadeIn, fadeOut */
    [ "In", "Out" ].forEach(function(direction) {
        VelocityStatic.Redirects["fade" + direction] = function(element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = __assign({}, options), complete = opts.complete, propertiesMap = {
                opacity: direction === "In" ? 1 : 0
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
                opts.display = direction === "In" ? "auto" : "none";
            }
            Velocity(this, propertiesMap, opts);
        };
    });
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    /************************
     Effect Registration
     ************************/
    /* Animate the expansion/contraction of the elements' parent's height for In/Out effects. */
    function animateParentHeight(elements, direction, totalDuration, stagger) {
        var totalHeightDelta = 0, parentNode;
        /* Sum the total height (including padding and margin) of all targeted elements. */
        (elements.nodeType ? [ elements ] : elements).forEach(function(element, i) {
            if (stagger) {
                /* Increase the totalDuration by the successive delay amounts produced by the stagger option. */
                totalDuration += i * stagger;
            }
            parentNode = element.parentNode;
            var propertiesToSum = [ "height", "paddingTop", "paddingBottom", "marginTop", "marginBottom" ];
            /* If box-sizing is border-box, the height already includes padding and margin */
            if (VelocityStatic.CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === "border-box") {
                propertiesToSum = [ "height" ];
            }
            propertiesToSum.forEach(function(property) {
                totalHeightDelta += parseFloat(VelocityStatic.CSS.getPropertyValue(element, property));
            });
        });
        /* Animate the parent element's height adjustment (with a varying duration multiplier for aesthetic benefits). */
        Velocity(parentNode, {
            height: (direction === "In" ? "+" : "-") + "=" + totalHeightDelta
        }, {
            queue: false,
            easing: "ease-in-out",
            duration: totalDuration * (direction === "In" ? .6 : 1)
        });
    }
    /* Note: RegisterUI is a legacy name. */
    function RegisterEffect(effectName, properties) {
        /* Register a custom redirect for each effect. */
        VelocityStatic.Redirects[effectName] = function(element, redirectOptions, elementsIndex, elementsSize, elements, promiseData, loop) {
            var finalElement = elementsIndex === elementsSize - 1, totalDuration = 0;
            loop = loop || properties.loop;
            if (typeof properties.defaultDuration === "function") {
                properties.defaultDuration = properties.defaultDuration.call(elements, elements);
            } else {
                properties.defaultDuration = parseFloat(properties.defaultDuration);
            }
            /* Get the total duration used, so we can share it out with everything that doesn't have a duration */
            for (var callIndex = 0; callIndex < properties.calls.length; callIndex++) {
                durationPercentage = properties.calls[callIndex][1];
                if (typeof durationPercentage === "number") {
                    totalDuration += durationPercentage;
                }
            }
            var shareDuration = totalDuration >= 1 ? 0 : properties.calls.length ? (1 - totalDuration) / properties.calls.length : 1;
            /* Iterate through each effect's call array. */
            for (callIndex = 0; callIndex < properties.calls.length; callIndex++) {
                var call = properties.calls[callIndex], propertyMap = call[0], redirectDuration = 1e3, durationPercentage = call[1], callOptions = call[2] || {}, opts = {};
                if (redirectOptions.duration !== undefined) {
                    redirectDuration = redirectOptions.duration;
                } else if (properties.defaultDuration !== undefined) {
                    redirectDuration = properties.defaultDuration;
                }
                /* Assign the whitelisted per-call options. */
                opts.duration = redirectDuration * (typeof durationPercentage === "number" ? durationPercentage : shareDuration);
                opts.queue = redirectOptions.queue || "";
                opts.easing = callOptions.easing || "ease";
                opts.delay = parseFloat(callOptions.delay) || 0;
                opts.loop = !properties.loop && callOptions.loop;
                opts.cache = callOptions.cache || true;
                /* Special processing for the first effect call. */
                if (callIndex === 0) {
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
                             and the first RAF tick. */
                            if (direction && direction[0] === "In" && propertyMap.opacity !== undefined) {
                                (elements.nodeType ? [ elements ] : elements).forEach(function(element) {
                                    VelocityStatic.CSS.setPropertyValue(element, "opacity", 0, 1);
                                });
                            }
                            /* Only trigger animateParentHeight() if we're using an In/Out transition. */
                            if (redirectOptions.animateParentHeight && direction) {
                                animateParentHeight(elements, direction[0], redirectDuration + opts.delay, redirectOptions.stagger);
                            }
                        };
                    }
                    /* If the user isn't overriding the display option, default to "auto" for "In"-suffixed transitions. */
                    if (redirectOptions.display !== null) {
                        if (redirectOptions.display !== undefined && redirectOptions.display !== "none") {
                            opts.display = redirectOptions.display;
                        } else if (/In$/.test(effectName)) {
                            /* Inline elements cannot be subjected to transforms, so we switch them to inline-block. */
                            var defaultDisplay = VelocityStatic.CSS.Values.getDisplayType(element);
                            opts.display = defaultDisplay === "inline" ? "inline-block" : defaultDisplay;
                        }
                    }
                    if (redirectOptions.visibility && redirectOptions.visibility !== "hidden") {
                        opts.visibility = redirectOptions.visibility;
                    }
                }
                /* Special processing for the last effect call. */
                if (callIndex === properties.calls.length - 1) {
                    /* Append promise resolving onto the user's redirect callback. */
                    var injectFinalCallbacks = function() {
                        if ((redirectOptions.display === undefined || redirectOptions.display === "none") && /Out$/.test(effectName)) {
                            (elements.nodeType ? [ elements ] : elements).forEach(function(element) {
                                VelocityStatic.CSS.setPropertyValue(element, "display", "none", 1);
                            });
                        }
                        if (redirectOptions.complete) {
                            redirectOptions.complete.call(elements, elements);
                        }
                        if (promiseData) {
                            promiseData.resolver(elements || element);
                        }
                    };
                    opts.complete = function() {
                        if (loop) {
                            VelocityStatic.Redirects[effectName](element, redirectOptions, elementsIndex, elementsSize, elements, promiseData, loop === true ? true : Math.max(0, loop - 1));
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
                                if (VelocityStatic.CSS.Hooks.registered[resetProperty] === undefined && (typeof resetValue === "string" || typeof resetValue === "number")) {
                                    properties.reset[resetProperty] = [ properties.reset[resetProperty], properties.reset[resetProperty] ];
                                }
                            }
                            /* So that the reset values are applied instantly upon the next rAF tick, use a zero duration and parallel queueing. */
                            var resetOptions = {
                                duration: 0,
                                queue: false
                            };
                            /* Since the reset option uses up the complete callback, we trigger the user's complete callback at the end of ours. */
                            if (finalElement) {
                                resetOptions.complete = injectFinalCallbacks;
                            }
                            Velocity(element, properties.reset, resetOptions);
                        } else if (finalElement) {
                            injectFinalCallbacks();
                        }
                    };
                    if (redirectOptions.visibility === "hidden") {
                        opts.visibility = redirectOptions.visibility;
                    }
                }
                Velocity(element, propertyMap, opts);
            }
        };
        /* Return the Velocity object so that RegisterUI calls can be chained. */
        return Velocity;
    }
    VelocityStatic.RegisterEffect = RegisterEffect;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    /* Resume all animations */
    function resumeAll(queueName) {
        for (var activeCall = VelocityStatic.State.first; activeCall; activeCall = activeCall.next) {
            /* If we have a queueName and this call is not on that queue, skip */
            if (queueName !== undefined && (activeCall.queue !== queueName || activeCall.queue === false)) {
                continue;
            }
            /* Set call to resumed if it was paused */
            if (activeCall.paused === true) {
                activeCall.paused = false;
            }
        }
    }
    VelocityStatic.resumeAll = resumeAll;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    /*********************
     Sequence Running
     **********************/
    /* Note: Sequence calls must use Velocity's single-object arguments syntax. */
    function RunSequence(originalSequence) {
        var sequence = _deepCopyObject([], originalSequence);
        if (sequence.length > 1) {
            sequence.reverse().forEach(function(currentCall, i) {
                var nextCall = sequence[i + 1];
                if (nextCall) {
                    /* Parallel sequence calls (indicated via sequenceQueue:false) are triggered
                     in the previous call's begin callback. Otherwise, chained calls are normally triggered
                     in the previous call's complete callback. */
                    var currentCallOptions = currentCall.o || currentCall.options, nextCallOptions = nextCall.o || nextCall.options;
                    var timing = currentCallOptions && currentCallOptions.sequenceQueue === false ? "begin" : "complete", callbackOriginal = nextCallOptions && nextCallOptions[timing], options = {};
                    options[timing] = function() {
                        var nextCallElements = nextCall.e || nextCall.elements;
                        var elements = nextCallElements.nodeType ? [ nextCallElements ] : nextCallElements;
                        if (callbackOriginal) {
                            callbackOriginal.call(elements, elements);
                        }
                        Velocity(currentCall);
                    };
                    if (nextCall.o) {
                        nextCall.o = __assign({}, nextCallOptions, options);
                    } else {
                        nextCall.options = __assign({}, nextCallOptions, options);
                    }
                }
            });
            sequence.reverse();
        }
        Velocity(sequence[0]);
    }
    VelocityStatic.RunSequence = RunSequence;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    /* Container for page-wide Velocity state data. */
    var State;
    (function(State) {
        State.isClient = window && window === window.window, /* Detect mobile devices to determine if mobileHA should be turned on. */
        State.isMobile = State.isClient && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), 
        /* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
        State.isAndroid = State.isClient && /Android/i.test(navigator.userAgent), State.isGingerbread = State.isClient && /Android 2\.3\.[3-7]/i.test(navigator.userAgent), 
        State.isChrome = State.isClient && window.chrome, State.isFirefox = State.isClient && /Firefox/i.test(navigator.userAgent), 
        /* Create a cached element for re-use when checking for CSS property prefixes. */
        State.prefixElement = State.isClient && document.createElement("div"), /* Cache every prefix match to avoid repeating lookups. */
        State.prefixMatches = {}, /* Retrieve the appropriate scroll anchor and property name for the browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY */
        State.windowScrollAnchor = State.isClient && window.pageYOffset !== undefined, /* Cache the anchor used for animating window scrolling. */
        State.scrollAnchor = State.windowScrollAnchor ? window : !State.isClient || document.documentElement || document.body.parentNode || document.body, 
        /* Cache the browser-specific property names associated with the scroll anchor. */
        State.scrollPropertyLeft = State.windowScrollAnchor ? "pageXOffset" : "scrollLeft", 
        State.scrollPropertyTop = State.windowScrollAnchor ? "pageYOffset" : "scrollTop", 
        /* Keep track of whether our RAF tick is running. */
        State.isTicking = false;
    })(State = VelocityStatic.State || (VelocityStatic.State = {}));
})(VelocityStatic || (VelocityStatic = {}));

///<reference path="state.ts" />
/************
 Tick
 ************/
var VelocityStatic;

(function(VelocityStatic) {
    /**************
     Timing
     **************/
    var ticker, /**
     * Shim for window.performance in case it doesn't exist
     */
    performance = function() {
        var perf = window.performance || {};
        if (typeof perf.now !== "function") {
            var nowOffset = perf.timing && perf.timing.navigationStart ? perf.timing.navigationStart : _now();
            perf.now = function() {
                return _now() - nowOffset;
            };
        }
        return perf;
    }(), /* rAF shim. Gist: https://gist.github.com/julianshapiro/9497513 */
    rAFShim = ticker = function() {
        return window.requestAnimationFrame || function(callback) {
            /* Dynamically set delay on a per-tick basis to match 60fps. */
            /* Based on a technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
            var timeCurrent = performance.now(), // High precision if we can
            timeDelta = Math.max(0, 1e3 / 60 - (timeCurrent - VelocityStatic.lastTick));
            return setTimeout(function() {
                callback(timeCurrent + timeDelta);
            }, timeDelta);
        };
    }();
    /**
     * The time that the last animation frame ran at. Set from tick(), and used
     * for missing rAF (ie, when not in focus etc).
     */
    VelocityStatic.lastTick = 0;
    /* Inactive browser tabs pause rAF, which results in all active animations immediately sprinting to their completion states when the tab refocuses.
     To get around this, we dynamically switch rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus. We skip this for mobile
     devices to avoid wasting battery power on inactive tabs. */
    /* Note: Tab focus detection doesn't work on older versions of IE, but that's okay since they don't support rAF to begin with. */
    if (!VelocityStatic.State.isMobile && document.hidden !== undefined) {
        var updateTicker = function() {
            /* Reassign the rAF function (which the global tick() function uses) based on the tab's focus state. */
            if (document.hidden) {
                ticker = function(callback) {
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
    /* Note: All calls to Velocity are pushed to the Velocity.State.calls array, which is fully iterated through upon each tick. */
    function tick(timestamp) {
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
            var timeCurrent = VelocityStatic.lastTick = timestamp && timestamp !== true ? timestamp : performance.now(), activeCall = VelocityStatic.State.first, nextCall, percentComplete, tween, easing, hasProgress, hasComplete, expandPattern = function($0, index, round) {
                if (percentComplete < 1) {
                    var startValue = tween.startValue[index], tweenDelta = tween.endValue[index] - startValue, result = startValue + tweenDelta * easing(percentComplete, activeCall, tweenDelta);
                } else {
                    result = tween.endValue[index];
                }
                return round ? Math.round(result) : result;
            };
            var _loop_1 = function() {
                nextCall = activeCall.next;
                /************************
                 Call-Wide Variables
                 ************************/
                var element = activeCall.element, data_2 = Data(element);
                //				console.log("activeCall tick", activeCall, data)
                /* Check to see if this element has been deleted midway through the animation by checking for the
                 continued existence of its data cache. If it's gone then end this animation. */
                if (!data_2) {
                    VelocityStatic.freeAnimationCall(activeCall);
                    return "continue";
                }
                var timeStart = activeCall.timeStart, paused = activeCall.paused, delay = activeCall.delay, firstTick = !timeStart;
                /* If timeStart is undefined, then this is the first time that this call has been processed by tick().
                 We assign timeStart now so that its value is as close to the real animation start time as possible.
                 (Conversely, had timeStart been defined when this call was added to Velocity.State.calls, the delay
                 between that time and now would cause the first few frames of the tween to be skipped since
                 percentComplete is calculated relative to timeStart.) */
                /* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
                 first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
                 same style value as the element's current value. */
                if (firstTick) {
                    activeCall.timeStart = timeStart = timeCurrent - 16;
                    /* Apply the "velocity-animating" indicator class. */
                    VelocityStatic.CSS.Values.addClass(element, "velocity-animating");
                }
                /* If a pause key is present, skip processing unless it has been set to resume */
                if (paused === true) {
                    return "continue";
                } else if (paused === false) {
                    /* Update the time start to accomodate the paused completion amount */
                    timeStart = activeCall.timeStart = Math.round(timeCurrent - activeCall.ellapsedTime - 16);
                    /* Remove pause key after processing */
                    activeCall.paused = undefined;
                }
                // Make sure anything we've delayed doesn't start animating yet
                // There might still be an active delay after something has been un-paused
                if (delay) {
                    if (timeStart + delay > timeCurrent) {
                        return "continue";
                    }
                    activeCall.timeStart = timeStart = timeStart - delay;
                    activeCall.delay = 0;
                }
                /* The tween's completion percentage is relative to the tween's start time, not the tween's start value
                 (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
                 Accordingly, we ensure that percentComplete does not exceed 1. */
                var tweens = activeCall.tweens, tweenDummyValue = null, millisecondsEllapsed = activeCall.ellapsedTime = timeCurrent - timeStart, property = void 0, transformPropertyExists = false;
                percentComplete = activeCall.percentComplete = Math.min(millisecondsEllapsed / activeCall.duration, 1);
                if (percentComplete === 1) {
                    hasComplete = true;
                }
                /**********************************
                 Display & Visibility Toggling
                 **********************************/
                /* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
                 (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
                if (activeCall.display !== undefined && activeCall.display !== null && activeCall.display !== "none") {
                    if (activeCall.display === "flex") {
                        flexValues = [ "-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex" ];
                        flexValues.forEach(function(flexValue) {
                            VelocityStatic.CSS.setPropertyValue(element, "display", flexValue, percentComplete);
                        });
                    }
                    VelocityStatic.CSS.setPropertyValue(element, "display", activeCall.display, percentComplete);
                }
                /* Same goes with the visibility option, but its "none" equivalent is "hidden". */
                if (activeCall.visibility !== undefined && activeCall.visibility !== "hidden") {
                    VelocityStatic.CSS.setPropertyValue(element, "visibility", activeCall.visibility, percentComplete);
                }
                /************************
                 Property Iteration
                 ************************/
                /* For every element, iterate through each property. */
                for (property in tweens) {
                    var currentValue = void 0;
                    tween = tweens[property];
                    /* Easing can either be a pre-genereated function or a string that references a pre-registered easing
                     on the Easings object. In either case, return the appropriate easing *function*. */
                    easing = isString(tween.easing) ? VelocityStatic.Easings[tween.easing] : tween.easing;
                    /******************************
                     Current Value Calculation
                     ******************************/
                    if (isString(tween.pattern)) {
                        // This automatically handles percentComplete===1
                        currentValue = tween.pattern.replace(/{(\d+)(!)?}/g, expandPattern);
                    } else if (percentComplete === 1) {
                        /* If this is the last tick pass (if we've reached 100% completion for this tween),
                         ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
                        currentValue = tween.endValue;
                    } else {
                        /* Otherwise, calculate currentValue based on the current delta from startValue. */
                        var tweenDelta = tween.endValue - tween.startValue;
                        currentValue = tween.startValue + tweenDelta * easing(percentComplete, activeCall, tweenDelta);
                    }
                    if (!firstTick && tween.currentValue === currentValue) {
                        continue;
                    }
                    tween.currentValue = currentValue;
                    /* If we're tweening a fake 'tween' property in order to log transition values, update the one-per-call variable so that
                     it can be passed into the progress callback. */
                    if (property === "tween") {
                        tweenDummyValue = currentValue;
                    } else {
                        /* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
                         for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
                         rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
                         updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
                         subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
                        if (VelocityStatic.CSS.Hooks.registered[property]) {
                            hookRoot = VelocityStatic.CSS.Hooks.getRoot(property);
                            rootPropertyValueCache = data_2.rootPropertyValueCache[hookRoot];
                            if (rootPropertyValueCache) {
                                tween.rootPropertyValue = rootPropertyValueCache;
                            }
                        }
                        /*****************
                         DOM Update
                         *****************/
                        /* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
                        /* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
                        adjustedSetData = VelocityStatic.CSS.setPropertyValue(element, /* SET */ property, tween.currentValue + (IE < 9 && parseFloat(currentValue) === 0 ? "" : tween.unitType), percentComplete, tween.rootPropertyValue, tween.scrollData);
                        /*******************
                         Hooks: Part II
                         *******************/
                        /* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
                        if (VelocityStatic.CSS.Hooks.registered[property]) {
                            /* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
                            if (VelocityStatic.CSS.Normalizations.registered[hookRoot]) {
                                data_2.rootPropertyValueCache[hookRoot] = VelocityStatic.CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
                            } else {
                                data_2.rootPropertyValueCache[hookRoot] = adjustedSetData[1];
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
                    /****************
                     mobileHA
                     ****************/
                    /* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
                     It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
                    if (activeCall.mobileHA) {
                        /* Don't set the null transform hack if we've already done so. */
                        if (data_2.transformCache.translate3d === undefined) {
                            /* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
                            data_2.transformCache.translate3d = "(0px, 0px, 0px)";
                            transformPropertyExists = true;
                        }
                    }
                    if (transformPropertyExists) {
                        VelocityStatic.CSS.flushTransformCache(element);
                    }
                }
                /* The non-"none" display value is only applied to an element once -- when its associated call is first ticked through.
                 Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
                if (activeCall.display !== undefined && activeCall.display !== "none") {
                    activeCall.display = false;
                }
                if (activeCall.visibility !== undefined && activeCall.visibility !== "hidden") {
                    activeCall.visibility = false;
                }
                if (activeCall.progress) {
                    hasProgress = true;
                }
            };
            var flexValues, hookRoot, rootPropertyValueCache, adjustedSetData;
            //			console.log("tick", timestamp, activeCall, State)
            /********************
             Call Iteration
             ********************/
            /* Iterate through each active call. */
            for (;activeCall && activeCall !== VelocityStatic.State.firstNew; activeCall = nextCall) {
                _loop_1();
            }
            if (hasProgress) {
                for (activeCall = VelocityStatic.State.first; activeCall && activeCall !== VelocityStatic.State.firstNew; activeCall = nextCall) {
                    nextCall = activeCall.next;
                    /* Pass the elements and the timing data (percentComplete, msRemaining, timeStart, tweenDummyValue) into the progress callback. */
                    if (activeCall.progress) {
                        activeCall.progress.call(activeCall.elements, activeCall.elements, activeCall.percentComplete, Math.max(0, activeCall.timeStart + activeCall.duration - timeCurrent), activeCall.timeStart, (activeCall.tweens["tween"] || {}).currentValue);
                    }
                }
            }
            if (hasComplete) {
                for (activeCall = VelocityStatic.State.first; activeCall && activeCall !== VelocityStatic.State.firstNew; activeCall = nextCall) {
                    nextCall = activeCall.next;
                    /* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
                    if (activeCall.percentComplete === 1) {
                        VelocityStatic.completeCall(activeCall);
                    }
                }
            }
        }
        expandTweens();
        /* Note: completeCall() sets the isTicking flag to false when the last call on Velocity.State.calls has completed. */
        if (VelocityStatic.State.isTicking) {
            ticker(tick);
        }
    }
    VelocityStatic.tick = tick;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    /* Use rAF high resolution timestamp when available */
    VelocityStatic.timestamp = true;
})(VelocityStatic || (VelocityStatic = {}));

/**
 * Expand all queued animations that haven't gone yet
 *
 * This will automatically expand the properties map for any recently added
 * animations so that the start and end values are correct
 */
function expandTweens() {
    var State = VelocityStatic.State, activeCall = State.firstNew;
    var _loop_2 = function() {
        var elements = activeCall.elements, elementsLength = elements.length, element = activeCall.element, elementArrayIndex = elements.indexOf(element);
        /*******************
         Option: Begin
         *******************/
        /* The begin callback is fired once per call -- not once per elemenet -- and is passed the full raw DOM element set as both its context and its first argument. */
        if (activeCall.begin) {
            /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
            try {
                activeCall.begin.call(elements, elements);
            } catch (error) {
                setTimeout(function() {
                    throw error;
                }, 1);
            }
        }
        /* Ensure each element in a set has a nodeType (is a real element) to avoid throwing errors. */
        if (isNode(element)) {
            var data_3 = Data(element), lastAnimation_1, /* A container for the processed data associated with each property in the propertyMap.
             (Each property in the map produces its own "tween".) */
            propertiesMap = activeCall.properties;
            /*****************************************
             Tween Data Construction (for Scroll)
             *****************************************/
            /* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Velocity as if it were a standard CSS property animation. */
            //			if (action === "scroll") {
            //				/* The scroll action uniquely takes an optional "offset" option -- specified in pixels -- that offsets the targeted scroll position. */
            //				var scrollDirection = (/^x$/i.test(opts.axis) ? "Left" : "Top"),
            //					scrollOffset = parseFloat(opts.offset as any as string) || 0,
            //					scrollPositionCurrent,
            //					scrollPositionCurrentAlternate,
            //					scrollPositionEnd;
            //
            //				/* Scroll also uniquely takes an optional "container" option, which indicates the parent element that should be scrolled --
            //				 as opposed to the browser window itself. This is useful for scrolling toward an element that's inside an overflowing parent element. */
            //				if (opts.container) {
            //					/* Ensure that either a jQuery object or a raw DOM element was passed in. */
            //					if (isWrapped(opts.container) || isNode(opts.container)) {
            //						/* Extract the raw DOM element from the jQuery wrapper. */
            //						opts.container = opts.container[0] || opts.container;
            //						/* Note: Unlike other properties in Velocity, the browser's scroll position is never cached since it so frequently changes
            //						 (due to the user's natural interaction with the page). */
            //						scrollPositionCurrent = opts.container["scroll" + scrollDirection]; /* GET */
            //
            //						/* _position() values are relative to the viewport (without taking into account the container's true dimensions
            //						 -- say, for example, if the container was not overflowing). Thus, the scroll end value is the sum of the child element's position *and*
            //						 the scroll container's current scroll position. */
            //						scrollPositionEnd = (scrollPositionCurrent + _position(element)[scrollDirection.toLowerCase()]) + scrollOffset; /* GET */
            //						/* If a value other than a jQuery object or a raw DOM element was passed in, default to null so that this option is ignored. */
            //					} else {
            //						opts.container = null;
            //					}
            //				} else {
            //					/* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using
            //					 the appropriate cached property names (which differ based on browser type). */
            //					scrollPositionCurrent = VelocityStatic.State.scrollAnchor[VelocityStatic.State["scrollProperty" + scrollDirection]]; /* GET */
            //					/* When scrolling the browser window, cache the alternate axis's current value since window.scrollTo() doesn't let us change only one value at a time. */
            //					scrollPositionCurrentAlternate = VelocityStatic.State.scrollAnchor[VelocityStatic.State["scrollProperty" + (scrollDirection === "Left" ? "Top" : "Left")]]; /* GET */
            //
            //					/* Unlike $.position(), $.offset() values are relative to the browser window's true dimensions -- not merely its currently viewable area --
            //					 and therefore end values do not need to be compounded onto current values. */
            //					scrollPositionEnd = _position(element)[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
            //				}
            //
            //				/* Since there's only one format that scroll's associated tweensContainer can take, we create it manually. */
            //				tweensContainer = {
            //					scroll: {
            //						rootPropertyValue: false,
            //						startValue: scrollPositionCurrent,
            //						currentValue: scrollPositionCurrent,
            //						endValue: scrollPositionEnd,
            //						unitType: "",
            //						easing: opts.easing,
            //						scrollData: {
            //							container: opts.container,
            //							direction: scrollDirection,
            //							alternateValue: scrollPositionCurrentAlternate
            //						}
            //					},
            //					element: element
            //				};
            //
            //				if (VelocityStatic.debug) {
            //					console.log("tweensContainer (scroll): ", (tweensContainer as any).scroll, element);
            //				}
            //
            //				/******************************************
            //				 Tween Data Construction (for Reverse)
            //				 ******************************************/
            //
            //				/* Reverse acts like a "start" action in that a property map is animated toward. The only difference is
            //				 that the property map used for reverse is the inverse of the map used in the previous call. Thus, we manipulate
            //				 the previous call to construct our new map: use the previous map's end values as our new map's start values. Copy over all other data. */
            //				/* Note: Reverse can be directly called via the "reverse" parameter, or it can be indirectly triggered via the loop option. (Loops are composed of multiple reverses.) */
            //				/* Note: Reverse calls do not need to be consecutively chained onto a currently-animating element in order to operate on cached values;
            //				 there is no harm to reverse being called on a potentially stale data cache since reverse's behavior is simply defined
            //				 as reverting to the element's values as they were prior to the previous *Velocity* call. */
            //			} else
            //		if (action === "reverse") {
            //
            //			/* Abort if there is no prior animation data to reverse to. */
            //			if (!data) {
            //				return;
            //			}
            //
            //			if (!data.tweensContainer) {
            //				/* Dequeue the element so that this queue entry releases itself immediately, allowing subsequent queue entries to run. */
            //				dequeue(element, isString(opts.queue) ? opts.queue : undefined);
            //
            //				return;
            //			} else {
            //				/*********************
            //				 Options Parsing
            //				 *********************/
            //
            //				/* If the element was hidden via the display option in the previous call,
            //				 revert display to "auto" prior to reversal so that the element is visible again. */
            //				if (data.opts.display === "none") {
            //					data.opts.display = "auto";
            //				}
            //
            //				if (data.opts.visibility === "hidden") {
            //					data.opts.visibility = "visible";
            //				}
            //
            //				/* If the loop option was set in the previous call, disable it so that "reverse" calls aren't recursively generated.
            //				 Further, remove the previous call's callback options; typically, users do not want these to be refired. */
            //				data.opts.loop = false;
            //				data.opts.begin = null;
            //				data.opts.complete = null;
            //
            //				/* Since we're extending an opts object that has already been extended with the defaults options object,
            //				 we remove non-explicitly-defined properties that are auto-assigned values. */
            //				if (!options.easing) {
            //					delete opts.easing;
            //				}
            //
            //				if (!options.duration) {
            //					delete opts.duration;
            //				}
            //
            //				/* The opts object used for reversal is an extension of the options object optionally passed into this
            //				 reverse call plus the options used in the previous Velocity call. */
            //				opts = {...data.opts, ...opts};
            //
            //				/*************************************
            //				 Tweens Container Reconstruction
            //				 *************************************/
            //
            //				/* Create a deep copy (indicated via the true flag) of the previous call's tweensContainer. */
            //				lastTweensContainer = _deepCopyObject({}, data ? data.tweensContainer : null);
            //
            //				/* Manipulate the previous tweensContainer by replacing its end values and currentValues with its start values. */
            //				for (var lastTween in lastTweensContainer) {
            //					/* In addition to tween data, tweensContainers contain an element property that we ignore here. */
            //					if (lastTweensContainer.hasOwnProperty(lastTween) && lastTween !== "element") {
            //						var lastStartValue = lastTweensContainer[lastTween].startValue;
            //
            //						lastTweensContainer[lastTween].startValue = lastTweensContainer[lastTween].currentValue = lastTweensContainer[lastTween].endValue;
            //						lastTweensContainer[lastTween].endValue = lastStartValue;
            //
            //						/* Easing is the only option that embeds into the individual tween data (since it can be defined on a per-property basis).
            //						 Accordingly, every property's easing value must be updated when an options object is passed in with a reverse call.
            //						 The side effect of this extensibility is that all per-property easing values are forcefully reset to the new value. */
            //						if (!isEmptyObject(options)) {
            //							lastTweensContainer[lastTween].easing = opts.easing;
            //						}
            //
            //						if (VelocityStatic.debug) {
            //							console.log("reverse tweensContainer (" + lastTween + "): " + JSON.stringify(lastTweensContainer[lastTween]), element);
            //						}
            //					}
            //				}
            //
            //				tweensContainer = lastTweensContainer;
            //			}
            //
            //			/*****************************************
            //			 Tween Data Construction (for Start)
            //			 *****************************************/
            //
            //		} else if (action === "start") {
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
            /* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale)
             to transfer over end values to use as start values. If it's set to true and there is a previous
             Velocity call to pull values from, do so. */
            if (data_3 && data_3.isAnimating && activeCall.queue !== false) {
                lastAnimation_1 = data_3.lastAnimationList[activeCall.queue];
            }
            /***************************
             Tween Data Calculation
             ***************************/
            /* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
            /* Property map values can either take the form of 1) a single value representing the end value,
             or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
             The optional third parameter is a forcefed startValue to be used instead of querying the DOM for
             the element's current value. Read Velocity's docmentation to learn more about forcefeeding: VelocityJS.org/#forcefeeding */
            function parsePropertyValue(valueData, skipResolvingEasing) {
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
                    if (!Array.isArray(valueData[1]) && /^[\d-]/.test(valueData[1]) || isFunction(valueData[1]) || VelocityStatic.CSS.RegEx.isHex.test(valueData[1])) {
                        startValue = valueData[1];
                    } else if (isString(valueData[1]) && !VelocityStatic.CSS.RegEx.isHex.test(valueData[1]) && VelocityStatic.Easings[valueData[1]] || Array.isArray(valueData[1])) {
                        easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1], activeCall.duration);
                        /* Don't bother validating startValue's value now since the ensuing property cycling logic inherently does that. */
                        startValue = valueData[2];
                    } else {
                        startValue = valueData[1] || valueData[2];
                    }
                } else {
                    endValue = valueData;
                }
                /* Default to the call's easing if a per-property easing type was not defined. */
                if (!skipResolvingEasing) {
                    easing = easing || activeCall.easing;
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
                return [ endValue || 0, easing, startValue ];
            }
            fixPropertyValue = function(property, valueData) {
                /* In case this property is a hook, there are circumstances where we will intend to work on the hook's root property and not the hooked subproperty. */
                var rootProperty = VelocityStatic.CSS.Hooks.getRoot(property), rootPropertyValue = false, /* Parse out endValue, easing, and startValue from the property's data. */
                endValue = valueData[0], easing = valueData[1], startValue = valueData[2], pattern;
                /**************************
                 Start Value Sourcing
                 **************************/
                /* Other than for the dummy tween property, properties that are not supported by the browser (and do not have an associated normalization) will
                 inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead.
                 Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */
                /* Note: Since SVG elements have some of their properties directly applied as HTML attributes,
                 there is no way to check for their explicit browser support, and so we skip skip this check for them. */
                if ((!data_3 || !data_3.isSVG) && rootProperty !== "tween" && VelocityStatic.CSS.Names.prefixCheck(rootProperty)[1] === false && VelocityStatic.CSS.Normalizations.registered[rootProperty] === undefined) {
                    if (VelocityStatic.debug) {
                        console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");
                    }
                    return;
                }
                /* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being
                 animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
                 a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
                if ((activeCall.display !== undefined && activeCall.display !== null && activeCall.display !== "none" || activeCall.visibility !== undefined && activeCall.visibility !== "hidden") && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
                    startValue = 0;
                }
                /* If values have been transferred from the previous Velocity call, extract the endValue and rootPropertyValue
                 for all of the current call's properties that were *also* animated in the previous call. */
                /* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
                if (lastAnimation_1 && lastAnimation_1.tweens[property]) {
                    if (startValue === undefined) {
                        startValue = lastAnimation_1.tweens[property].endValue + lastAnimation_1.tweens[property].unitType;
                    }
                    /* The previous call's rootPropertyValue is extracted from the element's data cache since that's the
                     instance of rootPropertyValue that gets freshly updated by the tweening process, whereas the rootPropertyValue
                     attached to the incoming lastTweensContainer is equal to the root property's value prior to any tweening. */
                    rootPropertyValue = data_3.rootPropertyValueCache[rootProperty];
                } else {
                    /* Handle hooked properties. */
                    if (VelocityStatic.CSS.Hooks.registered[property]) {
                        if (startValue === undefined) {
                            rootPropertyValue = VelocityStatic.CSS.getPropertyValue(element, rootProperty);
                            /* GET */
                            /* Note: The following getPropertyValue() call does not actually trigger a DOM query;
                             getPropertyValue() will extract the hook from rootPropertyValue. */
                            startValue = VelocityStatic.CSS.getPropertyValue(element, property, rootPropertyValue);
                        } else {
                            /* Grab this hook's zero-value template, e.g. "0px 0px 0px black". */
                            rootPropertyValue = VelocityStatic.CSS.Hooks.templates[rootProperty][1];
                        }
                    } else if (startValue === undefined) {
                        startValue = VelocityStatic.CSS.getPropertyValue(element, property);
                    }
                }
                /**************************
                 Value Data Extraction
                 **************************/
                var separatedValue, endValueUnitType, startValueUnitType, operator = false;
                /* Separates a property value into its numeric value and its unit type. */
                var separateValue = function(property, value) {
                    var unitType, numericValue;
                    numericValue = (value || "0").toString().toLowerCase().replace(/[%A-z]+$/, function(match) {
                        /* Grab the unit type. */
                        unitType = match;
                        /* Strip the unit type off of value. */
                        return "";
                    });
                    /* If no unit type was supplied, assign one that is appropriate for this property (e.g. "deg" for rotateZ or "px" for width). */
                    if (!unitType) {
                        unitType = VelocityStatic.CSS.Values.getUnitType(property);
                    }
                    return [ numericValue, unitType ];
                };
                if (startValue !== endValue && isString(startValue) && isString(endValue)) {
                    pattern = "";
                    var iStart = 0, // index in startValue
                    iEnd = 0, // index in endValue
                    aStart = [], // array of startValue numbers
                    aEnd = [], // array of endValue numbers
                    inCalc = 0, // Keep track of being inside a "calc()" so we don't duplicate it
                    inRGB = 0, // Keep track of being inside an RGB as we can't use fractional values
                    inRGBA = 0;
                    // Keep track of being inside an RGBA as we must pass fractional for the alpha channel
                    startValue = VelocityStatic.CSS.Hooks.fixColors(startValue);
                    endValue = VelocityStatic.CSS.Hooks.fixColors(endValue);
                    while (iStart < startValue.length && iEnd < endValue.length) {
                        var cStart = startValue[iStart], cEnd = endValue[iEnd];
                        if (/[\d\.-]/.test(cStart) && /[\d\.-]/.test(cEnd)) {
                            var tStart = cStart, // temporary character buffer
                            tEnd = cEnd, // temporary character buffer
                            dotStart = ".", // Make sure we can only ever match a single dot in a decimal
                            dotEnd = ".";
                            // Make sure we can only ever match a single dot in a decimal
                            while (++iStart < startValue.length) {
                                cStart = startValue[iStart];
                                if (cStart === dotStart) {
                                    dotStart = "..";
                                } else if (!/\d/.test(cStart)) {
                                    break;
                                }
                                tStart += cStart;
                            }
                            while (++iEnd < endValue.length) {
                                cEnd = endValue[iEnd];
                                if (cEnd === dotEnd) {
                                    dotEnd = "..";
                                } else if (!/\d/.test(cEnd)) {
                                    break;
                                }
                                tEnd += cEnd;
                            }
                            var uStart = VelocityStatic.CSS.Hooks.getUnit(startValue, iStart), // temporary unit type
                            uEnd = VelocityStatic.CSS.Hooks.getUnit(endValue, iEnd);
                            // temporary unit type
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
                                var nStart = parseFloat(tStart), nEnd = parseFloat(tEnd);
                                pattern += (inCalc < 5 ? "calc" : "") + "(" + (nStart ? "{" + aStart.length + (inRGB ? "!" : "") + "}" : "0") + uStart + " + " + (nEnd ? "{" + (aStart.length + (nStart ? 1 : 0)) + (inRGB ? "!" : "") + "}" : "0") + uEnd + ")";
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
                            if (inCalc === 0 && cStart === "c" || inCalc === 1 && cStart === "a" || inCalc === 2 && cStart === "l" || inCalc === 3 && cStart === "c" || inCalc >= 4 && cStart === "(") {
                                inCalc++;
                            } else if (inCalc && inCalc < 5 || inCalc >= 4 && cStart === ")" && --inCalc < 5) {
                                inCalc = 0;
                            }
                            // Keep track of being inside an rgb() / rgba()
                            if (inRGB === 0 && cStart === "r" || inRGB === 1 && cStart === "g" || inRGB === 2 && cStart === "b" || inRGB === 3 && cStart === "a" || inRGB >= 3 && cStart === "(") {
                                if (inRGB === 3 && cStart === "a") {
                                    inRGBA = 1;
                                }
                                inRGB++;
                            } else if (inRGBA && cStart === ",") {
                                if (++inRGBA > 3) {
                                    inRGB = inRGBA = 0;
                                }
                            } else if (inRGBA && inRGB < (inRGBA ? 5 : 4) || inRGB >= (inRGBA ? 4 : 3) && cStart === ")" && --inRGB < (inRGBA ? 5 : 4)) {
                                inRGB = inRGBA = 0;
                            }
                        } else {
                            inCalc = 0;
                            // TODO: changing units, fixing colours
                            break;
                        }
                    }
                    if (iStart !== startValue.length || iEnd !== endValue.length) {
                        if (VelocityStatic.debug) {
                            console.error('Trying to pattern match mis-matched strings ["' + endValue + '", "' + startValue + '"]');
                        }
                        pattern = undefined;
                    }
                    if (pattern) {
                        if (aStart.length) {
                            if (VelocityStatic.debug) {
                                console.log('Pattern found "' + pattern + '" -> ', aStart, aEnd, "[" + startValue + "," + endValue + "]");
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
                        } else if (/^scale/.test(property)) {
                            endValue = endValue / 100;
                            endValueUnitType = "";
                        } else if (/(Red|Green|Blue)$/i.test(property)) {
                            endValue = endValue / 100 * 255;
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
                //					var calculateUnitRatios = function() {
                //
                //						/************************
                //						 Same Ratio Checks
                //						 ************************/
                //
                //						/* The properties below are used to determine whether the element differs sufficiently from this call's
                //						 previously iterated element to also differ in its unit conversion ratios. If the properties match up with those
                //						 of the prior element, the prior element's conversion ratios are used. Like most optimizations in Velocity,
                //						 this is done to minimize DOM querying. */
                //						var sameRatioIndicators = {
                //							myParent: element.parentNode || document.body, /* GET */
                //							position: VelocityStatic.CSS.getPropertyValue(element, "position"), /* GET */
                //							fontSize: VelocityStatic.CSS.getPropertyValue(element, "fontSize") /* GET */
                //						},
                //							/* Determine if the same % ratio can be used. % is based on the element's position value and its parent's width and height dimensions. */
                //							samePercentRatio = ((sameRatioIndicators.position === callUnitConversionData.lastPosition) && (sameRatioIndicators.myParent === callUnitConversionData.lastParent)),
                //							/* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
                //							sameEmRatio = (sameRatioIndicators.fontSize === callUnitConversionData.lastFontSize);
                //
                //						/* Store these ratio indicators call-wide for the next element to compare against. */
                //						callUnitConversionData.lastParent = sameRatioIndicators.myParent;
                //						callUnitConversionData.lastPosition = sameRatioIndicators.position;
                //						callUnitConversionData.lastFontSize = sameRatioIndicators.fontSize;
                //
                //						/***************************
                //						 Element-Specific Units
                //						 ***************************/
                //
                //						/* Note: IE8 rounds to the nearest pixel when returning CSS values, thus we perform conversions using a measurement
                //						 of 100 (instead of 1) to give our ratios a precision of at least 2 decimal values. */
                //						var measurement = 100,
                //							unitRatios: {[key: string]: any} = {};
                //
                //						if (!sameEmRatio || !samePercentRatio) {
                //							var dummy = data && data.isSVG ? document.createElementNS("http://www.w3.org/2000/svg", "rect") : document.createElement("div");
                //
                //							VelocityStatic.init(dummy);
                //							sameRatioIndicators.myParent.appendChild(dummy);
                //
                //							/* To accurately and consistently calculate conversion ratios, the element's cascaded overflow and box-sizing are stripped.
                //							 Similarly, since width/height can be artificially constrained by their min-/max- equivalents, these are controlled for as well. */
                //							/* Note: Overflow must be also be controlled for per-axis since the overflow property overwrites its per-axis values. */
                //							["overflow", "overflowX", "overflowY"].forEach(function(property) {
                //								VelocityStatic.CSS.setPropertyValue(dummy, property, "hidden");
                //							});
                //							VelocityStatic.CSS.setPropertyValue(dummy, "position", sameRatioIndicators.position);
                //							VelocityStatic.CSS.setPropertyValue(dummy, "fontSize", sameRatioIndicators.fontSize);
                //							VelocityStatic.CSS.setPropertyValue(dummy, "boxSizing", "content-box");
                //
                //							/* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. */
                //							["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"].forEach(function(property) {
                //								VelocityStatic.CSS.setPropertyValue(dummy, property, measurement + "%");
                //							});
                //							/* paddingLeft arbitrarily acts as our proxy property for the em ratio. */
                //							VelocityStatic.CSS.setPropertyValue(dummy, "paddingLeft", measurement + "em");
                //
                //							/* Divide the returned value by the measurement to get the ratio between 1% and 1px. Default to 1 since working with 0 can produce Infinite. */
                //							unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth = (parseFloat(VelocityStatic.CSS.getPropertyValue(dummy, "width", null, true)) || 1) / measurement; /* GET */
                //							unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight = (parseFloat(VelocityStatic.CSS.getPropertyValue(dummy, "height", null, true)) || 1) / measurement; /* GET */
                //							unitRatios.emToPx = callUnitConversionData.lastEmToPx = (parseFloat(VelocityStatic.CSS.getPropertyValue(dummy, "paddingLeft")) || 1) / measurement; /* GET */
                //
                //							sameRatioIndicators.myParent.removeChild(dummy);
                //						} else {
                //							unitRatios.emToPx = callUnitConversionData.lastEmToPx;
                //							unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth;
                //							unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight;
                //						}
                //
                //						/***************************
                //						 Element-Agnostic Units
                //						 ***************************/
                //
                //						/* Whereas % and em ratios are determined on a per-element basis, the rem unit only needs to be checked
                //						 once per call since it's exclusively dependant upon document.body's fontSize. If this is the first time
                //						 that calculateUnitRatios() is being run during this call, remToPx will still be set to its default value of null,
                //						 so we calculate it now. */
                //						if (callUnitConversionData.remToPx === null) {
                //							/* Default to browsers' default fontSize of 16px in the case of 0. */
                //							callUnitConversionData.remToPx = parseFloat(VelocityStatic.CSS.getPropertyValue(document.body, "fontSize")) || 16; /* GET */
                //						}
                //
                //						/* Similarly, viewport units are %-relative to the window's inner dimensions. */
                //						if (callUnitConversionData.vwToPx === null) {
                //							callUnitConversionData.vwToPx = window.innerWidth / 100; /* GET */
                //							callUnitConversionData.vhToPx = window.innerHeight / 100; /* GET */
                //						}
                //
                //						unitRatios.remToPx = callUnitConversionData.remToPx;
                //						unitRatios.vwToPx = callUnitConversionData.vwToPx;
                //						unitRatios.vhToPx = callUnitConversionData.vhToPx;
                //
                //						if (VelocityStatic.debug >= 1) {
                //							console.log("Unit ratios: " + JSON.stringify(unitRatios), element);
                //						}
                //						return unitRatios;
                //					};
                /********************
                 Unit Conversion
                 ********************/
                /* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
                //					if (/[\/*]/.test(operator as any as string)) {
                //						endValueUnitType = startValueUnitType;
                //						/* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType
                //						 is a relative unit (%, em, rem), the values set during tweening will continue to be accurately relative even if the metrics they depend
                //						 on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
                //						 would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
                //						/* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnit */
                //					} else if ((startValueUnitType !== endValueUnitType) && startValue !== 0) {
                //						/* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used for tween values to remain accurate. */
                //						/* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively
                //						 match the underlying metrics if they change, but this is acceptable since we're animating toward invisibility instead of toward visibility,
                //						 which remains past the point of the animation's completion. */
                //						if (endValue === 0) {
                //							endValueUnitType = startValueUnitType;
                //						} else {
                //							/* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing).
                //							 If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
                //							elementUnitConversionData = elementUnitConversionData || calculateUnitRatios();
                //
                //							/* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
                //							/* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element. */
                //							var axis = (/margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property) || property === "x") ? "x" : "y";
                //
                //							/* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process:
                //							 1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit type. */
                //							switch (startValueUnitType) {
                //								case "%":
                //									/* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions.
                //									 Velocity does not include a special conversion process to account for this behavior. Therefore, animating translateX/Y from a % value
                //									 to a non-% value will produce an incorrect start value. Fortunately, this sort of cross-unit conversion is rarely done by users in practice. */
                //									startValue *= (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                //									break;
                //
                //								case "px":
                //									/* px acts as our midpoint in the unit conversion process; do nothing. */
                //									break;
                //
                //								default:
                //									startValue *= elementUnitConversionData[startValueUnitType + "ToPx"];
                //							}
                //
                //							/* Invert the px ratios to convert into to the target unit. */
                //							switch (endValueUnitType) {
                //								case "%":
                //									startValue *= 1 / (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                //									break;
                //
                //								case "px":
                //									/* startValue is already in px, do nothing; we're done. */
                //									break;
                //
                //								default:
                //									startValue *= 1 / elementUnitConversionData[endValueUnitType + "ToPx"];
                //							}
                //						}
                //					}
                /*********************
                 Relative Values
                 *********************/
                /* Operator logic must be performed last since it requires unit-normalized start and end values. */
                /* Note: Relative *percent values* do not behave how most people think; while one would expect "+=50%"
                 to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
                 50 points is added on top of the current % value. */
                switch (operator) {
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
                /* Construct the per-property tween object. */
                activeCall.tweens[property] = {
                    rootPropertyValue: rootPropertyValue,
                    startValue: startValue,
                    currentValue: startValue,
                    endValue: endValue,
                    unitType: endValueUnitType,
                    easing: easing,
                    pattern: pattern
                };
                if (VelocityStatic.debug) {
                    console.log("tweensContainer (" + property + "): " + JSON.stringify(activeCall.tweens[property]), element);
                }
            };
            /* Create a tween out of each property, and append its associated data to tweensContainer. */
            for (var property in propertiesMap) {
                if (!propertiesMap.hasOwnProperty(property)) {
                    continue;
                }
                /* The original property name's format must be used for the parsePropertyValue() lookup,
                 but we then use its camelCase styling to normalize it for manipulation. */
                propertyName = VelocityStatic.CSS.Names.camelCase(property), valueData = parsePropertyValue(propertiesMap[property]);
                /* Find shorthand color properties that have been passed a hex string. */
                /* Would be quicker to use vVelocityStatic.CSS.Lists.colors.includes() if possible */
                //				if (_inArray(VelocityStatic.CSS.Lists.colors, propertyName)) {
                //					/* Parse the value data for each shorthand. */
                //					var endValue = valueData[0],
                //						easing = valueData[1],
                //						startValue = valueData[2];
                //
                //					if (VelocityStatic.CSS.RegEx.isHex.test(endValue)) {
                //						/* Convert the hex strings into their RGB component arrays. */
                //						var colorComponents = ["Red", "Green", "Blue"],
                //							endValueRGB = VelocityStatic.CSS.Values.hexToRgb(endValue),
                //							startValueRGB = startValue ? VelocityStatic.CSS.Values.hexToRgb(startValue) : undefined;
                //
                //						/* Inject the RGB component tweens into propertiesMap. */
                //						for (var i = 0; i < colorComponents.length; i++) {
                //							var dataArray = [endValueRGB[i]];
                //
                //							if (easing) {
                //								dataArray.push(easing);
                //							}
                //
                //							if (startValueRGB !== undefined) {
                //								dataArray.push(startValueRGB[i]);
                //							}
                //
                //							fixPropertyValue(propertyName + colorComponents[i], dataArray);
                //						}
                //						/* If we have replaced a shortcut color value then don't update the standard property name */
                //						continue;
                //					}
                //				}
                fixPropertyValue(propertyName, valueData);
            }
            //		}
            /*****************
             Call Push
             *****************/
            if (data_3) {
                /* Store the tweensContainer and options if we're working on the default effects queue, so that they can be used by the reverse or repeat commands. */
                if (activeCall.queue !== false) {
                    data_3.lastAnimationList[activeCall.queue] = activeCall;
                }
                /* Switch on the element's animating flag. */
                data_3.isAnimating = true;
            }
        }
    };
    var fixPropertyValue, propertyName, valueData;
    for (;activeCall; activeCall = activeCall.next) {
        _loop_2();
    }
    State.firstNew = undefined;
}

var VelocityStatic;

(function(VelocityStatic) {
    // Velocity version (should grab from package.json)
    VelocityStatic.version = {
        major: MAJOR,
        minor: MINOR,
        patch: PATCH
    };
})(VelocityStatic || (VelocityStatic = {}));

/*! VelocityJS.org (2.0.0). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */
function Velocity() {
    /******************
     Call Chain
     ******************/
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    /* Logic for determining what to return to the call stack when exiting out of Velocity. */
    function getChain() {
        var promise = promiseData.promise, output = elementsWrapped;
        // || elements;
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
    var syntacticSugar = arguments[0] && (arguments[0].p || (isPlainObject(arguments[0].properties) && !arguments[0].properties.names || isString(arguments[0].properties))), /* Whether Velocity was called via the utility function (as opposed to on a jQuery/Zepto object). */
    isUtility = !isNode(this) && !isWrapped(this), /* When Velocity is called via the utility function ($.Velocity()/Velocity()), elements are explicitly
     passed in as the first parameter. Thus, argument positioning varies. We normalize them here. */
    elementsWrapped, argumentIndex, elements, propertiesMap, options, promiseData = {
        promise: null,
        resolver: null,
        rejecter: null
    };
    if (isUtility) {
        /* Raw elements are being animated via the utility function. */
        argumentIndex = 1;
        elements = syntacticSugar ? arguments[0].elements || arguments[0].e : arguments[0];
    } else {
        /* Detect jQuery/Zepto/Native elements being animated via .velocity() method. */
        argumentIndex = 0;
        elements = isNode(this) ? [ this ] : this;
        elementsWrapped = elements;
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
    var elementsLength = elements.length;
    /***************************
     Argument Overloading
     ***************************/
    /* Support is included for jQuery's argument overloading: $.animate(propertyMap [, duration] [, easing] [, complete]).
     Overloading is detected by checking for the absence of an object being passed into options. */
    /* Note: The stop/finish/pause/resume actions do not accept animation options, and are therefore excluded from this check. */
    if (!/^(stop|finish|finishAll|pause|resume)$/i.test(propertiesMap) && !isPlainObject(options)) {
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
            } else if (isString(arguments[i]) || Array.isArray(arguments[i])) {
                options.easing = arguments[i];
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
        /* Pause and Resume are call-wide (not on a per element basis). Thus, calling pause or resume on a
             single element will cause any calls that contain tweens for that element to be paused/resumed
             as well. */
        var queueName = options === undefined ? "" : options, activeCall = VelocityStatic.State.first, nextCall;
        /* Iterate through all calls and pause any that contain any of our elements */
        for (;activeCall; activeCall = nextCall) {
            nextCall = activeCall.next;
            if (activeCall.paused !== true) {
                /* Iterate through the active call's targeted elements. */
                activeCall.elements.some(function(activeElement) {
                    if (queueName !== true && activeCall.queue !== queueName && !(options === undefined && activeCall.queue === false)) {
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
        /* Pause and Resume are call-wide (not on a per element basis). Thus, calling pause or resume on a
             single element will cause any calls that containt tweens for that element to be paused/resumed
             as well. */
        /* Iterate through all calls and pause any that contain any of our elements */
        var queueName = options === undefined ? "" : options, activeCall = VelocityStatic.State.first, nextCall;
        /* Iterate through all calls and pause any that contain any of our elements */
        for (;activeCall; activeCall = nextCall) {
            nextCall = activeCall.next;
            if (activeCall.paused !== false) {
                /* Iterate through the active call's targeted elements. */
                activeCall.elements.some(function(activeElement) {
                    if (queueName !== true && activeCall.queue !== queueName && !(options === undefined && activeCall.queue === false)) {
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

      case "finishAll":
        /* Clear the currently-active delay on each targeted element. */
        if (options === true || isString(options)) {
            elements.forEach(function(element) {
                /* If we want to finish everything in the queue, we have to iterate through it
                     and call each function. This will make them active calls below, which will
                     cause them to be applied via the duration setting. */
                /* Iterate through the items in the element's queue. */
                var animation;
                while (animation = dequeue(element, isString(options) ? options : undefined)) {
                    animation.queue = false;
                }
            });
            expandTweens();
        }

      // deliberate fallthrough
        case "finish":
      case "stop":
        /*******************
             Action: Stop
             *******************/
        var callsToStop = [];
        /* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
             been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
             is stopped, the next item in its animation queue is immediately triggered. */
        /* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
             or a custom queue string can be passed in. */
        /* Note: The stop command runs prior to Velocity's Queueing phase since its behavior is intended to take effect *immediately*,
             regardless of the element's current queue state. */
        /* Iterate through every active call. */
        var queueName = options === undefined ? "" : options, activeCall = VelocityStatic.State.first, nextCall;
        /* Iterate through all calls and pause any that contain any of our elements */
        for (;activeCall; activeCall = nextCall) {
            nextCall = activeCall.next;
            activeCall.delay = 0;
            /* Iterate through the active call's targeted elements. */
            activeCall.elements.forEach(function(activeElement) {
                /* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
                     clear calls associated with the relevant queue. */
                /* Call stopping logic works as follows:
                     - options === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
                     - options === undefined --> stop current queue:"" call and all queue:false calls.
                     - options === false --> stop only queue:false calls.
                     - options === "custom" --> stop current queue:"custom" call, including remaining queued ones (there is no functionality to only clear the currently-running queue:"custom" call). */
                var queueName = options === undefined ? VelocityStatic.defaults.queue : options;
                if (queueName !== true && activeCall.queue !== queueName && !(options === undefined && activeCall.queue === false)) {
                    return true;
                }
                /* Iterate through the calls targeted by the stop command. */
                elements.forEach(function(element) {
                    /* Check that this call was applied to the target element. */
                    if (element === activeElement) {
                        var data = Data(element);
                        /* Optionally clear the remaining queued calls. If we're doing "finishAll" this won't find anything,
                             due to the queue-clearing above. */
                        if (options === true || isString(options)) {
                            var animation;
                            /* Iterate through the items in the element's queue. */
                            while (animation = dequeue(element, isString(options) ? options : undefined, true)) {
                                animation.resolver(animation.elements);
                            }
                        }
                        if (propertiesMap === "stop") {
                            /* Since "reverse" uses cached start values (the previous call's endValues), these values must be
                                 changed to reflect the final value that the elements were actually tweened to. */
                            /* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
                                 object. Also, queue:false animations can't be reversed. */
                            activeCall.queue = false;
                            activeCall.timeStart = -1;
                            callsToStop.push(activeCall);
                        } else if (propertiesMap === "finish" || propertiesMap === "finishAll") {
                            /* To get active tweens to finish immediately, we forcefully change the start time so that
                                 they finish upon the next rAf tick then proceed with normal call completion logic. */
                            activeCall.timeStart = -1;
                        }
                    }
                });
            });
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
        } else if (isString(propertiesMap) && VelocityStatic.Redirects[propertiesMap]) {
            var opts = __assign({}, options), durationOriginal = parseFloat(options.duration), delayOriginal = parseFloat(options.delay) || 0;
            /* If the backwards option was passed in, reverse the element set so that elements animate from the last to the first. */
            if (opts.backwards === true) {
                elements = elements.reverse();
            }
            /* Individually trigger the redirect for each element in the set to prevent users from having to handle iteration logic in their redirect. */
            elements.forEach(function(element, elementIndex) {
                /* If the stagger option was passed in, successively delay each element by the stagger value (in ms). Retain the original delay value. */
                if (parseFloat(opts.stagger)) {
                    opts.delay = delayOriginal + parseFloat(opts.stagger) * elementIndex;
                } else if (isFunction(opts.stagger)) {
                    opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
                }
                /* If the drag option was passed in, successively increase/decrease (depending on the presense of opts.backwards)
                     the duration of each element's animation, using floors to prevent producing very short durations. */
                if (opts.drag) {
                    /* Default the duration of UI pack effects (callouts and transitions) to 1000ms instead of the usual default duration of 400ms. */
                    opts.duration = durationOriginal || (/^(callout|transition)/.test(propertiesMap) ? 1e3 : DURATION_DEFAULT);
                    /* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
                         B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
                         The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
                    opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex / elementsLength : (elementIndex + 1) / elementsLength), opts.duration * .75, 200);
                }
                /* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
                     reduce the opts checking logic required inside the redirect. */
                VelocityStatic.Redirects[propertiesMap].call(element, element, opts, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
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
     VelocityStatic.State.calls array that is processed during animation ticking. */
    //var call: TweensContainer[] = [];
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
    /*********************************
     Option: Duration
     *********************************/
    if (isNumber(options.duration)) {
        var optionsDuration = options.duration;
    } else if (isString(options.duration)) {
        switch (options.duration.toLowerCase()) {
          case "fast":
            optionsDuration = DURATION_FAST;
            break;

          case "normal":
            optionsDuration = DURATION_DEFAULT;
            break;

          case "slow":
            optionsDuration = DURATION_SLOW;
            break;

          default:
            /* Remove the potential "ms" suffix and default to 1 if the user is attempting to set a duration of 0 (in order to produce an immediate style change). */
            optionsDuration = parseFloat(options.duration) || 1;
        }
    }
    /*********************************
     Option: Display & Visibility
     *********************************/
    /* Refer to Velocity's documentation (VelocityJS.org/#displayAndVisibility) for a description of the display and visibility options' behavior. */
    /* Note: We strictly check for undefined instead of falsiness because display accepts an empty string value. */
    if (options.display !== undefined && options.display !== null) {
        var optionsDisplay = options.display.toString().toLowerCase();
        /* Users can pass in a special "auto" value to instruct Velocity to set the element to its default display value. */
        if (optionsDisplay === "auto") {}
    }
    if (options.visibility !== undefined && options.visibility !== null) {
        var optionsVisibility = options.visibility.toString().toLowerCase();
    }
    /************************
     Global Option: Mock
     ************************/
    /* In mock mode, all animations are forced to 1ms so that they occur immediately upon the next rAF tick.
     Alternatively, a multiplier can be passed in to time remap all delays and durations. */
    if (VelocityStatic.mock === true) {
        var optionsDelay = 0;
        optionsDuration = 1;
    } else if (VelocityStatic.mock) {
        // TODO: Put this in the main tick loop - so we can change the speed
        var mock = parseFloat(VelocityStatic.mock) || 1;
        optionsDelay = parseFloat(options.delay) * mock;
        optionsDuration *= mock;
    } else {
        optionsDelay = parseInt(options.delay, 10) || 0;
        optionsDuration = optionsDuration || 0;
    }
    /*******************
     Option: Easing
     *******************/
    var optionsEasing = getEasing(options.easing, optionsDuration);
    /*******************
     Option: Loop
     *******************/
    var optionsLoop = options.loop || 0;
    /*******************
     Option: Repeat
     *******************/
    var optionsRepeat = options.repeat || 0;
    /**********************
     Option: mobileHA
     **********************/
    /* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
     on animating elements. HA is removed from the element at the completion of its animation. */
    /* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
    /* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
    var optionsMobileHA = options.mobileHA && VelocityStatic.State.isMobile && !VelocityStatic.State.isGingerbread;
    /******************
     Element Init
     ******************/
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
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
    for (var i_3 = 0, length_1 = elements.length; i_3 < length_1; i_3++) {
        var element = elements[i_3], animation = VelocityStatic.getAnimationCall(), isFirst = !i_3, isLast = i_3 === length_1 - 1;
        animation.begin = isFirst && isFunction(options.begin) && options.begin;
        animation.complete = isLast && isFunction(options.complete) && options.complete;
        animation.delay = optionsDelay;
        animation.duration = optionsDuration;
        animation.easing = optionsEasing;
        animation.elements = elements;
        animation.element = element;
        animation.ellapsedTime = 0;
        animation.loop = optionsLoop;
        //		animation.options = options;
        animation.queue = options.queue === false ? false : isString(options.queue) ? options.queue : VelocityStatic.defaults.queue;
        animation.progress = isFirst && isFunction(options.progress) && options.progress;
        animation.properties = propertiesMap;
        animation.repeat = optionsRepeat;
        animation.resolver = isLast && promiseData.resolver;
        animation.timeStart = 0;
        animation.tweens = Object.create(null);
        animation.display = optionsDisplay;
        animation.visibility = optionsVisibility;
        animation.mobileHA = optionsMobileHA;
        queue(elements[0], animation, animation.queue);
        expandTweens();
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

/*****************
 Dependencies
 *****************/
var global = this;

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
///<reference path="../index.d.ts" />
///<reference path="jquery.ts" />
///<reference path="constants.ts" />
///<reference path="types.ts" />
///<reference path="utility.ts" />
///<reference path="cache.ts" />
///<reference path="Velocity/_all.d.ts" />
///<reference path="core.ts" />
/*
 * Merge the VelocityStatic namespace onto the Velocity function for external
 * use.
 */
for (var key in VelocityStatic) {
    Velocity[key] = VelocityStatic[key];
}
//# sourceMappingURL=velocity.js.map
	return Velocity;
}));
