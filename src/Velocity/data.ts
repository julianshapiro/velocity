/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

interface Element {
	velocityData: ElementData;
}

/**
 * Get (and create) the internal data store for an element.
 */
function Data(element: HTMLorSVGElement): ElementData {
	// Use a string member so Uglify doesn't mangle it.
	let data: ElementData = element["velocityData"];

	if (!data) {
		// Do it this way so it errors on incorrect data.
		data = {
			isSVG: isSVG(element),
			count: 0,
			computedStyle: null,
			cache: Object.create(null),
			queueList: Object.create(null),
			lastAnimationList: Object.create(null),
			lastFinishList: Object.create(null)
		};
		Object.defineProperty(element, "velocityData", {
			value: data
		});
	}
	return data;
}
