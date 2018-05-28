/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity, {VelocityResult} from "velocity-animate";
import {defaultOptions, defaultProperties, getNow, getTarget} from "../utilities";
import "./_module";

QUnit.test("Promises", (assert) => {
	const done = assert.async(10),
		start = getNow();
	let result: VelocityResult;

	assert.expect(10);

	/**********************
	 Invalid Arguments
	 **********************/

	((Velocity as any)() as Promise<any>)
		.then(() => {
			assert.notOk(true, "Calling with no arguments should reject a Promise.");
		}, () => {
			assert.ok(true, "Calling with no arguments should reject a Promise.");
		})
		.then(done);

	Velocity(getTarget() as any)
		.then(() => {
			assert.notOk(true, "Calling with no properties should reject a Promise.");
		}, () => {
			assert.ok(true, "Calling with no properties should reject a Promise.");
		})
		.then(done);

	Velocity(getTarget(), {})
		.then(() => {
			assert.ok(true, "Calling with empty properties should not reject a Promise.");
		}, () => {
			assert.notOk(true, "Calling with empty properties should not reject a Promise.");
		})
		.then(done);

	Velocity(getTarget(), {}, defaultOptions.duration)
		.then(() => {
			assert.ok(true, "Calling with empty properties + duration should not reject a Promise.");
		}, () => {
			assert.notOk(true, "Calling with empty properties + duration should not reject a Promise.");
		})
		.then(done);

	/* Invalid arguments: Ensure an error isn't thrown. */
	Velocity(getTarget(), {} as any, "fakeArg1", "fakeArg2")
		.then(() => {
			assert.ok(true, "Calling with invalid arguments should reject a Promise.");
		}, () => {
			assert.notOk(true, "Calling with invalid arguments should reject a Promise.");
		})
		.then(done);

	result = Velocity(getTarget(), defaultProperties, defaultOptions);
	result
		.then((elements) => {
			assert.equal(elements.length, 1, "Calling with a single element fulfills with a single element array.");
		}, () => {
			assert.ok(false, "Calling with a single element fulfills with a single element array.");
		})
		.then(done);
	result.velocity(defaultProperties)
		.then((elements) => {
			assert.ok(getNow() - start > 2 * (defaultOptions.duration as number), "Queued call fulfilled after correct delay.");
		}, () => {
			assert.ok(false, "Queued call fulfilled after correct delay.");
		})
		.then(done);

	result = Velocity([getTarget(), getTarget()], defaultProperties, defaultOptions);
	result
		.then((elements) => {
			assert.equal(elements.length, 2, "Calling with multiple elements fulfills with a multiple element array.");
		}, () => {
			assert.ok(false, "Calling with multiple elements fulfills with a multiple element array.");
		})
		.then(done);

	const anim = Velocity(getTarget(), defaultProperties, defaultOptions);

	anim
		.then(() => {
			assert.ok(getNow() - start < (defaultOptions.duration as number), "Stop call fulfilled after correct delay.");
		}, () => {
			assert.ok(false, "Stop call fulfilled after correct delay.");
		})
		.then(done);
	anim.velocity("stop");

	Promise
		.all([
			Velocity(getTarget(), defaultProperties, defaultOptions).promise,
			Velocity(getTarget(), defaultProperties, defaultOptions).promise,
		])
		.then(() => {
			assert.ok(true, "Promise.all fulfilled when all animations have finished.");
		})
		.then(done);
});
