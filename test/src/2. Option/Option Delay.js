var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.test("Delay (Note: Browser Tab Must Have Focus Due to rAF)", function(assert) {
	var done = assert.async(2),
			testDelay = 250,
			$target = getTarget(),
			now = Date.now();

	assert.expect(2);
	Velocity($target, defaultProperties, {
		delay: testDelay,
		begin: function(elements, activeCall) {
			assert.close(Date.now() - now, testDelay, 32, "Delayed calls start after the correct delay");
			done();
		}
	});
	Velocity($target, defaultProperties, {
		delay: testDelay,
		begin: function(elements, activeCall) {
			assert.close(Date.now() - now, (testDelay * 2) + defaultOptions.duration, 70, "Queued delays start after the correct delay");
			done();
		}
	});
});
