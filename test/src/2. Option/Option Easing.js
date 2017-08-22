var QUnit, Velocity, Data, defaultOptions, defaultProperties, defaultStyles, asyncCheckDuration, completeCheckDuration;

QUnit.test("Easing", function(assert) {
	var done = assert.async(4),
			success;

	assert.expect(6);
	/* Ensure that a fake easing doesn't throw an error. */
	try {
		success = true;
		Velocity(getTarget(), defaultProperties, {easing: "fake"});
	} catch (e) {
		success = false;
	}
	assert.ok(success, "Fake easing didn't throw error.");

	/* Ensure that an improperly-formmated bezier curve array doesn't throw an error. */
	try {
		success = true;
		Velocity(getTarget(), defaultProperties, {easing: ["a", 0.5, 0.5, 0.5]});
		Velocity(getTarget(), defaultProperties, {easing: [0.5, 0.5, 0.5]});
	} catch (e) {
		success = false;
	}
	assert.ok(success, "Invalid bezier curve didn't throw error.");

	/* Ensure that a properly-formatted bezier curve array returns a bezier function. */
	var easingBezierArray = [0.27, -0.65, 0.78, 0.19],
			easingBezierTestPercent = 0.25,
			easingBezierTestValue = /^-0\.23/;

	Velocity(getTarget(), defaultProperties, {
		easing: easingBezierArray,
		begin: function(elements, animation) {
			assert.equal(easingBezierTestValue.test(animation.easing(easingBezierTestPercent)), true, "Array converted into bezier function.");
			done();
		}
	});

	/* Ensure that a properly-formatted spring RK4 array returns a bezier function. */
	var easingSpringRK4Array = [250, 12],
			easingSpringRK4TestPercent = 0.25,
			easingSpringRK4TestValue = 0.928, // TODO: Check accuracy
			easingSpringRK4TestDuration = 992;

	Velocity(getTarget(), defaultProperties, {
		duration: 150,
		easing: easingSpringRK4Array,
		begin: function(elements, animation) {
			assert.closePercent(animation.easing(easingSpringRK4TestPercent), easingSpringRK4TestValue, 10, "Array with duration converted into springRK4 function.");
			done();
		}
	});
	Velocity(getTarget(), defaultProperties, {
		easing: easingSpringRK4Array,
		begin: function(elements, animation) {
			assert.equal(animation.easing, easingSpringRK4TestDuration, "Array without duration converted into springRK4 duration.");
			done();
		}
	});

	/* Ensure that a properly-formatted step easing array returns a step function. */
	var easingStepArray = [4],
			easingStepTestPercent = 0.35,
			easingStepTestValue = /^0\.25/;

	Velocity(getTarget(), defaultProperties, {
		easing: easingStepArray,
		begin: function(elements, animation) {
			assert.equal(easingStepTestValue.test(animation.easing(easingStepTestPercent)), true, "Array converted into Step function.");
			done();
		}
	});
});
