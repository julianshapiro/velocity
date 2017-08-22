var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.test("Progress", function(assert) {
	var done = assert.async(1),
			$target = getTarget();

	assert.expect(3);
	Velocity($target, defaultProperties, {
		duration: asyncCheckDuration,
		progress: once(function(elements, percentComplete, msRemaining) {
			assert.deepEqual(this, [$target], "Elements passed into progress.");
			assert.equal(percentComplete >= 0 && percentComplete <= 1, true, "percentComplete passed into progress.");
			assert.equal(msRemaining > asyncCheckDuration - 50, true, "msRemaining passed into progress.");
			done();
		})
	});
});
