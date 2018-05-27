/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {asyncCheckDuration, asyncTests, defaultProperties, getTarget} from "../utilities";
import "./_module";

QUnit.test("Complete", (assert) => {
	asyncTests(assert, 1, (done) => {
		const $targetSet = [getTarget(), getTarget()];

		Velocity($targetSet, defaultProperties, {
			duration: asyncCheckDuration,
			complete(elements) {
				assert.deepEqual(elements, $targetSet, "Elements passed into callback.");

				done();
			},
		});
	});

	assert.expect(asyncTests());
});
