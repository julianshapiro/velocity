/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {

	export namespace CSS {
		export function clip(type, propertyValue) {
			switch (type) {
				case "name":
					return "clip";
				/* Clip needs to be unwrapped and stripped of its commas during extraction. */
				case "extract":
					let extracted;

					/* If Velocity also extracted this value, skip extraction. */
					if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
						extracted = propertyValue;
					} else {
						/* Remove the "rect()" wrapper. */
						extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);

						/* Strip off commas. */
						extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
					}

					return extracted;
				/* Clip needs to be re-wrapped during injection. */
				case "inject":
					return "rect(" + propertyValue + ")";
			}
		}

		registerNormalization(["clip", clip]);
	}
}

