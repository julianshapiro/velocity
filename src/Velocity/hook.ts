namespace VelocityStatic {
	/* A parallel to jQuery's $.css(), used for getting/setting Velocity's hooked CSS properties. */
	export function hook(elements: HTMLorSVGElement[], arg2, arg3) {
		var value;

		elements = sanitizeElements(elements);

		elements.forEach(function(element) {
			/* Initialize Velocity's per-element data cache if this element hasn't previously been animated. */
			if (Data(element) === undefined) {
				VelocityStatic.init(element);
			}

			/* Get property value. If an element set was passed in, only return the value for the first element. */
			if (arg3 === undefined) {
				if (value === undefined) {
					value = VelocityStatic.CSS.getPropertyValue(element, arg2);
				}
				/* Set property value. */
			} else {
				/* sPV returns an array of the normalized propertyName/propertyValue pair used to update the DOM. */
				var adjustedSet = VelocityStatic.CSS.setPropertyValue(element, arg2, arg3, 1);

				/* Transform properties don't automatically set. They have to be flushed to the DOM. */
				if (adjustedSet[0] === "transform") {
					VelocityStatic.CSS.flushTransformCache(element);
				}

				value = adjustedSet;
			}
		});

		return value;
	};
};
