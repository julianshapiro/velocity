/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {getTarget} from "../utilities";
import "./_module";

QUnit.skip("Callbacks", (assert) => {
	const done = assert.async(2),
		$targets = [getTarget(), getTarget()];

	assert.expect(3);
	Velocity($targets, "transition.bounceIn", {
		begin(elements) {
			assert.deepEqual(elements, $targets, "Begin callback returned.");

			done();
		},
		complete(elements) {
			assert.deepEqual(elements, $targets, "Complete callback returned.");

			done();
		},
		//	}).then(function(elements) {
		//		assert.deepEqual(elements, $targets, "Promise fulfilled.");
		//
		//		done();
	});
});
