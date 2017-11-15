/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {
	/**
	 * Replace any css colour name with its rgba() value. It is possible to use
	 * the name within an "rgba(blue, 0.4)" string this way.
	 */
	export function fixColors(str: string): string {
		return str.replace(/(rgba?\(\s*)?(\b[a-z]+\b)/g, function($0, $1, $2) {
			if (Lists.colorNames.hasOwnProperty($2)) {
				return ($1 ? $1 : "rgba(") + CSS.Lists.colorNames[$2] + ($1 ? "" : ",1)");
			}
			return $1 + $2;
		});
	}
}
