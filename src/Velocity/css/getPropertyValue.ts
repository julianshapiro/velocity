/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

// Typedefs
import {HTMLorSVGElement, VelocityNormalizationsFn} from "../../../velocity.d";

// Project
import Velocity from "../../velocity";
import {Data} from "../data";
import {getNormalization} from "../normalizations/normalizations";
import {NoCacheNormalizations} from "../normalizations/normalizationsObject";
import {augmentDimension} from "./augmentDimension";
import {setPropertyValue} from "./setPropertyValue";

/**
 * Get the width or height of an element, pulled out as it can be used when the
 * in two locations so don't want to repeat it.
 */
function getWidthHeight(element: HTMLorSVGElement, property: "width" | "height"): string {
	return (element.getBoundingClientRect()[property] + augmentDimension(element, property, true)) + "px";
}

// TODO: This is still a complete mess
export function computePropertyValue(element: HTMLorSVGElement, property: string): string {
	const data = Data(element),
		// If computedStyle is cached, use it. If not then get the correct one
		// for the element to support cross-iframe boundaries.
		computedStyle = data.computedStyle ? data.computedStyle : data.window.getComputedStyle(element, null);
	let computedValue: string | number = 0;

	if (!data.computedStyle) {
		data.computedStyle = computedStyle;
	}
	if (computedStyle["display"] === "none") {
		switch (property) {
			case "width":
			case "height":
				// Browsers do not return height and width values for elements
				// that are set to display:"none". Thus, we temporarily toggle
				// display to the element type's default value.
				setPropertyValue(element, "display", "auto");
				computedValue = getWidthHeight(element, property);
				setPropertyValue(element, "display", "none");

				return String(computedValue);
		}
	}

	/* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
	 Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
	 So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
	/* TODO: There is a borderColor normalisation in legacy/ - figure out where this is needed... */

	computedValue = computedStyle[property];
	/* Fall back to the property's style value (if defined) when computedValue returns nothing,
	 which can happen when the element hasn't been painted. */
	if (!computedValue) {
		computedValue = element.style[property];
	}
	/* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
	 defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
	 effect as being set to 0, so no conversion is necessary.) */
	/* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
	 property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
	 to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
	if (computedValue === "auto") {
		switch (property) {
			case "width":
			case "height":
				computedValue = getWidthHeight(element, property);
				break;

			case "top":
			case "left":
				const topLeft = true;
			case "right":
			case "bottom":
				const position = getPropertyValue(element, "position");

				if (position === "fixed" || (topLeft && position === "absolute")) {
					// Note: this has no pixel unit on its returned values,
					// we re-add it here to conform with
					// computePropertyValue's behavior.
					computedValue = element.getBoundingClientRect[property] + "px";
					break;
				}
			// Deliberate fallthrough!
			default:
				computedValue = "0px";
				break;
		}
	}

	return computedValue ? String(computedValue) : "";
}

/**
 * Get a property value. This will grab via the cache if it exists, then
 * via any normalisations.
 */
export function getPropertyValue(element: HTMLorSVGElement, propertyName: string, fn?: VelocityNormalizationsFn, skipCache?: boolean): string {
	const data = Data(element);
	let propertyValue: string;

	if (NoCacheNormalizations.has(propertyName)) {
		skipCache = true;
	}
	if (!skipCache && data && data.cache[propertyName] != null) {
		propertyValue = data.cache[propertyName];
	} else {
		fn = fn || getNormalization(element, propertyName);
		if (fn) {
			propertyValue = fn(element);
			if (data) {
				data.cache[propertyName] = propertyValue;
			}
		}
	}
	if (Velocity.debug >= 2) {
		console.info(`Get "${propertyName}": "${propertyValue}"`, element);
	}

	return propertyValue;
}
