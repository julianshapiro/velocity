/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {asyncTests, defaultOptions, defaultProperties, getNow, getTarget} from "../utilities";
import "./_module";

QUnit.test("Duration", (assert) => {
	const testDuration = Velocity.defaults.duration as number;

	asyncTests(assert, 1, (done) => {
		const start = getNow();

		Velocity(getTarget(), defaultProperties, {
			duration: testDuration,
			complete(elements, activeCall) {
				const time = getNow() - start;

				assert.close(time, testDuration, 32, `Calls run for the correct duration (~${Math.floor(time)}ms / ${testDuration}ms).`);

				done();
			},
		});
	});

	asyncTests(assert, 1, (done) => {
		const start = getNow();

		Velocity(getTarget(), {width: ["200px", "500px"]}, {
			duration: testDuration,
		})
			.velocity({width: ["500px", "200px"]}, {
				duration: testDuration,
				complete(elements, activeCall) {
					const time = getNow() - start;

					assert.close(getNow() - start, testDuration * 2, 32, `Chained durations run for the correct duration (~${Math.floor(time)}ms / ${testDuration * 2}ms).`);

					done();
				},
			});
	});

	asyncTests(assert, 1, (done) => {
		const start = getNow();

		Velocity(getTarget(), {width: ["200px", "500px"]})
			.velocity({width: ["500px", "200px"]})
			.then(() => {
				const time = getNow() - start;

				assert.close(getNow() - start, testDuration * 2, 32, `Chained durations with defaults run for the correct duration (~${Math.floor(time)}ms / ${testDuration * 2}ms).`);

				done();
			});
	});

	assert.expect(asyncTests());
});
