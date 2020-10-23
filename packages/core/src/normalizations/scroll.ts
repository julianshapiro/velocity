/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import { KnownElement } from "../velocity";
import { getPropertyValue } from "../css/getPropertyValue";
import { NormalizationsFn, registerNormalization } from "../normalizations";

/**
 * Get the scrollWidth of an element.
 */
function clientWidth(element: KnownElement): string;
function clientWidth(element: KnownElement, propertyValue: string): void;
function clientWidth(element: KnownElement, propertyValue?: string): string | void {
	if (propertyValue == null) {
		return element.clientWidth + "px";
	}
}

/**
 * Get the scrollWidth of an element.
 */
function scrollWidth(element: KnownElement): string;
function scrollWidth(element: KnownElement, propertyValue: string): void;
function scrollWidth(element: KnownElement, propertyValue?: string): string | void {
	if (propertyValue == null) {
		return element.scrollWidth + "px";
	}
}

/**
 * Get the scrollHeight of an element.
 */
function clientHeight(element: KnownElement): string;
function clientHeight(element: KnownElement, propertyValue: string): void;
function clientHeight(element: KnownElement, propertyValue?: string): string | void {
	if (propertyValue == null) {
		return element.clientHeight + "px";
	}
}

/**
 * Get the scrollHeight of an element.
 */
function scrollHeight(element: KnownElement): string;
function scrollHeight(element: KnownElement, propertyValue: string): void;
function scrollHeight(element: KnownElement, propertyValue?: string): string | void {
	if (propertyValue == null) {
		return element.scrollHeight + "px";
	}
}

/**
 * Scroll an element.
 */
function scroll(direction: "Height", end: "Top"): NormalizationsFn;
function scroll(direction: "Width", end: "Left"): NormalizationsFn;
function scroll(direction: "Height" | "Width", end: "Top" | "Left"): NormalizationsFn {
	return ((element: KnownElement, propertyValue?: string): string | void => {
		if (propertyValue == null) {
			// Make sure we have these values cached.
			getPropertyValue(element, "client" + direction, null as any, true);
			getPropertyValue(element, "scroll" + direction, null as any, true);

			return element["scroll" + end] + "px";
		}
		const value = parseFloat(propertyValue);
		const unit = propertyValue.replace(String(value), "");

		switch (unit) {
			case "":
			case "px":
				element["scroll" + end] = value;
				break;

			case "%":
				const client = parseFloat(getPropertyValue(element, "client" + direction));
				const scrollValue = parseFloat(getPropertyValue(element, "scroll" + direction));

				element["scroll" + end] = Math.max(0, scrollValue - client) * value / 100;
				break;
		}
	}) as NormalizationsFn;
}

registerNormalization("HTMLElement", "scroll", scroll("Height", "Top"), false);
registerNormalization("HTMLElement", "scrollTop", scroll("Height", "Top"), false);
registerNormalization("HTMLElement", "scrollLeft", scroll("Width", "Left"), false);
registerNormalization("HTMLElement", "scrollWidth", scrollWidth);
registerNormalization("HTMLElement", "clientWidth", clientWidth);
registerNormalization("HTMLElement", "scrollHeight", scrollHeight);
registerNormalization("HTMLElement", "clientHeight", clientHeight);
