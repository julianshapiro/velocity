/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

//namespace VelocityStatic.CSS {
//	export function clip(element, propertyValue) {
//		if (propertyValue === undefined) {
//			let extracted;
//
//			/* If Velocity also extracted this value, skip extraction. */
//			if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
//				extracted = propertyValue;
//			} else {
//				/* Remove the "rect()" wrapper. */
//				extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);
//
//				/* Strip off commas. */
//				extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
//			}
//
//			return extracted;
//		} else {
//			return "rect(" + propertyValue + ")";
//		}
//	}
//
//	registerNormalization(["clip", clip]);
//}