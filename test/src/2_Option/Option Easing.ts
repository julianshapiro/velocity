/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity, {VelocityResult} from "velocity-animate";
import {asyncCheckDuration, asyncTests, defaultProperties, getTarget, once} from "../utilities";
import "./_module";

QUnit.test("Easing", (assert) => {
	asyncTests(assert, 1, (done) => {
		let success = false;

		try {
			success = true;
			Velocity(getTarget(), defaultProperties, {easing: "fake"});
		} catch (e) {
			success = false;
		}
		assert.ok(success, "Fake easing string didn't throw error.");

		done();
	});

	asyncTests(assert, 1, (done) => {
		let success = false;

		try {
			success = true;
			Velocity(getTarget(), defaultProperties, {easing: ["a" as any, 0.5, 0.5, 0.5]});
			Velocity(getTarget(), defaultProperties, {easing: [0.5, 0.5, 0.5]});
		} catch (e) {
			success = false;
		}
		assert.ok(success, "Invalid bezier curve didn't throw error.");

		done();
	});

	asyncTests(assert, 1, (done) => {
		// TODO: Use a "tween" action?
		/* Ensure that a properly-formatted bezier curve array returns a bezier function. */
		const easingBezierArray = [0.27, -0.65, 0.78, 0.19],
			easingBezierTestPercent = 0.25,
			easingBezierTestValue = -0.23;

		Velocity(getTarget(), defaultProperties, {
			easing: easingBezierArray,
			begin(elements, animation) {
				assert.close(animation.options.easing(easingBezierTestPercent, 0, 1), easingBezierTestValue, 0.005, "Array converted into bezier function.");

				done();
			},
		});
	});

	asyncTests(assert, 1, (done) => {
		/* Ensure that a properly-formatted spring RK4 array returns a bezier function. */
		const easingSpringRK4Array = [250, 12],
			easingSpringRK4TestPercent = 0.25,
			easingSpringRK4TestValue = 0.928, // TODO: Check accuracy
			easingSpringRK4TestDuration = 992;

		Velocity(getTarget(), defaultProperties, {
			duration: 150,
			easing: easingSpringRK4Array,
			begin(elements, animation) {
				assert.close(animation.options.easing(easingSpringRK4TestPercent, 0, 1), easingSpringRK4TestValue, 10, "Array with duration converted into springRK4 function.");

				done();
			},
		});
	});

	// TODO: Get this working in Velocity - so it can be tested
	//	async(assert, 1, (done) => {
	//	Velocity(getTarget(), defaultProperties, {
	//		easing: easingSpringRK4Array,
	//		begin(elements, animation) {
	//			assert.equal(animation.duration, easingSpringRK4TestDuration, "Array without duration converted into springRK4 duration.");
	//			done();
	//		}
	//	});
	//	});

	asyncTests(assert, 1, (done) => {
		/* Ensure that a properly-formatted step easing array returns a step function. */
		const easingStepArray = [4],
			easingStepTestPercent = 0.35,
			easingStepTestValue = 0.25;

		Velocity(getTarget(), defaultProperties, {
			easing: easingStepArray,
			begin(elements, animation) {
				assert.close(animation.options.easing(easingStepTestPercent, 0, 1), easingStepTestValue, 0.05, "Array converted into Step function.");
				done();
			},
		});
	});

	asyncTests(assert, 3, (done) => {
		Velocity(getTarget(), {opacity: [0, "during", 1]}, {
			duration: asyncCheckDuration,
			begin(elements) {
				assert.equal(elements.velocity("style", "opacity"), 1, "Correct begin value (easing:'during').");
			},
			progress: once((elements: VelocityResult) => {
				assert.equal(elements.velocity("style", "opacity"), 0, "Correct progress value (easing:'during').");
			}),
			complete(elements) {
				assert.equal(elements.velocity("style", "opacity"), 1, "Correct complete value (easing:'during').");

				done();
			},
		});
	});

	asyncTests(assert, 3, (done) => {
		Velocity(getTarget(), {opacity: [0, "at-start", 1]}, {
			duration: asyncCheckDuration,
			begin(elements) {
				assert.equal(elements.velocity("style", "opacity"), 1, "Correct begin value (easing:'at-start').");
			},
			progress: once((elements: VelocityResult) => {
				assert.equal(elements.velocity("style", "opacity"), 0, "Correct progress value (easing:'at-start').");
			}),
			complete(elements) {
				assert.equal(elements.velocity("style", "opacity"), 0, "Correct complete value (easing:'at-start').");

				done();
			},
		});
	});

	asyncTests(assert, 3, (done) => {
		Velocity(getTarget(), {opacity: [0, "at-end", 1]}, {
			duration: asyncCheckDuration,
			begin(elements) {
				assert.equal(elements.velocity("style", "opacity"), 1, "Correct begin value (easing:'at-end').");
			},
			progress: once((elements: VelocityResult) => {
				assert.equal(elements.velocity("style", "opacity"), 1, "Correct progress value (easing:'at-end').");
			}),
			complete(elements) {
				assert.equal(elements.velocity("style", "opacity"), 0, "Correct complete value (easing:'at-end').");

				done();
			},
		});
	});

	assert.expect(asyncTests());
});
