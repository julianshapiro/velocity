/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

/**
 * Remove nested `calc(0px + *)` or `calc(* + (0px + *))` correctly.
 */
export function removeNestedCalc(value: string): string {
	if (value.indexOf("calc(") >= 0) {
		const tokens = value.split(/([\(\)])/);
		let depth = 0;

		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];

			switch (token) {
				case "(":
					depth++;
					break;

				case ")":
					depth--;
					break;

				default:
					if (depth && token[0] === "0") {
						tokens[i] = token.replace(/^0[a-z%]+ \+ /, "");
					}
					break;
			}
		}

		return tokens.join("")
			.replace(/(?:calc)?\(([0-9\.]+[a-z%]+)\)/g, "$1");
	}

	return value;
}
