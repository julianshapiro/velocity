/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

namespace VelocityStatic {

	/**************
	 Dimensions
	 **************/
	function augmentDimension(name, element, wantInner) {
		let isBorderBox = CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === "border-box";

		if (isBorderBox === (wantInner || false)) {
			/* in box-sizing mode, the CSS width / height accessors already give the outerWidth / outerHeight. */
			let i: number,
				value: number,
				augment = 0,
				sides = name === "width" ? ["Left", "Right"] : ["Top", "Bottom"],
				fields = ["padding" + sides[0], "padding" + sides[1], "border" + sides[0] + "Width", "border" + sides[1] + "Width"];

			for (i = 0; i < fields.length; i++) {
				value = parseFloat(CSS.getPropertyValue(element, fields[i]) as string);
				if (!isNaN(value)) {
					augment += value;
				}
			}
			return wantInner ? -augment : augment;
		}
		return 0;
	}

	function getDimension(name, wantInner?: boolean) {
		return function (type, element, propertyValue) {
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

	export namespace CSS {

		/*******************
		 Normalizations
		 *******************/

		/**
		 * Normalizations can be replaced by users.
		 */
		export let Normalizations: { [name: string]: VelocityNormalizationsFn } = Object.create(null);

		/**
		 * Used to register a normalization. This should never be called by users
		 * directly, instead it should be called via a Normalizations.
		 *
		 * @private
		 */
		export function registerNormalization(args?: [string, VelocityNormalizationsFn]) {
			let name: string = args[0],
				callback = args[1];

			if (!isString(name)) {
				console.warn("VelocityJS: Trying to set 'registerNormalization' name to an invalid value:", name);
			} else if (!isFunction(callback)) {
				console.warn("VelocityJS: Trying to set 'registerNormalization' callback to an invalid value:", callback);
			} else if (Normalizations[name] && !propertyIsEnumerable(Normalizations, name)) {
				console.warn("VelocityJS: Trying to override internal 'registerNormalization' callback");
			} else {
				Normalizations[name] = callback;
			}
		}

		registerNormalization(["registerNormalization", registerNormalization as any]);

		registerNormalization(["innerWidth", () => getDimension("width", true)]);
		registerNormalization(["innerHeight", () => getDimension("height", true)]);
		registerNormalization(["outerWidth", () => getDimension("width")]);
		registerNormalization(["outerHeight", () => getDimension("height")]);

		//TODO check if needed

		/*****************************
		 Batched Registrations
		 *****************************/

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

		for (let i = 0; i < CSS.Lists.transformsBase.length; i++) {
			/* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
             paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */

			let transformName = CSS.Lists.transformsBase[i];

			let genericMethod = function (type, element, propertyValue) {
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
						let invalid = false;

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
			}

			registerNormalization([transformName, genericMethod]);
		}
	}
}
