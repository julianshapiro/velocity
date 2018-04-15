/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import {
	ElementData,
	HTMLorSVGElement,
} from "../../index.d";

import {constructors} from "./normalizations/normalizationsObject";

const dataName = "velocityData";

/**
 * Get (and create) the internal data store for an element.
 */
export function Data(element: HTMLorSVGElement): ElementData {
	// Use a string member so Uglify doesn't mangle it.
	const data = element[dataName];

	if (data) {
		return data;
	}
	let types = 0;

	for (let index = 0; index < constructors.length; index++) {
		if (element instanceof constructors[index]) {
			types |= 1 << index; // tslint:disable-line:no-bitwise
		}
	}
	// Do it this way so it errors on incorrect data.
	const newData: ElementData = {
		types,
		count: 0,
		computedStyle: null,
		cache: {} as any,
		queueList: {},
		lastAnimationList: {},
		lastFinishList: {},
		window: element.ownerDocument.defaultView,
	};
	Object.defineProperty(element, dataName, {
		value: newData,
	});

	return newData;
}
