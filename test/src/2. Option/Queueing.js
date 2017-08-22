var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.test("Queueing", function(assert) {
	var done = assert.async(1),
			$target1 = getTarget();

	assert.expect(1);
	Velocity($target1, {opacity: 0});
	Velocity($target1, {width: 2});

	setTimeout(function() {
		/* Ensure that the second call hasn't started yet. */
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "width")), defaultStyles.width, "Queued calls chain.");

		done();
	}, asyncCheckDuration);
});
