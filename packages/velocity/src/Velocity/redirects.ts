/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {

	/* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
	export let Redirects = {/* Manually registered by the user. */};

	/***********************
	 Packaged Redirects
	 ***********************/

	/* slideUp, slideDown */
	["Down", "Up"].forEach(function(direction) {
		Redirects["slide" + direction] = function(element: HTMLorSVGElement, options: VelocityOptions, elementsIndex: number, elementsSize, elements: HTMLorSVGElement[], resolver: (value?: HTMLorSVGElement[] | VelocityResult) => void) {
			let opts = {...options},
				begin = opts.begin,
				complete = opts.complete,
				inlineValues = {},
				computedValues = {
					height: "",
					marginTop: "",
					marginBottom: "",
					paddingTop: "",
					paddingBottom: ""
				};

			if (opts.display === undefined) {
				let isInline = inlineRx.test(element.nodeName.toLowerCase());

				/* Show the element before slideDown begins and hide the element after slideUp completes. */
				/* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */
				opts.display = (direction === "Down" ? (isInline ? "inline-block" : "block") : "none");
			}

			opts.begin = function() {
				/* If the user passed in a begin callback, fire it now. */
				if (elementsIndex === 0 && begin) {
					begin.call(elements, elements);
				}

				/* Cache the elements' original vertical dimensional property values so that we can animate back to them. */
				for (let property in computedValues) {
					if (!computedValues.hasOwnProperty(property)) {
						continue;
					}
					inlineValues[property] = element.style[property];

					/* For slideDown, use forcefeeding to animate all vertical properties from 0. For slideUp,
					 use forcefeeding to start from computed values and animate down to 0. */
					let propertyValue = CSS.getPropertyValue(element, property);
					computedValues[property] = (direction === "Down") ? [propertyValue, 0] : [0, propertyValue];
				}

				/* Force vertical overflow content to clip so that sliding works as expected. */
				(inlineValues as any).overflow = element.style.overflow;
				element.style.overflow = "hidden";
			};

			opts.complete = function() {
				/* Reset element to its pre-slide inline values once its slide animation is complete. */
				for (let property in inlineValues) {
					if (inlineValues.hasOwnProperty(property)) {
						element.style[property] = inlineValues[property];
					}
				}

				/* If the user passed in a complete callback, fire it now. */
				if (elementsIndex === elementsSize - 1) {
					if (complete) {
						complete.call(elements, elements);
					}
					if (resolver) {
						resolver(elements);
					}
				}
			};

			(VelocityFn as any)(element, computedValues, opts);
		};
	});

	/* fadeIn, fadeOut */
	["In", "Out"].forEach(function(direction) {
		Redirects["fade" + direction] = function(element: HTMLorSVGElement, options: VelocityOptions, elementsIndex: number, elementsSize, elements: HTMLorSVGElement[], promiseData) {
			let opts = {...options},
				complete = opts.complete,
				propertiesMap = {
					opacity: (direction === "In") ? 1 : 0
				};

			/* Since redirects are triggered individually for each element in the animated set, avoid repeatedly triggering
			 callbacks by firing them only when the final element has been reached. */
			if (elementsIndex !== 0) {
				opts.begin = null;
			}
			if (elementsIndex !== elementsSize - 1) {
				opts.complete = null;
			} else {
				opts.complete = function() {
					if (complete) {
						complete.call(elements, elements);
					}
					if (promiseData) {
						promiseData.resolver(elements);
					}
				};
			}

			/* If a display was passed in, use it. Otherwise, default to "none" for fadeOut or the element-specific default for fadeIn. */
			/* Note: We allow users to pass in "null" to skip display setting altogether. */
			if (opts.display === undefined) {
				opts.display = (direction === "In" ? "auto" : "none");
			}

			(VelocityFn as any)(this, propertiesMap, opts);
		};
	});
};
