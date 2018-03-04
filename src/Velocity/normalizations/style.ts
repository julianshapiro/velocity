///<reference path="normalizations.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 * 
 * This handles all CSS style properties. With browser prefixed properties it
 * will register a version that handles setting (and getting) both the prefixed
 * and non-prefixed version.
 */

namespace VelocityStatic {
	/**
	 * An RegExp pattern for the following list of css words using
	 * http://kemio.com.ar/tools/lst-trie-re.php to generate:
	 * 
	 * blockSize
	 * borderBottomLeftRadius
	 * borderBottomRightRadius
	 * borderBottomWidth
	 * borderImageOutset
	 * borderImageWidth
	 * borderLeftWidth
	 * borderRadius
	 * borderRightWidth
	 * borderSpacing
	 * borderTopLeftRadius
	 * borderTopRightRadius
	 * borderTopWidth
	 * borderWidth
	 * bottom
	 * columnGap
	 * columnRuleWidth
	 * columnWidth
	 * flexBasis
	 * fontSize
	 * gridColumnGap
	 * gridGap
	 * gridRowGap
	 * height
	 * inlineSize
	 * left
	 * letterSpacing
	 * margin
	 * marginBottom
	 * marginLeft
	 * marginRight
	 * marginTop
	 * maxBlockSize
	 * maxHeight
	 * maxInlineSize
	 * maxWidth
	 * minBlockSize
	 * minHeight
	 * minInlineSize
	 * minWidth
	 * objectPosition
	 * outlineOffset
	 * outlineWidth
	 * padding
	 * paddingBottom
	 * paddingLeft
	 * paddingRight
	 * paddingTop
	 * perspective
	 * right
	 * shapeMargin
	 * strokeDashoffset
	 * strokeWidth
	 * textIndent
	 * top
	 * transformOrigin
	 * width
	 * wordSpacing
	 */
	const rxAddPx = /^(b(lockSize|o(rder(Bottom(LeftRadius|RightRadius|Width)|Image(Outset|Width)|LeftWidth|R(adius|ightWidth)|Spacing|Top(LeftRadius|RightRadius|Width)|Width)|ttom))|column(Gap|RuleWidth|Width)|f(lexBasis|ontSize)|grid(ColumnGap|Gap|RowGap)|height|inlineSize|le(ft|tterSpacing)|m(a(rgin(Bottom|Left|Right|Top)|x(BlockSize|Height|InlineSize|Width))|in(BlockSize|Height|InlineSize|Width))|o(bjectPosition|utline(Offset|Width))|p(adding(Bottom|Left|Right|Top)|erspective)|right|s(hapeMargin|troke(Dashoffset|Width))|t(extIndent|op|ransformOrigin)|w(idth|ordSpacing))$/;

	/**
	 * Return a Normalisation that can be used to set / get a prefixed style
	 * property.
	 */
	function getSetPrefixed(propertyName: string, unprefixed: string) {
		return function(element: HTMLorSVGElement, propertyValue?: string): string | void {
			if (propertyValue === undefined) {
				return CSS.computePropertyValue(element, propertyName) || CSS.computePropertyValue(element, unprefixed);
			}
			element.style[propertyName] = element.style[unprefixed] = propertyValue;
		} as VelocityNormalizationsFn;
	}

	/**
	 * Return a Normalisation that can be used to set / get a style property.
	 */
	function getSetStyle(propertyName: string) {
		return function(element: HTMLorSVGElement, propertyValue?: string): string | void {
			if (propertyValue === undefined) {
				return CSS.computePropertyValue(element, propertyName);
			}
			element.style[propertyName] = propertyValue;
		} as VelocityNormalizationsFn;
	}

	/**
	 * Vendor prefixes. Chrome / Safari, Firefox, IE / Edge, Opera.
	 */
	const rxVendors = /^(webkit|moz|ms|o)[A-Z]/,
		prefixElement = State.prefixElement;

	for (const propertyName in prefixElement.style) {
		if (rxVendors.test(propertyName)) {
			let unprefixed = propertyName.replace(/^[a-z]+([A-Z])/, ($, letter: string) => letter.toLowerCase());

			if (ALL_VENDOR_PREFIXES || isString(prefixElement.style[unprefixed])) {
				let addUnit = rxAddPx.test(unprefixed) ? "px" : undefined;

				registerNormalization([Element, unprefixed, getSetPrefixed(propertyName, unprefixed), addUnit]);
			}
		} else if (!hasNormalization([Element, propertyName])) {
			let addUnit = rxAddPx.test(propertyName) ? "px" : undefined;

			registerNormalization([Element, propertyName, getSetStyle(propertyName), addUnit]);
		}
	}
}
