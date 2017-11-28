/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

interface Element {
	velocityData: ElementData;
}

/**
 * Get the internal data store for an element.
 */
function Data(element: HTMLorSVGElement): ElementData {
	// Use a string member so Uglify doesn't mangle it.
	let data: ElementData = element["velocityData"];

	if (!data) {
		// Do it this way so it errors on incorrect data.
		data = {
			/**
			 * Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements.
			 */
			isSVG: isSVG(element),
			/**
			 * Keep track of whether the element is currently being animated by Velocity.
			 * This is used to ensure that property values are not transferred between non-consecutive (stale) calls.
			 */
			isAnimating: false,
			/**
			 * A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle
			 */
			computedStyle: null,
			/**
			 * Cached current value as set
			 */
			cache: Object.create(null),
			/**
			 * The queues and their animations
			 */
			queueList: Object.create(null),
			/**
			 * The last tweens for use as repetitions
			 */
			lastAnimationList: Object.create(null),
			/**
			 * The last tweens for use as repetitions
			 */
			lastFinishList: Object.create(null)
		};
		Object.defineProperty(element, "velocityData", {
			value: data
		});
	}

	return data;
}
