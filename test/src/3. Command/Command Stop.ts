///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Stop", async function(assert) {
	async(assert, 1, function(done) {
		Velocity(getTarget(), "stop");
		assert.ok(true, "Calling on an element that isn't animating doesn't cause an error.");

		done();
	});

	async(assert, 1, function(done) {
		const $target = getTarget();

		Velocity($target, defaultProperties, defaultOptions);
		Velocity($target, {top: 0}, defaultOptions);
		Velocity($target, {width: 0}, defaultOptions);
		Velocity($target, "stop");
		assert.ok(true, "Calling on an element that is animating doesn't cause an error.");

		done();
	});

	async(assert, 1, async function(done) {
		const $target = getTarget(),
			startOpacity = getPropertyValue($target, "opacity");

		Velocity($target, {opacity: [0, 1]}, defaultOptions);
		await sleep(defaultOptions.duration as number / 2);
		Velocity($target, "stop");
		assert.close(parseFloat(getPropertyValue($target, "opacity")), parseFloat(startOpacity) / 2, 0.1, "Animation runs until stopped.");

		done();
	});

	async(assert, 1, async function(done) {
		const $target = getTarget();
		let begin = false;

		Velocity($target, {opacity: [0, 1]}, {
			delay: 1000,
			begin: () => {begin = true}
		});
		await sleep(500);
		Velocity($target, "stop");
		assert.notOk(begin, "Stop animation before delay ends.");

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
		Velocity($target, "stop", "test1");
		await sleep(defaultOptions.duration as number * 2);
		assert.ok(complete2, "Stop animation with correct queue.");
		assert.notOk(complete1, "Don't stop animation with wrong queue.");

		done();
	});

	async(assert, 1, async function(done) {
		const $target = getTarget();
		let begin1 = false,
			begin2 = false;

		Velocity($target, {opacity: [0, 1]}, {
			begin: () => {begin1 = true}
		});
		Velocity($target, {width: "500px"}, {
			begin: () => {begin2 = true}
		});
		Velocity($target, "stop", true);
		await sleep(defaultOptions.duration as number * 2);
		assert.notOk(begin1 || begin2, "Stop 'true' stops all animations.");

		done();
	});

	async(assert, 2, async function(done) {
		const $target = getTarget(),
			anim = Velocity($target, {opacity: [0, 1]}, {
				queue: "test",
				begin: () => {begin1 = true}
			});
		let begin1 = false,
			begin2 = false;

		Velocity($target, {opacity: [0, 1]}, {
			begin: () => {begin2 = true}
		});
		anim.velocity("stop");
		await sleep(defaultOptions.duration as number * 2);
		assert.notOk(begin1, "Stop without arguments on a chain stops chain animations.");
		assert.ok(begin2, "Stop without arguments on a chain doesn't stop other animations.");

		done();
	});

	assert.expect(async());
});
