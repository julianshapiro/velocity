///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {
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
			getPropertyValue(element, "clientHeight", false, true);
			getPropertyValue(element, "scrollHeight", false, true);
			getPropertyValue(element, "scrollTop", false, true);
			return element.scrollTop + "px";
		}
		console.log("setScrollTop", propertyValue)
		const value = parseFloat(propertyValue),
			unit = propertyValue.replace(String(value), "");

		switch (unit) {
			case "":
			case "px":
				element.scrollTop = value;
				break;

			case "%":
				let clientHeight = parseFloat(getPropertyValue(element, "clientHeight")),
					scrollHeight = parseFloat(getPropertyValue(element, "scrollHeight"));

				console.log("setScrollTop percent", scrollHeight, clientHeight, value, Math.max(0, scrollHeight - clientHeight) * value / 100)
				element.scrollTop = Math.max(0, scrollHeight - clientHeight) * value / 100;
		}
		return false;
	}

	registerNormalization([HTMLElement, "scrollTop", scrollTop, false]);
	registerNormalization([HTMLElement, "scrollWidth", scrollWidth]);
	registerNormalization([HTMLElement, "clientWidth", clientWidth]);
	registerNormalization([HTMLElement, "scrollHeight", scrollHeight]);
	registerNormalization([HTMLElement, "clientHeight", clientHeight]);
}
