var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.todo("'velocity-animating' Classname", function(assert) {
	var done = assert.async(2),
			$target1 = getTarget();

	Velocity($target1, defaultProperties, function(element) {
		assert.equal(/velocity-animating/.test($target1.className), false, "Class removed.");
		done();
	});

	setTimeout(function() {
		assert.equal(/velocity-animating/.test($target1.className), true, "Class added.");

		done();
	}, asyncCheckDuration);
});
