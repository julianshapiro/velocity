///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic.CSS {
	const inlineRx = /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|let|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i,
		listItemRx = /^(li)$/i,
		tableRowRx = /^(tr)$/i,
		tableRx = /^(table)$/i,
		tableRowGroupRx = /^(tbody)$/i;

	/**
	 * Return a Normalisation that can be used to set / get the vendor prefixed
	 * real name for a propery.
	 */
	function display(element: HTMLorSVGElement): string;
	function display(element: HTMLorSVGElement, propertyValue: string): boolean;
	function display(element: HTMLorSVGElement, propertyValue?: string): string | boolean {
		let style = element.style;

		if (propertyValue === undefined) {
			return getPropertyValue(element, "display", true);
		}
		if (propertyValue === "auto") {
			let nodeName = element && element.nodeName,
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
		return true;
	}

	registerNormalization(["display", display]);
}
