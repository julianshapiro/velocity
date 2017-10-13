/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {
	export namespace CSS {

		/****************************
		 Style Getting & Setting
		 ****************************/

		/* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
		export function getPropertyValue(element: HTMLorSVGElement, property: string, rootPropertyValue?: string, forceStyleLookup?: boolean): string | number {
			/* Get an element's computed property value. */
			/* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
			 style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
			 *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
			function computePropertyValue(element: HTMLorSVGElement, property: string) {
				/* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
				 element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
				 offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
				 We subtract border and padding to get the sum of interior + scrollbar. */
				let data = Data(element),
					computedValue: string | number = 0,
					computedStyle = data && data.computedStyle ? data.computedStyle : window.getComputedStyle(element, null),
					isWidthHeight = /^(width|height)$/.test(property),
					/* Browsers do not return height and width values for elements that are set to display:"none". Thus, we temporarily
					 toggle display to the element type's default value. */
					toggleDisplay: boolean = isWidthHeight && getPropertyValue(element, "display") === 0,
					revertDisplay = toggleDisplay ? function() {
						setPropertyValue(element, "display", "none", 1);
					} : function() {};

				if (toggleDisplay) {
					setPropertyValue(element, "display", Values.getDisplayType(element), 1);
				}
				/* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf
				 of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
				if (data && !data.computedStyle) {
					data.computedStyle = computedStyle;
					/* If computedStyle is cached, use it. */
				}
				if (!forceStyleLookup && isWidthHeight && getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
					if (property === "height") {
						// TODO: offsetHeight does not exist on SVGElement
						computedValue = (element as HTMLElement).offsetHeight - (parseFloat(getPropertyValue(element, "borderTopWidth") as string) || 0) - (parseFloat(getPropertyValue(element, "borderBottomWidth") as string) || 0) - (parseFloat(getPropertyValue(element, "paddingTop") as string) || 0) - (parseFloat(getPropertyValue(element, "paddingBottom") as string) || 0);
					} else { //if (property === "width") {
						// TODO: offsetWidth does not exist on SVGElement
						computedValue = (element as HTMLElement).offsetWidth - (parseFloat(getPropertyValue(element, "borderLeftWidth") as string) || 0) - (parseFloat(getPropertyValue(element, "borderRightWidth") as string) || 0) - (parseFloat(getPropertyValue(element, "paddingLeft") as string) || 0) - (parseFloat(getPropertyValue(element, "paddingRight") as string) || 0);
					}
					revertDisplay();
					return computedValue;
				}

				/* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
				 Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
				 So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
				/* TODO: add polyfill */
				if (property === "borderColor") {
					property = "borderTopColor";
				}

				/* IE9 has a bug in which the "filter" property must be accessed from computedStyle using the getPropertyValue method
				 instead of a direct property lookup. The getPropertyValue method is slower than a direct lookup, which is why we avoid it by default. */
				/* TODO: add polyfill */
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
				/* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
				 defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
				 effect as being set to 0, so no conversion is necessary.) */
				/* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
				 property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
				 to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
				if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
					let position = computePropertyValue(element, "position"); /* GET */

					if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
						/* Note: this has no pixel unit on its returned values; we re-add it here to conform with computePropertyValue's behavior. */
						computedValue = _position(element)[property] + "px"; /* GET */
					}
				}

				return computedValue;
			}

			let propertyValue;

			/* If this is a hooked property (e.g. "clipLeft" instead of the root property of "clip"),
			 extract the hook's value from a normalized rootPropertyValue using Hooks.extractValue(). */
			if (Hooks.registered[property]) {
				let hook = property,
					hookRoot = Hooks.getRoot(hook);

				/* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM),
				 query the DOM for the root property's value. */
				if (rootPropertyValue === undefined) {
					/* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
					rootPropertyValue = getPropertyValue(element, Names.prefixCheck(hookRoot)[0]) as string; /* GET */
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
				let normalizedPropertyName = Normalizations.registered[property]("name", element),
					normalizedPropertyValue;

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
				let data = Data(element),
					isWidthHeight = /^(height|width)$/i.test(property);

				if (data && !isWidthHeight && data[property] != null) {
					propertyValue = data[property];
				} else if (data && data.isSVG && Names.SVGAttribute(property)) {
					/* Since the height/width attribute values must be set manually, they don't reflect computed values.
					 Thus, we use use getBBox() to ensure we always get values for elements with undefined height/width attributes. */
					if (isWidthHeight) {
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
			//			if (Values.isCSSNullValue(propertyValue)) {
			//				propertyValue = 0;
			//			}

			if (debug >= 2) {
				console.log("Get " + property + ": " + propertyValue);
			}

			return propertyValue;
		}
	};
};
