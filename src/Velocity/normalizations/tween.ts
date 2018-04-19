/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import {
	HTMLorSVGElement,
} from "../../../index";

import {registerNormalization} from "./normalizations";

/**
 * A fake normalization used to allow the "tween" property easy access.
 */
function getSetTween(element: HTMLorSVGElement, propertyValue?: string) {
	if (propertyValue === undefined) {
		return "";
	}
}

registerNormalization(["Element", "tween", getSetTween]);
