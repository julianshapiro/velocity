///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Promises", function(assert) {
	let done = assert.async(9),
		result: VelocityResult,
		start = getNow();

	assert.expect(9);

	/**********************
	 Invalid Arguments
	 **********************/

	(Velocity as any)().then(function() {
		assert.notOk(true, "Calling with no arguments should reject a Promise.");
	}, function() {
		assert.ok(true, "Calling with no arguments should reject a Promise.");
	}).then(done);

	Velocity(getTarget() as any).then(function() {
		assert.notOk(true, "Calling with no properties should reject a Promise.");
	}, function() {
		assert.ok(true, "Calling with no properties should reject a Promise.");
	}).then(done);

	Velocity(getTarget(), {}).then(function() {
		assert.ok(true, "Calling with empty properties should not reject a Promise.");
	}, function() {
		assert.notOk(true, "Calling with empty properties should not reject a Promise.");
	}).then(done);

	Velocity(getTarget(), {}, defaultOptions.duration).then(function() {
		assert.ok(true, "Calling with empty properties + duration should not reject a Promise.");
	}, function() {
		assert.notOk(true, "Calling with empty properties + duration should not reject a Promise.");
	}).then(done);

	/* Invalid arguments: Ensure an error isn't thrown. */
	Velocity(getTarget(), {} as any, "fakeArg1", "fakeArg2").then(function() {
		assert.ok(true, "Calling with invalid arguments should reject a Promise.");
	}, function() {
		assert.notOk(true, "Calling with invalid arguments should reject a Promise.");
	}).then(done);

	result = Velocity(getTarget(), defaultProperties, defaultOptions);
	result.then(function(elements) {
		assert.equal(elements.length, 1, "Calling with a single element fulfills with a single element array.");
	}, function() {
		assert.ok(false, "Calling with a single element fulfills with a single element array.");
	}).then(done);
	result.velocity(defaultProperties).then(function(elements) {
		assert.ok(getNow() - start > 2 * (defaultOptions.duration as number), "Queued call fulfilled after correct delay.");
	}, function() {
		assert.ok(false, "Queued call fulfilled after correct delay.");
	}).then(done);

	result = Velocity([getTarget(), getTarget()], defaultProperties, defaultOptions);
	result.then(function(elements) {
		assert.equal(elements.length, 2, "Calling with multiple elements fulfills with a multiple element array.");
	}, function() {
		assert.ok(false, "Calling with multiple elements fulfills with a multiple element array.");
	}).then(done);

	let anim = Velocity(getTarget(), defaultProperties, defaultOptions);

	anim.then(function() {
		assert.ok(getNow() - start < (defaultOptions.duration as number), "Stop call fulfilled after correct delay.");
	}, function() {
		assert.ok(false, "Stop call fulfilled after correct delay.");
	}).then(done);
	anim.velocity("stop");
});
