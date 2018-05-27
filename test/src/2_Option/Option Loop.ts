/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {asyncTests, defaultProperties, getNow, getTarget} from "../utilities";
import "./_module";

QUnit.test("Loop", (assert) => {
	asyncTests(assert, 4, (done) => {
		const testOptions = {loop: 2, delay: 100, duration: 100},
			start = getNow();
		let begin = 0,
			complete = 0,
			loop = 0,
			lastPercentComplete = 2;

		Velocity(getTarget(), defaultProperties,
			{
				loop: testOptions.loop,
				delay: testOptions.delay,
				duration: testOptions.duration,
				begin() {
					begin++;
				},
				progress(elements, percentComplete) {
					if (lastPercentComplete > percentComplete) {
						loop++;
					}
					lastPercentComplete = percentComplete;
				},
				complete() {
					complete++;
				},
			})
			.then(() => {
				assert.equal(begin, 1, "Begin callback only called once.");
				assert.equal(loop, testOptions.loop * 2 - 1, "Animation looped correct number of times (once each direction per loop).");
				assert.close(getNow() - start, (testOptions.delay + testOptions.duration) * loop, 32, "Looping with 'delay' has correct duration.");
				assert.equal(complete, 1, "Complete callback only called once.");

				done();
			});
	});

	assert.expect(asyncTests());
});
