var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.todo("End Value Calculation", function(assert) {
//	/* Standard properties without operators. */
//	var $target1 = getTarget(),
//			done = assert.async(2);
//
//	Velocity($target1, defaultProperties);
//	setTimeout(function() {
//		assert.equal(Data($target1).style.width.endValue, defaultProperties.width, "Standard end value #1 was calculated.");
//		assert.equal(Data($target1).style.opacity.endValue, defaultProperties.opacity, "Standard end value #2 was calculated.");
//		done();
//	}, asyncCheckDuration);
//
//	/* Standard properties with operators. */
//	var testIncrementWidth = "5px",
//			testDecrementOpacity = 0.25,
//			testMultiplyMarginBottom = 4,
//			testDivideHeight = 2;
//
//	var $target2 = getTarget();
//	Velocity($target2, {width: "+=" + testIncrementWidth, opacity: "-=" + testDecrementOpacity, marginBottom: "*=" + testMultiplyMarginBottom, height: "/=" + testDivideHeight});
//	setTimeout(function() {
//
//		assert.equal(Data($target2).style.width.endValue, defaultStyles.width + parseFloat(testIncrementWidth), "Incremented end value was calculated.");
//		assert.equal(Data($target2).style.opacity.endValue, defaultStyles.opacity - testDecrementOpacity, "Decremented end value was calculated.");
//		assert.equal(Data($target2).style.marginBottom.endValue, defaultStyles.marginBottom * testMultiplyMarginBottom, "Multiplied end value was calculated.");
//		assert.equal(Data($target2).style.height.endValue, defaultStyles.height / testDivideHeight, "Divided end value was calculated.");
//
//		done();
//	}, asyncCheckDuration);
});
