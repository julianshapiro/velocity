/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import {asyncTests, defaultOptions, defaultProperties, getNow, getTarget} from "../app";
import "./_module";
import {Velocity} from "../../../index.d";

QUnit.test("Delay", function(assert) {
	const testDelay = 250;

	asyncTests(assert, 1, function(done) {
		const start = getNow();

		Velocity(getTarget(), defaultProperties, {
			duration: defaultOptions.duration,
			delay: testDelay,
			begin: function(elements, activeCall) {
				assert.close(getNow() - start, testDelay, 32, "Delayed calls start after the correct delay.");
				done();
			}
		});
	});

	asyncTests(assert, 1, function(done) {
		const start = getNow();

		Velocity(getTarget(), defaultProperties, {
			duration: defaultOptions.duration,
			delay: testDelay
		})
			.velocity(defaultProperties, {
				duration: defaultOptions.duration,
				delay: testDelay,
				begin: function(elements, activeCall) {
					assert.close(getNow() - start, (testDelay * 2) + (defaultOptions.duration as number), 32, "Queued delays start after the correct delay.");
					done();
				}
			});
	});

	assert.expect(asyncTests());
});
