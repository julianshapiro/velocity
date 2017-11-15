///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.todo("Pause / Resume", function(assert) {
	var done = assert.async(8),
		$target1 = getTarget(),
		$target1d = getTarget(); //delayed

	assert.expect(7);
	/* Ensure an error isn't thrown when "pause" is called on a $target that isn't animating. */
	Velocity($target1, "pause");
	Velocity($target1d, "pause");

	/* Ensure an error isn't thrown when "pause" is called on a $target that isn't animating. */
	Velocity($target1, "resume");
	Velocity($target1d, "resume");

	/* Ensure a paused $target ceases to animate */
	Velocity($target1, {opacity: 0}, defaultOptions);
//	assert.notEqual(Data($target1).isPaused, true, "Newly active call not paused.");
	Velocity($target1d, {opacity: 0}, Object.assign({}, defaultOptions, {delay: 200}));
//	assert.notEqual(Data($target1d).isPaused, true, "New call with delay not paused.");

	Velocity($target1, "pause");
	Velocity($target1d, "pause");

	setTimeout(function() {
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "opacity") as string), 1, "Property value unchanged after pause.");

		done();
	}, completeCheckDuration);

	setTimeout(function() {
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1d, "opacity") as string), 1, "Property value unchanged after pause during delay.");

		done();
	}, 201);

	/* Ensure a resumed $target proceeds to animate */
	var $target2 = getTarget();
	var $target2d = getTarget();
	Velocity($target2, {opacity: 0}, defaultOptions);
	Velocity($target2d, {opacity: 0}, Object.assign({}, defaultOptions, {delay: 100}));

	Velocity($target2, "pause");

	setTimeout(function() {
		Velocity($target2d, "pause");
	}, 40);

	Velocity($target2, "resume");

	setTimeout(function() {
		Velocity($target2d, "resume");
	}, 130);

	setTimeout(function() {
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target2, "opacity") as string), 0, "Tween completed after pause/resume.");

		done();
	}, completeCheckDuration);

	setTimeout(function() {
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target2d, "opacity") as string), 1, "Delayed tween did not start early after pause.");

		done();
	}, 130);

	setTimeout(function() {
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target2d, "opacity") as string), 0, "Delayed tween completed after pause/resume.");

		done();
	}, completeCheckDuration + 200);

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
	setTimeout(function() {
		Velocity($target3, "pause");
		isPaused = true;
	}, 100);

	setTimeout(function() {
		Velocity($target3, "resume");
		isPaused = false;
	}, 200);


	setTimeout(function() {
		/* Property value should be linearly proportional to */
		var val = parseFloat(Velocity.CSS.getPropertyValue($target3, "opacity") as string);

		/* Prop value and percentage complete should correlate after pause. We need to test this since
		 the timing variables used to calculate and return the percentage complete and msRemaining are
		 modified after pause and resume comamands have been issued on the call */
		// TODO: These both had a 2nd argument to the Math.round - 4
		assert.ok(Math.round(1 - val) === Math.round(percent), "Tween value and percentageComplete correlate correctly after pause.");

		done();
	}, 250);


	// TODO: No longer a valid case in V2
	/* Ensure a all elements in a call are paused if any element is paused, likewise for resume */
	var $targetA = getTarget(), $targetB = getTarget();
	Velocity([$targetA, $targetB], {opacity: 0}, {
		duration: 100,
		progress: function(elements, percent, msRemaining) {
			//			throw new Error("Tween does not proceed for any elements");
		}
	});

	Velocity($targetA, "pause");

	/* Ensure proper behavior with queue:false  */
	var $target4 = getTarget();
	Velocity($target4, {opacity: 0}, {
		duration: 200
	});

	var isResumed = false;

	setTimeout(function() {
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

		// TODO: Re-enable this test
		//		Velocity($target4, {top: 20}, {
		//			duration: 100,
		//			easing: "linear",
		//			begin: function(elements) {
		//				assert.ok(isResumed, "Queued animation began after previously paused animation completed");
		//				done();
		//			}
		//		});
	}, 100);

	setTimeout(function() {
		isResumed = true;
		Velocity($target4, "resume");
	}, 200);

	setTimeout(function() {
		/* Clear out any existing test animations to prevent errors from being thrown
		 in another test */
		try {
			Velocity([$targetA, $target3, $target4], "stop");
		} catch (e) {
		}
		done();
	}, 800);
});
