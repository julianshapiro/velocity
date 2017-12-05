///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Pause + Resume", async function(assert) {
	async(assert, 2, function(done) {
		const $target = getTarget();

		Velocity($target, "pause");
		assert.ok(true, "Calling \"pause\" on an element that isn't animating doesn't cause an error.");
		Velocity($target, "resume");
		assert.ok(true, "Calling \"resume\" on an element that isn't animating doesn't cause an error.");

		done();
	});

	async(assert, 4, async function(done) {
		const $target = getTarget();
		let progress = false;

		Velocity($target, {opacity: 0}, {duration: 250, progress: () => {progress = true;}});
		Velocity($target, "pause");
		await sleep(50);
		assert.equal(getPropertyValue($target, "opacity"), "1", "Property value unchanged after pause.");
		assert.notOk(progress, "Progress callback not run during pause.");
		Velocity($target, "resume");
		await sleep(300);
		assert.equal(getPropertyValue($target, "opacity"), "0", "Tween completed after pause/resume.");
		assert.ok(progress, "Progress callback run after pause.");

		done();
	});

	async(assert, 3, async function(done) {
		const $target = getTarget();

		Velocity($target, {opacity: 0}, {duration: 250, delay: 250});
		Velocity($target, "pause");
		await sleep(500);
		assert.equal(getPropertyValue($target, "opacity"), "1", "Delayed property value unchanged after pause.");
		Velocity($target, "resume");
		await sleep(100);
		assert.equal(getPropertyValue($target, "opacity"), "1", "Delayed tween did not start early after pause.");
		await sleep(500);
		assert.equal(getPropertyValue($target, "opacity"), "0", "Delayed tween completed after pause/resume.");

		done();
	});

	async(assert, 1, async function(done) {
		const $target = getTarget();

		Velocity($target, {opacity: 0}, {queue: "test", duration: 250});
		Velocity("pause", "test");
		await sleep(300);
		assert.equal(getPropertyValue($target, "opacity"), "1", "Pause 'queue' works globally.");

		done();
	});

	async(assert, 1, async function(done) {
		const $target = getTarget();

		Velocity($target, {opacity: 0})
			.velocity("pause");
		await sleep(300);
		assert.equal(getPropertyValue($target, "opacity"), "1", "Chained pause only pauses chained tweens.");

		done();
	});

	// TODO: Better global tests, queue: false, named queues

	//	/* Ensure proper behavior with queue:false  */
	//	var $target4 = getTarget();
	//	Velocity($target4, {opacity: 0}, {duration: 200});
	//
	//	var isResumed = false;
	//
	//	await sleep(100);
	//	Velocity($target4, "pause");
	//	Velocity($target4, {left: -20}, {
	//		duration: 100,
	//		easing: "linear",
	//		queue: false,
	//		begin: function(elements) {
	//			assert.ok(true, "Animation with {queue:false} will run regardless of previously paused animations.");
	//		}
	//	});
	//
	//	Velocity($target4, {top: 20}, {
	//		duration: 100,
	//		easing: "linear",
	//		begin: function(elements) {
	//			assert.ok(isResumed, "Queued animation began after previously paused animation completed");
	//		}
	//	});
	//
	//	await sleep(100);
	//
	//	isResumed = true;
	//	Velocity($target4, "resume");
	//	await sleep(100);

	assert.expect(async());
});
