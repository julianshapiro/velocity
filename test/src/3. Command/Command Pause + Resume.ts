///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Pause / Resume", async (assert) => {
	var done = assert.async(3),
		$target1 = getTarget(),
		$target1d = getTarget(); //delayed

	assert.expect(12);
	/* Ensure an error isn't thrown when "pause" is called on a $target that isn't animating. */
	Velocity($target1, "pause");
	Velocity($target1d, "pause");

	/* Ensure an error isn't thrown when "pause" is called on a $target that isn't animating. */
	Velocity($target1, "resume");
	Velocity($target1d, "resume");

	/* Ensure a paused $target ceases to animate */
	Velocity($target1, {opacity: 0}, defaultOptions);
	Velocity($target1d, {opacity: 0}, Object.assign({}, defaultOptions, {delay: 200}));

	Velocity($target1, "pause").then(() => {
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "opacity") as string), 1, "Property value unchanged after pause.")
	});

	Velocity($target1d, "pause").then(() => {
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1d, "opacity") as string), 1, "Property value unchanged after pause during delay.")

		done();
	});

	/* Ensure a resumed $target proceeds to animate */
	var $target2 = getTarget();
	var $target2d = getTarget();

	Velocity($target2, {opacity: 0}, defaultOptions);
	Velocity($target2d, {opacity: 0}, Object.assign({}, defaultOptions, {delay: 100}));

	Velocity($target2, "pause");

	Velocity($target2, "resume");

	await sleep(40);

	Velocity($target2d, "pause");

	await sleep(130);
	Velocity($target2d, "resume");
	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target2d, "opacity") as string), 1, "Delayed tween did not start early after pause.");

	await sleep(250);
	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target2, "opacity") as string), 0, "Tween completed after pause/resume.");

	await sleep(100);
	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target2d, "opacity") as string), 0, "Delayed tween completed after pause/resume.");

	/* Ensure the property values of a pause tween are midway between start and end values */
	var $target3 = getTarget(),
		percent = 0,
		isPaused = false;

	Velocity($target3, {opacity: 0}, {
		duration: 200,
		easing: "linear",
		progress: function(elements, _percentComplete, _msRemaining) {
			if (isPaused) {
				console.error("Progress callback run after pause.");
			}
			percent = _percentComplete;
		}
	});

	/* Pause element midway through tween */
	await sleep(100);
	Velocity($target3, "pause");
	isPaused = true;

	await sleep(100);
	Velocity($target3, "resume");
	isPaused = false;

	await sleep(100);
	/* Property value should be linearly proportional to */
	var val = parseFloat(Velocity.CSS.getPropertyValue($target3, "opacity") as string);

	/* Prop value and percentage complete should correlate after pause. We need to test this since
     the timing variables used to calculate and return the percentage complete and msRemaining are
     modified after pause and resume comamands have been issued on the call */
	// TODO: These both had a 2nd argument to the Math.round - 4
	assert.ok(Math.round(1 - val) === Math.round(percent), "Tween value and percentageComplete correlate correctly after pause.");

	/* Ensure only given elements in a call to resumed if given */
	var $targetC = getTarget(), $targetD = getTarget();
	Velocity([$targetC, $targetD], {opacity: 0}, {
		duration: 100,
	}).then(() => {
		//TODO this promise doesn't get resolved
		//assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetD, "opacity") as string), 0, "Should be 1");
		//assert.notEqual(parseFloat(Velocity.CSS.getPropertyValue($targetC, "opacity") as string), 0, "Should be 0");
	});

	Velocity($targetC, "pause");
	Velocity($targetD, "pause");

	// resume first element
	await sleep(50);
	Velocity($targetC, "resume");

	//TODO this is resolved instead of the promise. Should remove and use it inside of then() above
	await sleep(150);
	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetD, "opacity") as string), 1, "Second tween animation must have not started when pausing both elements and resuming first tween.");
	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetC, "opacity") as string), 0, "First tween animation must be completed when pausing both elements and resuming only first tween.");

	// Testing named queue for both elements
	var $targetA = getTarget(), $targetB = getTarget();
	Velocity([$targetA, $targetB], {opacity: 0}, {
		queue: "test",
		duration: 100,
	}).then(() => {
		//assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetB, "opacity") as string), 0, "Second tween animation finished when pausing the first tween being in same queue");
		//assert.notEqual(parseFloat(Velocity.CSS.getPropertyValue($targetA, "opacity") as string), 0, "First tween should have animated opacity since it isn't paused being in same queue");
	});

	Velocity($targetA, "pause", "test");

	/* Ensure only given elements in a call to resumed if given with queue */
	var $targetC = getTarget(), $targetD = getTarget();
	Velocity([$targetC, $targetD], {opacity: 0}, {
		queue: "test",
		duration: 100,
	}).then(() => {
		//TODO this promise doesn't get resolved
		//assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetD, "opacity") as string), 0, "Should be 1");
		//assert.notEqual(parseFloat(Velocity.CSS.getPropertyValue($targetC, "opacity") as string), 0, "Should be 0");
	});

	Velocity($targetC, "pause", "test");
	Velocity($targetD, "pause", "test");

	// resume first element
	await sleep(50);
	Velocity($targetC, "resume", "test");

	//TODO this is resolved instead of the promise. Should remove and use it inside of then() above
	await sleep(150);
	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetD, "opacity") as string), 1, "Second tween animation must have not started when pausing both elements and resuming first tween when in same queue.");
	assert.equal(parseFloat(Velocity.CSS.getPropertyValue($targetC, "opacity") as string), 0, "First tween animation must be completed when pausing both elements and resuming only first tween when in same queue.");

	/* Ensure proper behavior with queue:false  */
	var $target4 = getTarget();
	Velocity($target4, {opacity: 0}, {duration: 200});

	var isResumed = false;

	sleep(100);
	Velocity($target4, "pause");
	Velocity($target4, {left: -20}, {
		duration: 100,
		easing: "linear",
		queue: false,
		begin: function(elements) {
			assert.ok(true, "Animation with {queue:false} will run regardless of previously paused animations.");

			done();
		}
	});

	Velocity($target4, {top: 20}, {
		duration: 100,
		easing: "linear",
		begin: function(elements) {
			assert.ok(isResumed, "Queued animation began after previously paused animation completed");

			done();
		}
	});

	sleep(100);

	isResumed = true;
	Velocity($target4, "resume");
});
