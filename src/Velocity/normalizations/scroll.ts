///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {
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
		return function(element: HTMLorSVGElement, propertyValue?: string): string | void {
			if (propertyValue == null) {
				// Make sure we have these values cached.
				CSS.getPropertyValue(element, "client" + direction, null, true);
				CSS.getPropertyValue(element, "scroll" + direction, null, true);
				CSS.getPropertyValue(element, "scroll" + end, null, true);
				return element["scroll" + end] + "px";
			}
			//		console.log("setScrollTop", propertyValue)
			const value = parseFloat(propertyValue),
				unit = propertyValue.replace(String(value), "");

			switch (unit) {
				case "":
				case "px":
					element["scroll" + end] = value;
					break;

				case "%":
					let client = parseFloat(CSS.getPropertyValue(element, "client" + direction)),
						scroll = parseFloat(CSS.getPropertyValue(element, "scroll" + direction));

					//				console.log("setScrollTop percent", scrollHeight, clientHeight, value, Math.max(0, scrollHeight - clientHeight) * value / 100)
					element["scroll" + end] = Math.max(0, scroll - client) * value / 100;
			}
		} as VelocityNormalizationsFn;
	}

	registerNormalization([HTMLElement, "scroll", scroll("Height", "Top"), false]);
	registerNormalization([HTMLElement, "scrollTop", scroll("Height", "Top"), false]);
	registerNormalization([HTMLElement, "scrollLeft", scroll("Width", "Left"), false]);
	registerNormalization([HTMLElement, "scrollWidth", scrollWidth]);
	registerNormalization([HTMLElement, "clientWidth", clientWidth]);
	registerNormalization([HTMLElement, "scrollHeight", scrollHeight]);
	registerNormalization([HTMLElement, "clientHeight", clientHeight]);
}
