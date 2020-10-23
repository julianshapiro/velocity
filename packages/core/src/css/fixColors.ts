/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

const rxColor6 = /#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/gi; // #aabbcc
const rxColor3 = /#([a-f\d])([a-f\d])([a-f\d])/gi; // #abc
const rxColorName = /(rgba?\(\s*)?(\b[a-z]+\b)/g; // rgb(red)
const rxRGB = /rgb(a?)\(([^\)]+)\)/gi; // rgba(.*)
const rxSpaces = /\s+/g;

/**
 * This is the list of color names -> rgb values. The object is in here so
 * that the actual name conversion can be in a separate file and not
 * included for custom builds.
 */
export const ColorNames: Record<string, string> = {};

/**
 * Convert a hex list to an rgba value. Designed to be used in replace.
 */
const makeRGBA = (_ignore: any, r: string, g: string, b: string): string =>
	`rgba(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)},1)`;

/**
 * Replace any css colour name with its rgba() value. It is possible to use
 * the name within an "rgba(blue, 0.4)" string this way.
 */
export function fixColors(str: string): string {
	return str
		.replace(rxColor6, makeRGBA)
		.replace(rxColor3, ($0, r, g, b) => makeRGBA($0, r + r, g + g, b + b))
		.replace(rxColorName, ($0, $1, $2) => ColorNames[$2]
			? ($1 ? $1 : "rgba(") + ColorNames[$2] + ($1 ? "" : ",1)")
			: $0)
		.replace(rxRGB, (_$0, $1, $2: string) => `rgba(${$2.replace(rxSpaces, "") + ($1 ? "" : ",1")})`);
}
