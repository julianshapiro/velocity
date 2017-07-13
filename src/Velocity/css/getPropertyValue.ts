namespace VelocityStatic {
	export namespace CSS {

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
							var contentBoxHeight = element.offsetHeight - (parseFloat(getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(getPropertyValue(element, "paddingBottom")) || 0);
							revertDisplay();

							return contentBoxHeight;
						} else if (property === "width" && getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
							var contentBoxWidth = element.offsetWidth - (parseFloat(getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(getPropertyValue(element, "paddingRight")) || 0);
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
		}
	};
};
