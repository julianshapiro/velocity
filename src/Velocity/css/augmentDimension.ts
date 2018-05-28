/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

// Typedefs
import {HTMLorSVGElement} from "../../../velocity.d";

// Project
import {getPropertyValue} from "./getPropertyValue";

/**
 * Figure out the dimensions for this width / height based on the
 * potential borders and whether we care about them.
 */
export function augmentDimension(element: HTMLorSVGElement, name: "width" | "height", wantInner: boolean): number {
	const isBorderBox = getPropertyValue(element, "boxSizing")
		.toString()
		.toLowerCase() === "border-box";

	if (isBorderBox === wantInner) {
		// in box-sizing mode, the CSS width / height accessors already
		// give the outerWidth / outerHeight.
		const sides = name === "width" ? ["Left", "Right"] : ["Top", "Bottom"],
			fields = [`padding${sides[0]}`, `padding${sides[1]}`, `border${sides[0]}Width`, `border${sides[1]}Width`];
		let augment = 0;

		for (const field of fields) {
			const value = parseFloat(getPropertyValue(element, field));

			if (!isNaN(value)) {
				augment += value;
			}
		}

		return wantInner ? -augment : augment;
	}

	return 0;
}
