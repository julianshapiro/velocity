/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import {asyncTests, asyncCheckDuration, defaultProperties, getTarget} from "../app";
import "./_module";
import {Velocity} from "../../../index.d";

QUnit.test("Complete", function(assert) {
	asyncTests(assert, 1, function(done) {
		const $targetSet = [getTarget(), getTarget()];

		Velocity($targetSet, defaultProperties, {
			duration: asyncCheckDuration,
			complete: function() {
				assert.deepEqual(this, $targetSet, "Elements passed into callback.");
				done();
			}
		});
	});

	assert.expect(asyncTests());
});
