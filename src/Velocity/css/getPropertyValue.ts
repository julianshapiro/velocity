/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {

	// TODO: This is still a complete mess
	function computePropertyValue(element: HTMLorSVGElement, property: string): string {
		let data = Data(element),
			computedValue: string | number = 0,
			// If computedStyle is cached, use it.
			computedStyle = data && data.computedStyle ? data.computedStyle : window.getComputedStyle(element, null);

		if (data && !data.computedStyle) {
			data.computedStyle = computedStyle;
		}
		if (/^(width|height)$/.test(property)) {
			// Browsers do not return height and width values for elements
			// that are set to display:"none". Thus, we temporarily toggle
			// display to the element type's default value.
			let toggleDisplay: boolean = getPropertyValue(element, "display") === "none";

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
				setPropertyValue(element, "display", "auto");
			}
			computedValue = augmentDimension(element, property, true);
			if (toggleDisplay) {
				setPropertyValue(element, "display", "none");
			}
			return String(computedValue);
		}

		/* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
		 Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
		 So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
		/* TODO: There is a borderColor normalisation in legacy/ - figure out where this is needed... */
//		if (property === "borderColor") {
//			property = "borderTopColor";
//		}

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
		/* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
		 defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
		 effect as being set to 0, so no conversion is necessary.) */
		/* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
		 property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
		 to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
		if (computedValue === "auto" && /^(top|right|bottom|left)$/.test(property)) {
			let position = getPropertyValue(element, "position"); /* GET */

			if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
				/* Note: this has no pixel unit on its returned values; we re-add it here to conform with computePropertyValue's behavior. */
				computedValue = _position(element)[property] + "px"; /* GET */
			}
		}
		return computedValue !== undefined ? String(computedValue) : undefined;
	}

	/**
	 * Get a property value. This will grab via the cache if it exists, then
	 * via any normalisations, then it will check the css values directly.
	 */
	export function getPropertyValue(element: HTMLorSVGElement, property: string, skipNormalisation?: boolean): string {
		let propertyValue: string,
			data = Data(element);

		if (data && data.cache[property] != null) {
			propertyValue = data.cache[property];
			if (debug >= 2) {
				console.info("Get " + property + ": " + propertyValue);
			}
			return propertyValue;
		} else if (!skipNormalisation && Normalizations[property]) {
			propertyValue = Normalizations[property](element);
		} else if (data && data.isSVG && Names.SVGAttribute(property)) {
			// Since the height/width attribute values must be set manually,
			// they don't reflect computed values. Thus, we use use getBBox()
			// to ensure we always get values for elements with undefined
			// height/width attributes.

			// For SVG elements, dimensional properties (which SVGAttribute()
			// detects) are tweened via their HTML attribute values instead
			// of their CSS style values.
			// TODO: Make into a normalisation
			if (/^(height|width)$/i.test(property)) {
				/* Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM. */
				try {
					propertyValue = (element as SVGGraphicsElement).getBBox()[property] + "px";
				} catch (e) {
					propertyValue = "0px";
				}
				/* Otherwise, access the attribute value directly. */
			} else {
				propertyValue = element.getAttribute(property);
			}
		} else {
			// Note: Retrieving the value of a CSS property cannot simply be
			// performed by checking an element's style attribute (which
			// only reflects user-defined values). Instead, the browser must
			// be queried for a property's *computed* value. You can read
			// more about getComputedStyle here:
			// https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle
			propertyValue = computePropertyValue(element, property);
		}
		if (debug >= 2) {
			console.info("Get " + property + ": " + propertyValue);
		}
		if (data) {
			data.cache[property] = propertyValue;
		}
		return propertyValue;
	}
}
