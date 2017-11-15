/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {
	/**
	 * Get the default unit for this property.
	 */
	export function getUnit(property: string, start?: number): string {
		let unit = (property.substr(start || 0, 5).match(/^[a-z%]+/) || [])[0] || "";

		if (unit && _inArray.call(CSS.Lists.units, unit)) {
			return unit;
		}
		return "";
	}

}
