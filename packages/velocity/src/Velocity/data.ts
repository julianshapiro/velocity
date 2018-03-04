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
	const data = element["velocityData"];

	if (data) {
		return data;
	}
	let types = 0;

	for (let index = 0, constructors = VelocityStatic.constructors; index < constructors.length; index++) {
		if (element instanceof constructors[index]) {
			types |= 1 << index;
		}
	}
	// Do it this way so it errors on incorrect data.
	let newData: ElementData = {
		types: types,
		count: 0,
		computedStyle: null,
		cache: createEmptyObject(),
		queueList: createEmptyObject(),
		lastAnimationList: createEmptyObject(),
		lastFinishList: createEmptyObject()
	};
	Object.defineProperty(element, "velocityData", {
		value: newData
	});
	return newData;
}
