/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {asyncTests, defaultProperties, getTarget, sleep} from "../utilities";
import "./_module";

QUnit.test("Sync", (assert) => {
	asyncTests(assert, 1, async (done) => {
		const $target = getTarget(),
			$targetSet = [getTarget(), $target, getTarget()];
		let complete = false;

		Velocity($target, defaultProperties, {
			duration: 300,
			complete() {
				complete = true;
			},
		});
		Velocity($targetSet, defaultProperties, {
			sync: false,
			duration: 250,
		});
		await sleep(275);
		assert.notOk(complete, "Sync 'false' animations don't wait for completion.");

		done();
	});

	asyncTests(assert, 1, async (done) => {
		const $target = getTarget(),
			$targetSet = [getTarget(), $target, getTarget()];
		let complete = false;

		Velocity($target, defaultProperties, {
			duration: 300,
			complete() {
				complete = true;
			},
		});
		Velocity($targetSet, defaultProperties, {
			sync: true,
			duration: 250,
			begin() {
				assert.ok(complete, "Sync 'true' animations wait for completion.");

				done();
			},
		});
	});

	assert.expect(asyncTests());
});
