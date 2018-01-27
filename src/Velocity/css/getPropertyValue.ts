/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {

	// TODO: This is still a complete mess
	export function computePropertyValue(element: HTMLorSVGElement, property: string): string {
		const data = Data(element),
			// If computedStyle is cached, use it.
			computedStyle = data && data.computedStyle ? data.computedStyle : window.getComputedStyle(element, null);
		let computedValue: string | number = 0;

		if (data && !data.computedStyle) {
			data.computedStyle = computedStyle;
		}
		if (property === "width" || property === "height") {
			// Browsers do not return height and width values for elements
			// that are set to display:"none". Thus, we temporarily toggle
			// display to the element type's default value.
			const toggleDisplay: boolean = getPropertyValue(element, "display") === "none";

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
		if (computedValue === "auto") {
			if (/^(top|right|bottom|left)$/.test(property)) {
				const position = getPropertyValue(element, "position"); /* GET */

				if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
					/* Note: this has no pixel unit on its returned values; we re-add it here to conform with computePropertyValue's behavior. */
					computedValue = _position(element)[property] + "px"; /* GET */
				}
			} else {
				computedValue = "0";
			}
		}
		return computedValue ? String(computedValue) : "";
	}

	/**
	 * Get a property value. This will grab via the cache if it exists, then
	 * via any normalisations, then it will check the css values directly.
	 */
	export function getPropertyValue(element: HTMLorSVGElement, propertyName: string, skipNormalisation?: boolean, skipCache?: boolean): string {
		const data = Data(element);
		let propertyValue: string;

		if (NoCacheNormalizations.has(propertyName)) {
			skipCache = true;
		}
		if (!skipCache && data && data.cache[propertyName] != null) {
			propertyValue = data.cache[propertyName];
			if (debug >= 2) {
				console.info("Get " + propertyName + ": " + propertyValue);
			}
			return propertyValue;
		} else {
			let types = data.types,
				best: VelocityNormalizationsFn;

			for (let index = 0; types; types >>= 1, index++) {
				if (types & 1) {
					best = Normalizations[index][propertyName] || best;
				}
			}
			if (best) {
				propertyValue = best(element);
			} else {
				// Note: Retrieving the value of a CSS property cannot simply be
				// performed by checking an element's style attribute (which
				// only reflects user-defined values). Instead, the browser must
				// be queried for a property's *computed* value. You can read
				// more about getComputedStyle here:
				// https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle
				propertyValue = computePropertyValue(element, propertyName);
			}
		}
		if (debug >= 2) {
			console.info("Get " + propertyName + ": " + propertyValue);
		}
		if (data) {
			data.cache[propertyName] = propertyValue;
		}
		return propertyValue;
	}
}
