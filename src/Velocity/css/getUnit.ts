/*
 * VelocityJS.org (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

/**
 * All possible units in CSS. Used to recognise units when parsing tweens.
 */
const Units = [
	"%", // relative
	"em", "ex", "ch", "rem", // font relative
	"vw", "vh", "vmin", "vmax", // viewport relative
	"cm", "mm", "Q", "in", "pc", "pt", "px", // absolute lengths
	"deg", "grad", "rad", "turn", // angles
	"s", "ms", // time
];

/**
 * Get the current unit for this property. Only used when parsing tweens
 * to check if the unit is changing between the start and end values.
 */
export function getUnit(property: string, start?: number): string {
	start = start || 0;
	if (property[start] && property[start] !== " ") {
		for (const unit of Units) {
			let j = 0;

			do {
				if (j >= unit.length) {
					return unit;
				}
				if (unit[j] !== property[start + j]) {
					break;
				}
			} while (++j);
		}
	}

	return "";
}
