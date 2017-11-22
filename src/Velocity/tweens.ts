/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Tweens
 */

const enum Tween {
	END,
	EASING,
	START,
	PATTERN,
	ROUNDING
};

namespace VelocityStatic {
	/**
	 * Expand all queued animations that haven't gone yet
	 *
	 * This will automatically expand the properties map for any recently added
	 * animations so that the start and end values are correct.
	 */
	export function expandTween(activeCall: AnimationCall) {
		let elements = activeCall.elements,
			options = activeCall.options,
			elementsLength = elements.length,
			element = activeCall.element,
			elementArrayIndex = _indexOf.call(elements, element),
			duration = getValue(options.duration, defaults.duration);

		/***************************
		 Tween Data Calculation
		 ***************************/


		State.firstNew = activeCall._next;
		/* Ensure each element in a set has a nodeType (is a real element) to avoid throwing errors. */
		if (isNode(element) && activeCall.timeStart !== -1) {
			let data = Data(element),
				lastAnimation: AnimationCall,
				/* A container for the processed data associated with each property in the propertyMap.
				 (Each property in the map produces its own "tween".) */
				propertiesMap = activeCall.properties as VelocityProperties;

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
			//		}

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
					let propertyName = CSS.Names.camelCase(property),
						valueData = propertiesMap[property],
						endValue: string,
						easing: string,
						startValue: string,
						arrayStart: (string | number)[] = [null],
						arrayEnd: (string | number)[] = [null],
						pattern: (string | number)[] = [""],
						rounding: boolean[];

					if (isFunction(valueData)) {
						// If we have a function as the main argument then
						// resolve it first, in case it returns an array that
						// needs to be split.
						valueData = valueData.call(element, elementArrayIndex, elementsLength, elements);
					}
					if (Array.isArray(valueData)) {
						// valueData is an array in the form of
						// [ endValue, [, easing] [, startValue] ]
						let arr1 = valueData[1],
							arr2 = valueData[2];

						endValue = valueData[0];
						if ((isString(arr1) && (/^[\d-]/.test(arr1) || CSS.RegEx.isHex.test(arr1))) || isFunction(arr1) || isNumber(arr1)) {
							startValue = arr1;
						} else if ((isString(arr1) && Easings[arr1]) || Array.isArray(arr1)) {
							easing = arr1 as string;
							startValue = arr2;
						} else {
							startValue = arr1 || arr2;
						}
					} else {
						endValue = valueData;
					}
					/* If functions were passed in as values, pass the function the current element as its context,
					 plus the element's index and the element set's size as arguments. Then, assign the returned value. */
					if (isFunction(endValue)) {
						endValue = endValue.call(element, elementArrayIndex, elementsLength);
					}
					if (isFunction(startValue)) {
						startValue = startValue.call(element, elementArrayIndex, elementsLength);
					}

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
						continue;
					}

					/* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being
					 animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
					 a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
					//					if (((activeCall.visibility !== undefined && activeCall.visibility !== "hidden")) && /opacity|filter/.test(propertyName) && !startValue && endValue !== 0) {
					//						startValue = 0;
					//					}

					if (startValue === undefined) {
						// Get the start value if it's not been passed in
						startValue = CSS.getPropertyValue(element, propertyName) || 0 as any;
					}
					if (isNumber(startValue)) {
						// Make sure we have the correct value.
						startValue = String(startValue) + CSS.Values.getUnitType(property);
					}
					if (isNumber(endValue)) {
						// Make sure we have the correct value.
						endValue = String(endValue) + CSS.Values.getUnitType(property);
					}
					let indexStart = 0, // index in startValue
						indexEnd = 0, // index in endValue
						inCalc = 0, // Keep track of being inside a "calc()" so we don't duplicate it
						inRGB = 0, // Keep track of being inside an RGB as we can't use fractional values
						inRGBA = 0; // Keep track of being inside an RGBA as we must pass fractional for the alpha channel

					startValue = CSS.fixColors(startValue);
					endValue = CSS.fixColors(endValue);
					while (indexStart < startValue.length || indexEnd < endValue.length) {
						let charStart = startValue[indexStart],
							charEnd = endValue[indexEnd];

						// If they're both numbers, then parse them as a whole
						if (/[\d\.-]/.test(charStart) && /[\d\.-]/.test(charEnd)) {
							let tempStart = charStart, // temporary character buffer
								tempEnd = charEnd, // temporary character buffer
								dotStart = ".", // Make sure we can only ever match a single dot in a decimal
								dotEnd = "."; // Make sure we can only ever match a single dot in a decimal

							while (++indexStart < startValue.length) {
								charStart = startValue[indexStart];
								if (charStart === dotStart) {
									dotStart = ".."; // Can never match two characters
								} else if (!/\d/.test(charStart)) {
									break;
								}
								tempStart += charStart;
							}
							while (++indexEnd < endValue.length) {
								charEnd = endValue[indexEnd];
								if (charEnd === dotEnd) {
									dotEnd = ".."; // Can never match two characters
								} else if (!/\d/.test(charEnd)) {
									break;
								}
								tempEnd += charEnd;
							}
							let unitStart = CSS.getUnit(startValue, indexStart), // temporary unit type
								unitEnd = CSS.getUnit(endValue, indexEnd); // temporary unit type

							indexStart += unitStart.length;
							indexEnd += unitEnd.length;
							if (unitStart === unitEnd) {
								// Same units
								if (tempStart === tempEnd) {
									// Same numbers, so just copy over
									pattern[pattern.length - 1] += tempStart + unitStart;
								} else {
									if (inRGB) {
										if (!rounding) {
											rounding = [];
										}
										rounding[arrayStart.length] = true;
									}
									pattern.push(0, unitStart);
									arrayStart.push(parseFloat(tempStart), null);
									arrayEnd.push(parseFloat(tempEnd), null);
								}
							} else {
								// Different units, so put into a "calc(from + to)" and animate each side to/from zero
								pattern[pattern.length - 1] += inCalc ? "+ (" : "calc(";
								pattern.push(0, unitStart + " + ", 0, unitEnd + ")");
								arrayStart.push(parseFloat(tempStart) || 0, null, 0, null);
								arrayEnd.push(0, null, parseFloat(tempEnd) || 0, null);
							}
						} else if (charStart === charEnd) {
							pattern[pattern.length - 1] += charStart;
							indexStart++;
							indexEnd++;
							// Keep track of being inside a calc()
							if (inCalc === 0 && charStart === "c"
								|| inCalc === 1 && charStart === "a"
								|| inCalc === 2 && charStart === "l"
								|| inCalc === 3 && charStart === "c"
								|| inCalc >= 4 && charStart === "("
							) {
								inCalc++;
							} else if ((inCalc && inCalc < 5)
								|| inCalc >= 4 && charStart === ")" && --inCalc < 5) {
								inCalc = 0;
							}
							// Keep track of being inside an rgb() / rgba()
							// Only the opacity is not rounded
							if (inRGB === 0 && charStart === "r"
								|| inRGB === 1 && charStart === "g"
								|| inRGB === 2 && charStart === "b"
								|| inRGB === 3 && charStart === "a"
								|| inRGB >= 3 && charStart === "("
							) {
								if (inRGB === 3 && charStart === "a") {
									inRGBA = 1;
								}
								inRGB++;
							} else if (inRGBA && charStart === ",") {
								if (++inRGBA > 3) {
									inRGB = inRGBA = 0;
								}
							} else if ((inRGBA && inRGB < (inRGBA ? 5 : 4))
								|| inRGB >= (inRGBA ? 4 : 3) && charStart === ")" && --inRGB < (inRGBA ? 5 : 4)) {
								inRGB = inRGBA = 0;
							}
						} else if (charStart || charEnd) {
							// Different letters, so we're going to push them into start and end until the next word
							if (!isString(arrayStart[arrayStart.length - 1])) {
								if (pattern.length === 1 && !pattern[0]) {
									arrayStart[0] = arrayEnd[0] = "";
								} else {
									pattern.push("");
									arrayStart.push("");
									arrayEnd.push("");
								}
							}
							while (indexStart < startValue.length) {
								charStart = startValue[indexStart++];
								if (charStart === " ") {
									break;
								} else {
									arrayStart[arrayStart.length - 1] += charStart;
								}
							}
							while (indexEnd < endValue.length) {
								charEnd = endValue[indexEnd++];
								if (charEnd === " ") {
									break;
								} else {
									arrayEnd[arrayEnd.length - 1] += charEnd;
								}
							}
						}
					}
					if (indexStart !== startValue.length || indexEnd !== endValue.length) {
						// TODO: change the tween to use a string type if they're different
						//							if (debug) {
						console.error("Trying to pattern match mis-matched strings " + propertyName + ":[\"" + endValue + "\", \"" + startValue + "\"]");
						//							}
						//							pattern = undefined;
					}
					if (debug) {
						console.log("Pattern found:", pattern, " -> ", arrayStart, arrayEnd, "[" + startValue + "," + endValue + "]");
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
					//					switch (operator as any as string) {
					//						case "+":
					//							endValue = startValue + endValue;
					//							break;
					//
					//						case "-":
					//							endValue = startValue - endValue;
					//							break;
					//
					//						case "*":
					//							endValue = startValue * endValue;
					//							break;
					//
					//						case "/":
					//							endValue = startValue / endValue;
					//							break;
					//					}

					if (propertyName === "display") {
						if (!/^(at-start|at-end|during)$/.test(easing)) {
							easing = endValue === "none" ? "at-end" : "at-start";
						}
					} else if (propertyName === "visibility") {
						if (!/^(at-start|at-end|during)$/.test(easing)) {
							easing = endValue === "hidden" ? "at-end" : "at-start";
						}
					}
					activeCall.tweens[propertyName] = [
						arrayEnd,
						validateEasing(easing, duration),
						arrayStart,
						pattern,
						rounding
					];
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
