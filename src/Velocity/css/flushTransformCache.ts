namespace VelocityStatic {
	export namespace CSS {

		/* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
		/* Note: Velocity applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
		export function flushTransformCache(element: HTMLorSVGElement) {
			var transformString = "",
				data = Data(element);

			/* Certain browsers require that SVG transforms be applied as an attribute. However, the SVG transform attribute takes a modified version of CSS's transform string
			 (units are dropped and, except for skewX/Y, subproperties are merged into their master property -- e.g. scaleX and scaleY are merged into scale(X Y). */
			if ((IE || (State.isAndroid && !State.isChrome)) && data && data.isSVG) {
				/* Since transform values are stored in their parentheses-wrapped form, we use a helper function to strip out their numeric values.
				 Further, SVG transform properties only take unitless (representing pixels) values, so it's okay that parseFloat() strips the unit suffixed to the float value. */
				var getTransformFloat = function(transformProperty) {
					return parseFloat(getPropertyValue(element, transformProperty) as string);
				};

				/* Create an object to organize all the transforms that we'll apply to the SVG element. To keep the logic simple,
				 we process *all* transform properties -- even those that may not be explicitly applied (since they default to their zero-values anyway). */
				var SVGTransforms = {
					translate: [getTransformFloat("translateX"), getTransformFloat("translateY")],
					skewX: [getTransformFloat("skewX")], skewY: [getTransformFloat("skewY")],
					/* If the scale property is set (non-1), use that value for the scaleX and scaleY values
					 (this behavior mimics the result of animating all these properties at once on HTML elements). */
					scale: getTransformFloat("scale") !== 1 ? [getTransformFloat("scale"), getTransformFloat("scale")] : [getTransformFloat("scaleX"), getTransformFloat("scaleY")],
					/* Note: SVG's rotate transform takes three values: rotation degrees followed by the X and Y values
					 defining the rotation's origin point. We ignore the origin values (default them to 0). */
					rotate: [getTransformFloat("rotateZ"), 0, 0]
				};

				/* Iterate through the transform properties in the user-defined property map order.
				 (This mimics the behavior of non-SVG transform animation.) */
				for (var transformName in Data(element).transformCache) {
					/* Except for with skewX/Y, revert the axis-specific transform subproperties to their axis-free master
					 properties so that they match up with SVG's accepted transform properties. */
					if (/^translate/i.test(transformName)) {
						transformName = "translate";
					} else if (/^scale/i.test(transformName)) {
						transformName = "scale";
					} else if (/^rotate/i.test(transformName)) {
						transformName = "rotate";
					}

					/* Check that we haven't yet deleted the property from the SVGTransforms container. */
					if (SVGTransforms[transformName]) {
						/* Append the transform property in the SVG-supported transform format. As per the spec, surround the space-delimited values in parentheses. */
						transformString += transformName + "(" + SVGTransforms[transformName].join(" ") + ")" + " ";

						/* After processing an SVG transform property, delete it from the SVGTransforms container so we don't
						 re-insert the same master property if we encounter another one of its axis-specific properties. */
						delete SVGTransforms[transformName];
					}
				}
			} else {
				var transformValue,
					perspective;

				/* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
				for (var transformName in Data(element).transformCache) {
					transformValue = Data(element).transformCache[transformName];

					/* Transform's perspective subproperty must be set first in order to take effect. Store it temporarily. */
					if (transformName === "transformPerspective") {
						perspective = transformValue;
						return true;
					}

					/* IE9 only supports one rotation type, rotateZ, which it refers to as "rotate". */
					if (IE === 9 && transformName === "rotateZ") {
						transformName = "rotate";
					}

					transformString += transformName + transformValue + " ";
				}

				/* If present, set the perspective subproperty first. */
				if (perspective) {
					transformString = "perspective" + perspective + " " + transformString;
				}
			}

			setPropertyValue(element, "transform", transformString, 1);
		}
	};
};
