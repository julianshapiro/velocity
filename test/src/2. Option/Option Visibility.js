var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.todo("Visibility", function(assert) {
	var done = assert.async(4),
			testVisibilityBlock = "visible",
			testVisibilityNone = "hidden",
			testVisibilityBlank = "";

	var $target1 = getTarget();
	/* Async checks are used since the visibility property is set inside processCallsTick(). */
	Velocity($target1, defaultProperties, {visibility: testVisibilityBlock});
	setTimeout(function() {
		assert.equal(Velocity.CSS.getPropertyValue($target1, "visibility"), testVisibilityBlock, "visibility:'visible' was set immediately.");

		done();
	}, asyncCheckDuration);

	var $target2 = getTarget();
	Velocity($target2, defaultProperties, {visibility: testVisibilityNone});
	setTimeout(function() {
		assert.notEqual(Velocity.CSS.getPropertyValue($target2, "visibility"), 0, "visibility:'hidden' was not set immediately.");

		done();
	}, asyncCheckDuration);

	setTimeout(function() {
		assert.equal(Velocity.CSS.getPropertyValue($target2, "visibility"), "hidden", "visibility:'hidden' was set upon completion.");

		done();
	}, completeCheckDuration);

	var $target3 = getTarget();
	Velocity($target3, defaultProperties, {display: testVisibilityBlank});
	setTimeout(function() {
		assert.equal(/visible|inherit/.test(Velocity.CSS.getPropertyValue($target3, "visibility")), true, "visibility:'' was set immediately.");

		done();
	}, completeCheckDuration);
});
