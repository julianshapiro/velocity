/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Tweens
 */

namespace VelocityStatic {
	const rxHex = /^#([A-f\d]{3}){1,2}$/i;
	let commands = new Map<string, (value: any, element: HTMLorSVGElement, elements: HTMLorSVGElement[], elementArrayIndex: number, propertyName: string, tween: VelocityTween) => string>();

	commands.set("function", function(value, element, elements, elementArrayIndex, propertyName, tween) {
		return (value as any as VelocityPropertyValueFn).call(element, elementArrayIndex, elements.length);
	})
	commands.set("number", function(value, element, elements, elementArrayIndex, propertyName, tween) {
		return value + getNormalizationUnit(tween.fn);
	});
	commands.set("string", function(value, element, elements, elementArrayIndex, propertyName, tween) {
		return CSS.fixColors(value);
	});
	commands.set("undefined", function(value, element, elements, elementArrayIndex, propertyName, tween) {
		return CSS.fixColors(CSS.getPropertyValue(element, propertyName, tween.fn) || "");
	});

	/**
	 * Expand a VelocityProperty argument into a valid sparse Tween array. This
	 * pre-allocates the array as it is then the correct size and slightly
	 * faster to access.
	 */
	export function expandProperties(animation: AnimationCall, properties: VelocityProperties) {
		const tweens = animation.tweens = createEmptyObject(),
			elements = animation.elements,
			element = animation.element,
			elementArrayIndex = elements.indexOf(element),
			data = Data(element),
			queue = getValue(animation.queue, animation.options.queue),
			duration = getValue(animation.options.duration, defaults.duration);

		for (const property in properties) {
			const propertyName = CSS.camelCase(property);
			let valueData = properties[property],
				fn = getNormalization(element, propertyName);

			if (!fn && propertyName !== "tween") {
				if (debug) {
					console.log("Skipping [" + property + "] due to a lack of browser support.");
				}
				continue;
			}
			if (valueData == null) {
				if (debug) {
					console.log("Skipping [" + property + "] due to no value supplied.");
				}
				continue;
			}
			const tween: VelocityTween = tweens[propertyName] = createEmptyObject() as any;
			let endValue: string,
				startValue: string;

			tween.fn = fn;
			if (isFunction(valueData)) {
				// If we have a function as the main argument then resolve
				// it first, in case it returns an array that needs to be
				// split.
				valueData = (valueData as VelocityPropertyFn).call(element, elementArrayIndex, elements.length, elements);
			}
			if (Array.isArray(valueData)) {
				// valueData is an array in the form of
				// [ endValue, [, easing] [, startValue] ]
				const arr1 = valueData[1],
					arr2 = valueData[2];

				endValue = valueData[0] as any;
				if ((isString(arr1) && (/^[\d-]/.test(arr1) || rxHex.test(arr1))) || isFunction(arr1) || isNumber(arr1)) {
					startValue = arr1 as any;
				} else if ((isString(arr1) && Easing.Easings[arr1]) || Array.isArray(arr1)) {
					tween.easing = arr1 as any;
					startValue = arr2 as any;
				} else {
					startValue = arr1 || arr2 as any;
				}
			} else {
				endValue = valueData as any;
			}
			tween.end = commands.get(typeof endValue)(endValue, element, elements, elementArrayIndex, propertyName, tween) as any;
			if (startValue != null || (queue === false || data.queueList[queue] === undefined)) {
				tween.start = commands.get(typeof startValue)(startValue, element, elements, elementArrayIndex, propertyName, tween) as any;
			}
			explodeTween(propertyName, tween, duration, !!startValue);
		}
	}

	/**
	 * Convert a string-based tween with start and end strings, into a pattern
	 * based tween with arrays.
	 */
	function explodeTween(propertyName: string, tween: VelocityTween, duration: number, isForcefeed?: boolean) {
		const endValue: string = tween.end as any as string;
		let startValue: string = tween.start as any as string;

		if (!isString(endValue) || !isString(startValue)) {
			return;
		}
		let runAgain = false; // Can only be set once if the Start value doesn't match the End value and it's not forcefed
		do {
			runAgain = false;
			const arrayStart: (string | number)[] = tween.start = [null],
				arrayEnd: (string | number)[] = tween.end = [null],
				pattern: (string | boolean)[] = tween.pattern = [""];
			let easing = tween.easing as any,
				indexStart = 0, // index in startValue
				indexEnd = 0, // index in endValue
				inCalc = 0, // Keep track of being inside a "calc()" so we don't duplicate it
				inRGB = 0, // Keep track of being inside an RGB as we can't use fractional values
				inRGBA = 0, // Keep track of being inside an RGBA as we must pass fractional for the alpha channel
				isStringValue: boolean;

			// TODO: Relative Values

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

			// TODO: Leading from a calc value
			while (indexStart < startValue.length && indexEnd < endValue.length) {
				let charStart = startValue[indexStart],
					charEnd = endValue[indexEnd];

				// If they're both numbers, then parse them as a whole
				if (TWEEN_NUMBER_REGEX.test(charStart) && TWEEN_NUMBER_REGEX.test(charEnd)) {
					let tempStart = charStart, // temporary character buffer
						tempEnd = charEnd, // temporary character buffer
						dotStart = ".", // Make sure we can only ever match a single dot in a decimal
						dotEnd = "."; // Make sure we can only ever match a single dot in a decimal

					while (++indexStart < startValue.length) {
						charStart = startValue[indexStart];
						if (charStart === dotStart) {
							dotStart = ".."; // Can never match two characters
						} else if (!isNumberWhenParsed(charStart)) {
							break;
						}
						tempStart += charStart;
					}
					while (++indexEnd < endValue.length) {
						charEnd = endValue[indexEnd];
						if (charEnd === dotEnd) {
							dotEnd = ".."; // Can never match two characters
						} else if (!isNumberWhenParsed(charEnd)) {
							break;
						}
						tempEnd += charEnd;
					}
					let unitStart = CSS.getUnit(startValue, indexStart), // temporary unit type
						unitEnd = CSS.getUnit(endValue, indexEnd); // temporary unit type

					indexStart += unitStart.length;
					indexEnd += unitEnd.length;
					if (unitEnd.length === 0) {
						// This order as it's most common for the user supplied
						// value to be a number.
						unitEnd = unitStart;
					} else if (unitStart.length === 0) {
						unitStart = unitEnd;
					}
					if (unitStart === unitEnd) {
						// Same units
						if (tempStart === tempEnd) {
							// Same numbers, so just copy over
							pattern[pattern.length - 1] += tempStart + unitStart;
						} else {
							pattern.push(inRGB ? true : false, unitStart);
							arrayStart.push(parseFloat(tempStart), null);
							arrayEnd.push(parseFloat(tempEnd), null);
						}
					} else {
						// Different units, so put into a "calc(from + to)" and
						// animate each side to/from zero. setPropertyValue will
						// look out for the final "calc(0 + " prefix and remove
						// it from the value when it finds it.
						pattern[pattern.length - 1] += inCalc ? "+ (" : "calc(";
						pattern.push(false, unitStart + " + ", false, unitEnd + ")");
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
					// The opacity must not be rounded.
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
					// Different letters, so we're going to push them into start
					// and end until the next word
					isStringValue = true;
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
						if (charStart === " " || TWEEN_NUMBER_REGEX.test(charStart)) {
							break;
						} else {
							arrayStart[arrayStart.length - 1] += charStart;
						}
					}
					while (indexEnd < endValue.length) {
						charEnd = endValue[indexEnd++];
						if (charEnd === " " || TWEEN_NUMBER_REGEX.test(charEnd)) {
							break;
						} else {
							arrayEnd[arrayEnd.length - 1] += charEnd;
						}
					}
				}
				if (!isForcefeed && (indexStart === startValue.length) !== (indexEnd === endValue.length)) {
					// This little piece will take a startValue, split out the
					// various numbers in it, then copy the endValue into the
					// startValue while replacing the numbers in it to match the
					// original start numbers as a repeating sequence.
					// Finally this function will run again with the new
					// startValue and a now matching pattern.
					let startNumbers = startValue.match(/\d\.?\d*/g) || ["0"],
						count = startNumbers.length,
						index = 0;

					startValue = endValue.replace(/\d+\.?\d*/g, function() {
						return startNumbers[index++ % count];
					});
					runAgain = isForcefeed = true;
					break;
				}
			}
			if (!runAgain) {
				// TODO: These two would be slightly better to not add the array indices in the first place
				if (pattern[0] === "" && arrayEnd[0] == null) {
					pattern.shift();
					arrayStart.shift();
					arrayEnd.shift();
				}
				if (pattern[pattern.length] === "" && arrayEnd[arrayEnd.length] == null) {
					pattern.pop();
					arrayStart.pop();
					arrayEnd.pop();
				}
				if (indexStart < startValue.length || indexEnd < endValue.length) {
					// NOTE: We should never be able to reach this code unless a
					// bad forcefed value is supplied.
					console.error("Velocity: Trying to pattern match mis-matched strings " + propertyName + ":[\"" + endValue + "\", \"" + startValue + "\"]");
				}
				if (debug) {
					console.log("Velocity: Pattern found:", pattern, " -> ", arrayStart, arrayEnd, "[" + startValue + "," + endValue + "]");
				}
				if (propertyName === "display") {
					if (!/^(at-start|at-end|during)$/.test(easing)) {
						easing = endValue === "none" ? "at-end" : "at-start";
					}
				} else if (propertyName === "visibility") {
					if (!/^(at-start|at-end|during)$/.test(easing)) {
						easing = endValue === "hidden" ? "at-end" : "at-start";
					}
				} else if (isStringValue
					&& easing !== "at-start" && easing !== "during" && easing !== "at-end"
					&& easing !== Easing.Easings["at-Start"] && easing !== Easing.Easings["during"] && easing !== Easing.Easings["at-end"]) {
					console.warn("Velocity: String easings must use one of 'at-start', 'during' or 'at-end': {" + propertyName + ": [\"" + endValue + "\", " + easing + ", \"" + startValue + "\"]}");
					easing = "at-start";
				}
				tween.easing = validateEasing(easing, duration);
			}
			// This can only run a second time once - if going from automatic startValue to "fixed" pattern from endValue with startValue numbers
		} while (runAgain);
	}

	/**
	 * Expand all queued animations that haven't gone yet
	 *
	 * This will automatically expand the properties map for any recently added
	 * animations so that the start and end values are correct.
	 */
	export function validateTweens(activeCall: AnimationCall) {
		// This might be called on an already-ready animation
		if (State.firstNew === activeCall) {
			State.firstNew = activeCall._next;
		}
		// Check if we're actually already ready
		if (activeCall._flags & AnimationFlags.EXPANDED) {
			return;
		}

		let element = activeCall.element,
			tweens = activeCall.tweens,
			duration = getValue(activeCall.options.duration, defaults.duration);

		for (const propertyName in tweens) {
			const tween = tweens[propertyName];

			if (tween.start == null) {
				// Get the start value as it's not been passed in
				const startValue = CSS.getPropertyValue(activeCall.element, propertyName);

				if (isString(startValue)) {
					tween.start = CSS.fixColors(startValue) as any;
					explodeTween(propertyName, tween, duration);
				} else if (!Array.isArray(startValue)) {
					console.warn("bad type", tween, propertyName, startValue)
				}
			}
			if (debug) {
				console.log("tweensContainer (" + propertyName + "): " + JSON.stringify(tween), element);
			}
		}
		activeCall._flags |= AnimationFlags.EXPANDED;
	}
}
