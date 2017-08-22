var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.test("Begin", function(assert) {
	var done = assert.async(1),
			$targetSet = [getTarget(), getTarget()];

	assert.expect(1);
	Velocity($targetSet, defaultProperties, {
		duration: asyncCheckDuration,
		begin: function() {
			assert.deepEqual(this, $targetSet, "Elements passed into callback.");
			done();
		}
	});
});
