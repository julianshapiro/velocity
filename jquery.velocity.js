/***************
    Details
***************/

/*!
* Velocity.js: Accelerated JavaScript animation.
* @version 0.0.0
* @requires jQuery.js
* @docs julian.com/research/velocity
* @license Copyright 2014 Julian Shapiro. MIT License: http://en.wikipedia.org/wiki/MIT_License
*/    

/****************
     Summary
****************/

/*
Velocity recreates the entirety of jQuery's CSS stack and builds a concise animation layer on top of it. To minimize DOM interaction, Velocity reuses previous animation values and batches DOM queries.
Whenever Velocity triggers a DOM query (a GET) or a DOM update (a SET), a comment indicating as much is placed next to the offending line of code.
Watch these talks to learn about the nuances of DOM performance: https://www.youtube.com/watch?v=cmZqLzPy0XE and https://www.youtube.com/watch?v=n8ep4leoN9A

Velocity is structured into four sections:
- CSS Stack: Works independently from the rest of Velocity.
- $.fn.velocity is the jQuery object extension that, when triggered, iterates over the targeted element set and queues the incoming Velocity animation onto each element individually. This process consists of:
  - Pre-Queueing: Prepare the element for animation by instantiating its data cache and processing the call's options argument.
  - Queueing: The logic that runs once the call has reached its point of execution in the element's $.queue() stack. Most logic is placed here to avoid risking it becoming stale.
  - Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
- Tick: The single requestAnimationFrame loop responsible for tweening all in-progress calls.
- completeCall: Handles the cleanup process for each Velocity call.

To interoperate with jQuery, Velocity uses jQuery's own $.queue() stack for all queuing logic. This has the byproduct of slightly bloating our codebase since $.queue()'s behavior is not straightforward.
The biggest cause of both codebase bloat and codepath obfuscation in Velocity is its support for animating compound-value CSS properties (e.g. "textShadow: 0px 0px 0px black" and "transform: skew(45) scale(1.5)").
*/

/*****************
    Structure
*****************/

/*
- Helper Functions
- Aborting
- Easings
- Constants
- Utility Function & State
- CSS Class Extraction
- CSS Stack
- $.fn.velocity
  - Pre-Queueing
  - Queueing
  - Pushing
- Tick
- Complete Call
*/

;(function ($, window, document, undefined) {  

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

    /* RAF polyfill. Gist: https://gist.github.com/julianshapiro/9497513 */
    var requestAnimationFrame = window.requestAnimationFrame || (function() { 
        var timeLast = 0;

        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {                
            var timeCurrent = (new Date()).getTime(),
                timeDelta;

            /* Dynamically set delay on a per-tick basis to match 60fps. */
            /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
            timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
            timeLast = timeCurrent + timeDelta;

            return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
        };
    })();

    /* Sparse array compacting. Copyright Lo-Dash. MIT License: https://github.com/lodash/lodash/blob/master/LICENSE.txt */
    function compactSparseArray (array) {
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

    /* Determine if a variable is a function. */
    function isFunction(variable) {
        return Object.prototype.toString.call(variable) === "[object Function]";
    }

    /****************
        Aborting
    ****************/

    /* Nothing prevents Velocity from working on IE6+7, but it is not worth the time to test on them. Simply revert to jQuery (and lose Velocity's extra features). */
    if (IE <= 7) {
        /* Revert to $.animate() and abort this Velocity declaration. */
        $.fn.velocity = $.fn.animate;

        return;
    } else if ($.velocity !== undefined || $.fn.velocity !== undefined) {
        console.log("Velocity is already loaded or its namespace is occupied.");

        return;
    } 

    /**************
        Easings
    **************/

    /* Velocity embeds jQuery UI's easings to save users from having to include an additional library to their page. */
    /* Copyright The jQuery Foundation. MIT License: https://jquery.org/license */
    (function () {
        var baseEasings = {};

        $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(i, name) {
            baseEasings[name] = function(p) {
                return Math.pow(p, i + 2);
            };
        });

        $.extend(baseEasings, {
            Sine: function (p) {
                return 1 - Math.cos(p * Math.PI / 2);
            },
            Circ: function (p) {
                return 1 - Math.sqrt(1 - p * p);
            },
            Elastic: function(p) {
                return p === 0 || p === 1 ? p :
                    -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
            },
            Back: function(p) {
                return p * p * (3 * p - 2);
            },
            Bounce: function (p) {
                var pow2,
                    bounce = 4;

                while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
                return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
            }
        });

        $.each(baseEasings, function(name, easeIn) {
            $.easing["easeIn" + name] = easeIn;
            $.easing["easeOut" + name] = function(p) {
                return 1 - easeIn(1 - p);
            };
            $.easing["easeInOut" + name] = function(p) {
                return p < 0.5 ?
                    easeIn(p * 2) / 2 :
                    1 - easeIn(p * -2 + 2) / 2;
            };
        });

        /* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
        $.easing["spring"] = function(p) {
            return 1 - (Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6));
        };
    })(); 

    /*****************
        Constants
    *****************/

    var NAME = "velocity";

    /******************************
       Utility Function & State
    ******************************/

    /* In addition to extending jQuery's $.fn object, Velocity also registers itself as a jQuery utility ($.) function so that certain features are accessible beyond just a per-element scope. */
    /* Note: The utility function doubles as a publicly-accessible data store for the purposes of unit testing. */
    $.velocity = {
        /* Container for page-wide Velocity state data. */
        State: {
            /* Detect mobile devices to determine if mobileHA should be turned on. */
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            /* Create a cached element for re-use when checking for CSS property prefixes. */
            prefixElement: document.createElement("div"),
            /* Cache every prefix match to avoid repeating lookups. */
            prefixMatches: {},
            /* Cache the anchor used for animating window scrolling. */
            scrollAnchor: null,
            /* Cache the property name associated with the scroll anchor. */
            scrollProperty: null,
            /* Keep track of whether our RAF tick is running. */
            isTicking: false,
            /* Container for every in-progress call to Velocity. */
            calls: []
        },
        Classes: {
            /* Container for CSS classes extracted from the page's stylesheets. */
            extracted: {},
            /* Function to allow users to force stylesheet re-extraction. */
            extract: function() { /* Defined below. */ }
        },
        /* Velocity's full re-implementation of jQuery's CSS stack. Made global for unit testing. */
        CSS: { /* Defined below. */ },
        /* Container for custom animation sequences that are referenced by name via Velocity's first argument (instead of passing in a properties map). */
        Sequences: {
            /* Manually extended by the user. */
        },
        /* Utility function's alias of $.fn.velocity(). Used for raw DOM element animation. */
        animate: function () { /* Defined below. */ },
        /* Set to 1 or 2 (most verbose) to log debug info to console. */
        debug: false
    };

    /* Retrieve the appropriate scroll anchor and property name for this browser. Learn more here: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY */
    if (window.pageYOffset !== undefined) {
        $.velocity.State.scrollAnchor = window;
        $.velocity.State.scrollProperty = "pageYOffset";
    } else {
        $.velocity.State.scrollAnchor = document.documentElement || document.body.parentNode || document.body;
        $.velocity.State.scrollProperty = "scrollTop";
    }

    /*************************
       CSS Class Extraction
    *************************/

    /* Crawl all same-domain stylesheets for classes formatted as .animate_{name}. Store matches onto $.velocity.Classes.extracted for reference during runtime, e.g. $element.velocity("name", optionsObject). */
    /* Extraction involves processing flattened cssText strings for each CSS rule, such as ".animate_{name} { width: 100 }" then appending an object onto $.velocity.Classes with a name equal to the Name and
       property:value pairs equal to the rule's property map. */
    /* Note: To avoid triggering unwanted extraction overhead, extraction must be triggered manually -- by calling $.velocity.Classes.extract(). (Note: Ensure that the relevant stylesheets have first been parsed by the browser.)
    /* Note: Whereas jQuery UI's class animation works by momentarily apply the class to an element then diffing the results to attain properly cascaded values, Velocity treats the class a literal property map
       container in order to avoid the layout thrashing associated with CSS value diffing. Thus, Velocity does not respect the hierarchical selector position of the .animate_{name} classes that it extracts. */
    /* Note: Browsers do not parse classes defined in the <head> element the same way they do stylesheet classes. Avoid setting styles inside HTML. */
    $.velocity.Classes.extract = function() {
        var styleSheets = document.styleSheets,
            extracted = {};

        for (var i = 0, styleSheetsLength = styleSheets.length; i < styleSheetsLength; i++) {
            var sheet = styleSheets[i],
                rules;

            /* Stylesheet crawling is wrapped in a try/catch since Firefox throws errors when accessing cross-domain stylesheets. Other browsers simply return null. */
            try { 
                if (!sheet.cssText && !sheet.cssRules) {
                    /* <=IE8 stylesheets contain a cssText string. Other browsers contain a cssRules object. If a match contains neither, then the browser is returning null since we're accessing a cross-domain stylesheet. Skip this sheet. */
                    continue;
                }

                /* <=IE8 return a giant, cocatenated cssText string that represents all classes defined in the stylesheet. To process this blob, newlines are removed then each rule is extracted via RegEx. */
                /* Other browsers return the cssText object which can be iterated over but still requires a fair amount of RegEx to extract individual properties and values. */
                if (sheet.cssText) {
                    /* Note: A property with a closing curly bracket (}) in its value will break a match, but only URI's would permit this character and URI's aren't numeric values that we can animate, so this is not an issue. */
                    /* Example RegEx behavior: http://regex101.com/r/wK9yA5 */
                    rules = sheet.cssText.replace(/[\r\n]/g, "").match(/[^}]+\{[^{]+\}/g);
                } else {
                    rules = sheet.cssRules;
                }

                for (var j = 0, rulesLength = rules.length; j < rulesLength; j++) {
                    var ruleText;

                    /* For <=IE8, our rules object now consists of all CSS rules flattened into strings. For other browsers, each rules object is now a metadata container for the specific rule. To achieve parity with the IE8 rule, we work with the cssText property of the non-<=IE8 rule's metadata container, which is also a flattened string. */
                    if (sheet.cssText) {
                        ruleText = rules[j];
                    /* Non-<=IE8 parse everything they can out of stylesheets, including declarations like "@charset UTF-8", which inherently have no cssText property to parse out. Thus, we ensure the existence of cssText. */
                    } else if (rules[j].cssText) {
                        ruleText = rules[j].cssText;
                    } else {
                        continue;
                    }

                    /* Match classes containing ".animate_" at the last selector position (e.g. ".animate_Name", "div.animate_Name", but not ".animate_Name p". */
                    /* Example RegEx behavior: http://regex101.com/r/oX7gK3 */
                    var animateClass = ruleText.match(/\.animate_([A-z0-9_-]+)(?:(\s+)?{)/);

                    if (animateClass) {
                        /* Extract the name after the underscore. */
                        var className = animateClass[1],
                            /* Extract the properties block then extract an array its property maps. */
                            /* Example RegEx behavior: http://regex101.com/r/fI1tZ3 */
                            /* Note: <=IE8 capitalize properties, so we normalize case. */
                            propertiesMap = ruleText.toLowerCase().match(/\{([\S\s]*)\}/)[1].match(/[A-z-][^;]+/g);

                        /* Only register this class on the classes container one time since we allow a class to be processed in aggregate across its numerous stylesheet declarations. Repeated properties overwrite their earlier values. */
                        if (!extracted[className]) {
                            extracted[className] = {};
                        }

                        for (var k = 0, propertiesMapLength = propertiesMap.length; k < propertiesMapLength; k++) {
                            /* Separate the property's name from its value, and strip out the ": " characters in between. */
                            var propertyMapParts = propertiesMap[k].match(/([^:]+):\s*(.+)/);

                            /* Register this map (e.g. "width: 100") onto its class name. */
                            extracted[className][propertyMapParts[1]] = propertyMapParts[2];
                        }
                    }
                }
                
            } catch(e) { /* Do nothing. There's no workaround for cross-domain access prevention. */ }
        }
        
        $.velocity.Classes.extracted = extracted;

        if ($.velocity.debug) console.log("Classes: " + JSON.stringify($.velocity.Classes.extracted));

        return extracted;
    };

    /*****************
        CSS Stack
    *****************/
        
    /* The CSS object is a highly condensed and performant CSS stack that fully replaces jQuery's. It handles the validation, getting, and setting of both standard CSS properties and CSS property hooks. */
    /* Note: A "CSS" shorthand is defined so that our code is easier to read. */
    var CSS = $.velocity.CSS = {   

        /*************
            RegEx
        *************/

        RegEx: {
            /* Unwrap a property value's surrounding text, e.g. "rgba(4, 3, 2, 1)" ==> "4, 3, 2, 1" and "rect(4px 3px 2px 1px)" ==> "4px 3px 2px 1px". */
            valueUnwrap: /^[A-z]+\((.*)\)$/i,
            wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
            /* Split a multi-value property into an array of subvalues, e.g. "rgba(4, 3, 2, 1) 4px 3px 2px 1px" ==> [ "rgba(4, 3, 2, 1)", "4px", "3px", "2px", "1px" ]. */
            valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/ig
        },

        /************
            Hooks 
        ************/

        /* Hooks allow a subproperty (e.g. "boxShadowBlur") of a compound-value CSS property (e.g. "boxShadow: X Y Blur Spread Color") to be animated as if it were a discrete property. */
        /* Note: Beyond enabling fine-grained property animation, hooking is necessary since Velocity only tweens properties with single numeric values; unlike CSS transitions, Velocity does not interpolate compound-values. */
        Hooks: {
            /********************
                Registration
            ********************/

            /* Templates are a concise way of indicating which subproperties must be individually registered for each compound-value CSS property. */
            /* Each template consists of the compound-value's base name, its constituent subproperty names, and those subproperties' default values. */
            templates: {
                /* Note: Colors are defaulted to white -- as opposed to black -- since colors that are currently set to "transparent" default to their respective template below when color-animated,
                   and white is typically a closer match to transparent than black is. */
                "color": [ "Red Green Blue Alpha", "255 255 255 1" ],
                "backgroundColor": [ "Red Green Blue Alpha", "255 255 255 1" ],
                "borderColor": [ "Red Green Blue Alpha", "255 255 255 1" ],
                "outlineColor": [ "Red Green Blue Alpha", "255 255 255 1" ],
                "textShadow": [ "Color X Y Blur", "black 0px 0px 0px" ],
                /* Todo: Add support for inset boxShadows. (webkit places it last whereas IE places it first.) */
                "boxShadow": [ "Color X Y Blur Spread", "black 0px 0px 0px 0px" ],
                "clip": [ "Top Right Bottom Left", "0px 0px 0px 0px" ],
                "backgroundPosition": [ "X Y", "0% 0%" ],
                "transformOrigin": [ "X Y Z", "50% 50% 0%" ],
                "perspectiveOrigin": [ "X Y", "50% 50%" ]
            },

            /* A "registered" hook is one that has been converted from its template form into a live, tweenable property. It contains data to associate it with its root property. */
            registered: {
                /* Note: A registered hook looks like this ==> textShadowBlur: [ "textShadow", 3 ], which consists of the subproperty's name, the associated root property's name,
                   and the subproperty's position in the root's value. */
            },
            /* Convert the templates into individual hooks then append them to the registered object above. */
            register: function () {
                var rootProperty,
                    hookTemplate,
                    hookNames;

                /* In IE, color values inside compound-value properties are positioned at the end the value instead of at the beginning. Thus, we re-arrange the templates accordingly. */
                if (IE) {
                    for (rootProperty in CSS.Hooks.templates) {
                        hookTemplate = CSS.Hooks.templates[rootProperty];
                        hookNames = hookTemplate[0].split(" ");

                        var defaultValues = hookTemplate[1].match(CSS.RegEx.valueSplit);

                        if (hookNames[0] === "Color") {
                            /* Reposition both the hook's name and its default value to the end of their respective strings. */
                            hookNames.push(hookNames.shift());
                            defaultValues.push(defaultValues.shift());

                            /* Replace the existing template for the hook's root property. */
                            CSS.Hooks.templates[rootProperty] = [ hookNames.join(" "), defaultValues.join(" ") ];
                        }
                    }
                 }

                /* Hook registration. */
                for (rootProperty in CSS.Hooks.templates) {
                    hookTemplate = CSS.Hooks.templates[rootProperty];
                    hookNames = hookTemplate[0].split(" ");

                    for (var i in hookNames) {
                        var fullHookName = rootProperty + hookNames[i],
                            hookPosition = i;

                        /* For each hook, register its full name (e.g. textShadowBlur) with its root property (e.g. textShadow) and the hook's position in its template's default value string. */
                        CSS.Hooks.registered[fullHookName] = [ rootProperty, hookPosition ];
                    }
                }
            },

            /*****************************
               Injection and Extraction
            *****************************/

            /* Look up the root property associated with the hook (e.g. return "textShadow" for "textShadowBlur"). */
            /* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
            getRoot: function (property) {
                var hookData = CSS.Hooks.registered[property];

                if (hookData) {
                    return hookData[0];
                } else {
                    /* If there was no hook match, return the property name untouched. */
                    return property;
                }
            },
            /* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that the targeted hook can be injected or extracted at its standard position. */
            cleanRootPropertyValue: function(rootProperty, rootPropertyValue) {
                /* If the rootPropertyValue is wrapped with "rgb()", "clip()", etc., remove the wrapping to normalize the value before manipulation. */
                if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {                        
                    rootPropertyValue = rootPropertyValue.match(CSS.Hooks.RegEx.valueUnwrap)[1];
                }

                /* If rootPropertyValue is a CSS null-value (from which there's inherently no hook value to extract), default to the root's default value as defined in CSS.Hooks.templates. */
                /* Note: CSS null-values include "none", "auto", and "transparent". They must be converted into their zero-values (e.g. textShadow: "none" ==> textShadow: "0px 0px 0px black") for hook manipulation to proceed. */
                if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                }

                return rootPropertyValue;
            },
            /* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
            extractValue: function (fullHookName, rootPropertyValue) {  
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1];

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
                    return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            },
            /* Inject the hook's value into its root property's value. This is used to piece back together the root property once Velocity has updated one of its individually hooked values through tweening. */
            injectValue: function (fullHookName, hookValue, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];
                        
                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1],
                        rootPropertyValueParts,
                        rootPropertyValueUpdated;

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue, then reconstruct the rootPropertyValue string. */
                    rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
                    rootPropertyValueParts[hookPosition] = hookValue;
                    rootPropertyValueUpdated = rootPropertyValueParts.join(" ");

                    return rootPropertyValueUpdated;
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }   
            }
        },

        /*******************
           Normalizations 
        *******************/

        /* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity) and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
        Normalizations: {
            /* Normalizations are passed a normalization vector (either the property's name, its extracted value, or its injected value), the targeted element (which may need to be queried), and the targeted property value. */
            registered: {
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

                                if (extracted) {
                                    /* Strip off commas. */
                                    extracted = extracted[1].replace(/,(\s+)?/g, " ");
                                }
                            }

                            return extracted;
                        /* Clip needs to be re-wrapped during injection. */
                        case "inject":
                            return "rect(" + propertyValue + ")";
                    }
                },

                /* <=IE8 do not support the opacity property. Further, they require opacified elements to have their zoom property set to a non-zero value. */
                opacity: function (type, element, propertyValue) {
                    if (IE <= 8) {
                        switch (type) {
                            case "name":
                                return "filter";
                            case "extract":
                                /* <=IE8 return a "filter" value of "alpha(opacity=\d{1,3})". Extract the value and convert it to a decimal value to match the standard CSS opacity property's formatting. */
                                var extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);

                                if (extracted) {
                                    /* Convert to decimal value. */
                                    propertyValue = extracted[1] / 100;
                                } else {
                                    /* When extracting opacity, default to 1 (fully visible) since a null value means opacity hasn't been set and the element is therefore fully visible. */
                                    propertyValue = 1;
                                }

                                return propertyValue;
                            case "inject":
                                element.style.zoom = 1;

                                /* As per the filter property's spec, convert the decimal value to a whole number and wrap the value. */
                                return "alpha(opacity=" + parseInt(propertyValue * 100) + ")";
                        }
                    /* With all other browsers, normalization is not required; return the same values that were passed in. */
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
                }
            },

            /*****************************
                Batched Registrations
            *****************************/

            /* Note: Batched normalizations extend the CSS.Normalizations.registered object. */
            register: function () {

                /*****************
                    Transforms
                *****************/

                /* Transforms are the subproperties contained by the CSS "transform" property. Transforms must undergo normalization so that they can be referenced in a properties map by their individual names. */
                /* Note: When transforms are "set", they are actually assigned to a per-element transformCache. When all transform setting is complete complete, CSS.flushTransformCache() must be manually called to flush the values to the DOM. 
                   Transform setting is batched in this way to improve performance: the transform style only needs to be updated once when multiple transform subproperties are being animated simultaneously. */
                var transformProperties = [ "translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ" ];

                /* IE9 has support for 2D -- but not 3D -- transforms. Since animating unsupported transform properties results in the browser ignoring the *entire* transform string, we prevent these 3D values from being normalized for these
                   browsers so that Tween Calculation logic skips animating these properties altogether (since it will detect that they're unsupported and unnormalized.) */
                if (!(IE <= 9)) {
                    /* Append 3D transform properties onto transformProperties. */
                    transformProperties = transformProperties.concat([ "translateZ", "scaleZ", "rotateX", "rotateY" ]);
                } 

                for (var i = 0, transformPropertiesLength = transformProperties.length; i < transformPropertiesLength; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that transformName's value is paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
                    (function() {
                        var transformName = transformProperties[i];

                        CSS.Normalizations.registered[transformName] = function (type, element, propertyValue) {
                            switch (type) {
                                /* The normalized property name is the parent "transform" property -- the property that is actually set in CSS. */
                                case "name":
                                    return "transform";
                                /* Transform values are cached onto a per-element transformCache object. */
                                case "extract":
                                    /* If this transform has yet to be assigned a value, return its null value. */
                                    if ($.data(element, NAME).transformCache[transformName] === undefined) {
                                        /* Scale transformProperties default to 1 whereas all other transform properties default to 0. */
                                        return /^scale/i.test(transformName) ? 1 : 0;
                                    /* When transform values are set, they are wrapped in parentheses as per the CSS spec. Thus, when extracting their values (for tween calculations), we strip off the parentheses. */
                                    } else {
                                        return $.data(element, NAME).transformCache[transformName].replace(/[()]/g, "");
                                    }
                                case "inject":
                                    var invalid = false;

                                    /* If an individual transform property contains an unsupported unit type, the browser ignores the *entire* transform property. 
                                       Thus, protect users from themselves by skipping setting for transform values supplied with invalid unit types. */
                                    /* Switch on the base transform type; ignore the axis by removing the last letter from the transform's name. */
                                    switch (transformName.substr(0, transformName.length - 1)) {
                                        /* Whitelist unit types for each transform. */
                                        case "translate":
                                            invalid = !/(%|px|em|rem|\d)$/i.test(propertyValue);
                                            break;
                                        case "scale":
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
                                        $.data(element, NAME).transformCache[transformName] = "(" + propertyValue + ")";
                                    }

                                    /* Although the value is set on the transformCache object, return the newly-updated value for the calling code to process as normal. */
                                    return $.data(element, NAME).transformCache[transformName];
                            }
                        };
                    })();
                }

                /*************
                    Colors    
                *************/

                /* Since Velocity only animates a single numeric value per property, color animation is achieved by hooking the individual RGBA components of CSS color properties. 
                   Accordingly, color values must be normalized (e.g. "#ff0000", "red", and "rgb(255, 0, 0)" ==> "255 0 0 1") so that their components can be injected/extracted by CSS.Hooks logic. */
                var colorProperties = [ "color", "backgroundColor", "borderColor", "outlineColor" ];

                for (var i = 0, colorPropertiesLength = colorProperties.length; i < colorPropertiesLength; i++) {
                    /* Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
                    function hexToRgb (hex) {
                        var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                            longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
                            rgbParts;

                        hex = hex.replace(shortformRegex, function (m, r, g, b) {
                            return r + r + g + g + b + b;
                        });

                        rgbParts = longformRegex.exec(hex);

                        return rgbParts ? "rgb(" + (parseInt(rgbParts[1], 16) + " " + parseInt(rgbParts[2], 16) + " " + parseInt(rgbParts[3], 16)) + ")" : "rgb(0 0 0)";
                    }

                    /* Wrap the dynamically generated normalization function in a new scope so that colorName's value is paired with its respective function. (Otherwise, all functions would take the final for loop's colorName.) */
                    (function () {
                        var colorName = colorProperties[i];

                        /* Note: In IE<=8, which support rgb but not rgba, colorProperties are reverted to rgb by stripping off the alpha component. */
                        CSS.Normalizations.registered[colorName] = function(type, element, propertyValue) {
                            switch (type) {
                                case "name":
                                    return colorName;
                                /* Convert all color values into the rgb format. (Old IE can return hex values and color names instead of rgb/rgba.) */
                                case "extract":
                                    var extracted;

                                    /* If the color is already in its hookable form (e.g. "255 255 255 1") due to having been previously extracted, skip extraction. */
                                    if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                        extracted = propertyValue;
                                    } else {
                                        var converted,
                                            colorNames = {
                                                aqua: "rgb(0, 255, 255);",
                                                black: "rgb(0, 0, 0)",
                                                blue: "rgb(0, 0, 255)",
                                                fuchsia: "rgb(255, 0, 255)",
                                                gray: "rgb(128, 128, 128)",
                                                green: "rgb(0, 128, 0)",
                                                lime: "rgb(0, 255, 0)",
                                                maroon: "rgb(128, 0, 0)",
                                                navy: "rgb(0, 0, 128)",
                                                olive: "rgb(128, 128, 0)",
                                                purple: "rgb(128, 0, 128)",
                                                red: "rgb(255, 0, 0)",
                                                silver: "rgb(192, 192, 192)",
                                                teal: "rgb(0, 128, 128)",
                                                white: "rgb(255, 255, 255)",
                                                yellow: "rgb(255, 255, 0)"
                                            };

                                        /* Convert color names to rgb. */
                                        if (/^[A-z]+$/i.test(propertyValue)) {
                                            if (colorNames[propertyValue] !== undefined) {
                                                converted = colorNames[propertyValue]
                                            } else {
                                                /* If an unmatched color name is provided, default to black. */
                                                converted = colorNames.black;
                                            }
                                        /* Convert hex values to rgb. */
                                        } else if (/^#([A-f\d]{3}){1,2}$/i.test(propertyValue)) {
                                            converted = hexToRgb(propertyValue);
                                        /* If the provided color doesn't match any of the accepted color formats, default to black. */
                                        } else if (!(/^rgba?\(/i.test(propertyValue))) {
                                            converted = colorNames.black;
                                        }

                                        /* Remove the surrounding "rgb/rgba()" string then replace commas with spaces and strip repeated spaces (in case the value included spaces to begin with). */
                                        extracted = (converted || propertyValue).toString().match(CSS.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ");
                                    }

                                    /* So long as this isn't <=IE8, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    if (!(IE <= 8) && extracted.split(" ").length === 3) {
                                        extracted += " 1";
                                    }

                                    return extracted;
                                case "inject":
                                    /* If this is IE<=8 and an alpha component exists, strip it off. */
                                    if (IE <= 8) {
                                        if (propertyValue.split(" ").length === 4) {
                                            propertyValue = propertyValue.split(/\s+/).slice(0, 3).join(" ");
                                        }
                                    /* Otherwise, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    } else if (propertyValue.split(" ").length === 3) {
                                        propertyValue += " 1";
                                    }

                                    /* Re-insert the browser-appropriate wrapper("rgb/rgba()"), insert commas, and strip off decimal units on all values but the fourth (R, G, and B only accept whole numbers). */
                                    return (IE <= 8 ? "rgb" : "rgba") + "(" + propertyValue.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")";
                            }
                        };
                    })();
                }
            }
        },

        /************************
           CSS Property Names 
        ************************/

        Names: {
            /* Camelcase a property name into its JavaScript notation (e.g. "background-color" ==> "backgroundColor"). Camelcasing is used to normalize property names between and across calls. */
            camelCase: function (property) {
                return property.replace(/-(\w)/g, function (match, subMatch) { 
                    return subMatch.toUpperCase();
                });
            },

            /* Determine whether a property should be set with a vendor prefix. */
            /* If a prefixed version of the property exists, return it. Otherwise, return the original property name. If the property is not at all supported by the browser, return a false flag. */
            prefixCheck: function (property) {
                /* If this property has already been checked, return the cached value. */
                if ($.velocity.State.prefixMatches[property]) {
                    return [ $.velocity.State.prefixMatches[property], true ];
                } else {
                    var vendors = [ "", "Webkit", "Moz", "ms", "O" ];

                    for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
                        var propertyPrefixed;

                        if (i === 0) {
                            propertyPrefixed = property;
                        } else {
                            /* Capitalize the first letter of the property to conform to JavaScript vendor prefix notation (e.g. webkitFilter). */
                            propertyPrefixed = vendors[i] + property.replace(/^\w/, function(match) { return match.toUpperCase(); });
                        }

                        /* Check if the browser supports this property as prefixed. */
                        if (typeof $.velocity.State.prefixElement.style[propertyPrefixed] === "string") {
                            /* Cache the match. */
                            $.velocity.State.prefixMatches[property] = propertyPrefixed;

                            return [ propertyPrefixed, true ];
                        }
                    }

                    /* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
                    return [ property, false ];
                }
            }
        },

        /************************
           CSS Property Values 
        ************************/

        Values: {
            isCSSNullValue: function (value) {
                /* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings. Thus, we check for both falsiness and these special strings. */
                /* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook templates as defined as CSS.Hooks (for the sake of hook injection/extraction). */
                /* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
                return (value == 0 || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
            },
            /* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
            getUnitType: function (property) {
                if (/^(rotate|skew)/i.test(property)) {
                    return "deg";
                } else if (/(^(scale|scaleX|scaleY|scaleZ|opacity|alpha|fillOpacity|flexGrow|flexHeight|zIndex|fontWeight)$)|color/i.test(property)) {
                    /* The above properties are unitless. */
                    return "";
                } else {
                    /* Default to px for all other properties. */
                    return "px";
                }
            }
        },

        /****************************
           Style Getting & Setting
        ****************************/

        /* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        getPropertyValue: function (element, property, rootPropertyValue, forceStyleLookup) {
            /* Get an element's computed property value. */
            /* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's style attribute (which only reflects user-defined values).
               Instead, the browser must be queried for a property's *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
            function computePropertyValue (element, property) {
                /* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an element's scrollbars are visible (which expands the element's dimensions). Thus, we defer
                   to the more accurate offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar. We subtract border and padding to get the sum of interior + scrollbar. */
                if (!forceStyleLookup) {
                    if (property === "height" && CSS.getPropertyValue(element, "boxSizing").toLowerCase() !== "border-box") {
                        return element.offsetHeight - (parseFloat(CSS.getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingBottom")) || 0);
                    } else if (property === "width" && CSS.getPropertyValue(element, "boxSizing").toLowerCase() !== "border-box") {
                        return element.offsetWidth - (parseFloat(CSS.getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingRight")) || 0);
                    }
                }

                var computedValue = 0;

                /* IE<=8 doesn't support window.getComputedStyle, thus we defer to jQuery, which has an extensive array of hacks to accurately retrieve IE8 property values.
                   Re-implementing that logic here is not worth bloating the codebase for a dying browser. The performance repercussions of using jQuery here are minimal since
                   Velocity is optimized to rarely (and sometimes never) query the DOM. Further, the $.css() codepath isn't that slow. */
                if (IE <= 8) {
                    computedValue = $.css(element, property); /* GET */
                /* All other browsers support getComputedStyle. The returned live object reference is cached onto its associated element so that it does not need to be refetched upon every GET. */
                } else {
                    var computedStyle;

                    /* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
                    if ($.data(element, NAME) === undefined) {
                        computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If the computedStyle object has yet to be cached, do so now. */
                    } else if (!$.data(element, NAME).computedStyle) {
                        computedStyle = $.data(element, NAME).computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If computedStyle is cached, use it. */
                    } else {
                        computedStyle = $.data(element, NAME).computedStyle;
                    }

                    /* IE doesn't return a value for borderColor -- it only returns individual values for each border side's color. As a polyfill, default to querying for just the top border's color. */
                    if (IE && property === "borderColor") {
                        property = "borderTopColor";
                    }

                    /* IE9 has a bug in which the "filter" property must be accessed from computedStyle using the getPropertyValue method instead of a direct property lookup. 
                       The getPropertyValue method is slower than a direct lookup, which is why we avoid it by default. */
                    if (IE === 9 && property === "filter") {
                        computedValue = computedStyle.getPropertyValue(property); /* GET */
                    } else {
                        computedValue = computedStyle[property];
                    } 

                    /* Fall back to the property's style value (if defined) when computedValue returns nothing, which can happen when the element hasn't been painted. */
                    if (computedValue === "") {
                        computedValue = element.style[property];
                    }
                }

                /* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position, defer to jQuery for converting "auto" to a numeric value.
                   (For elements with a "static" or "relative" position, "auto" has the same effect as being set to 0, so no conversion is necessary.) */
                /* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left" property, which reverts to "auto", left's value is 0 relative to its parent element,
                   but is often non-zero relative to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
                if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
                    var position = computePropertyValue(element, "position"); /* GET */

                    /* For absolute positioning, jQuery's $.position() only returns values for top and left; right and bottom will have their "auto" value reverted to 0. */
                    /* Note: A jQuery object must be created here since jQuery doesn't have a low-level alias for $.position(). Not a big deal since we're currently in a GET batch anyway. */
                    if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
                        /* Note: jQuery strips the pixel unit from its returned values; we re-add it here to conform with computePropertyValue's behavior. */
                        computedValue = $(element).position()[property] + "px"; /* GET */
                    }
                }

                return computedValue;
            }

            var propertyValue;

            /* If this is a hooked property (e.g. "clipLeft" instead of the root property of "clip"), extract the hook's value from a normalized rootPropertyValue using CSS.Hooks.extractValue(). */
            if (CSS.Hooks.registered[property]) {
                var hook = property,
                    hookRoot = CSS.Hooks.getRoot(hook);

                /* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM), query the DOM for the root property's value. */
                if (rootPropertyValue === undefined) {
                    /* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
                    rootPropertyValue = CSS.getPropertyValue(element, CSS.Names.prefixCheck(hookRoot)[0]); /* GET */
                }

                /* If this root has a normalization registered, peform the associated normalization extraction. */
                if (CSS.Normalizations.registered[hookRoot]) {
                    rootPropertyValue = CSS.Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
                }

                /* Extract the hook's value. */
                propertyValue = CSS.Hooks.extractValue(hook, rootPropertyValue);

            /* If this is a normalized property (e.g. "opacity" becomes "filter" in <=IE8) or "translateX" becomes "transform"), normalize the property's name and value, and handle the special case of transforms. */
            /* Note: Normalizing a property is mutually exclusive from hooking a property since hook-extracted values are strictly numerical and therefore do not require normalization extraction. */
            } else if (CSS.Normalizations.registered[property]) {  
                var normalizedPropertyName,
                    normalizedPropertyValue;

                normalizedPropertyName = CSS.Normalizations.registered[property]("name", element);                

                /* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache. At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
                   This is because parsing 3D transform matrices is not always accurate and would bloat our codebase; thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
                if (normalizedPropertyName !== "transform") {                    
                    normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

                    /* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
                    if (CSS.Values.isCSSNullValue(normalizedPropertyValue) && CSS.Hooks.templates[property]) {
                        normalizedPropertyValue = CSS.Hooks.templates[property][1];
                    }
                }

                propertyValue = CSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
            }

            /* If a value wasn't produced via hook extraction or normalization, query the DOM. */
            if (!/^[\d-]/.test(propertyValue)) {
                propertyValue = computePropertyValue(element, CSS.Names.prefixCheck(property)[0]); /* GET */
            }

            /* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values), convert CSS null-values to an integer of value 0. */
            if (CSS.Values.isCSSNullValue(propertyValue)) {
                propertyValue = 0;
            }            

            if ($.velocity.debug >= 2) console.log("Get " + property + ": " + propertyValue);

            return propertyValue;
        },

        /* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        setPropertyValue: function(element, property, propertyValue, rootPropertyValue, scrollContainer) {
            var propertyName = property;    

            /* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
            if (property === "scroll") {
                /* If a scrollContainer option is present, scroll the container instead of the browser window. */
                if (scrollContainer) {
                    scrollContainer.scrollTop = propertyValue;
                /* Otherwise, Velocity defaults to scrolling the browser window. */
                } else {
                    /* Note: When scrolling the browser window, the horizontal scroll position is reset to 0; Velocity does not support horizontal scroll animation. */
                    window.scrollTo(null, propertyValue);
                }
            } else {
                /* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache(). Thus, for now, we merely cache transforms being SET. */
                if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]("name", element) === "transform") {
                    /* Perform a normalization injection. */
                    /* Note: The normalization logic handles the transformCache updating. */
                    CSS.Normalizations.registered[property]("inject", element, propertyValue);

                    propertyName = "transform";
                    propertyValue = $.data(element, NAME).transformCache[property];
                } else {
                    /* Inject hooks. */
                    if (CSS.Hooks.registered[property]) {
                        var hookName = property,
                            hookRoot = CSS.Hooks.getRoot(property);

                        /* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
                        rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot); /* GET */

                        propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
                        property = hookRoot;
                    }   

                    /* Normalize names and values. */
                    if (CSS.Normalizations.registered[property]) {
                        propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
                        property = CSS.Normalizations.registered[property]("name", element);  
                    }

                    /* Assign the appropriate vendor prefix before perform an official style update. */
                    propertyName = CSS.Names.prefixCheck(property)[0];

                    /* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width. Try/catch is avoided for other browsers since it incurs a performance overhead. */
                    if (IE <= 8) {
                        try {
                            element.style[propertyName] = propertyValue;
                        } catch (e) { console.log("Error setting [" + propertyName + "] to [" + propertyValue + "]"); }
                    } else {
                        element.style[propertyName] = propertyValue;
                    }

                    if ($.velocity.debug >= 2) console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
                }
            }

            /* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
            return [ propertyName, propertyValue ];
        },

        /* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
        /* Note: Velocity does not apply transform values in the same order that they were defined in the call's property map. Doing so would become problematic since there'd
           be no indication of how an element's existing transforms should be re-ordered along with the new ones. */
        flushTransformCache: function(element) {
            var transformString = "",
                transformName,
                transformValue;

            /* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
            for (transformName in $.data(element, NAME).transformCache) {
                transformValue = $.data(element, NAME).transformCache[transformName];

                /* IE9 only supports one rotation type: rotateZ. It refers to rotateZ directly as "rotate". */
                if (IE === 9 && transformName === "rotateZ") {
                    transformName = "rotate";
                }

                transformString += transformName + transformValue + " ";
            }

            CSS.setPropertyValue(element, "transform", transformString);
        }
    };    

    /* Register hooks and normalizations. */
    CSS.Hooks.register();
    CSS.Normalizations.register();

    /*******************
       $.fn.velocity
    *******************/

    /* Simultaneously assign the jQuery plugin function ($elements.velocity()) and the utility alias ($.velocity.animate(elements)). */
    /* Note: The utility alias allows for the animation of raw (non-jQuery) DOM elements. */
    $.fn.velocity = $.velocity.animate = function() {

        /**************************
           Arguments Assignment
        **************************/

        /* When Velocity is called via the utility function, elements are explicitly passed in as the first parameter. Thus, argument positioning can vary. We normalize them here. */
        var isJquery,
            elements,
            propertiesMap,
            options,
            opt2,
            opt3;

        /* Detect jQuery elements by checking for the "jquery" property on the element or element set. */
        if (this.jquery) {
            isJquery = true;

            elements = this;
            propertiesMap = arguments[0];
            options = arguments[1];
        /* Otherwise, raw elements are being animated via the utility function. */
        } else {
            isJquery = false;

            elements = arguments[0];
            propertiesMap = arguments[1];
            options = arguments[2];
        }        

        /**********************
           Action Detection
        **********************/

        /* Velocity's behavior is categorized into "actions": Elements can either be specially scrolled into view, or they can be started, stopped, or reversed. If a literal or referenced properties map is passed
           in as Velocity's first argument, the associated action is "start". Alternatively, "scroll", "reverse", or "stop" can be passed in instead of a properties map. */
        var action;

        switch (propertiesMap) {
            case "scroll":
                action = "scroll";
                break;

            case "reverse":
                action = "reverse";
                break;

            case "stop":
                action = "stop";
                break;

            default:
                /* Treat a plain, non-empty object as a literal properties map. */
                if ($.isPlainObject(propertiesMap) && !$.isEmptyObject(propertiesMap)) {
                    action = "start";
                /* If this first argument is a string, check if it matches a user-defined sequence. (See Sequences above.) */
                } else if (typeof propertiesMap === "string" && $.velocity.Sequences[propertiesMap]) {
                    $.velocity.Sequences[propertiesMap].call(elements, options);

                    return true;
                /* Otherwise, check if the string matches an extracted CSS class. (See CSS Class Extraction above.) */
                } else if (typeof propertiesMap === "string" && $.velocity.Classes.extracted[propertiesMap]) {
                    /* Assign the map to that of the extracted CSS class being referenced. */
                    propertiesMap = $.velocity.Classes.extracted[propertiesMap];
                    action = "start";
                } else {
                    /* Abort if the propertiesMap is of an unknown type or an unmatched CSS class. */
                    if ($.velocity.debug) console.log("First argument was not a property map, a CSS class reference, or a known action. Aborting.")
                    
                    /* Keep the jQuery call chain intact by returning the targeted elements. */
                    return elements;
                }
        }

        /***************************
            Argument Overloading
        ***************************/

        /* Support is included for jQuery's argument overloading: $.animate(propertyMap [, duration] [, easing] [, complete]). Overloading is detected by checking for the absence of an options object.
           The stop action does not accept animation options, and is therefore excluded from this check. */
        /* Note: Although argument overloading is an incredibly sloppy practice in JavaScript, support is included so that $.velocity() can act as a drop-in replacement for $.animate(). */
        if (action !== "stop" && typeof options !== "object") {
            /* The utility function shifts all arguments one position to the right, so we adjust for that offset. */
            var startingArgumentPosition = isJquery ? 1 : 2;

            options = {};

            /* Iterate through all options arguments */
            for (var i = startingArgumentPosition; i < arguments.length; i++) {
                /* Treat a number as a duration. Parse it out. */
                if (/^\d/.test(arguments[i])) {
                    options.duration = parseFloat(arguments[i]);
                /* Treat a string as an easing. Trim whitespace. */
                } else if (typeof arguments[i] === "string") {
                    options.easing = arguments[i].replace(/^\s+|\s+$/g, "");
                /* Treat a function as a callback. */
                } else if (isFunction(arguments[i])) {
                    options.complete = arguments[i];
                }
            }
        }

        /**************************
            Call-Wide Variables
        **************************/

        /* The length of the targeted element set is defaulted to 1 in case a single raw DOM element is passed in (which doesn't contain a length property). */
        var elementsLength = elements.length || 1,
            elementsIndex = 0;

        /* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all properties being animated in a single Velocity call. 
           Calculating unit ratios necessitates DOM querying and updating, and is therefore avoided (via caching) wherever possible; further, ratios are only calculated when they're needed. */
        /* Note: This container is call-wide instead of page-wide to avoid the risk of using stale conversion metrics across Velocity animations that are not immediately consecutively chained. */
        var unitConversionRatios = {
                /* Performance optimization insight: When the parent element, CSS position value, and fontSize do not differ amongst elements, the elements' unit ratios are identical. */
                lastParent: null,
                lastPosition: null,
                lastFontSize: null,
                /* Percent is the only unit types whose ratio is dependant upon axis. */
                lastPercentToPxWidth: null,
                lastPercentToPxHeight: null,
                lastEmToPx: null,
                /* The rem==>px ratio is relative to the document's fontSize -- not any property belonging to the element. Thus, it is automatically call-wide cached whenever the rem unit is being animated. */
                remToPxRatio: null
            };

        /* A container for all the ensuing tween data and metadata associated with this call. This container gets pushed to the page-wide $.velocity.State.calls array that is processed during animation ticking. */
        var call = [];

        /**********************
           Option: Complete
        **********************/

        /* The complete option must be a function. Otherwise, default to null. */
        /* Note: The complete option is the only option that is processed on a call-wide basis since it is fired once per call -- not once per element. */
        if (options && !isFunction(options.complete)) {
            options.complete = null;
        }

        /************************
           Element Processing
        ************************/ 

        /* Element processing consists of three parts -- data processing that cannot go stale and data processing that *can* go stale (i.e. third-party style modifications):
           1) Pre-Queueing: Element-wide variables, including the element's data storage, are instantiated. 2) Options are prepared for animation. 3) If triggered, the Stop action is executed.
           2) Queueing: The logic that runs once this call has reached its point of execution in the element's $.queue() stack. Most logic is placed here to avoid risking it becoming stale.
           3) Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
        */

        function processElement () {

            /*************************
               Part I: Pre-Queueing
            *************************/

            /***************************
               Element-Wide Variables
            ***************************/

            var element = this,
                /* The runtime opts object is the extension of the current call's options and Velocity's page-wide option defaults. */ 
                opts = $.extend({}, $.fn.velocity.defaults, options),
                /* A container for the processed data associated with each property in the propertyMap. (Each property in the map produces its own "tween".) */
                tweensContainer = {};

            /********************
                Action: Stop
            ********************/

            /* When the stop action is triggered, the elements' remaining queue calls (including loops) are removed, but its in-progress animation runs until completion. This is intentional in order to avoid visually-abrupt stopping. */
            /* Note: The stop command runs prior to Queueing since its behavior is intended to take effect *immediately*, regardless of the targeted element's current state. */
            if (action === "stop") {
                /* Clearing jQuery's $.queue() array is achieved by manually setting it to []. */
                /* Note: To stop only the animations associated with a specific queue, a custom queue name can optionally be provided in place of an options object. */
                $.queue(element, (typeof options === "string") ? options : "", []);

                /* Since we're stopping, do not proceed with Queueing. */
                return true;
            }

            /******************
                Data Cache
            ******************/

            /* A primary design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache instantiated on it. */
            if ($.data(element, NAME) === undefined) {
                $.data(element, NAME, {
                    /* Keep track of whether the element is currently being animated by Velocity. This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
                    isAnimating: false,
                    /* A reference to the element's live computedStyle object. You can learn more about computedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
                    computedStyle: null,
                    /* Tween data is cached for each animation on the element so that data can be passed across calls -- in particular, end values are used as subsequent start values in consecutive Velocity calls. */
                    tweensContainer: null,
                    /* The full root property values of each CSS hook being animated on this element are cached so that:
                       1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
                       2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values.
                    */
                    rootPropertyValueCache: {},
                    /* A cache for transform updates, which must be manually flushed via CSS.flushTransformCache(). */
                    transformCache: {}
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
                    opts.duration = 400;
                    break;

                case "slow":
                    opts.duration = 600;
                    break;

                default:
                    /* Remove the value's potential "ms" suffix and default to a non-zero value (which is never intended -- if it actually is intended, the user needs to rethink their animation approach). */
                    opts.duration = parseFloat(opts.duration) || parseFloat($.fn.velocity.defaults.duration) || 400;
            }

            /********************
               Option: Easing
            ********************/

            /* Ensure that the passed in easing has been assigned to jQuery's $.easing object (which Velocity also uses as its easings container). */
            if (!$.easing[opts.easing]) {
                /* If the passed in easing is not supported, default to the easing in Velocity's page-wide defaults object so long as its supported (it may have been reassigned by the user). */
                if ($.easing[$.fn.velocity.defaults.easing]) {
                    opts.easing = $.fn.velocity.defaults.easing;
                /* Otherwise, revert to jQuery's default easing type of "swing". */
                } else {
                    opts.easing = "swing";
                }
            }

            /******************
               Option: Delay
            ******************/

            /* Velocity rolls its own delay function since jQuery doesn't have a utility alias for $.fn.delay() (and thus requires jQuery element creation, which we avoid since its overhead includes DOM querying). */
            if (/^\d/.test(opts.delay)) {
                $.queue(element, opts.queue, function(next) {
                    /* This is a flag used to indicate to the upcoming completeCall() function that this queue entry was initiated by Velocity. See completeCall() for further details. */
                    $.velocity.queueEntryFlag = true;

                    /* The ensuing queue item (which is assigned to the "next" argument that $.queue() automatically passes in) will be triggered after a setTimeout delay. */
                    setTimeout(next, parseFloat(opts.delay));
                });
            }

            /********************
               Option: Display
            ********************/

            /* Refer to Velocity's documentation (julian.com/reserach/velocity/) for a description of the display option's behavior. */
            if (opts.display) {
                opts.display = opts.display.toLowerCase();
            }

            /**********************
               Option: mobileHA
            **********************/

            /* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack) on animating elements. HA is removed from the element at the completion of its animation. */
            /* You can read more about the use of mobileHA in Velocity's documentation: julian.com/reserach/velocity/. */
            opts.mobileHA = (opts.mobileHA && $.velocity.State.isMobile);

            /***********************
               Part II: Queueing
            ***********************/

            /* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
               In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
            /* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
               the call array is pushed to $.velocity.State.calls for live processing by the requestAnimationFrame tick. */
            $.queue(element, opts.queue, function(next) {
                /* This is a flag used to indicate to the upcoming completeCall() function that this queue entry was initiated by Velocity. See completeCall() for further details. */
                $.velocity.queueEntryFlag = true;

                /*****************************************
                   Tween Data Construction (for Scroll)
                *****************************************/

                /* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Velocity as if it were a standard CSS property animation. */
                if (action === "scroll") {   
                    /* The scroll action uniquely takes an optional "offset" option -- specified in pixels -- that offsets the targeted scroll position. */
                    var scrollOffset = parseFloat(opts.offset) || 0,
                        scrollPositionCurrent,
                        scrollPositionEnd;

                    /* Scroll also uniquely takes an optional "container" option, which indicates the parent element that should be scrolled -- as opposed to the browser window itself.
                       This is useful for scrolling toward an element that's inside an overflowing parent element. */
                    if (opts.container) {
                        /* Ensure that either a jQuery object or a raw DOM element was passed in. */
                        if (opts.container.jquery || opts.container.nodeType) {
                            /* Extract the raw DOM element from the jQuery wrapper. */
                            opts.container = opts.container[0] || opts.container;
                            /* Note: Unlike all other properties in Velocity, the browser's scroll position is never cached since it so frequently changes (due to the user's natural interaction with the page). */
                            scrollPositionCurrent = opts.container.scrollTop; /* GET */

                            /* $.position() values are relative to the container's currently viewable area (without taking into account the container's true dimensions -- say, for example, if the container was not overflowing).
                               Thus, the scroll end value is the sum of the child element's position *and* the scroll container's current scroll position. */
                            /* Note: jQuery does not offer a utility alias for $.position(), so we have to incur jQuery object conversion here. This syncs up with an ensuing batch of GETs, so it fortunately does not produce layout thrashing. */
                            scrollPositionEnd = (scrollPositionCurrent + $(element).position().top) + scrollOffset; /* GET */
                        /* If a value other than a jQuery object or a raw DOM element was passed in, default to null so that this option is ignored. */
                        } else {
                            opts.container = null;
                        }
                    } else {
                        /* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using the appropriate cached property names (which differ based on browser type). */
                        scrollPositionCurrent = $.velocity.State.scrollAnchor[$.velocity.State.scrollProperty]; /* GET */

                        /* Unlike $.position(), $.offset() values are relative to the browser window's true dimensions -- not merely its currently viewable area -- and therefore end values do not need to be compounded onto current values. */
                        scrollPositionEnd = $(element).offset().top + scrollOffset; /* GET */
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
                            scrollContainer: opts.container
                        },
                        element: element
                    };

                /******************************************
                   Tween Data Construction (for Reverse)
                ******************************************/

                /* Reverse acts like a "start" action in that a property map is animated toward. The only difference is that the property map used for reverse is the inverse of the map used in the previous call.
                   Thus, we manipulate the previous call to construct our new map: use the previous map's end values as our new map's start values. Copy over all other data. */ 
                /* Note: Reverse can be directly called via the "reverse" parameter, or it can be indirectly triggered via the loop option. (Loops are composed of multiple reverses.) */
                /* Note: Reverse calls do not need to be consecutively chained onto a currently-animating element in order to operate on cached values; there is no harm to reverse being called on a potentially stale data cache since
                   reverse's behavior is simply defined as reverting to the element's values as they were prior to the previous *Velocity* call. */
                } else if (action === "reverse") {   
                    /* Abort if there is no prior animation data to reverse to. */
                    if (!$.data(element, NAME).tweensContainer) {
                        /* Dequeue the element so that this queue entry releases itself immediately, allowing subsequent queue entries to run. */
                        $.dequeue(element, opts.queue);

                        return;
                    } else {
                        /*********************
                           Options Parsing
                        *********************/

                        /* If the element was hidden via the display option in the previous call, revert display to block prior to reversal so that the element is visible again. */
                        if ($.data(element, NAME).opts.display === "none") {
                            $.data(element, NAME).opts.display = "block";
                        }

                        /* If the loop option was set in the previous call, disable it so that reverse calls aren't recursively generated. */
                        $.data(element, NAME).opts.loop = false;

                        /* The opts object used for reversal is an extension of the options object optionally passed into this reverse call plus the options used in the previous Velocity call. */
                        opts = $.extend({}, $.data(element, NAME).opts, options);

                        /*************************************
                           Tweens Container Reconstruction
                        *************************************/

                        /* Create a deepy copy (indicated via the true flag) of the previous call's tweensContainer. */
                        var lastTweensContainer = $.extend(true, {}, $.data(element, NAME).tweensContainer);   

                        /* Manipulate the previous tweensContainer by replacing its end values and currentValues with its start values. */
                        for (var lastTween in lastTweensContainer) {
                            /* In addition to tween data, tweensContainers contain an element property that we ignore here. */
                            if (lastTween !== "element") {
                                var lastStartValue = lastTweensContainer[lastTween].startValue;

                                lastTweensContainer[lastTween].startValue = lastTweensContainer[lastTween].currentValue = lastTweensContainer[lastTween].endValue;
                                lastTweensContainer[lastTween].endValue = lastStartValue;

                                /* Easing is the only call option that embeds into the individual tween data since it can be defined on a per-property basis. Accordingly, every property's easing value must
                                   be updated when an options object is passed in with a reverse call. The side effect of this extensibility is that all per-property easing values are forcefully reset to the new value. */
                                if (options) {
                                    lastTweensContainer[lastTween].easing = opts.easing;
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

                    /* If this queue entry follows a previous Velocity-initiated queue entry *and* if this entry was created while the element was in the process of being animated by Velocity, then this current call
                       is safe to use the end values from the prior call as its start values. Velocity attempts to perform this value transfer process whenever possible in order to avoid requerying the DOM. */
                    /* If values aren't transferred from a prior call and start values were not forcefed by the user (more on this below), then the DOM is queried for the element's current values as a last resort. */
                    /* Note: Conversely, animation reversal (and looping) *always* perform inter-call value transfers; they never requery the DOM. */
                    var lastTweensContainer;

                    /* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale) to transfer over end values to use as start values. If it's set to true and there is a previous 
                       Velocity call to pull values from, do so. */
                    if ($.data(element, NAME).tweensContainer && $.data(element, NAME).isAnimating === true) {
                        lastTweensContainer = $.data(element, NAME).tweensContainer;
                    }

                    /***************************
                       Tween Data Calculation   
                    ***************************/

                    /* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
                    /* Property map values can either take the form of 1) a single value representing the end value, or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
                       The optional third parameter is a forcefed startValue to be used instead of querying the DOM for the element's current value. Read Velocity's docmentation to learn more about forcefeeding: julian.com/research/velocity/ */
                    function parsePropertyValue (valueData) {
                        var endValue = undefined,
                            easing = undefined,
                            startValue = undefined;

                        /* Handle the array format, which can be structured as one of three potential overloads: A) [ endValue, easing, startValue ], B) [ endValue, easing ], or C) [ endValue, startValue ] */
                        if (Object.prototype.toString.call(valueData) === "[object Array]") {
                            /* endValue is always the first item in the array. Don't bother validating endValue's value now since the ensuing property cycling logic inherently does that. */
                            endValue = valueData[0];

                            /* Two-item array format: If the second item is a number or a function, treat it as a start value since easings can only be strings. */
                            if (/^[\d-]/.test(valueData[1]) || isFunction(valueData[1])) {
                                startValue = valueData[1];
                            /* Two or three-item array: If the second item is a string, treat it as an easing. */
                            } else if (typeof valueData[1] === "string") {
                                /* Only use this easing if it's been registered on $.easing. */
                                if ($.easing[valueData[1]] !== undefined) {
                                    easing = valueData[1];
                                }

                                /* Don't bother validating startValue's value now since the ensuing property cycling logic inherently does that. */
                                if (valueData[2]) {
                                    startValue = valueData[2];
                                }
                            }
                        /* Handle the single-value format. */
                        } else {
                            endValue = valueData;
                        }

                        /* Default to the call's easing if a per-property easing type was not defined. */ 
                        easing = easing || opts.easing;

                        /* If functions were passed in as values, pass the function the current element as its context, plus the element's index and the element set's size as arguments. Then, assign the returned value. */
                        if (isFunction(endValue)) {
                            endValue = endValue.call(element, elementsIndex, elementsLength);
                        }

                        if (isFunction(startValue)) {
                            startValue = startValue.call(element, elementsIndex, elementsLength);
                        }

                        /* Allow startValue to be left as undefined to indicate to the ensuing code that its value was not forcefed. */
                        return [ endValue || 0, easing, startValue ];
                    }

                    /* Create a tween out of each property, and append its associated data to tweensContainer. */
                    for (var property in propertiesMap) {
                        /* Normalize property names via camel casing so that properties can be consistently manipulated. */
                        /**************************
                           Start Value Sourcing
                        **************************/

                        /* Parse out endValue, easing, and startValue from the property's data. */
                        var valueData = parsePropertyValue(propertiesMap[property]),
                            endValue = valueData[0],
                            easing = valueData[1],
                            startValue = valueData[2];

                        /* Now that the original property name's format has been used for the parsePropertyValue() lookup above, we force the property to its camelCase styling to normalize it for manipulation. */
                        property = CSS.Names.camelCase(property);

                        /* In case this property is a hook, there are circumstances where we will intend to work on the hook's root property and not the hooked subproperty. */
                        var rootProperty = CSS.Hooks.getRoot(property),
                            rootPropertyValue = false;

                        /* Properties that are not supported by the browser (and do not have an associated normalization) will inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead. 
                           Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */ 
                        if (CSS.Names.prefixCheck(rootProperty)[1] === false && CSS.Normalizations.registered[rootProperty] === undefined) {
                            if ($.velocity.debug) console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");

                            continue;           
                        }

                        /* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being animated to an endValue of non-zero, the user's intention is to fade in from invisible, 
                           thus we forcefeed opacity a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
                        if ((opts.display && opts.display !== "none") && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
                            startValue = 0;
                        }

                        /* If values have been transferred from the previous Velocity call, extract the endValue and rootPropertyValue for all of the current call's properties that were *also* animated in the previous call. */
                        /* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
                        if (opts._cacheValues && lastTweensContainer && lastTweensContainer[property]) {
                            startValue = lastTweensContainer[property].endValue + lastTweensContainer[property].unitType;
                                    
                            /* The previous call's rootPropertyValue is extracted from the element's data cache since that's the instance of rootPropertyValue that gets freshly updated by the tweening process,
                               whereas the rootPropertyValue attached to the incoming lastTweensContainer is equal to the root property's value prior to any tweening. */
                            rootPropertyValue = $.data(element, NAME).rootPropertyValueCache[rootProperty];
                        /* If values were not transferred from a previous Velocity call, query the DOM as needed. */
                        } else {
                            /* Handle hooked properties. */
                            if (CSS.Hooks.registered[property]) {
                               if (startValue === undefined) {
                                    rootPropertyValue = CSS.getPropertyValue(element, rootProperty); /* GET */
                                    /* Note: The following getPropertyValue() call does not actually trigger a DOM query; getPropertyValue() will extract the hook from rootPropertyValue. */
                                    startValue = CSS.getPropertyValue(element, property, rootPropertyValue);
                                /* If startValue is already defined via forcefeeding, do not query the DOM for the root property's value; just grab rootProperty's zero-value template from CSS.Hooks. This overwrites the element's actual
                                   root property value (if one is set), but this is acceptable since the primary reason users forcefeed is to avoid DOM queries, and thus we likewise avoid querying the DOM for the root property's value. */
                                } else {
                                    /* Grab this hook's zero-value template, e.g. "0px 0px 0px black". */
                                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                                }
                            /* Handle non-hooked properties that haven't already been defined via forcefeeding. */
                            } else if (startValue === undefined) {
                                startValue = CSS.getPropertyValue(element, property); /* GET */
                            }
                        }

                        /**************************
                           Value Data Extraction
                        **************************/

                        var separatedValue,
                            endValueUnitType,
                            startValueUnitType,
                            operator;

                        /* Separates a property value into its numeric value and its unit type. */
                        function separateValue (property, value) {
                            var unitType,
                                numericValue;

                            numericValue = (value || 0)
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
                                unitType = CSS.Values.getUnitType(property);
                            }

                            return [ numericValue, unitType ];
                        }

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

                        /*****************************
                           Value & Unit Conversion
                        *****************************/

                        var elementUnitRatios;

                        /* Custom support for properties that don't actually accept the % unit type, but where pollyfilling is trivial and relatively foolproof. */
                        if (endValueUnitType === "%") {
                            /* A %-value fontSize/lineHeight is relative to the parent's fontSize (as opposed to the parent's dimensions), which is identical to the em unit's behavior, so we piggyback off of that. */
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

                        /* When queried, the browser returns (most) CSS property values in pixels. Therefore, if an endValue of %, em, or rem is animated toward, startValue must be converted from pixels into the same unit type 
                           as endValue in order for value manipulation logic to proceed. Further, if the startValue was forcefed or transferred from a previous call, its value may not actually be in pixels. Unit conversion logic
                           consists of two steps: 1) Calculating the ratio of %, em, and rem relative to pixels, and 2) Matching up startValue's unit type with endValue's based on these ratios. */
                        /* Unit conversion ratios are calculated by momentarily setting a value with the target unit type on the element, comparing the returned pixel value, then reverting to the original value. */
                        /* Note: Even if only one of these unit types is being animated, all unit ratios are calculated at once since the overhead of batching the SETs and GETs together upfront outweights the potential overhead
                                 of layout thrashing caused by re-querying for uncalculated ratios for subsequently-processed properties. */
                        /* Todo: Shift this logic into the calls' first tick instance so that it's synced with RAF. */
                        /* Todo: Store the original values and skip re-setting if we're animating height or width in the properties map. */
                        function calculateUnitRatios () {
                            /* The properties below are used to determine whether the element differs sufficiently from this call's prior element to also differ in its unit conversion ratio.
                               If the properties match up with those of the prior element, the prior element's conversion ratios are used. Like most optimizations in Velocity, this is done to minimize DOM querying. */
                            var sameRatioIndicators = {
                                    parent: element.parentNode, /* GET */
                                    position: CSS.getPropertyValue(element, "position"), /* GET */
                                    fontSize: CSS.getPropertyValue(element, "fontSize") /* GET */
                                },
                                /* Determine if the same % ratio can be used. % is relative to the element's position and the parent's dimensions. */
                                sameBasePercent = ((sameRatioIndicators.position === unitConversionRatios.lastPosition) && (sameRatioIndicators.parent === unitConversionRatios.lastParent)),
                                /* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
                                sameBaseEm = (sameRatioIndicators.fontSize === unitConversionRatios.lastFontSize);

                            /* Store these ratio indicators call-wide for the next element to compare against. */
                            unitConversionRatios.lastParent = sameRatioIndicators.parent;
                            unitConversionRatios.lastPosition = sameRatioIndicators.position;
                            unitConversionRatios.lastFontSize = sameRatioIndicators.fontSize;

                            /* Whereas % and em ratios are determined on a per-element basis, the rem unit type only needs to be checked once per call since it is exclusively dependant upon the body element's fontSize.
                               If this is the first time that calculateUnitRatios() is being run during this call, the remToPxRatio value will be null, so we calculate it now. */
                            if (unitConversionRatios.remToPxRatio === null) {
                                /* Default to most browsers' default fontSize of 16px in the case of 0. */
                                unitConversionRatios.remToPxRatio = parseFloat(CSS.getPropertyValue(document.body, "fontSize")) || 16; /* GET */
                            }

                            var originalValues = {
                                    /* To accurately and consistently calculate conversion ratios, the element's overflow and box-sizing are temporarily disabled. Overflow must be manipulated on a per-axis basis
                                       since the plain overflow property overwrites its subproperties' values. */
                                    overflowX: null,
                                    overflowY: null,
                                    boxSizing: null,
                                    /* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. Since they can be artificially constrained by their min-/max- equivalents, those properties are changed as well. */
                                    width: null,
                                    minWidth: null,
                                    maxWidth: null,
                                    height: null,
                                    minHeight: null,
                                    maxHeight: null,
                                    /* paddingLeft acts as our proxy for the em ratio. */
                                    paddingLeft: null
                                },
                                elementUnitRatios = {},
                                /* Note: IE<=8 round to the nearest pixel when returning CSS values, thus we perform conversions using a measurement of 10 (instead of 1) to give our ratios a precision of at least 1 decimal value. */
                                measurement = 10;                                

                            /* For organizational purposes, active ratios calculations are consolidated onto the elementUnitRatios object. */
                            elementUnitRatios.remToPxRatio = unitConversionRatios.remToPxRatio;

                            /* Note: To minimize layout thrashing, the ensuing unit conversion logic is split into batches to synchronize GETs and SETs. */
                            originalValues.overflowX = CSS.getPropertyValue(element, "overflowX"); /* GET */
                            originalValues.overflowY = CSS.getPropertyValue(element, "overflowY"); /* GET */
                            originalValues.boxSizing = CSS.getPropertyValue(element, "boxSizing"); /* GET */

                            /* Since % values are relative to their respective axes, ratios are calculated for both width and height. In contrast, only a single ratio is required for rem and em. */
                            /* When calculating % values, we set a flag to indiciate that we want the computed value instead of offsetWidth/Height, which incorporate additional dimensions (such as padding and border-width) into their values. */
                            originalValues.width = CSS.getPropertyValue(element, "width", null, true); /* GET */
                            originalValues.minWidth = CSS.getPropertyValue(element, "minWidth"); /* GET */
                            /* Note: max-width/height must default to "none" when 0 is returned, otherwise the element cannot have its width/height set. */
                            originalValues.maxWidth = CSS.getPropertyValue(element, "maxWidth") || "none"; /* GET */

                            originalValues.height = CSS.getPropertyValue(element, "height", null, true); /* GET */
                            originalValues.minHeight = CSS.getPropertyValue(element, "minHeight"); /* GET */
                            originalValues.maxHeight = CSS.getPropertyValue(element, "maxHeight") || "none"; /* GET */

                            originalValues.paddingLeft = CSS.getPropertyValue(element, "paddingLeft"); /* GET */

                            if (sameBasePercent) {
                                elementUnitRatios.percentToPxRatioWidth = unitConversionRatios.lastPercentToPxWidth;
                                elementUnitRatios.percentToPxRatioHeight = unitConversionRatios.lastPercentToPxHeight;
                            } else {
                                CSS.setPropertyValue(element, "overflowX",  "hidden"); /* SET */
                                CSS.setPropertyValue(element, "overflowY",  "hidden"); /* SET */
                                CSS.setPropertyValue(element, "boxSizing",  "content-box"); /* SET */

                                CSS.setPropertyValue(element, "width", measurement + "%"); /* SET */
                                CSS.setPropertyValue(element, "minWidth", measurement + "%"); /* SET */
                                CSS.setPropertyValue(element, "maxWidth", measurement + "%"); /* SET */

                                CSS.setPropertyValue(element, "height",  measurement + "%"); /* SET */
                                CSS.setPropertyValue(element, "minHeight",  measurement + "%"); /* SET */
                                CSS.setPropertyValue(element, "maxHeight",  measurement + "%"); /* SET */
                            }

                            if (sameBaseEm) {
                                elementUnitRatios.emToPxRatio = unitConversionRatios.lastEmToPx;
                            } else {
                                CSS.setPropertyValue(element, "paddingLeft", measurement + "em"); /* SET */
                            }

                            /* The following pixel-value GETs cannot be batched with the prior GETs since they depend upon the values temporarily set immediately above; layout thrashing cannot be avoided here. */
                            if (!sameBasePercent) {
                                /* Divide the returned value by the measurement value to get the ratio between 1% and 1px. */
                                elementUnitRatios.percentToPxRatioWidth = unitConversionRatios.lastPercentToPxWidth = (parseFloat(CSS.getPropertyValue(element, "width", null, true)) || 0) / measurement; /* GET */
                                elementUnitRatios.percentToPxRatioHeight = unitConversionRatios.lastPercentToPxHeight = (parseFloat(CSS.getPropertyValue(element, "height", null, true)) || 0) / measurement; /* GET */
                            }

                            if (!sameBaseEm) {
                                elementUnitRatios.emToPxRatio = unitConversionRatios.lastEmToPx = (parseFloat(CSS.getPropertyValue(element, "paddingLeft")) || 0) / measurement; /* GET */
                            }

                            /* Revert each test property to its original value. */
                            for (var originalValueProperty in originalValues) {
                                CSS.setPropertyValue(element, originalValueProperty, originalValues[originalValueProperty]); /* SETs */
                            }

                            if ($.velocity.debug >= 1) console.log("Unit ratios: " + JSON.stringify(elementUnitRatios), element);

                            return elementUnitRatios;
                        }

                        /* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
                        if (/[\/*]/.test(operator)) {
                            endValueUnitType = startValueUnitType;
                        /* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType is a relative unit (%, em, rem), the values set during tweening will continue
                           to be accurately relative even if the metrics they depend on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
                           would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
                        /* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnitType. */
                        } else if ((startValueUnitType !== endValueUnitType) && startValue !== 0) {                            
                            /* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used in this case for tween values to remain accurate. */
                            /* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively match the underlying metrics if they change, but this is acceptable
                               since we're animating toward invisibility instead of toward visibility that remains past the point of the animation's completion. */ 
                            if (endValue === 0) {
                                endValueUnitType = startValueUnitType;
                            } else { 
                                /* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing). If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
                                elementUnitRatios = elementUnitRatios || calculateUnitRatios();

                                /* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
                                /* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element, so they're included in this expression. */
                                var axis = (/margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property)) ? "x" : "y";

                                /* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process: 1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit type. */
                                switch (startValueUnitType) {
                                    case "%":
                                        /* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions. Velocity does not include a special conversion process
                                           for these properties due of the additional DOM overhead it would entail. Therefore, animating translateX/Y from a % value to a non-% value will produce an incorrect start value. Fortunately, 
                                           this sort of cross-unit conversion is rarely done by users in practice. */
                                        startValue *= (axis === "x" ? elementUnitRatios.percentToPxRatioWidth : elementUnitRatios.percentToPxRatioHeight); 
                                        break;

                                    case "em":
                                        startValue *= elementUnitRatios.emToPxRatio;
                                        break;

                                    case "rem":
                                        startValue *= elementUnitRatios.remToPxRatio;
                                        break;

                                    case "px":
                                        /* px acts as our midpoint in the unit conversion process; do nothing. */
                                        break;
                                }

                                /* Invert the px ratios to convert into to the target unit. */
                                switch (endValueUnitType) {
                                    case "%":
                                        startValue *= 1 / (axis === "x" ? elementUnitRatios.percentToPxRatioWidth : elementUnitRatios.percentToPxRatioHeight); 
                                        break;

                                    case "em":
                                        startValue *= 1 / elementUnitRatios.emToPxRatio;
                                        break;

                                    case "rem":
                                        startValue *= 1 / elementUnitRatios.remToPxRatio;
                                        break;

                                    case "px":
                                        /* startValue is already in px, do nothing; we're done. */
                                        break;
                                }
                            }
                        }

                        /***********************
                            Value Operators
                        ***********************/

                        /* Operator logic must be performed last since it requires unit-normalized start and end values. */
                        /* Note: Relative percent values do not behave how most people think; while one would expect "+=50%" to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
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

                        /* Construct the per-property tween object, and push it to the element's tweensContainer. */
                        tweensContainer[property] = {
                            rootPropertyValue: rootPropertyValue,
                            startValue: startValue,
                            currentValue: startValue,
                            endValue: endValue,
                            unitType: endValueUnitType,
                            easing: easing
                        };

                        if ($.velocity.debug) console.log("tweensContainer (" + property + "): " + JSON.stringify(tweensContainer[property]), element);
                    }

                    /* Along with its property data, store a reference to the element itself onto tweensContainer. */
                    tweensContainer.element = element;
                }

                /***************
                    Pushing
                ***************/

                /* Note: tweensContainer can be empty if all of the properties in this call's property map were skipped due to not being supported by the browser.
                   The element property is used as a proxy for checking that the tweensContainer has been appended to. */
                if (tweensContainer.element) {

                    /*****************
                        Call Push
                    *****************/

                    /* The call array houses the tweensContainers for each element being animated in the current call. */
                    call.push(tweensContainer);

                    /* Store on the element its tweensContainer plus the current call's opts so that Velocity can reference this data the next time this element is animated. */
                    $.data(element, NAME).tweensContainer = tweensContainer;
                    $.data(element, NAME).opts = opts;
                    /* Switch on the element's animating flag. */
                    $.data(element, NAME).isAnimating = true;

                    /******************
                        Calls Push
                    ******************/

                    /* Once the final element in this call's targeted element set has been processed, push the call array onto $.velocity.State.calls for the animation tick to immediately begin processing. */
                    if (elementsIndex === elementsLength - 1) {
                        /* To speed up iterating over this array, it is compacted (falsey items -- calls that have completed -- are removed) when its length has ballooned to a point that can impact tick performance. 
                           This only becomes necessary when animation has been continuous with many elements over a long period of time; whenever all active calls are completed, completeCall() clears $.velocity.State.calls. */
                        if ($.velocity.State.calls.length > 10000) {
                            $.velocity.State.calls = compactSparseArray($.velocity.State.calls);
                        }

                        /* Add the current call plus its associated metadata (the element set and the call's options) onto the page-wide call container. Anything on this call container is subjected to tick() processing. */
                        $.velocity.State.calls.push([ call, elements, opts ]);

                        /* If the animation tick isn't currently running, start it. (Velocity shuts the tick off when there are no active calls to process.) */
                        if ($.velocity.State.isTicking === false) {
                            $.velocity.State.isTicking = true;

                            /* Start the tick loop. */
                            tick();
                        }
                    } else {
                        elementsIndex++;
                    }
                }

                /* jQuery's $.queue() behavior requires calls on a *custom* queue to be explicitly dequeued; non-custom queues have their entries dequeued automatically. */
                /* Note: An empty queue name is an alias for the "fx" queue, which is jQuery's default queue. */
                if (opts.queue !== "" && opts.queue !== "fx") { 
                    /* Fire the next queue entry once this queue has completed. This queue's running time is the sum of the current call's duration and delay options. */
                    setTimeout(next, opts.duration + opts.delay);
                }
            });

            /*********************
                Auto-Dequeuing
            *********************/

            /* As per jQuery's $.queue() behavior, to fire the first non-custom-queue entry on an element, the element must be dequeued if its queue stack consists *solely* of the current call.
               (This can be determined by checking for the "inprogress" item that jQuery prepends to active queue stack arrays.) Otherwise, whenever the element's queue is further appended with 
               additional items -- including $.delay()'s or even $.animate() calls, the queue's first entry is automatically fired. This behavior contrasts that of custom queues, which never auto-fire. */
            /* The queue option may alternatively be set to false, which results in an immediate triggering; chain waiting is skipped entirely, and the targeted call runs in parallel with any currently-running queue entries. */
            /* Note: When an element set is being subjected to a non-parallel Velocity call, the animation will not begin until each one of the elements in the set has reached the end of its individually pre-existing queue chain. */
            /* Note: Unfortunately, most people don't fully grasp jQuery's powerful, yet quirky, $.queue() function. Lean more here: http://stackoverflow.com/questions/1058158/can-somebody-explain-jquery-queue-to-me */
            if (opts.queue === false || ((opts.queue === "" || opts.queue === "fx") && $.queue(element)[0] !== "inprogress")) {                
                $.dequeue(element);
            }            
        }

        /**************************
           Element Set Iteration
        **************************/ 

        /* Determine elements' type, then individually process each element in the set via processElement(). */
        if (isJquery) {
            elements.each(processElement);
        /* Check if this is a single raw DOM element by sniffing for a nodeType property. */
        } else if (elements.nodeType) {
            processElement.call(elements);
        /* Otherwise, check if this is an array of raw DOM elements, in which case just sniff the first item's nodeType as a proxy for the remainder. */
        } else if (elements[0] && elements[0].nodeType) {
            for (var rawElementsIndex in elements) {
                processElement.call(elements[rawElementsIndex]);
            }
        }

        /******************
           Option: Loop 
        ******************/

        /* The loop option accepts an integer indicating how many times the element should loop between the values in the current call's properties map and the element's property values prior to this call. */
        /* The loop option's logic is performed here -- after element processing -- because the current call needs to undergo its queue insertion prior to the loop option generating its series of constituent "reverse" calls,
           which chain after the current call. Two reverse calls (two "alternations") constitute one loop. */
        var opts = $.extend({}, $.fn.velocity.defaults, options);
        opts.loop = parseInt(opts.loop);

        if (opts.loop) {
            /* Double the loop count to convert it into its appropriate number of "reverse" calls. Subtract 1 from the resulting value since the current call is included in the total alternation count. */
            for (var x = 0; x < (opts.loop * 2) - 1; x++) {
                /* Since the logic for the reverse action occurs inside Queueing and thus this call's options object isn't parsed until then as well, the current call's delay option must be explicitly passed
                   into the reverse call so that the delay logic that occurs inside *Pre-Queueing* can process this delay. */
                if (isJquery) {
                    elements.velocity("reverse", { delay: opts.delay });
                } else {
                    $.velocity.animate(elements, "reverse", { delay: opts.delay });
                }
            }
        }

        /**************
           Chaining
        **************/

        /* Return the processed elements back to the call chain. */
        return elements;
    };

    /*****************************
       Tick (Calls Processing)
    *****************************/

    /* Note: There is only a single tick() instance; all calls to Velocity are pushed to the $.velocity.State.calls array, which is fully iterated through upon each tick. */
    function tick (timestamp) {
        /* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on (which implies that this tick wasn't called by itself). We leverage this indicator to fully ignore the first tick pass
           since RAF's initial pass is fired whenever the browser's next tick sync time occurs (whereas subsequent RAF passes are spaced by a timer resolution of ~16ms), which results in the first elements subjected to Velocity
           calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
           by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
        if (timestamp) {
            /* We ignore RAF's high resolution timestamp since it can be significantly offset when the browser is under high stress; we opt for choppiness over allowing the browser to drop huge chunks of frames. */
            var timeCurrent = (new Date).getTime();

            /********************
               Call Iteration
            ********************/

            /* Iterate through each active call. */
            for (var i = 0, callsLength = $.velocity.State.calls.length; i < callsLength; i++) {
                /* When a velocity call is completed, its calls array entry is set to false. Continue on to the next call. */
                if (!$.velocity.State.calls[i]) {
                    continue;
                }

                /************************
                   Call-Wide Variables
                ************************/
                      
                var callContainer = $.velocity.State.calls[i],
                    call = callContainer[0],
                    opts = callContainer[2],
                    timeStart = callContainer[3];

                /* If timeStart is undefined, then this is the first time that this call has been processed by tick(). We assign timeStart now so that its value is as close to the real animation start time as possible.
                   (Conversely, had timeStart been defined when this call was added to $.velocity.State.calls, the delay between that time and now would cause the first few frames of the tween to be skipped since percentComplete is
                   calculated relative to timeStart.) */
                /* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the first tick iteration isn't wasted by animating at 0% tween completion,
                   which would produce the same style value as the element's current value. */
                if (!timeStart) {
                    timeStart = $.velocity.State.calls[i][3] = timeCurrent - 16;
                }

                /* The tween's completion percentage is relative to the tween's start time, not the tween's start value (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
                   Accordingly, we ensure that percentComplete does not exceed 1. */
                var percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1);

                /**********************
                   Element Iteration
                **********************/

                /* For every call, iterate through each of the elements in its set. */
                for (var j = 0, callLength = call.length; j < callLength; j++) {

                    var tweensContainer = call[j],
                        element = tweensContainer.element;

                    /* Check to see if this element has been deleted midway through the animation by checking for the continued existence of its data cache. If it's gone, skip animating this element. */
                    if (!$.data(element, NAME)) {
                        continue;
                    }

                    var transformPropertyExists = false;

                    /*********************
                       Display Toggling
                    *********************/

                    /* If the display option is set to non-"none", set it upfront so that the element has a chance to become visible before tweening begins. (Otherwise, display's value is set in completeCall() once the animation has completed.) */
                    if (opts.display && opts.display !== "none") {
                        CSS.setPropertyValue(element, "display", opts.display);

                        /* The display option is only set once -- when its associated call is first ticked through. Accordingly, we set its value to false so that it isn't processed again by tick(). */
                        $.velocity.State.calls[i][2].display = false;
                    }

                    /************************
                       Property Iteration
                    ************************/

                    /* For every element, iterate through each property. */
                    for (var property in tweensContainer) {
                        /* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
                        if (property !== "element") {
                            var tween = tweensContainer[property],
                                lastCurrentValue = tween.currentValue,
                                currentValue;

                            /******************************
                               Current Value Calculation
                            ******************************/

                            /* If this is the last tick pass (if we've reached 100% completion for this tween), ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
                            if (percentComplete === 1) {
                                currentValue = tween.endValue;
                            /* Otherwise, calculate currentValue based on the current delta from startValue. */
                            } else {
                                currentValue = tween.startValue + ((tween.endValue - tween.startValue) * $.easing[tween.easing](percentComplete));
                            }

                            /* If style updating wasn't skipped, store the new currentValue onto the call cache. */
                            tween.currentValue = currentValue;

                            /******************
                               Hooks: Part I
                            ******************/

                            /* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used for subsequent hooks in this call that are associated with the same root property.
                               If we didn't cache the updated rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's updates to rootPropertyValue prior to injection. */
                            /* A nice performance byproduct of rootPropertyValue caching is that subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
                            if (CSS.Hooks.registered[property]) {
                                var hookRoot = CSS.Hooks.getRoot(property),
                                    rootPropertyValueCache = $.data(element, NAME).rootPropertyValueCache[hookRoot];

                                if (rootPropertyValueCache) {
                                    tween.rootPropertyValue = rootPropertyValueCache;
                                }
                            }

                            /*****************
                                DOM Update
                            *****************/

                            /* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
                            var adjustedSetData = CSS.setPropertyValue(element, property, tween.currentValue + (currentValue === "auto" ? "" : tween.unitType), tween.rootPropertyValue, tween.scrollContainer); /* SET */

                            /*******************
                               Hooks: Part II
                            *******************/
                            
                            /* Now that we have the hook's updated rootPropertyValue (which is the post-processed value provided by the adjustedSetData array), cache it onto the element. */
                            if (CSS.Hooks.registered[property]) {
                                /* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. */
                                if (CSS.Normalizations.registered[hookRoot]) {
                                    $.data(element, NAME).rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
                                } else {
                                    $.data(element, NAME).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
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

                    /****************
                        mobileHA
                    ****************/

                    /* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration. It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
                    if (opts.mobileHA) {
                        /* Don't set the null transform hack if we've already done so. */
                        if ($.data(element, NAME).transformCache.translate3d === undefined) {
                            /* All entries on the transformCache object are concatenated into a single transform string via flushTransformCache(). */
                            $.data(element, NAME).transformCache.translate3d = "(0, 0, 0)";

                            transformPropertyExists = true;
                        } else if (percentComplete === 1) {
                            /* If we've reached the end of the animation, remove the translate3d value while setting transformPropertyExists to true in order to flush this removal change to the DOM. */
                            delete $.data(element, NAME).transformCache.translate3d;

                            transformPropertyExists = true;
                        }
                    }

                    if (transformPropertyExists) {
                        CSS.flushTransformCache(element);
                    }
                }

                /* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
                if (percentComplete === 1) {
                    completeCall(i);
                }
            }
        }

        /* Note: completeCall() contains the logic for setting the isTicking flag to false (which occurs when the last active call on $.velocity.State.calls has completed). */
        if ($.velocity.State.isTicking) {
            requestAnimationFrame(tick);
        }
    }

    /**********************
        Call Completion
    **********************/

    /* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
    function completeCall (callIndex) {
        /* Pull the metadata from the call. */
        var call = $.velocity.State.calls[callIndex][0],
            elements = $.velocity.State.calls[callIndex][1],
            opts = $.velocity.State.calls[callIndex][2];

        var remainingCallsExist = false;

        /*************************
           Element Finalization
        *************************/

        for (var i = 0, callLength = call.length; i < callLength; i++) {
            var element = call[i].element; 

            /* If the display option is set to "none" (meaning the user intends to hide the element), set this value now that the animation is complete. */
            /* Note: The display option is ignored with "reverse" calls, which is what loops are composed of. See reverse's logic for further details. */
            if (opts.display === "none" && opts.loop === false) {
                CSS.setPropertyValue(element, "display", opts.display);
            }

            /* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run a non-Velocity-initiated entry, turn off the isAnimating flag. 
               A non-Velocity-initiatied queue entry's logic might alter an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
               we check for the existence of our special $.velocity.queueEntryFlag declaration, which minifiers won't rename since the flag is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
            if ($.queue(element)[1] === undefined || !/\$\.velocity\.queueEntryFlag/i.test($.queue(element)[1])) {     
                /* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
                if ($.data(element, NAME)) {
                    $.data(element, NAME).isAnimating = false;
                    /* Clear the element's rootPropertyValueCache, which will become stale. */
                    $.data(element, NAME).rootPropertyValueCache = {};
                }
            }

            /* Fire the next call in the queue chain. */
            /* Note: Even if the end of the animation queue has been reached, $.dequeue() must still be called in order to completely clear jQuery's animation queue. */
            $.dequeue(element);
        }

        /************************
           Calls Array Cleanup
        ************************/

        /* Since this call is complete, remove it from $.velocity.State.calls. For performance reasons, the call is set to false instead of being deleted from the array. Learn more here: http://www.html5rocks.com/en/tutorials/speed/v8/ */
        $.velocity.State.calls[callIndex] = false;

        /* Iterate through the calls array to determine if this was the last running animation. If so, set a flag to end ticking and clear the calls array. */
        for (var j = 0, callsLength = $.velocity.State.calls.length; j < callsLength; j++) {
            if ($.velocity.State.calls[j] !== false) {
                remainingCallsExist = true;

                break;
            }
        }

        if (remainingCallsExist === false) {
            /* tick() will detect this flag upon its next iteration and subsequently turn itself off. */
            $.velocity.State.isTicking = false;

            /* Clear the calls array so that its length is reset. */
            delete $.velocity.State.calls;
            $.velocity.State.calls = [];
        }

        /****************
            Callback
        ****************/

        /* Now that all logic associated with this call is complete, fire the optional callback. */
        /* Note: The callback is fired once per call -- not once per elemenet -- and is passed the full element set as its context. */
        if (opts.complete) { 
            opts.complete.call(elements); 
        }
    }
})(jQuery, window, document);

/***************
    Defaults
***************/

/* Page-wide option defaults, which can be overriden by the user. */
jQuery.fn.velocity.defaults = {
    queue: "",
    duration: 400,
    easing: "swing",
    complete: null,
    display: null,
    loop: false,
    delay: false,
    mobileHA: true,
    /* Advanced: Set to false to prevent property values from being cached between immediately consecutive Velocity-initiated calls. See Value Transferring for further details. */
    _cacheValues: true
};

/******************
   Known Issues
******************/

/* When animating height or width to a % value on an element *without* box-sizing:border-box and *with* visible scrollbars on *both* axes, the opposite axis (e.g. height vs width) will be shortened by the height/width of its scrollbar. */
/* The translateX/Y/Z subproperties of the transform CSS property are %-relative to the element itself -- not its parent. Velocity, however, doesn't make the distinction. Thus, converting to or from the % unit with these subproperties will produce an inaccurate conversion value. */