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
	ROUNDING,
	length
};

namespace VelocityStatic {
	/**
	 * Expand a VelocityProperty argument into a valid sparse Tween array. This
	 * pre-allocates the array as it is then the correct size and slightly
	 * faster to access.
	 */
	function expandProperty(elements: HTMLorSVGElement[], element: HTMLorSVGElement, elementArrayIndex: number, property: string, valueData: VelocityProperty) {
		let tween = new Array(Tween.length),
			endValue: string,
			easing: string,
			startValue: string;

		if (isFunction(valueData)) {
			// If we have a function as the main argument then
			// resolve it first, in case it returns an array that
			// needs to be split.
			valueData = valueData.call(element, elementArrayIndex, elements.length, elements);
		}
		if (Array.isArray(valueData)) {
			// valueData is an array in the form of
			// [ endValue, [, easing] [, startValue] ]
			let arr1 = valueData[1],
				arr2 = valueData[2];

			endValue = valueData[0] as any;
			if ((isString(arr1) && (/^[\d-]/.test(arr1) || CSS.RegEx.isHex.test(arr1))) || isFunction(arr1) || isNumber(arr1)) {
				startValue = arr1 as any;
			} else if ((isString(arr1) && Easings[arr1]) || Array.isArray(arr1)) {
				easing = arr1 as string;
				startValue = arr2 as any;
			} else {
				startValue = arr1 || arr2 as any;
			}
		} else {
			endValue = valueData as any;
		}
		/* If functions were passed in as values, pass the function the current element as its context,
		 plus the element's index and the element set's size as arguments. Then, assign the returned value. */
		if (isFunction(endValue)) {
			endValue = endValue.call(element, elementArrayIndex, elements.length);
		}
		if (isFunction(startValue)) {
			startValue = startValue.call(element, elementArrayIndex, elements.length);
		}
		if (isNumber(endValue)) {
			// Make sure we have the correct value.
			endValue = String(endValue) + CSS.Values.getUnitType(property);
		}
		if (isNumber(startValue)) {
			// Make sure we have the correct value.
			startValue = String(startValue) + CSS.Values.getUnitType(property);
		}
		if (isString(endValue)) {
			endValue = CSS.fixColors(endValue);
		}
		if (isString(startValue)) {
			startValue = CSS.fixColors(startValue);
		}
		tween[Tween.END] = endValue;
		tween[Tween.EASING] = easing;
		tween[Tween.START] = startValue;
		return tween;
	}

	/**
	 * Expand all queued animations that haven't gone yet
	 *
	 * This will automatically expand the properties map for any recently added
	 * animations so that the start and end values are correct.
	 */
	export function expandTween(activeCall: AnimationCall) {
		let elements = activeCall.elements,
			options = activeCall.options,
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
				propertiesMap = activeCall.properties as VelocityProperties;

			/* Create a tween out of each property, and append its associated data to tweensContainer. */
			if (propertiesMap) {
				for (let property in propertiesMap) {
					if (!propertiesMap.hasOwnProperty(property)) {
						// Not sure what we're getting in...
						continue;
					}
					let propertyName = CSS.Names.camelCase(property);

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

					let tween = expandProperty(elements, element, elementArrayIndex, property, propertiesMap[property]),
						endValue: string = tween[Tween.END],
						easing = tween[Tween.EASING],
						startValue: string = tween[Tween.START],
						arrayStart: (string | number)[] = [null],
						arrayEnd: (string | number)[] = [null],
						pattern: (string | number)[] = [""],
						rounding: boolean[],
						indexStart = 0, // index in startValue
						indexEnd = 0, // index in endValue
						inCalc = 0, // Keep track of being inside a "calc()" so we don't duplicate it
						inRGB = 0, // Keep track of being inside an RGB as we can't use fractional values
						inRGBA = 0; // Keep track of being inside an RGBA as we must pass fractional for the alpha channel

					if (startValue === undefined) {
						// Get the start value if it's not been passed in
						startValue = CSS.getPropertyValue(element, propertyName) || 0 as any;
						if (isNumber(startValue)) {
							// Make sure we have the correct value.
							startValue = String(startValue) + CSS.Values.getUnitType(property);
						}
						if (isString(startValue)) {
							startValue = CSS.fixColors(startValue);
						}
					}
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
					tween[Tween.END] = arrayEnd;
					tween[Tween.EASING] = validateEasing(easing, duration);
					tween[Tween.START] = arrayStart;
					tween[Tween.PATTERN] = pattern;
					tween[Tween.ROUNDING] = rounding;
					activeCall.tweens[propertyName] = tween as any;
					if (debug) {
						console.log("tweensContainer (" + propertyName + "): " + JSON.stringify(tween), element);
					}
				}
				activeCall.properties = undefined;
			}
			//		}

			/*****************
			 Call Push
			 *****************/

			if (data) {
				let queue = getValue(activeCall.queue, options.queue, defaults.queue);

				if (queue !== false) {
					// Store the last animation added so we can use it for the
					// beginning of the next one.
					data.lastAnimationList[queue] = activeCall;
				}
				// Switch on the element's animating flag.
				data.isAnimating = true;
			}
		}
	}
}
