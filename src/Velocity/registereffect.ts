namespace VelocityStatic {
	/************************
	 Effect Registration
	 ************************/

	/* Animate the expansion/contraction of the elements' parent's height for In/Out effects. */
	function animateParentHeight(elements, direction, totalDuration, stagger) {
		var totalHeightDelta = 0,
			parentNode;

		/* Sum the total height (including padding and margin) of all targeted elements. */
		(elements.nodeType ? [elements] : elements).forEach(function(element, i) {
			if (stagger) {
				/* Increase the totalDuration by the successive delay amounts produced by the stagger option. */
				totalDuration += i * stagger;
			}

			parentNode = element.parentNode;

			var propertiesToSum = ["height", "paddingTop", "paddingBottom", "marginTop", "marginBottom"];

			/* If box-sizing is border-box, the height already includes padding and margin */
			if (CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === "border-box") {
				propertiesToSum = ["height"];
			}

			$.each(propertiesToSum, function(i, property) {
				totalHeightDelta += parseFloat(CSS.getPropertyValue(element, property));
			});
		});

		/* Animate the parent element's height adjustment (with a varying duration multiplier for aesthetic benefits). */
		Velocity(
			parentNode,
			{height: (direction === "In" ? "+" : "-") + "=" + totalHeightDelta},
			{queue: false, easing: "ease-in-out", duration: totalDuration * (direction === "In" ? 0.6 : 1)}
		);
	}

	/* Note: RegisterUI is a legacy name. */
	export function RegisterEffect(effectName: string, properties) {

		/* Register a custom redirect for each effect. */
		Redirects[effectName] = function(element, redirectOptions, elementsIndex, elementsSize, elements, promiseData, loop) {
			var finalElement = (elementsIndex === elementsSize - 1),
				totalDuration = 0;

			loop = loop || properties.loop;
			if (typeof properties.defaultDuration === "function") {
				properties.defaultDuration = properties.defaultDuration.call(elements, elements);
			} else {
				properties.defaultDuration = parseFloat(properties.defaultDuration);
			}

			/* Get the total duration used, so we can share it out with everything that doesn't have a duration */
			for (var callIndex = 0; callIndex < properties.calls.length; callIndex++) {
				durationPercentage = properties.calls[callIndex][1];
				if (typeof durationPercentage === "number") {
					totalDuration += durationPercentage;
				}
			}
			var shareDuration = totalDuration >= 1 ? 0 : properties.calls.length ? (1 - totalDuration) / properties.calls.length : 1;

			/* Iterate through each effect's call array. */
			for (callIndex = 0; callIndex < properties.calls.length; callIndex++) {
				var call = properties.calls[callIndex],
					propertyMap = call[0],
					redirectDuration = 1000,
					durationPercentage = call[1],
					callOptions = call[2] || {},
					opts: VelocityOptions = {};

				if (redirectOptions.duration !== undefined) {
					redirectDuration = redirectOptions.duration;
				} else if (properties.defaultDuration !== undefined) {
					redirectDuration = properties.defaultDuration;
				}

				/* Assign the whitelisted per-call options. */
				opts.duration = redirectDuration * (typeof durationPercentage === "number" ? durationPercentage : shareDuration);
				opts.queue = redirectOptions.queue || "";
				opts.easing = callOptions.easing || "ease";
				opts.delay = parseFloat(callOptions.delay) || 0;
				opts.loop = !properties.loop && callOptions.loop;
				opts._cacheValues = callOptions._cacheValues || true;

				/* Special processing for the first effect call. */
				if (callIndex === 0) {
					/* If a delay was passed into the redirect, combine it with the first call's delay. */
					opts.delay += (parseFloat(redirectOptions.delay) || 0);

					if (elementsIndex === 0) {
						opts.begin = function() {
							/* Only trigger a begin callback on the first effect call with the first element in the set. */
							if (redirectOptions.begin) {
								redirectOptions.begin.call(elements, elements);
							}

							var direction = effectName.match(/(In|Out)$/);

							/* Make "in" transitioning elements invisible immediately so that there's no FOUC between now
							 and the first RAF tick. */
							if ((direction && direction[0] === "In") && propertyMap.opacity !== undefined) {
								(elements.nodeType ? [elements] : elements).forEach(function(element) {
									CSS.setPropertyValue(element, "opacity", 0);
								});
							}

							/* Only trigger animateParentHeight() if we're using an In/Out transition. */
							if (redirectOptions.animateParentHeight && direction) {
								animateParentHeight(elements, direction[0], redirectDuration + (opts.delay as number), redirectOptions.stagger);
							}
						};
					}

					/* If the user isn't overriding the display option, default to "auto" for "In"-suffixed transitions. */
					if (redirectOptions.display !== null) {
						if (redirectOptions.display !== undefined && redirectOptions.display !== "none") {
							opts.display = redirectOptions.display;
						} else if (/In$/.test(effectName)) {
							/* Inline elements cannot be subjected to transforms, so we switch them to inline-block. */
							var defaultDisplay = CSS.Values.getDisplayType(element);
							opts.display = (defaultDisplay === "inline") ? "inline-block" : defaultDisplay;
						}
					}

					if (redirectOptions.visibility && redirectOptions.visibility !== "hidden") {
						opts.visibility = redirectOptions.visibility;
					}
				}

				/* Special processing for the last effect call. */
				if (callIndex === properties.calls.length - 1) {
					/* Append promise resolving onto the user's redirect callback. */
					var injectFinalCallbacks = function() {
						if ((redirectOptions.display === undefined || redirectOptions.display === "none") && /Out$/.test(effectName)) {
							(elements.nodeType ? [elements] : elements).forEach(function(element) {
								CSS.setPropertyValue(element, "display", "none");
							});
						}
						if (redirectOptions.complete) {
							redirectOptions.complete.call(elements, elements);
						}
						if (promiseData) {
							promiseData.resolver(elements || element);
						}
					};

					opts.complete = function() {
						if (loop) {
							Redirects[effectName](element, redirectOptions, elementsIndex, elementsSize, elements, promiseData, loop === true ? true : Math.max(0, loop - 1));
						}
						if (properties.reset) {
							for (var resetProperty in properties.reset) {
								if (!properties.reset.hasOwnProperty(resetProperty)) {
									continue;
								}
								var resetValue = properties.reset[resetProperty];

								/* Format each non-array value in the reset property map to [ value, value ] so that changes apply
								 immediately and DOM querying is avoided (via forcefeeding). */
								/* Note: Don't forcefeed hooks, otherwise their hook roots will be defaulted to their null values. */
								if (CSS.Hooks.registered[resetProperty] === undefined && (typeof resetValue === "string" || typeof resetValue === "number")) {
									properties.reset[resetProperty] = [properties.reset[resetProperty], properties.reset[resetProperty]];
								}
							}

							/* So that the reset values are applied instantly upon the next rAF tick, use a zero duration and parallel queueing. */
							var resetOptions: VelocityOptions = {duration: 0, queue: false};

							/* Since the reset option uses up the complete callback, we trigger the user's complete callback at the end of ours. */
							if (finalElement) {
								resetOptions.complete = injectFinalCallbacks;
							}

							Velocity(element, properties.reset, resetOptions);
							/* Only trigger the user's complete callback on the last effect call with the last element in the set. */
						} else if (finalElement) {
							injectFinalCallbacks();
						}
					};

					if (redirectOptions.visibility === "hidden") {
						opts.visibility = redirectOptions.visibility;
					}
				}

				Velocity(element, propertyMap, opts);
			}
		};

		/* Return the Velocity object so that RegisterUI calls can be chained. */
		return Velocity;
	};
};