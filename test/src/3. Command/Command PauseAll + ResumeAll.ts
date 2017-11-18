///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.todo("Global Pause / Resume", function(assert) {
	var done = assert.async(4),
		$target1 = getTarget(),
		$target2 = getTarget(),
		$target3 = getTarget(),
		$target4 = getTarget(),
		isPaused = false,
		hasProgressed2 = false;

	assert.expect(3);
	Velocity($target1, {opacity: 0}, Object.assign({}, defaultOptions, {
		delay: 100,
		queue: false,
		progress: function(elements, progress, msRemaining) {
			if (isPaused) {
				throw new Error("Delayed Tween should not progress when globally paused");
			}
		}
	}));

	Velocity($target2, {opacity: 0}, Object.assign({}, defaultOptions, {
		progress: function(elements, progress, msRemaining) {
			if (isPaused) {
				assert.ok(false, "Tween resumes on individual pause after global resume");
				done();
			} else if (!hasProgressed2) {
				hasProgressed2 = true;
				assert.ok(true, "Tween resumes on individual pause after global resume");
				done();
			}
		}
	}));

	Velocity.pauseAll();
	isPaused = true;

	/* Testing with custom queues */
	var hasProgressed3 = false;
	Velocity($target3, {opacity: 0}, Object.assign({}, defaultOptions, {
		queue: "queue1",
		progress: function(elements, progress, msRemaining) {
			if (!hasProgressed3) {
				hasProgressed3 = true;
				assert.ok(true, "Tweens created after global pause begin immediately");

				done();
			}
		}
	}));

	var hasProgressed4 = false;
	Velocity($target4, {opacity: 0}, Object.assign({}, defaultOptions, {
		queue: "queue2",
		progress: function(elements, progress, msRemaining) {
			if (!hasProgressed4) {
				hasProgressed4 = true;
				if (isPaused) {
					assert.ok(false, "Paused tweens on a queue resume after a global resumeAll call");
				} else {
					assert.ok(true, "Paused tweens on a queue resume after a global resumeAll call");
				}
				done();
			}
		}
	}));

	/* Only $target4 should pause */
	Velocity.pauseAll("queue2");

	setTimeout(function() {
		isPaused = false;
		Velocity.resumeAll();
	}, 200);

	setTimeout(function() {
		done(); // Let the tests know when we're running normally again
		Velocity.resumeAll();
	}, 400);

});
