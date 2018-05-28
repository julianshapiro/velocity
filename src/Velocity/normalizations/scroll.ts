/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

// Typedefs
import {HTMLorSVGElement, VelocityNormalizationsFn} from "../../../velocity.d";

// Project
import {getPropertyValue} from "../css/getPropertyValue";
import {registerNormalization} from "./normalizations";

/**
 * Get the scrollWidth of an element.
 */
function clientWidth(element: HTMLorSVGElement): string;
function clientWidth(element: HTMLorSVGElement, propertyValue: string): void;
function clientWidth(element: HTMLorSVGElement, propertyValue?: string): string | void {
	if (propertyValue == null) {
		return element.clientWidth + "px";
	}
}

/**
 * Get the scrollWidth of an element.
 */
function scrollWidth(element: HTMLorSVGElement): string;
function scrollWidth(element: HTMLorSVGElement, propertyValue: string): void;
function scrollWidth(element: HTMLorSVGElement, propertyValue?: string): string | void {
	if (propertyValue == null) {
		return element.scrollWidth + "px";
	}
}

/**
 * Get the scrollHeight of an element.
 */
function clientHeight(element: HTMLorSVGElement): string;
function clientHeight(element: HTMLorSVGElement, propertyValue: string): void;
function clientHeight(element: HTMLorSVGElement, propertyValue?: string): string | void {
	if (propertyValue == null) {
		return element.clientHeight + "px";
	}
}

/**
 * Get the scrollHeight of an element.
 */
function scrollHeight(element: HTMLorSVGElement): string;
function scrollHeight(element: HTMLorSVGElement, propertyValue: string): void;
function scrollHeight(element: HTMLorSVGElement, propertyValue?: string): string | void {
	if (propertyValue == null) {
		return element.scrollHeight + "px";
	}
}

/**
 * Scroll an element.
 */
function scroll(direction: "Height", end: "Top"): VelocityNormalizationsFn;
function scroll(direction: "Width", end: "Left"): VelocityNormalizationsFn;
function scroll(direction: "Height" | "Width", end: "Top" | "Left"): VelocityNormalizationsFn {
	return ((element: HTMLorSVGElement, propertyValue?: string): string | void => {
		if (propertyValue == null) {
			// Make sure we have these values cached.
			getPropertyValue(element, "client" + direction, null, true);
			getPropertyValue(element, "scroll" + direction, null, true);

			return element["scroll" + end] + "px";
		}
		const value = parseFloat(propertyValue),
			unit = propertyValue.replace(String(value), "");

		switch (unit) {
			case "":
			case "px":
				element["scroll" + end] = value;
				break;

			case "%":
				const client = parseFloat(getPropertyValue(element, "client" + direction)),
					scrollValue = parseFloat(getPropertyValue(element, "scroll" + direction));

				element["scroll" + end] = Math.max(0, scrollValue - client) * value / 100;
				break;
		}
	}) as VelocityNormalizationsFn;
}

registerNormalization(["HTMLElement", "scroll", scroll("Height", "Top"), false]);
registerNormalization(["HTMLElement", "scrollTop", scroll("Height", "Top"), false]);
registerNormalization(["HTMLElement", "scrollLeft", scroll("Width", "Left"), false]);
registerNormalization(["HTMLElement", "scrollWidth", scrollWidth]);
registerNormalization(["HTMLElement", "clientWidth", clientWidth]);
registerNormalization(["HTMLElement", "scrollHeight", scrollHeight]);
registerNormalization(["HTMLElement", "clientHeight", clientHeight]);
