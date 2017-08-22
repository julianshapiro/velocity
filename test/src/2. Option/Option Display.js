var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.todo("Display", function(assert) {
	var done = assert.async(4),
			testDisplayBlock = "block",
			testDisplayNone = "none",
			testDisplayBlank = "";

	var $target1 = getTarget();
	/* Async checks are used since the display property is set inside processCallsTick(). */
	Velocity($target1, defaultProperties, {display: testDisplayBlock});
	setTimeout(function() {
		assert.equal(Velocity.CSS.getPropertyValue($target1, "display"), testDisplayBlock, "Display:'block' was set immediately.");
		done();
	}, asyncCheckDuration);

	var $target2 = getTarget();
	Velocity($target2, defaultProperties, {display: testDisplayNone});
	setTimeout(function() {
		assert.notEqual(Velocity.CSS.getPropertyValue($target2, "display"), 0, "Display:'none' was not set immediately.");
		done();
	}, asyncCheckDuration);

	setTimeout(function() {
		assert.equal(Velocity.CSS.getPropertyValue($target2, "display"), 0, "Display:'none' was set upon completion.");
		done();
	}, completeCheckDuration);

	var $target3 = getTarget();
	Velocity($target3, defaultProperties, {display: testDisplayBlank});
	setTimeout(function() {
		assert.equal(Velocity.CSS.getPropertyValue($target3, "display"), "block", "Display:'' was set immediately.");

		done();
	}, completeCheckDuration);
});
