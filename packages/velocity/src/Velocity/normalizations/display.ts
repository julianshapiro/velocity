///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {
	export const inlineRx = /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|let|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i,
		listItemRx = /^(li)$/i,
		tableRowRx = /^(tr)$/i,
		tableRx = /^(table)$/i,
		tableRowGroupRx = /^(tbody)$/i;

	/**
	 * Display has an extra value of "auto" that works out the correct value
	 * based on the type of element.
	 */
	function display(element: HTMLorSVGElement): string;
	function display(element: HTMLorSVGElement, propertyValue: string): void;
	function display(element: HTMLorSVGElement, propertyValue?: string): string | void {
		const style = element.style;

		if (propertyValue === undefined) {
			return CSS.computePropertyValue(element, "display");
		}
		if (propertyValue === "auto") {
			const nodeName = element && element.nodeName,
				data = Data(element);

			if (inlineRx.test(nodeName)) {
				propertyValue = "inline";
			} else if (listItemRx.test(nodeName)) {
				propertyValue = "list-item";
			} else if (tableRowRx.test(nodeName)) {
				propertyValue = "table-row";
			} else if (tableRx.test(nodeName)) {
				propertyValue = "table";
			} else if (tableRowGroupRx.test(nodeName)) {
				propertyValue = "table-row-group";
			} else {
				// Default to "block" when no match is found.
				propertyValue = "block";
			}
			// IMPORTANT: We need to do this as getPropertyValue bypasses the
			// Normalisation when it exists in the cache.
			data.cache["display"] = propertyValue;
		}
		style.display = propertyValue;
	}

	registerNormalization([Element, "display", display]);
}
