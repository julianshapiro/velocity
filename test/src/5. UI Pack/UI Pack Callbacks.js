var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.test("Callbacks", function(assert) {
	var done = assert.async(3),
			$targets = [getTarget(), getTarget()];

	assert.expect(3);
	Velocity($targets, "transition.bounceIn",
			{
				begin: function(elements) {
					assert.deepEqual(elements, $targets, "Begin callback returned.");

					done();
				},
				complete: function(elements) {
					assert.deepEqual(elements, $targets, "Complete callback returned.");

					done();
				}
			}
	).then(function(elements) {
		assert.deepEqual(elements, $targets, "Promise fulfilled.");

		done();
	});
});
