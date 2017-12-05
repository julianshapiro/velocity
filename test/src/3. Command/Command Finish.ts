///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Finish", async (assert) => {
	async(assert, 1, function(done) {
		Velocity(getTarget(), "finish");
		assert.ok(true, "Calling on an element that isn't animating doesn't cause an error.");

		done();
	});

	async(assert, 1, function(done) {
		const $target = getTarget();

		Velocity($target, defaultProperties, defaultOptions);
		Velocity($target, {top: 0}, defaultOptions);
		Velocity($target, {width: 0}, defaultOptions);
		Velocity($target, "finish");
		assert.ok(true, "Calling on an element that is animating doesn't cause an error.");

		done();
	});

	async(assert, 2, async function(done) {
		const $target = getTarget();
		let complete1 = false,
			complete2 = false;

		Velocity($target, {opacity: [0, 1]}, {
			queue: "test1",
			complete: () => {complete1 = true}
		});
		Velocity($target, {opacity: [0, 1]}, {
			queue: "test2",
			complete: () => {complete2 = true}
		});
		Velocity($target, "finish", "test1");
		await sleep(defaultOptions.duration as number / 2);
		assert.ok(complete1, "Finish animation with correct queue.");
		assert.notOk(complete2, "Don't finish animation with wrong queue.");

		done();
	});

	async(assert, 3, async function(done) {
		const $target = getTarget();
		let begin = false,
			complete = false;

		Velocity($target, {opacity: [0, 1]}, {
			begin: () => {begin = true},
			complete: () => {complete = true}
		});
		await sleep(500);
		Velocity($target, "finish");
		assert.ok(begin, "Finish calls 'begin()' callback without delay.");
		assert.ok(complete, "Finish calls 'complete()' callback without delay.");
		assert.equal(getPropertyValue($target, "opacity"), "0", "Finish animation with correct value.");

		done();
	});

	async(assert, 3, async function(done) {
		const $target = getTarget();
		let begin = false,
			complete = false;

		Velocity($target, {opacity: [0, 1]}, {
			delay: 1000,
			begin: () => {begin = true},
			complete: () => {complete = true}
		});
		await sleep(500);
		Velocity($target, "finish");
		assert.ok(begin, "Finish calls 'begin()' callback with delay.");
		assert.ok(complete, "Finish calls 'complete()' callback with delay.");
		assert.equal(getPropertyValue($target, "opacity"), "0", "Finish animation with correct value before delay ends.");

		done();
	});

	async(assert, 3, async function(done) {
		const $target = getTarget();

		Velocity($target, {opacity: 0})
			.velocity({opacity: 1})
			.velocity({opacity: 0.25})
			.velocity({opacity: 0.75})
			.velocity({opacity: 0.5});
		Velocity($target, "finish");
		assert.equal(getPropertyValue($target, "opacity"), "0", "Finish once starts the second animation.");
		Velocity($target, "finish");
		assert.equal(getPropertyValue($target, "opacity"), "1", "Finish twice starts the third animation.");
		Velocity($target, "finish", true);
		assert.equal(getPropertyValue($target, "opacity"), "0.5", "Finish 'true' finishes all animations.");

		done();
	});

	assert.expect(async());
});
