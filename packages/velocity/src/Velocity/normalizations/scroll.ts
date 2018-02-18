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
	function clientWidth(element: HTMLorSVGElement, propertyValue: string): boolean;
	function clientWidth(element: HTMLorSVGElement, propertyValue?: string): string | boolean {
		if (propertyValue == null) {
			return element.clientWidth + "px";
		}
		return false;
	}

	/**
	 * Get the scrollWidth of an element.
	 */
	function scrollWidth(element: HTMLorSVGElement): string;
	function scrollWidth(element: HTMLorSVGElement, propertyValue: string): boolean;
	function scrollWidth(element: HTMLorSVGElement, propertyValue?: string): string | boolean {
		if (propertyValue == null) {
			return element.scrollWidth + "px";
		}
		return false;
	}

	/**
	 * Get the scrollHeight of an element.
	 */
	function clientHeight(element: HTMLorSVGElement): string;
	function clientHeight(element: HTMLorSVGElement, propertyValue: string): boolean;
	function clientHeight(element: HTMLorSVGElement, propertyValue?: string): string | boolean {
		if (propertyValue == null) {
			return element.clientHeight + "px";
		}
		return false;
	}

	/**
	 * Get the scrollHeight of an element.
	 */
	function scrollHeight(element: HTMLorSVGElement): string;
	function scrollHeight(element: HTMLorSVGElement, propertyValue: string): boolean;
	function scrollHeight(element: HTMLorSVGElement, propertyValue?: string): string | boolean {
		if (propertyValue == null) {
			return element.scrollHeight + "px";
		}
		return false;
	}

	/**
	 * Scroll an element (vertical).
	 */
	function scrollTop(element: HTMLorSVGElement): string;
	function scrollTop(element: HTMLorSVGElement, propertyValue: string): boolean;
	function scrollTop(element: HTMLorSVGElement, propertyValue?: string): string | boolean {
		if (propertyValue == null) {
			//			getPropertyValue(element, "clientWidth", false, true);
			//			getPropertyValue(element, "scrollWidth", false, true);
			//			getPropertyValue(element, "scrollLeft", false, true);
			CSS.getPropertyValue(element, "clientHeight", false, true);
			CSS.getPropertyValue(element, "scrollHeight", false, true);
			CSS.getPropertyValue(element, "scrollTop", false, true);
			return element.scrollTop + "px";
		}
		//		console.log("setScrollTop", propertyValue)
		const value = parseFloat(propertyValue),
			unit = propertyValue.replace(String(value), "");

		switch (unit) {
			case "":
			case "px":
				element.scrollTop = value;
				break;

			case "%":
				let clientHeight = parseFloat(CSS.getPropertyValue(element, "clientHeight")),
					scrollHeight = parseFloat(CSS.getPropertyValue(element, "scrollHeight"));

				//				console.log("setScrollTop percent", scrollHeight, clientHeight, value, Math.max(0, scrollHeight - clientHeight) * value / 100)
				element.scrollTop = Math.max(0, scrollHeight - clientHeight) * value / 100;
		}
		return false;
	}

	/**
	 * Scroll an element (horizontal).
	 */
	function scrollLeft(element: HTMLorSVGElement): string;
	function scrollLeft(element: HTMLorSVGElement, propertyValue: string): boolean;
	function scrollLeft(element: HTMLorSVGElement, propertyValue?: string): string | boolean {
		if (propertyValue == null) {
			//			getPropertyValue(element, "clientWidth", false, true);
			//			getPropertyValue(element, "scrollWidth", false, true);
			//			getPropertyValue(element, "scrollLeft", false, true);
			CSS.getPropertyValue(element, "clientWidth", false, true);
			CSS.getPropertyValue(element, "scrollWidth", false, true);
			CSS.getPropertyValue(element, "scrollLeft", false, true);
			return element.scrollLeft + "px";
		}
		//		console.log("setScrollLeft", propertyValue)
		const value = parseFloat(propertyValue),
			unit = propertyValue.replace(String(value), "");

		switch (unit) {
			case "":
			case "px":
				element.scrollLeft = value;
				break;

			case "%":
				let clientWidth = parseFloat(CSS.getPropertyValue(element, "clientWidth")),
					scrollWidth = parseFloat(CSS.getPropertyValue(element, "scrollWidth"));

				//				console.log("setScrollLeft percent", scrollWidth, clientWidth, value, Math.max(0, scrollWidth - clientWidth) * value / 100)
				element.scrollTop = Math.max(0, scrollWidth - clientWidth) * value / 100;
		}
		return false;
	}

	registerNormalization([HTMLElement, "scroll", scrollTop, false]);
	registerNormalization([HTMLElement, "scrollTop", scrollTop, false]);
	registerNormalization([HTMLElement, "scrollLeft", scrollLeft, false]);
	registerNormalization([HTMLElement, "scrollWidth", scrollWidth]);
	registerNormalization([HTMLElement, "clientWidth", clientWidth]);
	registerNormalization([HTMLElement, "scrollHeight", scrollHeight]);
	registerNormalization([HTMLElement, "clientHeight", clientHeight]);
}
