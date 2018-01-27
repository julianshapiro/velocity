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
	let commands = new Map<string, (value: any, element: HTMLorSVGElement, elements: HTMLorSVGElement[], elementArrayIndex: number, propertyName: string) => string>();

	commands.set("function", function(value: any, element: HTMLorSVGElement, elements: HTMLorSVGElement[], elementArrayIndex: number) {
		return (value as any as VelocityPropertyValueFn).call(element, elementArrayIndex, elements.length);
	})
	commands.set("number", function(value, element, elements, elementArrayIndex, propertyName) {
		return CSS.fixColors(String(value) + CSS.Values.getUnitType(propertyName));
	});
	commands.set("string", function(value, element, elements, elementArrayIndex, propertyName) {
		return CSS.fixColors(value);
	});
	commands.set("undefined", function(value, element, elements, elementArrayIndex, propertyName) {
		return CSS.fixColors(CSS.getPropertyValue(element, propertyName) || "");
	});

	/**
	 * Expand a VelocityProperty argument into a valid sparse Tween array. This
	 * pre-allocates the array as it is then the correct size and slightly
	 * faster to access.
	 */
	export function expandProperties(animation: AnimationCall, properties: VelocityProperties) {
		const tweens = animation.tweens = Object.create(null),
			elements = animation.elements,
			element = animation.element,
			elementArrayIndex = elements.indexOf(element),
			data = Data(element),
			queue = getValue(animation.queue, animation.options.queue),
			duration = getValue(animation.options.duration, defaults.duration);

		for (const property in properties) {
			const propertyName = CSS.Names.camelCase(property);
			let valueData = properties[property],
				types = data.types,
				found: boolean = propertyName === "tween";

			for (let index = 0; types && !found; types >>= 1, index++) {
				found = !!(types & 1 && CSS.Normalizations[0][propertyName]);
			}
			if (!found
				&& (!State.prefixElement
					|| !isString(State.prefixElement.style[propertyName]))) {
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
			const tween: VelocityTween = tweens[propertyName] = new Array(Tween.length) as any;
			let endValue: string,
				startValue: string;

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
				if ((isString(arr1) && (/^[\d-]/.test(arr1) || CSS.RegEx.isHex.test(arr1))) || isFunction(arr1) || isNumber(arr1)) {
					startValue = arr1 as any;
				} else if ((isString(arr1) && Easing.Easings[arr1]) || Array.isArray(arr1)) {
					tween[Tween.EASING] = arr1 as any;
					startValue = arr2 as any;
				} else {
					startValue = arr1 || arr2 as any;
				}
			} else {
				endValue = valueData as any;
			}
			tween[Tween.END] = commands.get(typeof endValue)(endValue, element, elements, elementArrayIndex, propertyName) as any;
			if (startValue != null || (queue === false || data.queueList[queue] === undefined)) {
				tween[Tween.START] = commands.get(typeof startValue)(startValue, element, elements, elementArrayIndex, propertyName) as any;
			}
			explodeTween(propertyName, tween, duration);
		}
	}

	/**
	 * Convert a string-based tween with start and end strings, into a pattern
	 * based tween with arrays.
	 */
	function explodeTween(propertyName: string, tween: VelocityTween, duration: number) {
		const endValue: string = tween[Tween.END] as any as string,
			startValue: string = tween[Tween.START] as any as string;

		if (!isString(endValue) || !isString(startValue)) {
			return;
		}
		const arrayStart: (string | number)[] = tween[Tween.START] = [null],
			arrayEnd: (string | number)[] = tween[Tween.END] = [null],
			pattern: (string | number)[] = tween[Tween.PATTERN] = [""];
		let easing = tween[Tween.EASING] as any,
			rounding: boolean[],
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

		while (indexStart < startValue.length || indexEnd < endValue.length) {
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
						if (inRGB) {
							if (!rounding) {
								rounding = tween[Tween.ROUNDING] = [];
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
		if (indexStart !== startValue.length || indexEnd !== endValue.length) {
			// TODO: change the tween to use a string type if they're different
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
		tween[Tween.EASING] = validateEasing(easing, duration);
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

			if (tween[Tween.START] == null) {
				// Get the start value as it's not been passed in
				const startValue = CSS.getPropertyValue(activeCall.element, propertyName);

				if (isString(startValue)) {
					tween[Tween.START] = CSS.fixColors(startValue) as any;
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
