///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Easing", function(assert) {
	var done = assert.async(3),
		success;

	assert.expect(5);
	/* Ensure that a fake easing doesn't throw an error. */
	try {
		success = true;
		Velocity(getTarget(), defaultProperties, {easing: "fake"});
	} catch (e) {
		success = false;
	}
	assert.ok(success, "Fake easing string didn't throw error.");

	/* Ensure that an improperly-formmated bezier curve array doesn't throw an error. */
	try {
		success = true;
		Velocity(getTarget(), defaultProperties, {easing: ["a" as any, 0.5, 0.5, 0.5]});
		Velocity(getTarget(), defaultProperties, {easing: [0.5, 0.5, 0.5]});
	} catch (e) {
		success = false;
	}
	assert.ok(success, "Invalid bezier curve didn't throw error.");

	/* Ensure that a properly-formatted bezier curve array returns a bezier function. */
	var easingBezierArray = [0.27, -0.65, 0.78, 0.19],
		easingBezierTestPercent = 0.25,
		easingBezierTestValue = -0.23;

	Velocity(getTarget(), defaultProperties, {
		easing: easingBezierArray,
		begin: function(elements, animation) {
			assert.close(animation.options.easing(easingBezierTestPercent, 0, 1), easingBezierTestValue, 0.005, "Array converted into bezier function.");
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
			assert.close(animation.options.easing(easingSpringRK4TestPercent, 0, 1), easingSpringRK4TestValue, 10, "Array with duration converted into springRK4 function.");
			done();
		}
	});

	// TODO: Get this working in Velocity - so it can be tested
	//	Velocity(getTarget(), defaultProperties, {
	//		easing: easingSpringRK4Array,
	//		begin: function(elements, animation) {
	//			assert.equal(animation.duration, easingSpringRK4TestDuration, "Array without duration converted into springRK4 duration.");
	//			done();
	//		}
	//	});

	/* Ensure that a properly-formatted step easing array returns a step function. */
	var easingStepArray = [4],
		easingStepTestPercent = 0.35,
		easingStepTestValue = 0.25;

	Velocity(getTarget(), defaultProperties, {
		easing: easingStepArray,
		begin: function(elements, animation) {
			assert.close(animation.options.easing(easingStepTestPercent, 0, 1), easingStepTestValue, 0.05, "Array converted into Step function.");
			done();
		}
	});
});
