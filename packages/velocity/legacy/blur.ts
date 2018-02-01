/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

//namespace VelocityStatic.CSS {
//	export function blur(element, propertyValue) {
//		if (propertyValue === undefined) {
//			let extracted = parseFloat(propertyValue);
//
//			/* If extracted is NaN, meaning the value isn't already extracted. */
//			if (!(extracted || extracted === 0)) {
//				let blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
//
//				/* If the filter string had a blur component, return just the blur value and unit type. */
//				if (blurComponent) {
//					extracted = blurComponent[1];
//					/* If the component doesn't exist, default blur to 0. */
//				} else {
//					extracted = 0;
//				}
//			}
//
//			return extracted + "px";
//		}
//		/* For the blur effect to be fully de-applied, it needs to be set to "none" instead of 0. */
//		if (!parseFloat(propertyValue)) {
//			return "none";
//		}
//		return "blur(" + propertyValue + ")";
//	}
//
//	registerNormalization(["blur", blur]);
//}
