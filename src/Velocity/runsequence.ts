/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Sequence Running
 */

/**
 * Perform a deep copy of an object - also copies children so they're not
 * going to be affected by changing original.
 */
function _deepCopyObject<T, U>(target: T, ...sources: U[]): T & U {
	if (target == null) { // TypeError if undefined or null
		throw new TypeError("Cannot convert undefined or null to object");
	}
	const to = Object(target),
		hasOwnProperty = Object.prototype.hasOwnProperty;
	let source: any;

	while ((source = sources.shift())) {
		if (source != null) {
			for (const key in source) {
				if (hasOwnProperty.call(source, key)) {
					const value = source[key];

					if (Array.isArray(value)) {
						_deepCopyObject(to[key] = [], value);
					} else if (isPlainObject(value)) {
						_deepCopyObject(to[key] = {}, value);
					} else {
						to[key] = value;
					}
				}
			}
		}
	}
	return to;
}

namespace VelocityStatic {
	/* Note: Sequence calls must use Velocity's single-object arguments syntax. */
	export function RunSequence(originalSequence): void {
		let sequence = _deepCopyObject([], originalSequence);

		if (sequence.length > 1) {
			sequence.reverse().forEach(function(currentCall, i) {
				let nextCall = sequence[i + 1];

				if (nextCall) {
					/* Parallel sequence calls (indicated via sequenceQueue:false) are triggered
					 in the previous call's begin callback. Otherwise, chained calls are normally triggered
					 in the previous call's complete callback. */
					let currentCallOptions = currentCall.o || currentCall.options,
						nextCallOptions = nextCall.o || nextCall.options;

					let timing = (currentCallOptions && currentCallOptions.sequenceQueue === false) ? "begin" : "complete",
						callbackOriginal = nextCallOptions && nextCallOptions[timing],
						options = {};

					options[timing] = function() {
						let nextCallElements = nextCall.e || nextCall.elements;
						let elements = nextCallElements.nodeType ? [nextCallElements] : nextCallElements;

						if (callbackOriginal) {
							callbackOriginal.call(elements, elements);
						}
						VelocityFn(currentCall);
					};

					if (nextCall.o) {
						nextCall.o = {...nextCallOptions, ...options};
					} else {
						nextCall.options = {...nextCallOptions, ...options};
					}
				}
			});

			sequence.reverse();
		}

		VelocityFn(sequence[0]);
	};
};
