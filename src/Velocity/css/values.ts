namespace VelocityStatic {
	export namespace CSS {

		/************************
		 CSS Property Values
		 ************************/

		export var Values = {
			/* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
			hexToRgb: function(hex: string): [number, number, number] {
				var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
					longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
					rgbParts;

				hex = hex.replace(shortformRegex, function(m, r, g, b) {
					return r + r + g + g + b + b;
				});

				rgbParts = longformRegex.exec(hex);

				return rgbParts ? [parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16)] : [0, 0, 0];
			},
			isCSSNullValue: function(value: string): boolean {
				/* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
				 Thus, we check for both falsiness and these special strings. */
				/* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
				 templates as defined as Hooks (for the sake of hook injection/extraction). */
				/* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
				return (!value || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
			},
			/* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
			getUnitType: function(property: string): string {
				if (/^(rotate|skew)/i.test(property)) {
					return "deg";
				} else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
					/* The above properties are unitless. */
					return "";
				} else {
					/* Default to px for all other properties. */
					return "px";
				}
			},
			/* HTML elements default to an associated display type when they're not set to display:none. */
			/* Note: This function is used for correctly setting the non-"none" display value in certain Velocity redirects, such as fadeIn/Out. */
			getDisplayType: function(element: HTMLorSVGElement): string {
				var tagName = element && element.tagName.toString().toLowerCase();

				if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
					return "inline";
				} else if (/^(li)$/i.test(tagName)) {
					return "list-item";
				} else if (/^(tr)$/i.test(tagName)) {
					return "table-row";
				} else if (/^(table)$/i.test(tagName)) {
					return "table";
				} else if (/^(tbody)$/i.test(tagName)) {
					return "table-row-group";
					/* Default to "block" when no match is found. */
				} else {
					return "block";
				}
			},
			/* The class add/remove functions are used to temporarily apply a "velocity-animating" class to elements while they're animating. */
			addClass: function(element: HTMLorSVGElement, className: string): void {
				if (element) {
					if (element.classList) {
						element.classList.add(className);
					} else if (isString(element.className)) {
						// Element.className is around 15% faster then set/getAttribute
						element.className += (element.className.length ? " " : "") + className;
					} else {
						// Work around for IE strict mode animating SVG - and anything else that doesn't behave correctly - the same way jQuery does it
						var currentClass = element.getAttribute(IE <= 7 ? "className" : "class") || "";

						element.setAttribute("class", currentClass + (currentClass ? " " : "") + className);
					}
				}
			},
			removeClass: function(element: HTMLorSVGElement, className: string): void {
				if (element) {
					if (element.classList) {
						element.classList.remove(className);
					} else if (isString(element.className)) {
						// Element.className is around 15% faster then set/getAttribute
						// TODO: Need some jsperf tests on performance - can we get rid of the regex and maybe use split / array manipulation?
						element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
					} else {
						// Work around for IE strict mode animating SVG - and anything else that doesn't behave correctly - the same way jQuery does it
						var currentClass = element.getAttribute(IE <= 7 ? "className" : "class") || "";

						element.setAttribute("class", currentClass.replace(new RegExp("(^|\s)" + className.split(" ").join("|") + "(\s|$)", "gi"), " "));
					}
				}
			}
		};
	};
};
