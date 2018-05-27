/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

// Typedefs
import {HTMLorSVGElement, VelocityNormalizationsFn} from "../../../velocity.d";

// Project
import {augmentDimension} from "../css/augmentDimension";
import {setPropertyValue} from "../css/setPropertyValue";
import {registerNormalization} from "./normalizations";

/**
 * Get/set the inner/outer dimension.
 */
function getDimension(name: "width" | "height", wantInner: boolean) {
	return ((element: HTMLorSVGElement, propertyValue?: string): string | void => {
		if (propertyValue === undefined) {
			return augmentDimension(element, name, wantInner) + "px";
		}
		setPropertyValue(element, name, (parseFloat(propertyValue) - augmentDimension(element, name, wantInner)) + "px");
	}) as VelocityNormalizationsFn;
}

registerNormalization(["Element", "innerWidth", getDimension("width", true)]);
registerNormalization(["Element", "innerHeight", getDimension("height", true)]);
registerNormalization(["Element", "outerWidth", getDimension("width", false)]);
registerNormalization(["Element", "outerHeight", getDimension("height", false)]);
