var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.todo("Forcefeeding", function(assert) {
	/* Note: Start values are always converted into pixels. W test the conversion ratio we already know to avoid additional work. */
	var testStartWidth = "1rem", testStartWidthToPx = "16px",
			testStartHeight = "10px";

	var $target = getTarget();
	Velocity($target, {width: [100, "linear", testStartWidth], height: [100, testStartHeight], opacity: [defaultProperties.opacity, "easeInQuad"]});

	assert.equal(Data($target).style.width.startValue, parseFloat(testStartWidthToPx), "Forcefed value #1 passed to tween.");
	assert.equal(Data($target).style.height.startValue, parseFloat(testStartHeight), "Forcefed value #2 passed to tween.");
	assert.equal(Data($target).style.opacity.startValue, defaultStyles.opacity, "Easing was misinterpreted as forcefed value.");
});
