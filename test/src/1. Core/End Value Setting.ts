///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.todo("End Value Setting (Note: Browser Tab Must Have Focus Due to rAF)", function(assert) {
	var count = 0
		+ (!(IE < 9) ? 1 : 0)
		+ (!(IE < 10) && !Velocity.State.isGingerbread ? 1 : 0)
		+ (!Velocity.State.isGingerbread ? 1 : 0),
		done = assert.async(count);

	/* Transforms and the properties that are hooked by Velocity aren't supported below IE9. */
	if (!(IE < 9)) {
		var testHooks = {
			boxShadowBlur: "10px", // "black 0px 0px 10px 0px"
			boxShadowSpread: "20px", // "black 0px 0px 0px 20px"
			textShadowBlur: "30px" // "black 0px 0px 30px"
		};

		/* Hooks. */
		var $target3 = getTarget();
		Velocity($target3, testHooks);
		setTimeout(function() {
			/* Check for a match anywhere in the string since browser differ in where they inject the color value. */
			assert.equal(/0px 0px 10px 20px/.test(Velocity.CSS.getPropertyValue($target3, "boxShadow") as string), true, "Hook end value #1 was set.");
			/* textShadow isn't supported below IE10. */
			if (!IE || IE >= 10) {
				assert.equal(/0px 0px 30px/.test(Velocity.CSS.getPropertyValue($target3, "textShadow") as string), true, "Hook end value #2 was set.");
			}
			done();
		}, completeCheckDuration);

		if (!(IE < 10) && !Velocity.State.isGingerbread) {
			var testTransforms = {
				translateY: "10em", // Should stay the same
				translateX: "20px", // Should stay the same
				scaleX: "1.50", // Should remain unitless
				translateZ: "30", // Should become "10px"
				scaleY: "1.50deg" // Should be ignored entirely since it uses an invalid unit
			},
				testTransformsOutput = "matrix3d(1.5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 20, 160, 30, 1)";

			/* Transforms. */
			var $target4 = getTarget();
			Velocity($target4, testTransforms);
			setTimeout(function() {
				/* Check for a match anywhere in the string since browser differ in where they inject the color value. */
				assert.equal(Velocity.CSS.getPropertyValue($target4, "transform"), testTransformsOutput, "Transform end value was set.");

				/* Ensure previous transform values are reused. */
				Velocity($target4, {translateX: parseFloat(testTransforms.translateX) / 2});
				//				assert.equal(Data($target4).style.translateX.startValue, parseFloat(testTransforms.translateX), "Previous transform value was reused.");
				done();
			}, completeCheckDuration);
		}

		if (!Velocity.State.isGingerbread) {
			/* SVG. */
			var $svgRoot = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
				$svgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect"),
				svgStartValues = {x: 100, y: 10, width: 250, height: "30%"},
				svgEndValues = {x: 200, width: "50%", strokeDasharray: 10, height: "40%", rotateZ: "90deg", rotateX: "45deg"};

			$svgRoot.setAttribute("width", String(1000));
			$svgRoot.setAttribute("height", String(1000));

			$svgRect.setAttribute("x", String(svgStartValues.x));
			$svgRect.setAttribute("y", String(svgStartValues.y));
			$svgRect.setAttribute("width", String(svgStartValues.width));
			$svgRect.setAttribute("height", String(svgStartValues.height));

			$svgRoot.appendChild($svgRect);
			$qunitStage.appendChild($svgRoot);

			Velocity($svgRect, svgEndValues, defaultOptions);
			//			setTimeout(function() {
			//				assert.equal(Math.round(Data($svgRect).style.x.startValue), svgStartValues.x, "SVG dimensional attribute #1 value was retrieved.");
			//				assert.equal(Math.round(parseFloat(Velocity.CSS.getPropertyValue($svgRect, "x"))), svgEndValues.x, "SVG dimensional attribute #1 end value was set.");
			//
			//				assert.equal(Math.round(Data($svgRect).style.width.startValue), parseFloat(svgStartValues.width) / 1000 * 100, "SVG dimensional attribute #2 value was retrieved.");
			//				assert.equal(Math.round(parseFloat(Velocity.CSS.getPropertyValue($svgRect, "width"))), parseFloat(svgEndValues.width) / 100 * 1000, "SVG dimensional attribute #2 end value was set.");
			//
			//				assert.equal(Math.round(Data($svgRect).style.height.startValue), parseFloat(svgStartValues.height), "SVG dimensional attribute #3 value was retrieved.");
			//				assert.equal(Math.round(parseFloat(Velocity.CSS.getPropertyValue($svgRect, "height"))), parseFloat(svgEndValues.height) / 100 * 1000, "SVG dimensional attribute #3 end value was set.");
			//
			//				assert.equal(Math.round(Data($svgRect).style.rotateZ.startValue), 0, "SVG 2D transform value was retrieved.");
			//				assert.equal(Math.round(parseFloat(Velocity.CSS.getPropertyValue($svgRect, "rotateZ"))), parseFloat(svgEndValues.rotateZ), "SVG 2D transform end value was set.");
			//
			//				if (!IE) {
			//					assert.equal(Math.round(Data($svgRect).style.rotateX.startValue), 0, "SVG 3D transform value was retrieved.");
			//					assert.equal(Math.round(parseFloat(Velocity.CSS.getPropertyValue($svgRect, "rotateX"))), parseFloat(svgEndValues.rotateX), "SVG 3D transform end value was set.");
			//				}
			//
			//				assert.equal(Math.round(Data($svgRect).style.strokeDasharray.startValue), 0, "SVG CSS style value was retrieved.");
			//				assert.equal(parseFloat(Velocity.CSS.getPropertyValue($svgRect, "strokeDasharray")), svgEndValues.strokeDasharray, "SVG CSS style end value was set.");
			//				done();
			//			}, completeCheckDuration);
		}
	}

	/* Standard properties. */
	var $target1 = getTarget();
	Velocity($target1, defaultProperties, {});
	setTimeout(function() {
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "width") as string), defaultProperties.width, "Standard end value #1 was set.");
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "opacity") as string), defaultProperties.opacity, "Standard end value #2 was set.");

		done();
	}, completeCheckDuration);
});
