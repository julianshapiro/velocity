/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {
	export let data = new WeakMap<HTMLorSVGElement, ElementData>();
};

/**
 * Set or get internal data for an element
 */
function Data(element: HTMLorSVGElement): ElementData;
function Data(element: HTMLorSVGElement, value: ElementData): void;
function Data(element: HTMLorSVGElement, value?: ElementData): ElementData {
	if (value) {
		VelocityStatic.data.set(element, value);
	} else {
		return VelocityStatic.data.get(element);
	}
}
