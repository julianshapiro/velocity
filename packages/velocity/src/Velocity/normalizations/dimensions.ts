///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {

	/**
	 * Figure out the dimensions for this width / height based on the
	 * potential borders and whether we care about them.
	 */
	export function augmentDimension(element: HTMLorSVGElement, name: "width" | "height", wantInner: boolean): number {
		const isBorderBox = CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === "border-box";

		if (isBorderBox === wantInner) {
			// in box-sizing mode, the CSS width / height accessors already
			// give the outerWidth / outerHeight.
			const sides = name === "width" ? ["Left", "Right"] : ["Top", "Bottom"],
				fields = ["padding" + sides[0], "padding" + sides[1], "border" + sides[0] + "Width", "border" + sides[1] + "Width"];
			let i: number,
				value: number,
				augment = 0;

			for (i = 0; i < fields.length; i++) {
				value = parseFloat(CSS.getPropertyValue(element, fields[i]) as string);
				if (!isNaN(value)) {
					augment += value;
				}
			}
			return wantInner ? -augment : augment;
		}
		return 0;
	}

	/**
	 * Get/set the inner/outer dimension.
	 */
	function getDimension(name: "width" | "height", wantInner: boolean) {
		return function(element: HTMLorSVGElement, propertyValue?: string): string | void {
			if (propertyValue === undefined) {
				return augmentDimension(element, name, wantInner) + "px";
			}
			CSS.setPropertyValue(element, name, (parseFloat(propertyValue) - augmentDimension(element, name, wantInner)) + "px");
		} as VelocityNormalizationsFn;
	}

	registerNormalization([Element, "innerWidth", getDimension("width", true)]);
	registerNormalization([Element, "innerHeight", getDimension("height", true)]);
	registerNormalization([Element, "outerWidth", getDimension("width", false)]);
	registerNormalization([Element, "outerHeight", getDimension("height", false)]);
}
