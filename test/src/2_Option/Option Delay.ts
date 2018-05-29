/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {asyncTests, defaultOptions, defaultProperties, getNow, getTarget} from "../utilities";
import "./_module";

QUnit.test("Delay", (assert) => {
	const testDelay = 250;

	asyncTests(assert, 1, (done) => {
		const start = getNow();

		Velocity(getTarget(), defaultProperties, {
			duration: defaultOptions.duration,
			delay: testDelay,
			begin(elements, activeCall) {
				assert.close(getNow() - start, testDelay, 32, "Delayed calls start after the correct delay.");

				done();
			},
		});
	});

	asyncTests(assert, 1, (done) => {
		const start = getNow();

		Velocity(getTarget(), defaultProperties, {
			duration: defaultOptions.duration,
			delay: testDelay,
		})
			.velocity(defaultProperties, {
				duration: defaultOptions.duration,
				delay: testDelay,
				begin(elements, activeCall) {
					assert.close(getNow() - start, (testDelay * 2) + (defaultOptions.duration as number), 32, "Chained delays start after the correct delay.");

					done();
				},
			});
	});

	assert.expect(asyncTests());
});
