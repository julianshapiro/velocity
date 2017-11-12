/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {
	export namespace CSS {

		/****************************
		 Style Getting & Setting
		 ****************************/

		/* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
		export function setPropertyValue(element: HTMLorSVGElement, property: string, propertyValue: any, percentComplete: number, rootPropertyValue?, scrollData?: ScrollData) {
			let propertyName = property;

			//			if (property === "display") {
			//				if (propertyValue === "none") {
			//					if (percentComplete !== 1) {
			//						element.style[propertyName] = propertyValue;
			//					}
			//					if (propertyValue === "flex") {
			//						let flexValues = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];
			//
			//						flexValues.forEach(function(flexValue) {
			//							CSS.setPropertyValue(element, "display", flexValue, percentComplete);
			//						});
			//					}
			//				}
			//			} else
			if (property === "scroll") {
				/* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
				/* If a container option is present, scroll the container instead of the browser window. */
				if (scrollData.container) {
					scrollData.container["scroll" + scrollData.direction] = propertyValue;
					/* Otherwise, Velocity defaults to scrolling the browser window. */
				} else {
					if (scrollData.direction === "Left") {
						window.scrollTo(propertyValue, scrollData.alternateValue);
					} else {
						window.scrollTo(scrollData.alternateValue, propertyValue);
					}
				}
			} else {
				/* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
				 Thus, for now, we merely cache transforms being SET. */
				if (Normalizations[property] && Normalizations[property](element) === "transform") {
					/* Perform a normalization injection. */
					/* Note: The normalization logic handles the transformCache updating. */
					Normalizations[property]( element, propertyValue);

					propertyName = "transform";
					propertyValue = Data(element).transformCache[property];
				} else {
					/* Inject hooks. */
					if (Hooks[property]) {
						let hookName = property,
							hookRoot = Hooks.getRoot(property);

						/* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
						rootPropertyValue = rootPropertyValue || getPropertyValue(element, hookRoot); /* GET */

						propertyValue = Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
						property = hookRoot;
					}

					/* Normalize names and values. */
					if (Normalizations[property]) {
						propertyValue = Normalizations[property](element, propertyValue);
					}

					/* Assign the appropriate vendor prefix before performing an official style update. */
					propertyName = Names.prefixCheck(property)[0];

					let data = Data(element);

					/* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
					 Try/catch is avoided for other browsers since it incurs a performance overhead. */
					if (IE <= 8) {
						try {
							element.style[propertyName] = propertyValue;
							data.style[propertyName] = propertyValue;
						} catch (error) {
							if (debug) {
								console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]");
							}
						}
						/* SVG elements have their dimensional properties (width, height, x, y, cx, etc.) applied directly as attributes instead of as styles. */
						/* Note: IE8 does not support SVG elements, so it's okay that we skip it for SVG animation. */
					} else if (data.style[propertyName] !== propertyValue) {
						data.style[propertyName] = propertyValue;
						if (data.isSVG && Names.SVGAttribute(property)) {
							/* Note: For SVG attributes, vendor-prefixed property names are never used. */
							/* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
							element.setAttribute(property, propertyValue);
						} else {
							element.style[propertyName] = propertyValue;
						}
					}

					if (debug >= 2) {
						console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
					}
				}
			}

			/* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
			return [propertyName, propertyValue];
		}
	};
};
