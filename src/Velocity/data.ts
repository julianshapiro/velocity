/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

interface Element {
	velocityData: ElementData;
}

/**
 * Set or get internal data for an element
 */
function Data(element: HTMLorSVGElement): ElementData;
function Data(element: HTMLorSVGElement, value: ElementData): void;
function Data(element: HTMLorSVGElement, value?: ElementData): ElementData {
	if (value) {
		Object.defineProperty(element, "velocityData", {
			value: value
		});
	} else {
		return element.velocityData;
	}
}
