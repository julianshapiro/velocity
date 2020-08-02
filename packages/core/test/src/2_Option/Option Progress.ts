/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {asyncCheckDuration, asyncTests, defaultProperties, getTarget, once} from "../utilities";
import "./_module";

QUnit.test("Progress", (assert) => {
	asyncTests(assert, 4, (done) => {
		const $target = getTarget();

		Velocity($target, defaultProperties, {
			duration: asyncCheckDuration,
			progress: once(function(elements, percentComplete, msRemaining) { // tslint:disable-line:only-arrow-functions
				assert.deepEqual(elements, [$target], "Elements passed into progress.");
				assert.deepEqual(this, [$target], "Elements passed into progress as this."); // tslint:disable-line:no-invalid-this
				assert.equal(percentComplete >= 0 && percentComplete <= 1, true, "'percentComplete' passed into progress.");
				assert.equal(msRemaining > asyncCheckDuration - 50, true, "'msRemaining' passed into progress.");

				done();
			}),
		});
	});

	assert.expect(asyncTests());
});
