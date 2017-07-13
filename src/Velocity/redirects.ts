namespace VelocityStatic {

	/* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
	export var Redirects = {/* Manually registered by the user. */};

	/***********************
	 Packaged Redirects
	 ***********************/

	/* slideUp, slideDown */
	["Down", "Up"].forEach(function(direction) {
		Redirects["slide" + direction] = function(element: HTMLorSVGElement, options: VelocityOptions, elementsIndex: number, elementsSize, elements: HTMLorSVGElement[], promiseData) {
			var opts: ElementData = _assign({}, options) as ElementData,
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
				/* Show the element before slideDown begins and hide the element after slideUp completes. */
				/* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */
				opts.display = (direction === "Down" ? (CSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block") : "none");
			}

			opts.begin = function() {
				/* If the user passed in a begin callback, fire it now. */
				if (elementsIndex === 0 && begin) {
					begin.call(elements, elements);
				}

				/* Cache the elements' original vertical dimensional property values so that we can animate back to them. */
				for (var property in computedValues) {
					if (!computedValues.hasOwnProperty(property)) {
						continue;
					}
					inlineValues[property] = element.style[property];

					/* For slideDown, use forcefeeding to animate all vertical properties from 0. For slideUp,
					 use forcefeeding to start from computed values and animate down to 0. */
					var propertyValue = CSS.getPropertyValue(element, property);
					computedValues[property] = (direction === "Down") ? [propertyValue, 0] : [0, propertyValue];
				}

				/* Force vertical overflow content to clip so that sliding works as expected. */
				(inlineValues as any).overflow = element.style.overflow;
				element.style.overflow = "hidden";
			};

			opts.complete = function() {
				/* Reset element to its pre-slide inline values once its slide animation is complete. */
				for (var property in inlineValues) {
					if (inlineValues.hasOwnProperty(property)) {
						element.style[property] = inlineValues[property];
					}
				}

				/* If the user passed in a complete callback, fire it now. */
				if (elementsIndex === elementsSize - 1) {
					if (complete) {
						complete.call(elements, elements);
					}
					if (promiseData) {
						promiseData.resolver(elements);
					}
				}
			};

			(Velocity as any)(element, computedValues, opts);
		};
	});

	/* fadeIn, fadeOut */
	["In", "Out"].forEach(function(direction) {
		Redirects["fade" + direction] = function(element: HTMLorSVGElement, options: VelocityOptions, elementsIndex: number, elementsSize, elements: HTMLorSVGElement[], promiseData) {
			var opts: ElementData = _assign({}, options) as ElementData,
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

			(Velocity as any)(this, propertiesMap, opts);
		};
	});
};
