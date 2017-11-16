/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Tweens
 */

namespace VelocityStatic {
	/**
	 * Expand all queued animations that haven't gone yet
	 *
	 * This will automatically expand the properties map for any recently added
	 * animations so that the start and end values are correct
	 */
	export function expandTween(activeCall: AnimationCall) {
		let elements = activeCall.elements,
			options = activeCall.options,
			elementsLength = elements.length,
			element = activeCall.element,
			elementArrayIndex = _indexOf.call(elements, element);

		/***************************
		 Tween Data Calculation
		 ***************************/

		/* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
		/* Property map values can either take the form of 1) a single value representing the end value,
		 or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
		 The optional third parameter is a forcefed startValue to be used instead of querying the DOM for
		 the element's current value. Read Velocity's docmentation to learn more about forcefeeding: VelocityJS.org/#forcefeeding */
		function parsePropertyValue(valueData: any, skipResolvingEasing?: boolean) {
			let endValue, easing, startValue;

			/* If we have a function as the main argument then resolve it first, in case it returns an array that needs to be split */
			if (isFunction(valueData)) {
				valueData = valueData.call(element, elementArrayIndex, elementsLength);
			}

			/* Handle the array format, which can be structured as one of three potential overloads:
			 A) [ endValue, easing, startValue ], B) [ endValue, easing ], or C) [ endValue, startValue ] */
			if (Array.isArray(valueData)) {
				/* endValue is always the first item in the array. Don't bother validating endValue's value now
				 since the ensuing property cycling logic does that. */
				endValue = valueData[0];

				/* Two-item array format: If the second item is a number, function, or hex string, treat it as a
				 start value since easings can only be non-hex strings or arrays. */
				if ((!Array.isArray(valueData[1]) && /^[\d-]/.test(valueData[1])) || isFunction(valueData[1]) || CSS.RegEx.isHex.test(valueData[1])) {
					startValue = valueData[1];
					/* Two or three-item array: If the second item is a non-hex string easing name or an array, treat it as an easing. */
				} else if ((isString(valueData[1]) && !CSS.RegEx.isHex.test(valueData[1]) && Easings[valueData[1]]) || Array.isArray(valueData[1])) {
					easing = skipResolvingEasing ? valueData[1] : validateEasing(valueData[1], getValue(activeCall.duration, options.duration));

					/* Don't bother validating startValue's value now since the ensuing property cycling logic inherently does that. */
					startValue = valueData[2];
				} else {
					startValue = valueData[1] || valueData[2];
				}
				/* Handle the single-value format. */
			} else {
				endValue = valueData;
			}

			/* Default to the call's easing if a per-property easing type was not defined. */
			if (!skipResolvingEasing) {
				easing = getValue(easing, activeCall.easing, options.easing, defaults.easing);
			}

			/* If functions were passed in as values, pass the function the current element as its context,
			 plus the element's index and the element set's size as arguments. Then, assign the returned value. */
			if (isFunction(endValue)) {
				endValue = endValue.call(element, elementArrayIndex, elementsLength);
			}

			if (isFunction(startValue)) {
				startValue = startValue.call(element, elementArrayIndex, elementsLength);
			}

			/* Allow startValue to be left as undefined to indicate to the ensuing code that its value was not forcefed. */
			return [endValue || 0, easing, startValue];
		};

		State.firstNew = activeCall._next;
		/* Ensure each element in a set has a nodeType (is a real element) to avoid throwing errors. */
		if (isNode(element)) {
			let data = Data(element),
				lastAnimation: AnimationCall,
				/* A container for the processed data associated with each property in the propertyMap.
				 (Each property in the map produces its own "tween".) */
				propertiesMap = activeCall.properties as VelocityProperties;

			/*****************************************
			 Tween Data Construction (for Scroll)
			 *****************************************/

			/* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Velocity as if it were a standard CSS property animation. */
			//			if (action === "scroll") {
			//				/* The scroll action uniquely takes an optional "offset" option -- specified in pixels -- that offsets the targeted scroll position. */
			//				let scrollDirection = (/^x$/i.test(opts.axis) ? "Left" : "Top"),
			//					scrollOffset = parseFloat(opts.offset as any as string) || 0,
			//					scrollPositionCurrent,
			//					scrollPositionCurrentAlternate,
			//					scrollPositionEnd;
			//
			//				/* Scroll also uniquely takes an optional "container" option, which indicates the parent element that should be scrolled --
			//				 as opposed to the browser window itself. This is useful for scrolling toward an element that's inside an overflowing parent element. */
			//				if (opts.container) {
			//					/* Ensure that either a jQuery object or a raw DOM element was passed in. */
			//					if (isWrapped(opts.container) || isNode(opts.container)) {
			//						/* Extract the raw DOM element from the jQuery wrapper. */
			//						opts.container = opts.container[0] || opts.container;
			//						/* Note: Unlike other properties in Velocity, the browser's scroll position is never cached since it so frequently changes
			//						 (due to the user's natural interaction with the page). */
			//						scrollPositionCurrent = opts.container["scroll" + scrollDirection]; /* GET */
			//
			//						/* _position() values are relative to the viewport (without taking into account the container's true dimensions
			//						 -- say, for example, if the container was not overflowing). Thus, the scroll end value is the sum of the child element's position *and*
			//						 the scroll container's current scroll position. */
			//						scrollPositionEnd = (scrollPositionCurrent + _position(element)[scrollDirection.toLowerCase()]) + scrollOffset; /* GET */
			//						/* If a value other than a jQuery object or a raw DOM element was passed in, default to null so that this option is ignored. */
			//					} else {
			//						opts.container = null;
			//					}
			//				} else {
			//					/* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using
			//					 the appropriate cached property names (which differ based on browser type). */
			//					scrollPositionCurrent = State.scrollAnchor[State["scrollProperty" + scrollDirection]]; /* GET */
			//					/* When scrolling the browser window, cache the alternate axis's current value since window.scrollTo() doesn't let us change only one value at a time. */
			//					scrollPositionCurrentAlternate = State.scrollAnchor[State["scrollProperty" + (scrollDirection === "Left" ? "Top" : "Left")]]; /* GET */
			//
			//					/* Unlike $.position(), $.offset() values are relative to the browser window's true dimensions -- not merely its currently viewable area --
			//					 and therefore end values do not need to be compounded onto current values. */
			//					scrollPositionEnd = _position(element)[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
			//				}
			//
			//				/* Since there's only one format that scroll's associated tweensContainer can take, we create it manually. */
			//				tweensContainer = {
			//					scroll: {
			//						rootPropertyValue: false,
			//						startValue: scrollPositionCurrent,
			//						currentValue: scrollPositionCurrent,
			//						endValue: scrollPositionEnd,
			//						unitType: "",
			//						easing: opts.easing,
			//						scrollData: {
			//							container: opts.container,
			//							direction: scrollDirection,
			//							alternateValue: scrollPositionCurrentAlternate
			//						}
			//					},
			//					element: element
			//				};
			//
			//				if (debug) {
			//					console.log("tweensContainer (scroll): ", (tweensContainer as any).scroll, element);
			//				}
			//
			//				/******************************************
			//				 Tween Data Construction (for Reverse)
			//				 ******************************************/
			//
			//				/* Reverse acts like a "start" action in that a property map is animated toward. The only difference is
			//				 that the property map used for reverse is the inverse of the map used in the previous call. Thus, we manipulate
			//				 the previous call to construct our new map: use the previous map's end values as our new map's start values. Copy over all other data. */
			//				/* Note: Reverse can be directly called via the "reverse" parameter, or it can be indirectly triggered via the loop option. (Loops are composed of multiple reverses.) */
			//				/* Note: Reverse calls do not need to be consecutively chained onto a currently-animating element in order to operate on cached values;
			//				 there is no harm to reverse being called on a potentially stale data cache since reverse's behavior is simply defined
			//				 as reverting to the element's values as they were prior to the previous *Velocity* call. */
			//			} else
			//		if (action === "reverse") {
			//
			//			/* Abort if there is no prior animation data to reverse to. */
			//			if (!data) {
			//				return;
			//			}
			//
			//			if (!data.tweensContainer) {
			//				/* Dequeue the element so that this queue entry releases itself immediately, allowing subsequent queue entries to run. */
			//				dequeue(element, isString(opts.queue) ? opts.queue : undefined);
			//
			//				return;
			//			} else {
			//				/*********************
			//				 Options Parsing
			//				 *********************/
			//
			//				/* If the element was hidden via the display option in the previous call,
			//				 revert display to "auto" prior to reversal so that the element is visible again. */
			//				if (data.opts.display === "none") {
			//					data.opts.display = "auto";
			//				}
			//
			//				if (data.opts.visibility === "hidden") {
			//					data.opts.visibility = "visible";
			//				}
			//
			//				/* If the loop option was set in the previous call, disable it so that "reverse" calls aren't recursively generated.
			//				 Further, remove the previous call's callback options; typically, users do not want these to be refired. */
			//				data.opts.loop = false;
			//				data.opts.begin = null;
			//				data.opts.complete = null;
			//
			//				/* Since we're extending an opts object that has already been extended with the defaults options object,
			//				 we remove non-explicitly-defined properties that are auto-assigned values. */
			//				if (!options.easing) {
			//					delete opts.easing;
			//				}
			//
			//				if (!options.duration) {
			//					delete opts.duration;
			//				}
			//
			//				/* The opts object used for reversal is an extension of the options object optionally passed into this
			//				 reverse call plus the options used in the previous Velocity call. */
			//				opts = {...data.opts, ...opts};
			//
			//				/*************************************
			//				 Tweens Container Reconstruction
			//				 *************************************/
			//
			//				/* Create a deep copy (indicated via the true flag) of the previous call's tweensContainer. */
			//				lastTweensContainer = _deepCopyObject({}, data ? data.tweensContainer : null);
			//
			//				/* Manipulate the previous tweensContainer by replacing its end values and currentValues with its start values. */
			//				for (let lastTween in lastTweensContainer) {
			//					/* In addition to tween data, tweensContainers contain an element property that we ignore here. */
			//					if (lastTweensContainer.hasOwnProperty(lastTween) && lastTween !== "element") {
			//						let lastStartValue = lastTweensContainer[lastTween].startValue;
			//
			//						lastTweensContainer[lastTween].startValue = lastTweensContainer[lastTween].currentValue = lastTweensContainer[lastTween].endValue;
			//						lastTweensContainer[lastTween].endValue = lastStartValue;
			//
			//						/* Easing is the only option that embeds into the individual tween data (since it can be defined on a per-property basis).
			//						 Accordingly, every property's easing value must be updated when an options object is passed in with a reverse call.
			//						 The side effect of this extensibility is that all per-property easing values are forcefully reset to the new value. */
			//						if (!isEmptyObject(options)) {
			//							lastTweensContainer[lastTween].easing = opts.easing;
			//						}
			//
			//						if (debug) {
			//							console.log("reverse tweensContainer (" + lastTween + "): " + JSON.stringify(lastTweensContainer[lastTween]), element);
			//						}
			//					}
			//				}
			//
			//				tweensContainer = lastTweensContainer;
			//			}
			//
			//			/*****************************************
			//			 Tween Data Construction (for Start)
			//			 *****************************************/
			//
			//		} else if (action === "start") {

			/*************************
			 Value Transferring
			 *************************/

			/* If this queue entry follows a previous Velocity-initiated queue entry *and* if this entry was created
			 while the element was in the process of being animated by Velocity, then this current call is safe to use
			 the end values from the prior call as its start values. Velocity attempts to perform this value transfer
			 process whenever possible in order to avoid requerying the DOM. */
			/* If values aren't transferred from a prior call and start values were not forcefed by the user (more on this below),
			 then the DOM is queried for the element's current values as a last resort. */
			/* Note: Conversely, animation reversal (and looping) *always* perform inter-call value transfers; they never requery the DOM. */

			/* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale)
			 to transfer over end values to use as start values. If it's set to true and there is a previous
			 Velocity call to pull values from, do so. */
			let queue = getValue(activeCall.queue, options.queue, defaults.queue);

			if (data && data.isAnimating && queue !== false) {
				lastAnimation = data.lastAnimationList[queue];
			}

			/* Create a tween out of each property, and append its associated data to tweensContainer. */
			if (propertiesMap) {
				for (let property in propertiesMap) {
					if (!propertiesMap.hasOwnProperty(property)) {
						continue;
					}
					/* The original property name's format must be used for the parsePropertyValue() lookup,
					 but we then use its camelCase styling to normalize it for manipulation. */
					let propertyName = CSS.Names.camelCase(property),
						valueData = parsePropertyValue(propertiesMap[property]);

					/* Find shorthand color properties that have been passed a hex string. */
					/* Would be quicker to use vCSS.Lists.colors.includes() if possible */
					//				if (_inArray(CSS.Lists.colors, propertyName)) {
					//					/* Parse the value data for each shorthand. */
					//					let endValue = valueData[0],
					//						easing = valueData[1],
					//						startValue = valueData[2];
					//
					//					if (CSS.RegEx.isHex.test(endValue)) {
					//						/* Convert the hex strings into their RGB component arrays. */
					//						let colorComponents = ["Red", "Green", "Blue"],
					//							endValueRGB = CSS.Values.hexToRgb(endValue),
					//							startValueRGB = startValue ? CSS.Values.hexToRgb(startValue) : undefined;
					//
					//						/* Inject the RGB component tweens into propertiesMap. */
					//						for (let i = 0; i < colorComponents.length; i++) {
					//							let dataArray = [endValueRGB[i]];
					//
					//							if (easing) {
					//								dataArray.push(easing);
					//							}
					//
					//							if (startValueRGB !== undefined) {
					//								dataArray.push(startValueRGB[i]);
					//							}
					//
					//							fixPropertyValue(propertyName + colorComponents[i], dataArray);
					//						}
					//						/* If we have replaced a shortcut color value then don't update the standard property name */
					//						continue;
					//					}
					//				}
					/* Parse out endValue, easing, and startValue from the property's data. */
					let endValue = valueData[0],
						easing = valueData[1],
						startValue = valueData[2],
						pattern: (string | number)[],
						rounding: boolean[];

					/**************************
					 Start Value Sourcing
					 **************************/

					/* Other than for the dummy tween property, properties that are not supported by the browser (and do not have an associated normalization) will
					 inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead.
					 Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */
					/* Note: Since SVG elements have some of their properties directly applied as HTML attributes,
					 there is no way to check for their explicit browser support, and so we skip skip this check for them. */
					if ((!data || !data.isSVG) && propertyName !== "tween" && CSS.Normalizations[propertyName] === undefined && (!State.prefixElement || !isString(State.prefixElement.style[propertyName]))) {
						if (debug) {
							console.log("Skipping [" + propertyName + "] due to a lack of browser support.");
						}
						return;
					}

					/* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being
					 animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
					 a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
					if (((activeCall.display !== undefined && activeCall.display !== null && activeCall.display !== "none") || (activeCall.visibility !== undefined && activeCall.visibility !== "hidden")) && /opacity|filter/.test(propertyName) && !startValue && endValue !== 0) {
						startValue = 0;
					}

					/* If values have been transferred from the previous Velocity call, extract the endValue and rootPropertyValue
					 for all of the current call's properties that were *also* animated in the previous call. */
					/* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
					if (lastAnimation && lastAnimation.tweens[propertyName]) {
						if (startValue === undefined) {
							startValue = lastAnimation.tweens[propertyName].currentValue;
						}
						/* If values were not transferred from a previous Velocity call, query the DOM as needed. */
					} else {
						startValue = CSS.getPropertyValue(element, propertyName); /* GET */
					}

					/**************************
					 Value Data Extraction
					 **************************/

					let separatedValue,
						endValueUnitType,
						startValueUnitType,
						operator: boolean | string = false;

					/* Separates a property value into its numeric value and its unit type. */
					let separateValue = function(property: string, value: string) {
						let unitType,
							numericValue;

						numericValue = (value || "0")
							.toString()
							.toLowerCase()
							/* Match the unit type at the end of the value. */
							.replace(/[%a-z]+$/, function(match) {
								/* Grab the unit type. */
								unitType = match;

								/* Strip the unit type off of value. */
								return "";
							});

						/* If no unit type was supplied, assign one that is appropriate for this property (e.g. "deg" for rotateZ or "px" for width). */
						if (!unitType) {
							unitType = CSS.Values.getUnitType(property);
						}

						return [numericValue, unitType];
					};

					if (isNumber(startValue)) {
						startValue = String(startValue) + CSS.Values.getUnitType(property);
					}

					if (isNumber(endValue)) {
						endValue = String(endValue) + CSS.Values.getUnitType(property);
					}

					if (startValue !== endValue && isString(startValue) && isString(endValue)) {
						pattern = [];
						let iStart = 0, // index in startValue
							iEnd = 0, // index in endValue
							aStart = [], // array of startValue numbers
							aEnd = [], // array of endValue numbers
							inCalc = 0, // Keep track of being inside a "calc()" so we don't duplicate it
							inRGB = 0, // Keep track of being inside an RGB as we can't use fractional values
							inRGBA = 0, // Keep track of being inside an RGBA as we must pass fractional for the alpha channel
							lastPattern = ""; // The last part of the pattern, push out into pattern when it changes

						startValue = CSS.fixColors(startValue);
						endValue = CSS.fixColors(endValue);
						while (iStart < startValue.length && iEnd < endValue.length) {
							let cStart = startValue[iStart],
								cEnd = endValue[iEnd];

							if (/[\d\.-]/.test(cStart) && /[\d\.-]/.test(cEnd)) {
								let tStart = cStart, // temporary character buffer
									tEnd = cEnd, // temporary character buffer
									dotStart = ".", // Make sure we can only ever match a single dot in a decimal
									dotEnd = "."; // Make sure we can only ever match a single dot in a decimal

								while (++iStart < startValue.length) {
									cStart = startValue[iStart];
									if (cStart === dotStart) {
										dotStart = ".."; // Can never match two characters
									} else if (!/\d/.test(cStart)) {
										break;
									}
									tStart += cStart;
								}
								while (++iEnd < endValue.length) {
									cEnd = endValue[iEnd];
									if (cEnd === dotEnd) {
										dotEnd = ".."; // Can never match two characters
									} else if (!/\d/.test(cEnd)) {
										break;
									}
									tEnd += cEnd;
								}
								let uStart = CSS.getUnit(startValue, iStart), // temporary unit type
									uEnd = CSS.getUnit(endValue, iEnd); // temporary unit type

								iStart += uStart.length;
								iEnd += uEnd.length;
								if (uStart === uEnd) {
									// Same units
									if (tStart === tEnd) {
										// Same numbers, so just copy over
										lastPattern += tStart + uStart;
									} else {
										// Different numbers, so store them
										if (lastPattern) {
											pattern.push(lastPattern);
											lastPattern = "";
										}
										if (inRGB) {
											if (!rounding) {
												rounding = [];
											}
											rounding[aStart.length] = true;
										}
										pattern.push(0);
										lastPattern = uStart;
										aStart.push(parseFloat(tStart));
										aEnd.push(parseFloat(tEnd));
									}
								} else {
									// Different units, so put into a "calc(from + to)" and animate each side to/from zero
									let nStart = parseFloat(tStart),
										nEnd = parseFloat(tEnd);

									pattern.push("calc(", nStart ? 0 : "0", uStart + " + ", nEnd ? 0 : "0", uEnd + ")");
									if (nStart) {
										aStart.push(nStart);
										aEnd.push(0);
									}
									if (nEnd) {
										aStart.push(0);
										aEnd.push(nEnd);
									}
								}
							} else if (cStart === cEnd) {
								if (!pattern.length) {
									pattern.push("");
								}
								pattern[pattern.length - 1] += cStart;
								iStart++;
								iEnd++;
								// Keep track of being inside a calc()
								if (inCalc === 0 && cStart === "c"
									|| inCalc === 1 && cStart === "a"
									|| inCalc === 2 && cStart === "l"
									|| inCalc === 3 && cStart === "c"
									|| inCalc >= 4 && cStart === "("
								) {
									inCalc++;
								} else if ((inCalc && inCalc < 5)
									|| inCalc >= 4 && cStart === ")" && --inCalc < 5) {
									inCalc = 0;
								}
								// Keep track of being inside an rgb() / rgba()
								if (inRGB === 0 && cStart === "r"
									|| inRGB === 1 && cStart === "g"
									|| inRGB === 2 && cStart === "b"
									|| inRGB === 3 && cStart === "a"
									|| inRGB >= 3 && cStart === "("
								) {
									if (inRGB === 3 && cStart === "a") {
										inRGBA = 1;
									}
									inRGB++;
								} else if (inRGBA && cStart === ",") {
									if (++inRGBA > 3) {
										inRGB = inRGBA = 0;
									}
								} else if ((inRGBA && inRGB < (inRGBA ? 5 : 4))
									|| inRGB >= (inRGBA ? 4 : 3) && cStart === ")" && --inRGB < (inRGBA ? 5 : 4)) {
									inRGB = inRGBA = 0;
								}
							} else {
								inCalc = 0;
								// TODO: changing units, fixing colours
								break;
							}
						}
						if (iStart !== startValue.length || iEnd !== endValue.length) {
							// TODO: change the tween to use a string type if they're different
							if (debug) {
								console.error("Trying to pattern match mis-matched strings [\"" + endValue + "\", \"" + startValue + "\"]");
							}
							pattern = undefined;
						}
						if (pattern) {
							if (aStart.length) {
								if (debug) {
									console.log("Pattern found:", pattern, " -> ", aStart, aEnd, "[" + startValue + "," + endValue + "]");
								}
								if (lastPattern) {
									pattern.push(lastPattern);
								}
								startValue = aStart;
								endValue = aEnd;
								endValueUnitType = startValueUnitType = "";
							} else {
								pattern = undefined;
							}
						}
					}

					if (!pattern) {
						/* Separate startValue. */
						separatedValue = separateValue(propertyName, startValue);
						startValue = separatedValue[0];
						startValueUnitType = separatedValue[1];

						/* Separate endValue, and extract a value operator (e.g. "+=", "-=") if one exists. */
						separatedValue = separateValue(propertyName, endValue);
						endValue = separatedValue[0].replace(/^([+-\/*])=/, function(match, subMatch) {
							operator = subMatch;

							/* Strip the operator off of the value. */
							return "";
						});
						endValueUnitType = separatedValue[1];

						/* Parse float values from endValue and startValue. Default to 0 if NaN is returned. */
						startValue = parseFloat(startValue) || 0;
						endValue = parseFloat(endValue) || 0;

						/***************************************
						 Property-Specific Value Conversion
						 ***************************************/

						/* Custom support for properties that don't actually accept the % unit type, but where pollyfilling is trivial and relatively foolproof. */
						if (endValueUnitType === "%") {
							/* A %-value fontSize/lineHeight is relative to the parent's fontSize (as opposed to the parent's dimensions),
							 which is identical to the em unit's behavior, so we piggyback off of that. */
							if (/^(fontSize|lineHeight)$/.test(propertyName)) {
								/* Convert % into an em decimal value. */
								endValue = endValue / 100;
								endValueUnitType = "em";
								/* For scaleX and scaleY, convert the value into its decimal format and strip off the unit type. */
							} else if (/^scale/.test(propertyName)) {
								endValue = endValue / 100;
								endValueUnitType = "";
								/* For RGB components, take the defined percentage of 255 and strip off the unit type. */
							} else if (/(Red|Green|Blue)$/i.test(propertyName)) {
								endValue = (endValue / 100) * 255;
								endValueUnitType = "";
							}
						}
					}

					/***************************
					 Unit Ratio Calculation
					 ***************************/

					/* When queried, the browser returns (most) CSS property values in pixels. Therefore, if an endValue with a unit type of
					 %, em, or rem is animated toward, startValue must be converted from pixels into the same unit type as endValue in order
					 for value manipulation logic (increment/decrement) to proceed. Further, if the startValue was forcefed or transferred
					 from a previous call, startValue may also not be in pixels. Unit conversion logic therefore consists of two steps:
					 1) Calculating the ratio of %/em/rem/vh/vw relative to pixels
					 2) Converting startValue into the same unit of measurement as endValue based on these ratios. */
					/* Unit conversion ratios are calculated by inserting a sibling node next to the target node, copying over its position property,
					 setting values with the target unit type then comparing the returned pixel value. */
					/* Note: Even if only one of these unit types is being animated, all unit ratios are calculated at once since the overhead
					 of batching the SETs and GETs together upfront outweights the potential overhead
					 of layout thrashing caused by re-querying for uncalculated ratios for subsequently-processed properties. */
					/* Todo: Shift this logic into the calls' first tick instance so that it's synced with RAF. */
					//					let calculateUnitRatios = function() {
					//
					//						/************************
					//						 Same Ratio Checks
					//						 ************************/
					//
					//						/* The properties below are used to determine whether the element differs sufficiently from this call's
					//						 previously iterated element to also differ in its unit conversion ratios. If the properties match up with those
					//						 of the prior element, the prior element's conversion ratios are used. Like most optimizations in Velocity,
					//						 this is done to minimize DOM querying. */
					//						let sameRatioIndicators = {
					//							myParent: element.parentNode || document.body, /* GET */
					//							position: CSS.getPropertyValue(element, "position"), /* GET */
					//							fontSize: CSS.getPropertyValue(element, "fontSize") /* GET */
					//						},
					//							/* Determine if the same % ratio can be used. % is based on the element's position value and its parent's width and height dimensions. */
					//							samePercentRatio = ((sameRatioIndicators.position === callUnitConversionData.lastPosition) && (sameRatioIndicators.myParent === callUnitConversionData.lastParent)),
					//							/* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
					//							sameEmRatio = (sameRatioIndicators.fontSize === callUnitConversionData.lastFontSize);
					//
					//						/* Store these ratio indicators call-wide for the next element to compare against. */
					//						callUnitConversionData.lastParent = sameRatioIndicators.myParent;
					//						callUnitConversionData.lastPosition = sameRatioIndicators.position;
					//						callUnitConversionData.lastFontSize = sameRatioIndicators.fontSize;
					//
					//						/***************************
					//						 Element-Specific Units
					//						 ***************************/
					//
					//						/* Note: IE8 rounds to the nearest pixel when returning CSS values, thus we perform conversions using a measurement
					//						 of 100 (instead of 1) to give our ratios a precision of at least 2 decimal values. */
					//						let measurement = 100,
					//							unitRatios: {[key: string]: any} = {};
					//
					//						if (!sameEmRatio || !samePercentRatio) {
					//							let dummy = data && data.isSVG ? document.createElementNS("http://www.w3.org/2000/svg", "rect") : document.createElement("div");
					//
					//							init(dummy);
					//							sameRatioIndicators.myParent.appendChild(dummy);
					//
					//							/* To accurately and consistently calculate conversion ratios, the element's cascaded overflow and box-sizing are stripped.
					//							 Similarly, since width/height can be artificially constrained by their min-/max- equivalents, these are controlled for as well. */
					//							/* Note: Overflow must be also be controlled for per-axis since the overflow property overwrites its per-axis values. */
					//							["overflow", "overflowX", "overflowY"].forEach(function(property) {
					//								CSS.setPropertyValue(dummy, property, "hidden");
					//							});
					//							CSS.setPropertyValue(dummy, "position", sameRatioIndicators.position);
					//							CSS.setPropertyValue(dummy, "fontSize", sameRatioIndicators.fontSize);
					//							CSS.setPropertyValue(dummy, "boxSizing", "content-box");
					//
					//							/* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. */
					//							["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"].forEach(function(property) {
					//								CSS.setPropertyValue(dummy, property, measurement + "%");
					//							});
					//							/* paddingLeft arbitrarily acts as our proxy property for the em ratio. */
					//							CSS.setPropertyValue(dummy, "paddingLeft", measurement + "em");
					//
					//							/* Divide the returned value by the measurement to get the ratio between 1% and 1px. Default to 1 since working with 0 can produce Infinite. */
					//							unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth = (parseFloat(CSS.getPropertyValue(dummy, "width", null, true)) || 1) / measurement; /* GET */
					//							unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight = (parseFloat(CSS.getPropertyValue(dummy, "height", null, true)) || 1) / measurement; /* GET */
					//							unitRatios.emToPx = callUnitConversionData.lastEmToPx = (parseFloat(CSS.getPropertyValue(dummy, "paddingLeft")) || 1) / measurement; /* GET */
					//
					//							sameRatioIndicators.myParent.removeChild(dummy);
					//						} else {
					//							unitRatios.emToPx = callUnitConversionData.lastEmToPx;
					//							unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth;
					//							unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight;
					//						}
					//
					//						/***************************
					//						 Element-Agnostic Units
					//						 ***************************/
					//
					//						/* Whereas % and em ratios are determined on a per-element basis, the rem unit only needs to be checked
					//						 once per call since it's exclusively dependant upon document.body's fontSize. If this is the first time
					//						 that calculateUnitRatios() is being run during this call, remToPx will still be set to its default value of null,
					//						 so we calculate it now. */
					//						if (callUnitConversionData.remToPx === null) {
					//							/* Default to browsers' default fontSize of 16px in the case of 0. */
					//							callUnitConversionData.remToPx = parseFloat(CSS.getPropertyValue(document.body, "fontSize")) || 16; /* GET */
					//						}
					//
					//						/* Similarly, viewport units are %-relative to the window's inner dimensions. */
					//						if (callUnitConversionData.vwToPx === null) {
					//							callUnitConversionData.vwToPx = window.innerWidth / 100; /* GET */
					//							callUnitConversionData.vhToPx = window.innerHeight / 100; /* GET */
					//						}
					//
					//						unitRatios.remToPx = callUnitConversionData.remToPx;
					//						unitRatios.vwToPx = callUnitConversionData.vwToPx;
					//						unitRatios.vhToPx = callUnitConversionData.vhToPx;
					//
					//						if (debug >= 1) {
					//							console.log("Unit ratios: " + JSON.stringify(unitRatios), element);
					//						}
					//						return unitRatios;
					//					};

					/********************
					 Unit Conversion
					 ********************/

					/* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
					//					if (/[\/*]/.test(operator as any as string)) {
					//						endValueUnitType = startValueUnitType;
					//						/* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType
					//						 is a relative unit (%, em, rem), the values set during tweening will continue to be accurately relative even if the metrics they depend
					//						 on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
					//						 would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
					//						/* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnit */
					//					} else if ((startValueUnitType !== endValueUnitType) && startValue !== 0) {
					//						/* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used for tween values to remain accurate. */
					//						/* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively
					//						 match the underlying metrics if they change, but this is acceptable since we're animating toward invisibility instead of toward visibility,
					//						 which remains past the point of the animation's completion. */
					//						if (endValue === 0) {
					//							endValueUnitType = startValueUnitType;
					//						} else {
					//							/* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing).
					//							 If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
					//							elementUnitConversionData = elementUnitConversionData || calculateUnitRatios();
					//
					//							/* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
					//							/* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element. */
					//							let axis = (/margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property) || property === "x") ? "x" : "y";
					//
					//							/* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process:
					//							 1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit type. */
					//							switch (startValueUnitType) {
					//								case "%":
					//									/* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions.
					//									 Velocity does not include a special conversion process to account for this behavior. Therefore, animating translateX/Y from a % value
					//									 to a non-% value will produce an incorrect start value. Fortunately, this sort of cross-unit conversion is rarely done by users in practice. */
					//									startValue *= (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
					//									break;
					//
					//								case "px":
					//									/* px acts as our midpoint in the unit conversion process; do nothing. */
					//									break;
					//
					//								default:
					//									startValue *= elementUnitConversionData[startValueUnitType + "ToPx"];
					//							}
					//
					//							/* Invert the px ratios to convert into to the target unit. */
					//							switch (endValueUnitType) {
					//								case "%":
					//									startValue *= 1 / (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
					//									break;
					//
					//								case "px":
					//									/* startValue is already in px, do nothing; we're done. */
					//									break;
					//
					//								default:
					//									startValue *= 1 / elementUnitConversionData[endValueUnitType + "ToPx"];
					//							}
					//						}
					//					}

					/*********************
					 Relative Values
					 *********************/

					/* Operator logic must be performed last since it requires unit-normalized start and end values. */
					/* Note: Relative *percent values* do not behave how most people think; while one would expect "+=50%"
					 to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
					 50 points is added on top of the current % value. */
					switch (operator as any as string) {
						case "+":
							endValue = startValue + endValue;
							break;

						case "-":
							endValue = startValue - endValue;
							break;

						case "*":
							endValue = startValue * endValue;
							break;

						case "/":
							endValue = startValue / endValue;
							break;
					}

					/**************************
					 tweensContainer Push
					 **************************/

					/* Construct the per-property tween object. */
					activeCall.tweens[propertyName] = {
						startValue: startValue,
						currentValue: startValue,
						endValue: endValue,
						unitType: endValueUnitType,
						easing: easing,
						pattern: pattern,
						rounding: rounding
					};

					if (debug) {
						console.log("tweensContainer (" + propertyName + "): " + JSON.stringify(activeCall.tweens[propertyName]), element);
					}
				}
				activeCall.properties = undefined;
			}
			//		}

			/*****************
			 Call Push
			 *****************/

			if (data) {
				/* Store the tweensContainer and options if we're working on the default effects queue, so that they can be used by the reverse or repeat commands. */
				if (queue !== false) {
					data.lastAnimationList[queue] = activeCall;
				}
				/* Switch on the element's animating flag. */
				data.isAnimating = true;
			}
		}
	}
}
