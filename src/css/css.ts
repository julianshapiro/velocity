/* The CSS object is a highly condensed and performant CSS stack that fully replaces jQuery's.
 It handles the validation, getting, and setting of both standard CSS properties and CSS property hooks. */

namespace vCSS {
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
		transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"],
		units: [
			"%", // relative
			"em", "ex", "ch", "rem", // font relative
			"vw", "vh", "vmin", "vmax", // viewport relative
			"cm", "mm", "Q", "in", "pc", "pt", "px", // absolute lengths
			"deg", "grad", "rad", "turn", // angles
			"s", "ms" // time
		],
		colorNames: {
			"aliceblue": "240,248,255",
			"antiquewhite": "250,235,215",
			"aquamarine": "127,255,212",
			"aqua": "0,255,255",
			"azure": "240,255,255",
			"beige": "245,245,220",
			"bisque": "255,228,196",
			"black": "0,0,0",
			"blanchedalmond": "255,235,205",
			"blueviolet": "138,43,226",
			"blue": "0,0,255",
			"brown": "165,42,42",
			"burlywood": "222,184,135",
			"cadetblue": "95,158,160",
			"chartreuse": "127,255,0",
			"chocolate": "210,105,30",
			"coral": "255,127,80",
			"cornflowerblue": "100,149,237",
			"cornsilk": "255,248,220",
			"crimson": "220,20,60",
			"cyan": "0,255,255",
			"darkblue": "0,0,139",
			"darkcyan": "0,139,139",
			"darkgoldenrod": "184,134,11",
			"darkgray": "169,169,169",
			"darkgrey": "169,169,169",
			"darkgreen": "0,100,0",
			"darkkhaki": "189,183,107",
			"darkmagenta": "139,0,139",
			"darkolivegreen": "85,107,47",
			"darkorange": "255,140,0",
			"darkorchid": "153,50,204",
			"darkred": "139,0,0",
			"darksalmon": "233,150,122",
			"darkseagreen": "143,188,143",
			"darkslateblue": "72,61,139",
			"darkslategray": "47,79,79",
			"darkturquoise": "0,206,209",
			"darkviolet": "148,0,211",
			"deeppink": "255,20,147",
			"deepskyblue": "0,191,255",
			"dimgray": "105,105,105",
			"dimgrey": "105,105,105",
			"dodgerblue": "30,144,255",
			"firebrick": "178,34,34",
			"floralwhite": "255,250,240",
			"forestgreen": "34,139,34",
			"fuchsia": "255,0,255",
			"gainsboro": "220,220,220",
			"ghostwhite": "248,248,255",
			"gold": "255,215,0",
			"goldenrod": "218,165,32",
			"gray": "128,128,128",
			"grey": "128,128,128",
			"greenyellow": "173,255,47",
			"green": "0,128,0",
			"honeydew": "240,255,240",
			"hotpink": "255,105,180",
			"indianred": "205,92,92",
			"indigo": "75,0,130",
			"ivory": "255,255,240",
			"khaki": "240,230,140",
			"lavenderblush": "255,240,245",
			"lavender": "230,230,250",
			"lawngreen": "124,252,0",
			"lemonchiffon": "255,250,205",
			"lightblue": "173,216,230",
			"lightcoral": "240,128,128",
			"lightcyan": "224,255,255",
			"lightgoldenrodyellow": "250,250,210",
			"lightgray": "211,211,211",
			"lightgrey": "211,211,211",
			"lightgreen": "144,238,144",
			"lightpink": "255,182,193",
			"lightsalmon": "255,160,122",
			"lightseagreen": "32,178,170",
			"lightskyblue": "135,206,250",
			"lightslategray": "119,136,153",
			"lightsteelblue": "176,196,222",
			"lightyellow": "255,255,224",
			"limegreen": "50,205,50",
			"lime": "0,255,0",
			"linen": "250,240,230",
			"magenta": "255,0,255",
			"maroon": "128,0,0",
			"mediumaquamarine": "102,205,170",
			"mediumblue": "0,0,205",
			"mediumorchid": "186,85,211",
			"mediumpurple": "147,112,219",
			"mediumseagreen": "60,179,113",
			"mediumslateblue": "123,104,238",
			"mediumspringgreen": "0,250,154",
			"mediumturquoise": "72,209,204",
			"mediumvioletred": "199,21,133",
			"midnightblue": "25,25,112",
			"mintcream": "245,255,250",
			"mistyrose": "255,228,225",
			"moccasin": "255,228,181",
			"navajowhite": "255,222,173",
			"navy": "0,0,128",
			"oldlace": "253,245,230",
			"olivedrab": "107,142,35",
			"olive": "128,128,0",
			"orangered": "255,69,0",
			"orange": "255,165,0",
			"orchid": "218,112,214",
			"palegoldenrod": "238,232,170",
			"palegreen": "152,251,152",
			"paleturquoise": "175,238,238",
			"palevioletred": "219,112,147",
			"papayawhip": "255,239,213",
			"peachpuff": "255,218,185",
			"peru": "205,133,63",
			"pink": "255,192,203",
			"plum": "221,160,221",
			"powderblue": "176,224,230",
			"purple": "128,0,128",
			"red": "255,0,0",
			"rosybrown": "188,143,143",
			"royalblue": "65,105,225",
			"saddlebrown": "139,69,19",
			"salmon": "250,128,114",
			"sandybrown": "244,164,96",
			"seagreen": "46,139,87",
			"seashell": "255,245,238",
			"sienna": "160,82,45",
			"silver": "192,192,192",
			"skyblue": "135,206,235",
			"slateblue": "106,90,205",
			"slategray": "112,128,144",
			"snow": "255,250,250",
			"springgreen": "0,255,127",
			"steelblue": "70,130,180",
			"tan": "210,180,140",
			"teal": "0,128,128",
			"thistle": "216,191,216",
			"tomato": "255,99,71",
			"turquoise": "64,224,208",
			"violet": "238,130,238",
			"wheat": "245,222,179",
			"whitesmoke": "245,245,245",
			"white": "255,255,255",
			"yellowgreen": "154,205,50",
			"yellow": "255,255,0"
		}
	};
	/************
	 Hooks
	 ************/

	/* Hooks allow a subproperty (e.g. "boxShadowBlur") of a compound-value CSS property
	 (e.g. "boxShadow: X Y Blur Spread Color") to be animated as if it were a discrete property. */
	/* Note: Beyond enabling fine-grained property animation, hooking is necessary since Velocity only
	 tweens properties with single numeric values; unlike CSS transitions, Velocity does not interpolate compound-values. */
	export var Hooks = vHooks;

	/*******************
	 Normalizations
	 *******************/

	/* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
	 and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
	export var Normalizations = vNormalizations;

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
			if (IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) {
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
					var prefixElement = Velocity.State.prefixElement;

					if (prefixElement && isString(prefixElement.style[propertyPrefixed])) {
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
		hexToRgb: function(hex: string): [number, number, number] {
			var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
				longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
				rgbParts;

			hex = hex.replace(shortformRegex, function(m, r, g, b) {
				return r + r + g + g + b + b;
			});

			rgbParts = longformRegex.exec(hex);

			return rgbParts ? [parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16)] : [0, 0, 0];
		},
		isCSSNullValue: function(value: string): boolean {
			/* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
			 Thus, we check for both falsiness and these special strings. */
			/* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
			 templates as defined as vCSS.Hooks (for the sake of hook injection/extraction). */
			/* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
			return (!value || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
		},
		/* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
		getUnitType: function(property: string): string {
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
		getDisplayType: function(element: HTMLorSVGElement): string {
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
		addClass: function(element: HTMLorSVGElement, className: string): void {
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
		removeClass: function(element: HTMLorSVGElement, className: string): void {
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

					element.setAttribute("class", currentClass.replace(new RegExp("(^|\s)" + className.split(" ").join("|") + "(\s|$)", "gi"), " "));
				}
			}
		}
	};
	/****************************
	 Style Getting & Setting
	 ****************************/

	/* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
	export function getPropertyValue(element: HTMLorSVGElement, property: string, rootPropertyValue?: string, forceStyleLookup?: boolean) {
		/* Get an element's computed property value. */
		/* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
		 style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
		 *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
		function computePropertyValue(element, property) {
			/* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
			 element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
			 offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
			 We subtract border and padding to get the sum of interior + scrollbar. */
			var computedValue: string | number = 0;

			/* IE<=8 doesn't support window.getComputedStyle, thus we defer to jQuery, which has an extensive array
			 of hacks to accurately retrieve IE8 property values. Re-implementing that logic here is not worth bloating the
			 codebase for a dying browser. The performance repercussions of using jQuery here are minimal since
			 Velocity is optimized to rarely (and sometimes never) query the DOM. Further, the $.css() codepath isn't that slow. */
			if (IE <= 8) {
				computedValue = $.css(element, property); /* GET */
				/* All other browsers support getComputedStyle. The returned live object reference is cached onto its
				 associated element so that it does not need to be refetched upon every GET. */
			} else {
				/* Browsers do not return height and width values for elements that are set to display:"none". Thus, we temporarily
				 toggle display to the element type's default value. */
				var toggleDisplay = false;

				if (/^(width|height)$/.test(property) && vCSS.getPropertyValue(element, "display") === 0) {
					toggleDisplay = true;
					vCSS.setPropertyValue(element, "display", vCSS.Values.getDisplayType(element));
				}

				var revertDisplay = function() {
					if (toggleDisplay) {
						vCSS.setPropertyValue(element, "display", "none");
					}
				};

				if (!forceStyleLookup) {
					if (property === "height" && vCSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
						var contentBoxHeight = element.offsetHeight - (parseFloat(vCSS.getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(vCSS.getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(vCSS.getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(vCSS.getPropertyValue(element, "paddingBottom")) || 0);
						revertDisplay();

						return contentBoxHeight;
					} else if (property === "width" && vCSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
						var contentBoxWidth = element.offsetWidth - (parseFloat(vCSS.getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(vCSS.getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(vCSS.getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(vCSS.getPropertyValue(element, "paddingRight")) || 0);
						revertDisplay();

						return contentBoxWidth;
					}
				}

				var computedStyle: CSSStyleDeclaration,
					data = Data(element);

				/* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf
				 of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
				if (!data) {
					computedStyle = window.getComputedStyle(element, null); /* GET */
					/* If the computedStyle object has yet to be cached, do so now. */
				} else if (!data.computedStyle) {
					computedStyle = data.computedStyle = window.getComputedStyle(element, null); /* GET */
					/* If computedStyle is cached, use it. */
				} else {
					computedStyle = data.computedStyle;
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
					computedValue = computedStyle.getPropertyValue(property); /* GET */
				} else {
					computedValue = computedStyle[property];
				}

				/* Fall back to the property's style value (if defined) when computedValue returns nothing,
				 which can happen when the element hasn't been painted. */
				if (computedValue === "" || computedValue === null) {
					computedValue = element.style[property];
				}

				revertDisplay();
			}

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
		 extract the hook's value from a normalized rootPropertyValue using vCSS.Hooks.extractValue(). */
		if (vCSS.Hooks.registered[property]) {
			var hook = property,
				hookRoot = vCSS.Hooks.getRoot(hook);

			/* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM),
			 query the DOM for the root property's value. */
			if (rootPropertyValue === undefined) {
				/* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
				rootPropertyValue = vCSS.getPropertyValue(element, vCSS.Names.prefixCheck(hookRoot)[0]); /* GET */
			}

			/* If this root has a normalization registered, peform the associated normalization extraction. */
			if (vCSS.Normalizations.registered[hookRoot]) {
				rootPropertyValue = vCSS.Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
			}

			/* Extract the hook's value. */
			propertyValue = vCSS.Hooks.extractValue(hook, rootPropertyValue);

			/* If this is a normalized property (e.g. "opacity" becomes "filter" in <=IE8) or "translateX" becomes "transform"),
			 normalize the property's name and value, and handle the special case of transforms. */
			/* Note: Normalizing a property is mutually exclusive from hooking a property since hook-extracted values are strictly
			 numerical and therefore do not require normalization extraction. */
		} else if (vCSS.Normalizations.registered[property]) {
			var normalizedPropertyName,
				normalizedPropertyValue;

			normalizedPropertyName = vCSS.Normalizations.registered[property]("name", element);

			/* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache.
			 At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
			 This is because parsing 3D transform matrices is not always accurate and would bloat our codebase;
			 thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
			if (normalizedPropertyName !== "transform") {
				normalizedPropertyValue = computePropertyValue(element, vCSS.Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

				/* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
				if (vCSS.Values.isCSSNullValue(normalizedPropertyValue) && vCSS.Hooks.templates[property]) {
					normalizedPropertyValue = vCSS.Hooks.templates[property][1];
				}
			}

			propertyValue = vCSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
		}

		/* If a (numeric) value wasn't produced via hook extraction or normalization, query the DOM. */
		if (!/^[\d-]/.test(propertyValue)) {
			/* For SVG elements, dimensional properties (which SVGAttribute() detects) are tweened via
			 their HTML attribute values instead of their CSS style values. */
			var data = Data(element);

			if (data && data.isSVG && vCSS.Names.SVGAttribute(property)) {
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
				propertyValue = computePropertyValue(element, vCSS.Names.prefixCheck(property)[0]); /* GET */
			}
		}

		/* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values),
		 convert CSS null-values to an integer of value 0. */
		if (vCSS.Values.isCSSNullValue(propertyValue)) {
			propertyValue = 0;
		}

		if (Velocity.debug >= 2) {
			console.log("Get " + property + ": " + propertyValue);
		}

		return propertyValue;
	}

	/* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
	export function setPropertyValue(element: HTMLorSVGElement, property: string, propertyValue: any, rootPropertyValue?, scrollData?: ScrollData) {
		var propertyName = property;

		/* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
		if (property === "scroll") {
			/* If a container option is present, scroll the container instead of the browser window. */
			if (scrollData.container) {
				scrollData.container["scroll" + scrollData.direction] = propertyValue;
				/* Otherwise, Velocity defaults to scrolling the browser window. */
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
			if (vCSS.Normalizations.registered[property] && vCSS.Normalizations.registered[property]("name", element) === "transform") {
				/* Perform a normalization injection. */
				/* Note: The normalization logic handles the transformCache updating. */
				vCSS.Normalizations.registered[property]("inject", element, propertyValue);

				propertyName = "transform";
				propertyValue = Data(element).transformCache[property];
			} else {
				/* Inject hooks. */
				if (vCSS.Hooks.registered[property]) {
					var hookName = property,
						hookRoot = vCSS.Hooks.getRoot(property);

					/* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
					rootPropertyValue = rootPropertyValue || vCSS.getPropertyValue(element, hookRoot); /* GET */

					propertyValue = vCSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
					property = hookRoot;
				}

				/* Normalize names and values. */
				if (vCSS.Normalizations.registered[property]) {
					propertyValue = vCSS.Normalizations.registered[property]("inject", element, propertyValue);
					property = vCSS.Normalizations.registered[property]("name", element);
				}

				/* Assign the appropriate vendor prefix before performing an official style update. */
				propertyName = vCSS.Names.prefixCheck(property)[0];

				/* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
				 Try/catch is avoided for other browsers since it incurs a performance overhead. */
				if (IE <= 8) {
					try {
						element.style[propertyName] = propertyValue;
					} catch (error) {
						if (Velocity.debug) {
							console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]");
						}
					}
					/* SVG elements have their dimensional properties (width, height, x, y, cx, etc.) applied directly as attributes instead of as styles. */
					/* Note: IE8 does not support SVG elements, so it's okay that we skip it for SVG animation. */
				} else {
					var data = Data(element);

					if (data && data.isSVG && vCSS.Names.SVGAttribute(property)) {
						/* Note: For SVG attributes, vendor-prefixed property names are never used. */
						/* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
						element.setAttribute(property, propertyValue);
					} else {
						element.style[propertyName] = propertyValue;
					}
				}

				if (Velocity.debug >= 2) {
					console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
				}
			}
		}

		/* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
		return [propertyName, propertyValue];
	}

	/* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
	/* Note: Velocity applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
	export function flushTransformCache(element: HTMLorSVGElement) {
		var transformString = "",
			data = Data(element);

		/* Certain browsers require that SVG transforms be applied as an attribute. However, the SVG transform attribute takes a modified version of CSS's transform string
		 (units are dropped and, except for skewX/Y, subproperties are merged into their master property -- e.g. scaleX and scaleY are merged into scale(X Y). */
		if ((IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) && data && data.isSVG) {
			/* Since transform values are stored in their parentheses-wrapped form, we use a helper function to strip out their numeric values.
			 Further, SVG transform properties only take unitless (representing pixels) values, so it's okay that parseFloat() strips the unit suffixed to the float value. */
			var getTransformFloat = function(transformProperty) {
				return parseFloat(vCSS.getPropertyValue(element, transformProperty));
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

				/* IE9 only supports one rotation type, rotateZ, which it refers to as "rotate". */
				if (IE === 9 && transformName === "rotateZ") {
					transformName = "rotate";
				}

				transformString += transformName + transformValue + " ";
			});

			/* If present, set the perspective subproperty first. */
			if (perspective) {
				transformString = "perspective" + perspective + " " + transformString;
			}
		}

		vCSS.setPropertyValue(element, "transform", transformString);
	}
};
