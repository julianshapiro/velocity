namespace VelocityStatic {

	export namespace CSS {

		/*******************
		 Normalizations
		 *******************/

		/* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
		 and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
		export namespace Normalizations {

			/**************
			 Dimensions
			 **************/
			function augmentDimension(name, element, wantInner) {
				var isBorderBox = CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === "border-box";

				if (isBorderBox === (wantInner || false)) {
					/* in box-sizing mode, the CSS width / height accessors already give the outerWidth / outerHeight. */
					var i: number,
						value: number,
						augment = 0,
						sides = name === "width" ? ["Left", "Right"] : ["Top", "Bottom"],
						fields = ["padding" + sides[0], "padding" + sides[1], "border" + sides[0] + "Width", "border" + sides[1] + "Width"];

					for (i = 0; i < fields.length; i++) {
						value = parseFloat(CSS.getPropertyValue(element, fields[i]));
						if (!isNaN(value)) {
							augment += value;
						}
					}
					return wantInner ? -augment : augment;
				}
				return 0;
			}

			function getDimension(name, wantInner?: boolean) {
				return function(type, element, propertyValue) {
					switch (type) {
						case "name":
							return name;

						case "extract":
							return parseFloat(propertyValue) + augmentDimension(name, element, wantInner);

						case "inject":
							return (parseFloat(propertyValue) - augmentDimension(name, element, wantInner)) + "px";
					}
				};
			}

			/* Normalizations are passed a normalization target (either the property's name, its extracted value, or its injected value),
			 the targeted element (which may need to be queried), and the targeted property value. */
			export var registered: {[key: string]: ((type: "name" | "extract" | "inject", element?: HTMLorSVGElement, propertyValue?) => any)} = {
				clip: function(type, element, propertyValue) {
					switch (type) {
						case "name":
							return "clip";
						/* Clip needs to be unwrapped and stripped of its commas during extraction. */
						case "extract":
							var extracted;

							/* If Velocity also extracted this value, skip extraction. */
							if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
								extracted = propertyValue;
							} else {
								/* Remove the "rect()" wrapper. */
								extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);

								/* Strip off commas. */
								extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
							}

							return extracted;
						/* Clip needs to be re-wrapped during injection. */
						case "inject":
							return "rect(" + propertyValue + ")";
					}
				},
				blur: function(type, element, propertyValue) {
					switch (type) {
						case "name":
							return VelocityStatic.State.isFirefox ? "filter" : "-webkit-filter";
						case "extract":
							var extracted = parseFloat(propertyValue);

							/* If extracted is NaN, meaning the value isn't already extracted. */
							if (!(extracted || extracted === 0)) {
								var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);

								/* If the filter string had a blur component, return just the blur value and unit type. */
								if (blurComponent) {
									extracted = blurComponent[1];
									/* If the component doesn't exist, default blur to 0. */
								} else {
									extracted = 0;
								}
							}

							return extracted;
						/* Blur needs to be re-wrapped during injection. */
						case "inject":
							/* For the blur effect to be fully de-applied, it needs to be set to "none" instead of 0. */
							if (!parseFloat(propertyValue)) {
								return "none";
							} else {
								return "blur(" + propertyValue + ")";
							}
					}
				},
				/* <=IE8 do not support the standard opacity property. They use filter:alpha(opacity=INT) instead. */
				opacity: function(type, element, propertyValue) {
					if (IE <= 8) {
						switch (type) {
							case "name":
								return "filter";
							case "extract":
								/* <=IE8 return a "filter" value of "alpha(opacity=\d{1,3})".
								 Extract the value and convert it to a decimal value to match the standard CSS opacity property's formatting. */
								var extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);

								if (extracted) {
									/* Convert to decimal value. */
									propertyValue = extracted[1] / 100;
								} else {
									/* When extracting opacity, default to 1 since a null value means opacity hasn't been set. */
									propertyValue = 1;
								}

								return propertyValue;
							case "inject":
								/* Opacified elements are required to have their zoom property set to a non-zero value. */
								element.style.zoom = "1";

								/* Setting the filter property on elements with certain font property combinations can result in a
								 highly unappealing ultra-bolding effect. There's no way to remedy this throughout a tween, but dropping the
								 value altogether (when opacity hits 1) at leasts ensures that the glitch is gone post-tweening. */
								if (parseFloat(propertyValue) >= 1) {
									return "";
								} else {
									/* As per the filter property's spec, convert the decimal value to a whole number and wrap the value. */
									return "alpha(opacity=" + parseInt((parseFloat(propertyValue) * 100) as any, 10) + ")";
								}
						}
						/* With all other browsers, normalization is not required; return the same values that were passed in. */
					} else {
						switch (type) {
							case "name":
								return "opacity";
							case "extract":
								return propertyValue;
							case "inject":
								return propertyValue;
						}
					}
				},

				innerWidth: getDimension("width", true),
				innerHeight: getDimension("height", true),
				outerWidth: getDimension("width"),
				outerHeight: getDimension("height")
			};

			/*****************************
			 Batched Registrations
			 *****************************/

			/* Note: Batched normalizations extend the vCSS.Normalizations.registered object. */
			export function register() {

				/*****************
				 Transforms
				 *****************/

				/* Transforms are the subproperties contained by the CSS "transform" property. Transforms must undergo normalization
				 so that they can be referenced in a properties map by their individual names. */
				/* Note: When transforms are "set", they are actually assigned to a per-element transformCache. When all transform
				 setting is complete complete, vCSS.flushTransformCache() must be manually called to flush the values to the DOM.
				 Transform setting is batched in this way to improve performance: the transform style only needs to be updated
				 once when multiple transform subproperties are being animated simultaneously. */
				/* Note: IE9 and Android Gingerbread have support for 2D -- but not 3D -- transforms. Since animating unsupported
				 transform properties results in the browser ignoring the *entire* transform string, we prevent these 3D values
				 from being normalized for these browsers so that tweening skips these properties altogether
				 (since it will ignore them as being unsupported by the browser.) */
				if ((!IE || IE > 9) && !VelocityStatic.State.isGingerbread) {
					/* Note: Since the standalone CSS "perspective" property and the CSS transform "perspective" subproperty
					 share the same name, the latter is given a unique token within Velocity: "transformPerspective". */
					CSS.Lists.transformsBase = CSS.Lists.transformsBase.concat(CSS.Lists.transforms3D);
				}

				for (var i = 0; i < CSS.Lists.transformsBase.length; i++) {
					/* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
					 paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
					(function() {
						var transformName = CSS.Lists.transformsBase[i];

						CSS.Normalizations.registered[transformName] = function(type, element, propertyValue) {
							switch (type) {
								/* The normalized property name is the parent "transform" property -- the property that is actually set in vCSS. */
								case "name":
									return "transform";
								/* Transform values are cached onto a per-element transformCache object. */
								case "extract":
									/* If this transform has yet to be assigned a value, return its null value. */
									if (Data(element) === undefined || Data(element).transformCache[transformName] === undefined) {
										/* Scale vCSS.Lists.transformsBase default to 1 whereas all other transform properties default to 0. */
										return /^scale/i.test(transformName) ? 1 : 0;
										/* When transform values are set, they are wrapped in parentheses as per the CSS spec.
										 Thus, when extracting their values (for tween calculations), we strip off the parentheses. */
									}
									return Data(element).transformCache[transformName].replace(/[()]/g, "");
								case "inject":
									var invalid = false;

									/* If an individual transform property contains an unsupported unit type, the browser ignores the *entire* transform property.
									 Thus, protect users from themselves by skipping setting for transform values supplied with invalid unit types. */
									/* Switch on the base transform type; ignore the axis by removing the last letter from the transform's name. */
									switch (transformName.substr(0, transformName.length - 1)) {
										/* Whitelist unit types for each transform. */
										case "translate":
											invalid = !/(%|px|em|rem|vw|vh|\d)$/i.test(propertyValue);
											break;
										/* Since an axis-free "scale" property is supported as well, a little hack is used here to detect it by chopping off its last letter. */
										case "scal":
										case "scale":
											/* Chrome on Android has a bug in which scaled elements blur if their initial scale
											 value is below 1 (which can happen with forcefeeding). Thus, we detect a yet-unset scale property
											 and ensure that its first value is always 1. More info: http://stackoverflow.com/questions/10417890/css3-animations-with-transform-causes-blurred-elements-on-webkit/10417962#10417962 */
											if (VelocityStatic.State.isAndroid && Data(element).transformCache[transformName] === undefined && propertyValue < 1) {
												propertyValue = 1;
											}

											invalid = !/(\d)$/i.test(propertyValue);
											break;
										case "skew":
											invalid = !/(deg|\d)$/i.test(propertyValue);
											break;
										case "rotate":
											invalid = !/(deg|\d)$/i.test(propertyValue);
											break;
									}

									if (!invalid) {
										/* As per the CSS spec, wrap the value in parentheses. */
										Data(element).transformCache[transformName] = "(" + propertyValue + ")";
									}

									/* Although the value is set on the transformCache object, return the newly-updated value for the calling code to process as normal. */
									return Data(element).transformCache[transformName];
							}
						};
					})();
				}
			}
		};
	};
};

