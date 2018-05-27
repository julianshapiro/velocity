/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

// Typedefs
import {ElementData, HTMLorSVGElement} from "../../velocity.d";

// Project
import {isString} from "../types";
import {constructors} from "./normalizations/normalizationsObject";

// Constants
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
	const window = element.ownerDocument.defaultView;
	let types = 0;

	for (let index = 0; index < constructors.length; index++) {
		const constructor = constructors[index];

		if (isString(constructor)) {
			if (element instanceof window[constructor]) {
				types |= 1 << index; // tslint:disable-line:no-bitwise
			}
		} else if (element instanceof constructor) {
			types |= 1 << index; // tslint:disable-line:no-bitwise
		}
	}
	// Use an intermediate object so it errors on incorrect data.
	const newData: ElementData = {
		types,
		count: 0,
		computedStyle: null,
		cache: {} as any,
		queueList: {},
		lastAnimationList: {},
		lastFinishList: {},
		window,
	};

	Object.defineProperty(element, dataName, {
		value: newData,
	});

	return newData;
}
