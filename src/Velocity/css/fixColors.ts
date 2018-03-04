/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {
	/**
	 * This is the list of color names -> rgb values. The object is in here so
	 * that the actual name conversion can be in a separate file and not
	 * included for custom builds.
	 */
	export const ColorNames: {[name: string]: string} = createEmptyObject();

	/**
	 * Convert a hex list to an rgba value. Designed to be used in replace.
	 */
	function makeRGBA(ignore: any, r: string, g: string, b: string): string {
		return "rgba(" + parseInt(r, 16) + "," + parseInt(g, 16) + "," + parseInt(b, 16) + ",1)";
	}

	const rxColor6 = /#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/gi,
		rxColor3 = /#([a-f\d])([a-f\d])([a-f\d])/gi,
		rxColorName = /(rgba?\(\s*)?(\b[a-z]+\b)/g,
		rxRGB = /rgb(a?)\(([^\)]+)\)/gi,
		rxSpaces = /\s+/g;

	/**
	 * Replace any css colour name with its rgba() value. It is possible to use
	 * the name within an "rgba(blue, 0.4)" string this way.
	 */
	export function fixColors(str: string): string {
		return str
			.replace(rxColor6, makeRGBA)
			.replace(rxColor3, function($0, r, g, b) {
				return makeRGBA($0, r + r, g + g, b + b);
			})
			.replace(rxColorName, function($0, $1, $2) {
				if (ColorNames[$2]) {
					return ($1 ? $1 : "rgba(") + ColorNames[$2] + ($1 ? "" : ",1)");
				}
				return $0;
			})
			.replace(rxRGB, function($0, $1, $2: string) {
				return "rgba(" + $2.replace(rxSpaces, "") + ($1 ? "" : ",1") + ")";
			});
	}
}
