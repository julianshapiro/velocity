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

function defineProperty(proto, name, value, force) {
    if (proto && (force || !proto[name])) {
        Object.defineProperty(proto, name, {
            configurable: true,
            writable: true,
            value: value
        });
    }
}

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

var _now = Date.now ? Date.now : function() {
    return new Date().getTime();
};

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

function sanitizeElements(elements) {
    if (isWrapped(elements)) {
        elements = elements.slice();
    } else if (isNode(elements)) {
        elements = [ elements ];
    }
    return elements;
}

var VelocityStatic;

(function(VelocityStatic) {
    var defaultUndefinedDescriptor = {
        writable: true,
        enumerable: true,
        value: undefined
    };
    var defaultNumberDescriptor = {
        writable: true,
        enumerable: true,
        value: 0
    };
    var emptyAnimation = {
        callbacks: defaultUndefinedDescriptor,
        delay: defaultNumberDescriptor,
        duration: defaultNumberDescriptor,
        easing: defaultUndefinedDescriptor,
        element: defaultUndefinedDescriptor,
        elements: defaultUndefinedDescriptor,
        ellapsedTime: defaultNumberDescriptor,
        loop: defaultUndefinedDescriptor,
        next: defaultUndefinedDescriptor,
        paused: defaultUndefinedDescriptor,
        percentComplete: defaultNumberDescriptor,
        prev: defaultUndefinedDescriptor,
        properties: defaultUndefinedDescriptor,
        queue: defaultUndefinedDescriptor,
        repeat: defaultUndefinedDescriptor,
        repeatAgain: defaultUndefinedDescriptor,
        started: defaultUndefinedDescriptor,
        timeStart: defaultNumberDescriptor,
        tweens: defaultUndefinedDescriptor,
        display: defaultUndefinedDescriptor,
        visibility: defaultUndefinedDescriptor,
        mobileHA: defaultUndefinedDescriptor
    };
    var cache;
    function getAnimationCall() {
        var animation = cache;
        if (animation) {
            cache = animation.next;
            return Object.defineProperties(animation, emptyAnimation);
        }
        return Object.create(null, emptyAnimation);
    }
    VelocityStatic.getAnimationCall = getAnimationCall;
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
            VelocityStatic.State.isTicking = false;
            cache = undefined;
        }
    }
    VelocityStatic.freeAnimationCall = freeAnimationCall;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    function completeCall(activeCall, isStopped) {
        var isLoop = activeCall.loop, isRepeat = activeCall.repeat;
        if (!isStopped && (isLoop || isRepeat)) {
            if (isRepeat && activeCall.repeat !== true) {
                activeCall.repeat--;
            } else if (isLoop && activeCall.loop !== true) {
                activeCall.loop--;
                activeCall.repeat = activeCall.repeatAgain;
            }
            var tweens = activeCall.tweens;
            if (isLoop) {
                for (var propertyName in tweens) {
                    var tweenContainer = tweens[propertyName], oldStartValue = tweenContainer.startValue;
                    tweenContainer.startValue = tweenContainer.endValue;
                    tweenContainer.endValue = oldStartValue;
                    tweenContainer.reverse = !tweenContainer.reverse;
                }
            }
            activeCall.timeStart = 0;
            activeCall.started = false;
        } else {
            var elements = activeCall.elements, element = activeCall.element, data_1 = Data(element);
            if (activeCall.display === "none") {
                VelocityStatic.CSS.setPropertyValue(element, "display", activeCall.display, 1);
            }
            if (activeCall.visibility === "hidden") {
                VelocityStatic.CSS.setPropertyValue(element, "visibility", activeCall.visibility, 1);
            }
            if (isStopped && data_1 && (activeCall.queue === false || data_1.queueList[activeCall.queue])) {
                data_1.isAnimating = false;
                data_1.rootPropertyValueCache = {};
                var transformHAPropertyExists_1 = false;
                VelocityStatic.CSS.Lists.transforms3D.forEach(function(transformName) {
                    var defaultValue = /^scale/.test(transformName) ? 1 : 0, currentValue = data_1.transformCache[transformName];
                    if (data_1.transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
                        transformHAPropertyExists_1 = true;
                        delete data_1.transformCache[transformName];
                    }
                });
                if (activeCall.mobileHA) {
                    transformHAPropertyExists_1 = true;
                    delete data_1.transformCache.translate3d;
                }
                if (transformHAPropertyExists_1) {
                    VelocityStatic.CSS.flushTransformCache(element);
                }
                VelocityStatic.CSS.Values.removeClass(element, "velocity-animating");
            }
            var callbacks = activeCall.callbacks;
            if (callbacks && ++callbacks.completed === callbacks.total) {
                if (!isStopped && callbacks.complete) {
                    try {
                        callbacks.complete.call(elements, elements, activeCall);
                    } catch (error) {
                        setTimeout(function() {
                            throw error;
                        }, 1);
                    }
                    callbacks.complete = undefined;
                }
                if (callbacks.resolver) {
                    callbacks.resolver(elements);
                    callbacks.resolver = undefined;
                }
            }
            if (activeCall.queue !== false) {
                dequeue(element, activeCall.queue);
            }
            VelocityStatic.freeAnimationCall(activeCall);
        }
    }
    VelocityStatic.completeCall = completeCall;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        function flushTransformCache(element) {
            var transformString = "", data = Data(element);
            if ((IE || VelocityStatic.State.isAndroid && !VelocityStatic.State.isChrome) && data && data.isSVG) {
                var getTransformFloat = function(transformProperty) {
                    return parseFloat(CSS.getPropertyValue(element, transformProperty));
                };
                var SVGTransforms = {
                    translate: [ getTransformFloat("translateX"), getTransformFloat("translateY") ],
                    skewX: [ getTransformFloat("skewX") ],
                    skewY: [ getTransformFloat("skewY") ],
                    scale: getTransformFloat("scale") !== 1 ? [ getTransformFloat("scale"), getTransformFloat("scale") ] : [ getTransformFloat("scaleX"), getTransformFloat("scaleY") ],
                    rotate: [ getTransformFloat("rotateZ"), 0, 0 ]
                };
                for (var transformName in Data(element).transformCache) {
                    if (/^translate/i.test(transformName)) {
                        transformName = "translate";
                    } else if (/^scale/i.test(transformName)) {
                        transformName = "scale";
                    } else if (/^rotate/i.test(transformName)) {
                        transformName = "rotate";
                    }
                    if (SVGTransforms[transformName]) {
                        transformString += transformName + "(" + SVGTransforms[transformName].join(" ") + ")" + " ";
                        delete SVGTransforms[transformName];
                    }
                }
            } else {
                var transformValue, perspective;
                for (var transformName in Data(element).transformCache) {
                    transformValue = Data(element).transformCache[transformName];
                    if (transformName === "transformPerspective") {
                        perspective = transformValue;
                        return true;
                    }
                    if (IE === 9 && transformName === "rotateZ") {
                        transformName = "rotate";
                    }
                    transformString += transformName + transformValue + " ";
                }
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
        function getPropertyValue(element, property, rootPropertyValue, forceStyleLookup) {
            function computePropertyValue(element, property) {
                var data = Data(element), computedValue = 0, computedStyle = data && data.computedStyle ? data.computedStyle : window.getComputedStyle(element, null), isWidthHeight = /^(width|height)$/.test(property), toggleDisplay = isWidthHeight && getPropertyValue(element, "display") === 0, revertDisplay = toggleDisplay ? function() {
                    CSS.setPropertyValue(element, "display", "none", 1);
                } : function() {};
                if (toggleDisplay) {
                    CSS.setPropertyValue(element, "display", CSS.Values.getDisplayType(element), 1);
                }
                if (data && !data.computedStyle) {
                    data.computedStyle = computedStyle;
                }
                if (!forceStyleLookup && isWidthHeight && getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                    if (property === "height") {
                        computedValue = element.offsetHeight - (parseFloat(getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(getPropertyValue(element, "paddingBottom")) || 0);
                    } else {
                        computedValue = element.offsetWidth - (parseFloat(getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(getPropertyValue(element, "paddingRight")) || 0);
                    }
                    revertDisplay();
                    return computedValue;
                }
                if (property === "borderColor") {
                    property = "borderTopColor";
                }
                if (IE === 9 && property === "filter") {
                    computedValue = computedStyle.getPropertyValue(property);
                } else {
                    computedValue = computedStyle[property];
                }
                if (computedValue === "" || computedValue === null) {
                    computedValue = element.style[property];
                }
                revertDisplay();
                if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
                    var position = computePropertyValue(element, "position");
                    if (position === "fixed" || position === "absolute" && /top|left/i.test(property)) {
                        computedValue = _position(element)[property] + "px";
                    }
                }
                return computedValue;
            }
            var propertyValue;
            if (CSS.Hooks.registered[property]) {
                var hook_1 = property, hookRoot = CSS.Hooks.getRoot(hook_1);
                if (rootPropertyValue === undefined) {
                    rootPropertyValue = getPropertyValue(element, CSS.Names.prefixCheck(hookRoot)[0]);
                }
                if (CSS.Normalizations.registered[hookRoot]) {
                    rootPropertyValue = CSS.Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
                }
                propertyValue = CSS.Hooks.extractValue(hook_1, rootPropertyValue);
            } else if (CSS.Normalizations.registered[property]) {
                var normalizedPropertyName = CSS.Normalizations.registered[property]("name", element), normalizedPropertyValue = void 0;
                if (normalizedPropertyName !== "transform") {
                    normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]);
                    if (CSS.Values.isCSSNullValue(normalizedPropertyValue) && CSS.Hooks.templates[property]) {
                        normalizedPropertyValue = CSS.Hooks.templates[property][1];
                    }
                }
                propertyValue = CSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
            }
            if (!/^[\d-]/.test(propertyValue)) {
                var data_2 = Data(element), isWidthHeight = /^(height|width)$/i.test(property);
                if (data_2 && !isWidthHeight && data_2[property] != null) {
                    propertyValue = data_2[property];
                } else if (data_2 && data_2.isSVG && CSS.Names.SVGAttribute(property)) {
                    if (isWidthHeight) {
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
        var Hooks;
        (function(Hooks) {
            Hooks.templates = {
                textShadow: [ "Color X Y Blur", "black 0px 0px 0px" ],
                boxShadow: [ "Color X Y Blur Spread", "black 0px 0px 0px 0px" ],
                clip: [ "Top Right Bottom Left", "0px 0px 0px 0px" ],
                backgroundPosition: [ "X Y", "0% 0%" ],
                transformOrigin: [ "X Y Z", "50% 50% 0px" ],
                perspectiveOrigin: [ "X Y", "50% 50%" ]
            };
            Hooks.registered = Object.create(null);
            function register() {
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    var rgbComponents = CSS.Lists.colors[i] === "color" ? "0 0 0 1" : "255 255 255 1";
                    Hooks.templates[CSS.Lists.colors[i]] = [ "Red Green Blue Alpha", rgbComponents ];
                }
                var rootProperty, hookTemplate, hookNames;
                if (IE) {
                    for (rootProperty in Hooks.templates) {
                        if (!Hooks.templates.hasOwnProperty(rootProperty)) {
                            continue;
                        }
                        hookTemplate = Hooks.templates[rootProperty];
                        hookNames = hookTemplate[0].split(" ");
                        var defaultValues = hookTemplate[1].match(CSS.RegEx.valueSplit);
                        if (hookNames[0] === "Color") {
                            hookNames.push(hookNames.shift());
                            defaultValues.push(defaultValues.shift());
                            Hooks.templates[rootProperty] = [ hookNames.join(" "), defaultValues.join(" ") ];
                        }
                    }
                }
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
                        Hooks.registered[fullHookName] = [ rootProperty, hookPosition ];
                    }
                }
            }
            Hooks.register = register;
            function getRoot(property) {
                var hookData = Hooks.registered[property];
                if (hookData) {
                    return hookData[0];
                } else {
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
            function fixColors(str) {
                return str.replace(/(rgba?\(\s*)?(\b[a-z]+\b)/g, function($0, $1, $2) {
                    if (CSS.Lists.colorNames.hasOwnProperty($2)) {
                        return ($1 ? $1 : "rgba(") + CSS.Lists.colorNames[$2] + ($1 ? "" : ",1)");
                    }
                    return $1 + $2;
                });
            }
            Hooks.fixColors = fixColors;
            function cleanRootPropertyValue(rootProperty, rootPropertyValue) {
                if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {
                    rootPropertyValue = rootPropertyValue.match(CSS.RegEx.valueUnwrap)[1];
                }
                if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
                    rootPropertyValue = Hooks.templates[rootProperty][1];
                }
                return rootPropertyValue;
            }
            Hooks.cleanRootPropertyValue = cleanRootPropertyValue;
            function extractValue(fullHookName, rootPropertyValue) {
                var hookData = Hooks.registered[fullHookName];
                if (hookData) {
                    var hookRoot = hookData[0], hookPosition = hookData[1];
                    rootPropertyValue = cleanRootPropertyValue(hookRoot, rootPropertyValue);
                    return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
                } else {
                    return rootPropertyValue;
                }
            }
            Hooks.extractValue = extractValue;
            function injectValue(fullHookName, hookValue, rootPropertyValue) {
                var hookData = Hooks.registered[fullHookName];
                if (hookData) {
                    var hookRoot = hookData[0], hookPosition = hookData[1], rootPropertyValueParts, rootPropertyValueUpdated;
                    rootPropertyValue = cleanRootPropertyValue(hookRoot, rootPropertyValue);
                    rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
                    rootPropertyValueParts[hookPosition] = hookValue;
                    rootPropertyValueUpdated = rootPropertyValueParts.join(" ");
                    return rootPropertyValueUpdated;
                } else {
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
    var State;
    (function(State) {
        State.isClient = window && window === window.window, State.isMobile = State.isClient && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), 
        State.isAndroid = State.isClient && /Android/i.test(navigator.userAgent), State.isGingerbread = State.isClient && /Android 2\.3\.[3-7]/i.test(navigator.userAgent), 
        State.isChrome = State.isClient && window.chrome, State.isFirefox = State.isClient && /Firefox/i.test(navigator.userAgent), 
        State.prefixElement = State.isClient && document.createElement("div"), State.prefixMatches = {}, 
        State.windowScrollAnchor = State.isClient && window.pageYOffset !== undefined, State.scrollAnchor = State.windowScrollAnchor ? window : !State.isClient || document.documentElement || document.body.parentNode || document.body, 
        State.scrollPropertyLeft = State.windowScrollAnchor ? "pageXOffset" : "scrollLeft", 
        State.scrollPropertyTop = State.windowScrollAnchor ? "pageYOffset" : "scrollTop", 
        State.isTicking = false;
    })(State = VelocityStatic.State || (VelocityStatic.State = {}));
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        var SVGAttributes = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2" + (IE || VelocityStatic.State.isAndroid && !VelocityStatic.State.isChrome ? "|transform" : ""), SVGAttributesRX = RegExp("^(" + SVGAttributes + ")$", "i");
        CSS.Names = {
            camelCase: function(property) {
                return property.replace(/-(\w)/g, function(match, subMatch) {
                    return subMatch.toUpperCase();
                });
            },
            SVGAttribute: function(property) {
                return SVGAttributesRX.test(property);
            },
            prefixCheck: function(property) {
                if (VelocityStatic.State.prefixMatches[property]) {
                    return [ VelocityStatic.State.prefixMatches[property], true ];
                } else {
                    var vendors = [ "", "Webkit", "Moz", "ms", "O" ];
                    for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
                        var propertyPrefixed;
                        if (i === 0) {
                            propertyPrefixed = property;
                        } else {
                            propertyPrefixed = vendors[i] + property.replace(/^\w/, function(match) {
                                return match.toUpperCase();
                            });
                        }
                        var prefixElement = VelocityStatic.State.prefixElement;
                        if (prefixElement && isString(prefixElement.style[propertyPrefixed])) {
                            VelocityStatic.State.prefixMatches[property] = propertyPrefixed;
                            return [ propertyPrefixed, true ];
                        }
                    }
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
        var Normalizations;
        (function(Normalizations) {
            function augmentDimension(name, element, wantInner) {
                var isBorderBox = CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === "border-box";
                if (isBorderBox === (wantInner || false)) {
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
            Normalizations.registered = {
                clip: function(type, element, propertyValue) {
                    switch (type) {
                      case "name":
                        return "clip";

                      case "extract":
                        var extracted;
                        if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                            extracted = propertyValue;
                        } else {
                            extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);
                            extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
                        }
                        return extracted;

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
                        if (!(extracted || extracted === 0)) {
                            var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
                            if (blurComponent) {
                                extracted = blurComponent[1];
                            } else {
                                extracted = 0;
                            }
                        }
                        return extracted;

                      case "inject":
                        if (!parseFloat(propertyValue)) {
                            return "none";
                        } else {
                            return "blur(" + propertyValue + ")";
                        }
                    }
                },
                opacity: function(type, element, propertyValue) {
                    if (IE <= 8) {
                        switch (type) {
                          case "name":
                            return "filter";

                          case "extract":
                            var extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);
                            if (extracted) {
                                propertyValue = extracted[1] / 100;
                            } else {
                                propertyValue = 1;
                            }
                            return propertyValue;

                          case "inject":
                            element.style.zoom = "1";
                            if (parseFloat(propertyValue) >= 1) {
                                return "";
                            } else {
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
            function register() {
                if ((!IE || IE > 9) && !VelocityStatic.State.isGingerbread) {
                    CSS.Lists.transformsBase = CSS.Lists.transformsBase.concat(CSS.Lists.transforms3D);
                }
                for (var i = 0; i < CSS.Lists.transformsBase.length; i++) {
                    (function() {
                        var transformName = CSS.Lists.transformsBase[i];
                        CSS.Normalizations.registered[transformName] = function(type, element, propertyValue) {
                            switch (type) {
                              case "name":
                                return "transform";

                              case "extract":
                                if (Data(element) === undefined || Data(element).transformCache[transformName] === undefined) {
                                    return /^scale/i.test(transformName) ? 1 : 0;
                                }
                                return Data(element).transformCache[transformName].replace(/[()]/g, "");

                              case "inject":
                                var invalid = false;
                                switch (transformName.substr(0, transformName.length - 1)) {
                                  case "translate":
                                    invalid = !/(%|px|em|rem|vw|vh|\d)$/i.test(propertyValue);
                                    break;

                                  case "scal":
                                  case "scale":
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
                                    Data(element).transformCache[transformName] = "(" + propertyValue + ")";
                                }
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
        CSS.RegEx = {
            isHex: /^#([A-f\d]{3}){1,2}$/i,
            valueUnwrap: /^[A-z]+\((.*)\)$/i,
            wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
            valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
        };
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        function setPropertyValue(element, property, propertyValue, percentComplete, rootPropertyValue, scrollData) {
            var propertyName = property;
            if (property === "scroll") {
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
                if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]("name", element) === "transform") {
                    CSS.Normalizations.registered[property]("inject", element, propertyValue);
                    propertyName = "transform";
                    propertyValue = Data(element).transformCache[property];
                } else {
                    if (CSS.Hooks.registered[property]) {
                        var hookName = property, hookRoot = CSS.Hooks.getRoot(property);
                        rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot);
                        propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
                        property = hookRoot;
                    }
                    if (CSS.Normalizations.registered[property]) {
                        propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
                        property = CSS.Normalizations.registered[property]("name", element);
                    }
                    propertyName = CSS.Names.prefixCheck(property)[0];
                    var data_3 = Data(element);
                    if (IE <= 8) {
                        try {
                            element.style[propertyName] = propertyValue;
                            data_3.style[propertyName] = propertyValue || null;
                        } catch (error) {
                            if (VelocityStatic.debug) {
                                console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]");
                            }
                        }
                    } else {
                        if (data_3 && data_3.isSVG && CSS.Names.SVGAttribute(property)) {
                            element.setAttribute(property, propertyValue);
                        } else {
                            element.style[propertyName] = propertyValue;
                        }
                        data_3.style[propertyName] = propertyValue || null;
                    }
                    if (VelocityStatic.debug >= 2) {
                        console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
                    }
                }
            }
            return [ propertyName, propertyValue ];
        }
        CSS.setPropertyValue = setPropertyValue;
    })(CSS = VelocityStatic.CSS || (VelocityStatic.CSS = {}));
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    var CSS;
    (function(CSS) {
        CSS.Values = {
            hexToRgb: function(hex) {
                var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, rgbParts;
                hex = hex.replace(shortformRegex, function(m, r, g, b) {
                    return r + r + g + g + b + b;
                });
                rgbParts = longformRegex.exec(hex);
                return rgbParts ? [ parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16) ] : [ 0, 0, 0 ];
            },
            isCSSNullValue: function(value) {
                return !value || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value);
            },
            getUnitType: function(property) {
                if (/^(rotate|skew)/i.test(property)) {
                    return "deg";
                } else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
                    return "";
                } else {
                    return "px";
                }
            },
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
            addClass: function(element, className) {
                if (element) {
                    if (element.classList) {
                        element.classList.add(className);
                    } else if (isString(element.className)) {
                        element.className += (element.className.length ? " " : "") + className;
                    } else {
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
                        element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
                    } else {
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
    VelocityStatic.debug = false;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    VelocityStatic.defaults = {
        queue: "",
        duration: DURATION_DEFAULT,
        easing: EASING_DEFAULT,
        mobileHA: true,
        cache: true,
        promiseRejectEmpty: true
    };
})(VelocityStatic || (VelocityStatic = {}));

function generateBezier(mX1, mY1, mX2, mY2) {
    var NEWTON_ITERATIONS = 4, NEWTON_MIN_SLOPE = .001, SUBDIVISION_PRECISION = 1e-7, SUBDIVISION_MAX_ITERATIONS = 10, kSplineTableSize = 11, kSampleStepSize = 1 / (kSplineTableSize - 1), float32ArraySupported = "Float32Array" in window;
    if (arguments.length !== 4) {
        return false;
    }
    for (var i = 0; i < 4; ++i) {
        if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
            return false;
        }
    }
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
        if (have_duration) {
            time_lapsed = springRK4Factory(tension, friction);
            dt = time_lapsed / duration * DT;
        } else {
            dt = DT;
        }
        while (true) {
            last_state = springIntegrateState(last_state || initState, dt);
            path.push(1 + last_state.x);
            time_lapsed += 16;
            if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
                break;
            }
        }
        return !have_duration ? time_lapsed : function(percentComplete) {
            return path[percentComplete * (path.length - 1) | 0];
        };
    };
}();

function generateStep(steps) {
    return function(p) {
        return Math.round(p * steps) * (1 / steps);
    };
}

function getEasing(value, duration) {
    var easing = value;
    if (isString(value)) {
        if (!VelocityStatic.Easings[value]) {
            easing = false;
        }
    } else if (Array.isArray(value)) {
        if (value.length === 1) {
            easing = generateStep(value[0]);
        } else if (value.length === 2) {
            easing = generateSpringRK4(value[0], value[1], duration);
        } else if (value.length === 4) {
            easing = generateBezier.apply(null, value);
        } else {
            easing = false;
        }
    } else {
        easing = false;
    }
    if (easing === false) {
        if (VelocityStatic.Easings[VelocityStatic.defaults.easing]) {
            easing = VelocityStatic.defaults.easing;
        } else {
            easing = EASING_DEFAULT;
        }
    }
    return easing;
}

var VelocityStatic;

(function(VelocityStatic) {
    VelocityStatic.Easings = {
        linear: function(p) {
            return p;
        },
        swing: function(p) {
            return .5 - Math.cos(p * Math.PI) / 2;
        },
        spring: function(p) {
            return 1 - Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6);
        },
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
        "ease-in": generateBezier(.42, 0, 1, 1),
        "ease-out": generateBezier(0, 0, .58, 1),
        "ease-in-out": generateBezier(.42, 0, .58, 1)
    };
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    function hook(elements, arg2, arg3) {
        var value;
        elements = sanitizeElements(elements);
        elements.forEach(function(element) {
            if (Data(element) === undefined) {
                VelocityStatic.init(element);
            }
            if (arg3 === undefined) {
                if (value === undefined) {
                    value = VelocityStatic.CSS.getPropertyValue(element, arg2);
                }
            } else {
                var adjustedSet = VelocityStatic.CSS.setPropertyValue(element, arg2, arg3, 1);
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
    function init(element) {
        Data(element, {
            isSVG: isSVG(element),
            isAnimating: false,
            computedStyle: null,
            style: Object.create(null),
            rootPropertyValueCache: Object.create(null),
            transformCache: Object.create(null),
            queueList: Object.create(null),
            lastAnimationList: Object.create(null)
        });
    }
    VelocityStatic.init = init;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    VelocityStatic.mock = false;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    function pauseAll(queueName) {
        for (var activeCall = VelocityStatic.State.first; activeCall; activeCall = activeCall.next) {
            if (queueName !== undefined && (activeCall.queue !== queueName || activeCall.queue === false)) {
                continue;
            }
            activeCall.paused = true;
        }
    }
    VelocityStatic.pauseAll = pauseAll;
})(VelocityStatic || (VelocityStatic = {}));

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

function queue(element, animation, queue) {
    if (queue === false) {
        animate(animation);
    } else {
        if (!isString(queue)) {
            queue = "";
        }
        var data = Data(element), last = data.queueList[queue];
        if (!last) {
            if (last === null) {
                data.queueList[queue] = animation;
            } else {
                data.queueList[queue] = null;
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

function dequeue(element, queue, skip) {
    if (queue !== false) {
        if (!isString(queue)) {
            queue = "";
        }
        var data = Data(element), animation = data.queueList[queue];
        if (animation) {
            data.queueList[queue] = animation.next || null;
            if (!skip) {
                animate(animation);
            }
        } else if (animation === null) {
            delete data.queueList[queue];
        }
        return animation;
    }
}

var VelocityStatic;

(function(VelocityStatic) {
    VelocityStatic.Redirects = {};
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
                opts.display = direction === "Down" ? VelocityStatic.CSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block" : "none";
            }
            opts.begin = function() {
                if (elementsIndex === 0 && begin) {
                    begin.call(elements, elements);
                }
                for (var property in computedValues) {
                    if (!computedValues.hasOwnProperty(property)) {
                        continue;
                    }
                    inlineValues[property] = element.style[property];
                    var propertyValue = VelocityStatic.CSS.getPropertyValue(element, property);
                    computedValues[property] = direction === "Down" ? [ propertyValue, 0 ] : [ 0, propertyValue ];
                }
                inlineValues.overflow = element.style.overflow;
                element.style.overflow = "hidden";
            };
            opts.complete = function() {
                for (var property in inlineValues) {
                    if (inlineValues.hasOwnProperty(property)) {
                        element.style[property] = inlineValues[property];
                    }
                }
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
    [ "In", "Out" ].forEach(function(direction) {
        VelocityStatic.Redirects["fade" + direction] = function(element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = __assign({}, options), complete = opts.complete, propertiesMap = {
                opacity: direction === "In" ? 1 : 0
            };
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
            if (opts.display === undefined) {
                opts.display = direction === "In" ? "auto" : "none";
            }
            Velocity(this, propertiesMap, opts);
        };
    });
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    function animateParentHeight(elements, direction, totalDuration, stagger) {
        var totalHeightDelta = 0, parentNode;
        (elements.nodeType ? [ elements ] : elements).forEach(function(element, i) {
            if (stagger) {
                totalDuration += i * stagger;
            }
            parentNode = element.parentNode;
            var propertiesToSum = [ "height", "paddingTop", "paddingBottom", "marginTop", "marginBottom" ];
            if (VelocityStatic.CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === "border-box") {
                propertiesToSum = [ "height" ];
            }
            propertiesToSum.forEach(function(property) {
                totalHeightDelta += parseFloat(VelocityStatic.CSS.getPropertyValue(element, property));
            });
        });
        Velocity(parentNode, {
            height: (direction === "In" ? "+" : "-") + "=" + totalHeightDelta
        }, {
            queue: false,
            easing: "ease-in-out",
            duration: totalDuration * (direction === "In" ? .6 : 1)
        });
    }
    function RegisterEffect(effectName, properties) {
        VelocityStatic.Redirects[effectName] = function(element, redirectOptions, elementsIndex, elementsSize, elements, promiseData, loop) {
            var finalElement = elementsIndex === elementsSize - 1, totalDuration = 0;
            loop = loop || properties.loop;
            if (typeof properties.defaultDuration === "function") {
                properties.defaultDuration = properties.defaultDuration.call(elements, elements);
            } else {
                properties.defaultDuration = parseFloat(properties.defaultDuration);
            }
            for (var callIndex = 0; callIndex < properties.calls.length; callIndex++) {
                durationPercentage = properties.calls[callIndex][1];
                if (typeof durationPercentage === "number") {
                    totalDuration += durationPercentage;
                }
            }
            var shareDuration = totalDuration >= 1 ? 0 : properties.calls.length ? (1 - totalDuration) / properties.calls.length : 1;
            for (callIndex = 0; callIndex < properties.calls.length; callIndex++) {
                var call = properties.calls[callIndex], propertyMap = call[0], redirectDuration = 1e3, durationPercentage = call[1], callOptions = call[2] || {}, opts = {};
                if (redirectOptions.duration !== undefined) {
                    redirectDuration = redirectOptions.duration;
                } else if (properties.defaultDuration !== undefined) {
                    redirectDuration = properties.defaultDuration;
                }
                opts.duration = redirectDuration * (typeof durationPercentage === "number" ? durationPercentage : shareDuration);
                opts.queue = redirectOptions.queue || "";
                opts.easing = callOptions.easing || "ease";
                opts.delay = parseFloat(callOptions.delay) || 0;
                opts.loop = !properties.loop && callOptions.loop;
                opts.cache = callOptions.cache || true;
                if (callIndex === 0) {
                    opts.delay += parseFloat(redirectOptions.delay) || 0;
                    if (elementsIndex === 0) {
                        opts.begin = function() {
                            if (redirectOptions.begin) {
                                redirectOptions.begin.call(elements, elements);
                            }
                            var direction = effectName.match(/(In|Out)$/);
                            if (direction && direction[0] === "In" && propertyMap.opacity !== undefined) {
                                (elements.nodeType ? [ elements ] : elements).forEach(function(element) {
                                    VelocityStatic.CSS.setPropertyValue(element, "opacity", 0, 1);
                                });
                            }
                            if (redirectOptions.animateParentHeight && direction) {
                                animateParentHeight(elements, direction[0], redirectDuration + opts.delay, redirectOptions.stagger);
                            }
                        };
                    }
                    if (redirectOptions.display !== null) {
                        if (redirectOptions.display !== undefined && redirectOptions.display !== "none") {
                            opts.display = redirectOptions.display;
                        } else if (/In$/.test(effectName)) {
                            var defaultDisplay = VelocityStatic.CSS.Values.getDisplayType(element);
                            opts.display = defaultDisplay === "inline" ? "inline-block" : defaultDisplay;
                        }
                    }
                    if (redirectOptions.visibility && redirectOptions.visibility !== "hidden") {
                        opts.visibility = redirectOptions.visibility;
                    }
                }
                if (callIndex === properties.calls.length - 1) {
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
                                if (VelocityStatic.CSS.Hooks.registered[resetProperty] === undefined && (typeof resetValue === "string" || typeof resetValue === "number")) {
                                    properties.reset[resetProperty] = [ properties.reset[resetProperty], properties.reset[resetProperty] ];
                                }
                            }
                            var resetOptions = {
                                duration: 0,
                                queue: false
                            };
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
        return Velocity;
    }
    VelocityStatic.RegisterEffect = RegisterEffect;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    function resumeAll(queueName) {
        for (var activeCall = VelocityStatic.State.first; activeCall; activeCall = activeCall.next) {
            if (queueName !== undefined && (activeCall.queue !== queueName || activeCall.queue === false)) {
                continue;
            }
            if (activeCall.paused === true) {
                activeCall.paused = false;
            }
        }
    }
    VelocityStatic.resumeAll = resumeAll;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    function RunSequence(originalSequence) {
        var sequence = _deepCopyObject([], originalSequence);
        if (sequence.length > 1) {
            sequence.reverse().forEach(function(currentCall, i) {
                var nextCall = sequence[i + 1];
                if (nextCall) {
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
    var FRAME_TIME = 1e3 / 60;
    var ticker, performance = function() {
        var perf = window.performance || {};
        if (typeof perf.now !== "function") {
            var nowOffset = perf.timing && perf.timing.navigationStart ? perf.timing.navigationStart : _now();
            perf.now = function() {
                return _now() - nowOffset;
            };
        }
        return perf;
    }(), rAFShim = ticker = function() {
        return window.requestAnimationFrame || function(callback) {
            var timeCurrent = performance.now(), timeDelta = Math.max(0, FRAME_TIME - (timeCurrent - VelocityStatic.lastTick));
            return setTimeout(function() {
                callback(timeCurrent + timeDelta);
            }, timeDelta);
        };
    }();
    VelocityStatic.lastTick = 0;
    if (!VelocityStatic.State.isMobile && document.hidden !== undefined) {
        var updateTicker = function() {
            if (document.hidden) {
                ticker = function(callback) {
                    return setTimeout(function() {
                        callback(true);
                    }, 16);
                };
                tick();
            } else {
                ticker = rAFShim;
            }
        };
        updateTicker();
        document.addEventListener("visibilitychange", updateTicker);
    }
    function tick(timestamp) {
        expandTweens();
        if (timestamp) {
            var timeCurrent = timestamp && timestamp !== true ? timestamp : performance.now(), deltaTime = VelocityStatic.lastTick ? timeCurrent - VelocityStatic.lastTick : FRAME_TIME, activeCall = VelocityStatic.State.first, nextCall, percentComplete, tween, easing, hasProgress, hasComplete, getEasing = function(tweenDelta) {
                return tweenDelta * (tween.reverse ? 1 - easing(1 - percentComplete, activeCall, tweenDelta) : easing(percentComplete, activeCall, tweenDelta));
            }, expandPattern = function($0, index, round) {
                if (percentComplete < 1) {
                    var startValue = tween.startValue[index], result = startValue + getEasing(tween.endValue[index] - startValue);
                } else {
                    result = tween.endValue[index];
                }
                return round ? Math.round(result) : result;
            };
            VelocityStatic.lastTick = timeCurrent;
            var _loop_1 = function() {
                nextCall = activeCall.next;
                var element = activeCall.element, data_4 = Data(element);
                if (!data_4) {
                    VelocityStatic.freeAnimationCall(activeCall);
                    return "continue";
                }
                var timeStart = activeCall.timeStart, paused = activeCall.paused, delay = activeCall.delay, started = activeCall.started, callbacks = activeCall.callbacks, firstTick = !timeStart;
                if (firstTick) {
                    activeCall.timeStart = timeStart = timeCurrent - deltaTime;
                    VelocityStatic.CSS.Values.addClass(element, "velocity-animating");
                }
                if (paused === true) {
                    activeCall.timeStart += deltaTime;
                    return "continue";
                } else if (paused === false) {
                    activeCall.paused = undefined;
                }
                if (!started && delay) {
                    if (timeStart + delay > timeCurrent) {
                        return "continue";
                    }
                    activeCall.timeStart = timeStart = timeCurrent - deltaTime;
                }
                if (!started) {
                    activeCall.started = true;
                    if (callbacks && callbacks.started++ === 0) {
                        callbacks.first = activeCall;
                        if (callbacks.begin) {
                            try {
                                var elements = activeCall.elements;
                                callbacks.begin.call(elements, elements, activeCall);
                            } catch (error) {
                                setTimeout(function() {
                                    throw error;
                                }, 1);
                            }
                            callbacks.begin = undefined;
                        }
                    }
                }
                var tweens = activeCall.tweens, tweenDummyValue = null, millisecondsEllapsed = activeCall.ellapsedTime = timeCurrent - timeStart, property = void 0, transformPropertyExists = false;
                percentComplete = activeCall.percentComplete = Math.min(millisecondsEllapsed / activeCall.duration, 1);
                if (percentComplete === 1) {
                    hasComplete = true;
                }
                if (activeCall.display !== undefined && activeCall.display !== null && activeCall.display !== "none") {
                    if (activeCall.display === "flex") {
                        flexValues = [ "-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex" ];
                        flexValues.forEach(function(flexValue) {
                            VelocityStatic.CSS.setPropertyValue(element, "display", flexValue, percentComplete);
                        });
                    }
                    VelocityStatic.CSS.setPropertyValue(element, "display", activeCall.display, percentComplete);
                }
                if (activeCall.visibility !== undefined && activeCall.visibility !== "hidden") {
                    VelocityStatic.CSS.setPropertyValue(element, "visibility", activeCall.visibility, percentComplete);
                }
                for (property in tweens) {
                    var currentValue = void 0;
                    tween = tweens[property];
                    easing = isString(tween.easing) ? VelocityStatic.Easings[tween.easing] : tween.easing;
                    if (isString(tween.pattern)) {
                        currentValue = tween.pattern.replace(/{(\d+)(!)?}/g, expandPattern);
                    } else if (percentComplete === 1) {
                        currentValue = tween.endValue;
                    } else {
                        currentValue = tween.startValue + getEasing(tween.endValue - tween.startValue);
                    }
                    if (!firstTick && tween.currentValue === currentValue) {
                        continue;
                    }
                    tween.currentValue = currentValue;
                    if (property === "tween") {
                        tweenDummyValue = currentValue;
                    } else {
                        if (VelocityStatic.CSS.Hooks.registered[property]) {
                            hookRoot = VelocityStatic.CSS.Hooks.getRoot(property);
                            rootPropertyValueCache = data_4.rootPropertyValueCache[hookRoot];
                            if (rootPropertyValueCache) {
                                tween.rootPropertyValue = rootPropertyValueCache;
                            }
                        }
                        adjustedSetData = VelocityStatic.CSS.setPropertyValue(element, property, tween.currentValue + (IE < 9 && parseFloat(currentValue) === 0 ? "" : tween.unitType), percentComplete, tween.rootPropertyValue, tween.scrollData);
                        if (VelocityStatic.CSS.Hooks.registered[property]) {
                            if (VelocityStatic.CSS.Normalizations.registered[hookRoot]) {
                                data_4.rootPropertyValueCache[hookRoot] = VelocityStatic.CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
                            } else {
                                data_4.rootPropertyValueCache[hookRoot] = adjustedSetData[1];
                            }
                        }
                        if (adjustedSetData[0] === "transform") {
                            transformPropertyExists = true;
                        }
                    }
                    if (activeCall.mobileHA) {
                        if (data_4.transformCache.translate3d === undefined) {
                            data_4.transformCache.translate3d = "(0px, 0px, 0px)";
                            transformPropertyExists = true;
                        }
                    }
                    if (transformPropertyExists) {
                        VelocityStatic.CSS.flushTransformCache(element);
                    }
                }
                if (activeCall.display !== undefined && activeCall.display !== "none") {
                    activeCall.display = false;
                }
                if (activeCall.visibility !== undefined && activeCall.visibility !== "hidden") {
                    activeCall.visibility = false;
                }
                if (callbacks && callbacks.first === activeCall && callbacks.progress) {
                    hasProgress = true;
                }
            };
            var flexValues, hookRoot, rootPropertyValueCache, adjustedSetData;
            for (;activeCall && activeCall !== VelocityStatic.State.firstNew; activeCall = nextCall) {
                _loop_1();
            }
            if (hasProgress) {
                for (activeCall = VelocityStatic.State.first; activeCall && activeCall !== VelocityStatic.State.firstNew; activeCall = nextCall) {
                    nextCall = activeCall.next;
                    var callbacks = activeCall.callbacks;
                    if (callbacks && activeCall.started && !activeCall.paused && callbacks.first === activeCall && callbacks.progress) {
                        callbacks.progress.call(activeCall.elements, activeCall.elements, activeCall.percentComplete, Math.max(0, activeCall.timeStart + activeCall.duration - timeCurrent), activeCall.timeStart, (activeCall.tweens["tween"] || {}).currentValue, activeCall);
                    }
                }
            }
            if (hasComplete) {
                for (activeCall = VelocityStatic.State.first; activeCall && activeCall !== VelocityStatic.State.firstNew; activeCall = nextCall) {
                    nextCall = activeCall.next;
                    if (activeCall.started && !activeCall.paused && activeCall.percentComplete === 1) {
                        VelocityStatic.completeCall(activeCall);
                    }
                }
            }
        }
        if (VelocityStatic.State.isTicking) {
            ticker(tick);
        } else {
            VelocityStatic.lastTick = 0;
        }
    }
    VelocityStatic.tick = tick;
})(VelocityStatic || (VelocityStatic = {}));

var VelocityStatic;

(function(VelocityStatic) {
    VelocityStatic.timestamp = true;
})(VelocityStatic || (VelocityStatic = {}));

function expandTweens() {
    var State = VelocityStatic.State, activeCall = State.firstNew;
    var _loop_2 = function() {
        var elements = activeCall.elements, elementsLength = elements.length, element = activeCall.element, elementArrayIndex = elements.indexOf(element), callbacks = activeCall.callbacks;
        if (isNode(element)) {
            var data_5 = Data(element), lastAnimation_1, propertiesMap = activeCall.properties;
            if (data_5 && data_5.isAnimating && activeCall.queue !== false) {
                lastAnimation_1 = data_5.lastAnimationList[activeCall.queue];
            }
            function parsePropertyValue(valueData, skipResolvingEasing) {
                var endValue, easing, startValue;
                if (isFunction(valueData)) {
                    valueData = valueData.call(element, elementArrayIndex, elementsLength);
                }
                if (Array.isArray(valueData)) {
                    endValue = valueData[0];
                    if (!Array.isArray(valueData[1]) && /^[\d-]/.test(valueData[1]) || isFunction(valueData[1]) || VelocityStatic.CSS.RegEx.isHex.test(valueData[1])) {
                        startValue = valueData[1];
                    } else if (isString(valueData[1]) && !VelocityStatic.CSS.RegEx.isHex.test(valueData[1]) && VelocityStatic.Easings[valueData[1]] || Array.isArray(valueData[1])) {
                        easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1], activeCall.duration);
                        startValue = valueData[2];
                    } else {
                        startValue = valueData[1] || valueData[2];
                    }
                } else {
                    endValue = valueData;
                }
                if (!skipResolvingEasing) {
                    easing = easing || activeCall.easing;
                }
                if (isFunction(endValue)) {
                    endValue = endValue.call(element, elementArrayIndex, elementsLength);
                }
                if (isFunction(startValue)) {
                    startValue = startValue.call(element, elementArrayIndex, elementsLength);
                }
                return [ endValue || 0, easing, startValue ];
            }
            fixPropertyValue = function(property, valueData) {
                var rootProperty = VelocityStatic.CSS.Hooks.getRoot(property), rootPropertyValue, endValue = valueData[0], easing = valueData[1], startValue = valueData[2], pattern;
                if ((!data_5 || !data_5.isSVG) && rootProperty !== "tween" && VelocityStatic.CSS.Names.prefixCheck(rootProperty)[1] === false && VelocityStatic.CSS.Normalizations.registered[rootProperty] === undefined) {
                    if (VelocityStatic.debug) {
                        console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");
                    }
                    return;
                }
                if ((activeCall.display !== undefined && activeCall.display !== null && activeCall.display !== "none" || activeCall.visibility !== undefined && activeCall.visibility !== "hidden") && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
                    startValue = 0;
                }
                if (lastAnimation_1 && lastAnimation_1.tweens[property]) {
                    if (startValue === undefined) {
                        startValue = lastAnimation_1.tweens[property].endValue + lastAnimation_1.tweens[property].unitType;
                    }
                    rootPropertyValue = data_5.rootPropertyValueCache[rootProperty];
                } else {
                    if (VelocityStatic.CSS.Hooks.registered[property]) {
                        if (startValue === undefined) {
                            rootPropertyValue = VelocityStatic.CSS.getPropertyValue(element, rootProperty);
                            startValue = VelocityStatic.CSS.getPropertyValue(element, property, rootPropertyValue);
                        } else {
                            rootPropertyValue = VelocityStatic.CSS.Hooks.templates[rootProperty][1];
                        }
                    } else if (startValue === undefined) {
                        startValue = VelocityStatic.CSS.getPropertyValue(element, property);
                    }
                }
                var separatedValue, endValueUnitType, startValueUnitType, operator = false;
                var separateValue = function(property, value) {
                    var unitType, numericValue;
                    numericValue = (value || "0").toString().toLowerCase().replace(/[%A-z]+$/, function(match) {
                        unitType = match;
                        return "";
                    });
                    if (!unitType) {
                        unitType = VelocityStatic.CSS.Values.getUnitType(property);
                    }
                    return [ numericValue, unitType ];
                };
                if (startValue !== endValue && isString(startValue) && isString(endValue)) {
                    pattern = "";
                    var iStart = 0, iEnd = 0, aStart = [], aEnd = [], inCalc = 0, inRGB = 0, inRGBA = 0;
                    startValue = VelocityStatic.CSS.Hooks.fixColors(startValue);
                    endValue = VelocityStatic.CSS.Hooks.fixColors(endValue);
                    while (iStart < startValue.length && iEnd < endValue.length) {
                        var cStart = startValue[iStart], cEnd = endValue[iEnd];
                        if (/[\d\.-]/.test(cStart) && /[\d\.-]/.test(cEnd)) {
                            var tStart = cStart, tEnd = cEnd, dotStart = ".", dotEnd = ".";
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
                            var uStart = VelocityStatic.CSS.Hooks.getUnit(startValue, iStart), uEnd = VelocityStatic.CSS.Hooks.getUnit(endValue, iEnd);
                            iStart += uStart.length;
                            iEnd += uEnd.length;
                            if (uStart === uEnd) {
                                if (tStart === tEnd) {
                                    pattern += tStart + uStart;
                                } else {
                                    pattern += "{" + aStart.length + (inRGB ? "!" : "") + "}" + uStart;
                                    aStart.push(parseFloat(tStart));
                                    aEnd.push(parseFloat(tEnd));
                                }
                            } else {
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
                            if (inCalc === 0 && cStart === "c" || inCalc === 1 && cStart === "a" || inCalc === 2 && cStart === "l" || inCalc === 3 && cStart === "c" || inCalc >= 4 && cStart === "(") {
                                inCalc++;
                            } else if (inCalc && inCalc < 5 || inCalc >= 4 && cStart === ")" && --inCalc < 5) {
                                inCalc = 0;
                            }
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
                    separatedValue = separateValue(property, startValue);
                    startValue = separatedValue[0];
                    startValueUnitType = separatedValue[1];
                    separatedValue = separateValue(property, endValue);
                    endValue = separatedValue[0].replace(/^([+-\/*])=/, function(match, subMatch) {
                        operator = subMatch;
                        return "";
                    });
                    endValueUnitType = separatedValue[1];
                    startValue = parseFloat(startValue) || 0;
                    endValue = parseFloat(endValue) || 0;
                    if (endValueUnitType === "%") {
                        if (/^(fontSize|lineHeight)$/.test(property)) {
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
            if (propertiesMap) {
                for (var property in propertiesMap) {
                    if (!propertiesMap.hasOwnProperty(property)) {
                        continue;
                    }
                    propertyName = VelocityStatic.CSS.Names.camelCase(property), valueData = parsePropertyValue(propertiesMap[property]);
                    fixPropertyValue(propertyName, valueData);
                }
                activeCall.properties = undefined;
            }
            if (data_5) {
                if (activeCall.queue !== false) {
                    data_5.lastAnimationList[activeCall.queue] = activeCall;
                }
                data_5.isAnimating = true;
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
    VelocityStatic.version = {
        major: MAJOR,
        minor: MINOR,
        patch: PATCH
    };
})(VelocityStatic || (VelocityStatic = {}));

function Velocity() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    function getChain() {
        var promise = promiseData.promise, output = elementsWrapped;
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
    var syntacticSugar = arguments[0] && (arguments[0].p || (isPlainObject(arguments[0].properties) && !arguments[0].properties.names || isString(arguments[0].properties))), isUtility = !isNode(this) && !isWrapped(this), elementsWrapped, argumentIndex, elements, propertiesMap, options, promiseData = {
        promise: null,
        resolver: null,
        rejecter: null
    };
    if (isUtility) {
        argumentIndex = 1;
        elements = syntacticSugar ? arguments[0].elements || arguments[0].e : arguments[0];
    } else {
        argumentIndex = 0;
        elements = isNode(this) ? [ this ] : this;
        elementsWrapped = elements;
    }
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
            if (!propertiesMap || (options && isBoolean(options.promiseRejectEmpty) ? options.promiseRejectEmpty : VelocityStatic.defaults.promiseRejectEmpty) === true) {
                promiseData.rejecter("Velocity: No elements supplied, if that is deliberate then pass `promiseRejectEmpty:false` as an option. Aborting.");
            } else {
                promiseData.resolver();
            }
        }
        return getChain();
    }
    var elementsLength = elements.length;
    if (!/^(stop|finish|finishAll|pause|resume)$/i.test(propertiesMap) && !isPlainObject(options)) {
        var startingArgumentPosition = argumentIndex + 1;
        options = {};
        for (var i = startingArgumentPosition; i < arguments.length; i++) {
            if (!Array.isArray(arguments[i]) && (/^(fast|normal|slow)$/i.test(arguments[i]) || /^\d/.test(arguments[i]))) {
                options.duration = arguments[i];
            } else if (isString(arguments[i]) || Array.isArray(arguments[i])) {
                options.easing = arguments[i];
            } else if (isFunction(arguments[i])) {
                options.complete = arguments[i];
            }
        }
    }
    var action;
    switch (propertiesMap) {
      case "scroll":
        action = "scroll";
        break;

      case "reverse":
        action = "reverse";
        break;

      case "pause":
        var queueName = options === undefined ? "" : options, activeCall = VelocityStatic.State.first, nextCall;
        for (;activeCall; activeCall = nextCall) {
            nextCall = activeCall.next;
            if (activeCall.paused !== true) {
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
        return getChain();

      case "resume":
        var queueName = options === undefined ? "" : options, activeCall = VelocityStatic.State.first, nextCall;
        for (;activeCall; activeCall = nextCall) {
            nextCall = activeCall.next;
            if (activeCall.paused !== false) {
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
        return getChain();

      case "finishAll":
        if (options === true || isString(options)) {
            elements.forEach(function(element) {
                var animation;
                while (animation = dequeue(element, isString(options) ? options : undefined)) {
                    animation.queue = false;
                }
            });
            expandTweens();
        }

      case "finish":
      case "stop":
        var callsToStop = [];
        var queueName = options === undefined ? "" : options, activeCall = VelocityStatic.State.first, nextCall;
        for (;activeCall; activeCall = nextCall) {
            nextCall = activeCall.next;
            var queueName_1 = options === undefined ? VelocityStatic.defaults.queue : options;
            if (queueName_1 !== true && activeCall.queue !== queueName_1 && !(options === undefined && activeCall.queue === false)) {
                continue;
            }
            for (var i_1 = 0; i_1 < elementsLength; i_1++) {
                var element = elements[i_1];
                if (element === activeCall.element) {
                    activeCall.started = true;
                    activeCall.queue = false;
                    if (options === true || isString(options)) {
                        var animation;
                        while (animation = dequeue(element, isString(options) ? options : undefined, true)) {
                            var callbacks_1 = animation.callbacks;
                            if (callbacks_1.resolver) {
                                callbacks_1.resolver(animation.elements);
                                callbacks_1.resolver = undefined;
                            }
                        }
                    }
                    if (propertiesMap === "stop") {
                        activeCall.timeStart = -1;
                        callsToStop.push(activeCall);
                    } else if (propertiesMap === "finish" || propertiesMap === "finishAll") {
                        activeCall.timeStart = -1;
                    }
                }
            }
        }
        if (propertiesMap === "stop") {
            callsToStop.forEach(function(activeCall) {
                VelocityStatic.completeCall(activeCall, true);
            });
            if (promiseData.promise) {
                promiseData.resolver(elements);
            }
        }
        return getChain();

      default:
        if (isPlainObject(propertiesMap) && !isEmptyObject(propertiesMap)) {
            action = "start";
        } else if (isString(propertiesMap) && VelocityStatic.Redirects[propertiesMap]) {
            var opts = __assign({}, options), durationOriginal = parseFloat(options.duration), delayOriginal = parseFloat(options.delay) || 0;
            if (opts.backwards === true) {
                elements = elements.reverse();
            }
            elements.forEach(function(element, elementIndex) {
                if (parseFloat(opts.stagger)) {
                    opts.delay = delayOriginal + parseFloat(opts.stagger) * elementIndex;
                } else if (isFunction(opts.stagger)) {
                    opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
                }
                if (opts.drag) {
                    opts.duration = durationOriginal || (/^(callout|transition)/.test(propertiesMap) ? 1e3 : DURATION_DEFAULT);
                    opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex / elementsLength : (elementIndex + 1) / elementsLength), opts.duration * .75, 200);
                }
                VelocityStatic.Redirects[propertiesMap].call(element, element, opts, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
            });
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
    function parseTime(value, def) {
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
                return parseFloat(value.replace("ms", "").replace("s", "000")) || 0;
            }
        }
        return parseTime(def, 0);
    }
    var optionsDuration = parseTime(options.duration, VelocityStatic.defaults.duration || DURATION_DEFAULT), optionsDelay = parseTime(options.delay, VelocityStatic.defaults.delay || 0);
    if (options.display !== undefined && options.display !== null) {
        var optionsDisplay = options.display.toString().toLowerCase();
        if (optionsDisplay === "auto") {}
    }
    if (options.visibility !== undefined && options.visibility !== null) {
        var optionsVisibility = options.visibility.toString().toLowerCase();
    }
    if (VelocityStatic.mock === true) {
        optionsDelay = 0;
        optionsDuration = 1;
    } else if (VelocityStatic.mock) {
        var mock = parseFloat(VelocityStatic.mock) || 1;
        optionsDelay *= mock;
        optionsDuration *= mock;
    }
    var optionsEasing = getEasing(options.easing, optionsDuration);
    var optionsLoop = options.loop || 0;
    var optionsRepeat = options.repeat || 0;
    var optionsMobileHA = options.mobileHA && VelocityStatic.State.isMobile && !VelocityStatic.State.isGingerbread;
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (isNode(element) && Data(element) === undefined) {
            VelocityStatic.init(element);
        }
    }
    var callbacks = {
        first: undefined,
        total: elementsLength,
        started: 0,
        completed: 0,
        begin: isFunction(options.begin) && options.begin,
        complete: isFunction(options.complete) && options.complete,
        progress: isFunction(options.progress) && options.progress,
        resolver: promiseData.resolver
    };
    for (var i_2 = 0, length_1 = elementsLength; i_2 < length_1; i_2++) {
        var element = elements[i_2], animation_1 = VelocityStatic.getAnimationCall();
        animation_1.callbacks = callbacks;
        animation_1.delay = optionsDelay;
        animation_1.display = optionsDisplay;
        animation_1.duration = optionsDuration;
        animation_1.easing = optionsEasing;
        animation_1.elements = elements;
        animation_1.element = element;
        animation_1.ellapsedTime = 0;
        animation_1.loop = Math.max(0, optionsLoop * 2 - 1);
        animation_1.mobileHA = optionsMobileHA;
        animation_1.properties = propertiesMap;
        animation_1.queue = options.queue === false ? false : isString(options.queue) ? options.queue : VelocityStatic.defaults.queue;
        animation_1.repeat = animation_1.repeatAgain = optionsRepeat;
        animation_1.timeStart = 0;
        animation_1.tweens = Object.create(null);
        animation_1.visibility = optionsVisibility;
        queue(elements[0], animation_1, animation_1.queue);
        expandTweens();
    }
    if (VelocityStatic.State.isTicking === false) {
        VelocityStatic.State.isTicking = true;
        VelocityStatic.tick();
    }
    return getChain();
}

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

var global = this;

VelocityStatic.CSS.Hooks.register();

VelocityStatic.CSS.Normalizations.register();

global.Velocity = Velocity;

if (window === global) {
    defineProperty(window.jQuery, "Velocity", Velocity);
    defineProperty(window.jQuery && window.jQuery.fn, "velocity", Velocity);
    defineProperty(window.Zepto, "Velocity", Velocity);
    defineProperty(window.Zepto && window.Zepto.fn, "velocity", Velocity);
    defineProperty(Element && Element.prototype, "velocity", Velocity);
    defineProperty(NodeList && NodeList.prototype, "velocity", Velocity);
    defineProperty(HTMLCollection && HTMLCollection.prototype, "velocity", Velocity);
}

if (IE <= 8) {
    throw new Error("VelocityJS cannot run on Internet Explorer 8 or earlier");
}

for (var key in VelocityStatic) {
    Velocity[key] = VelocityStatic[key];
}
//# sourceMappingURL=velocity.js.map
	return Velocity;
}));
