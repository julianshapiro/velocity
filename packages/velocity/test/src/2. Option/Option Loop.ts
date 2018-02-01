///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Loop", function(assert) {
	async(assert, 4, function(done) {
		const testOptions = {loop: 2, delay: 100, duration: 100},
			start = getNow();
		let begin = 0,
			complete = 0,
			loop = 0,
			lastPercentComplete = 2;

		Velocity(getTarget(), defaultProperties, {
			loop: testOptions.loop,
			delay: testOptions.delay,
			duration: testOptions.duration,
			begin: function(elements, animation) {
				begin++;
			},
			progress: function(elements, percentComplete, remaining, start, tweenValue) {
				if (lastPercentComplete > percentComplete) {
					loop++;
				}
				lastPercentComplete = percentComplete;
			},
			complete: function(elements, animation) {
				complete++;
			}
		}).then(() => {
			assert.equal(begin, 1, "Begin callback only called once.");
			assert.equal(loop, testOptions.loop * 2 - 1, "Animation looped correct number of times (once each direction per loop).");
			assert.close(getNow() - start, (testOptions.delay + testOptions.duration) * loop, 32, "Looping with 'delay' has correct duration.");
			assert.equal(complete, 1, "Complete callback only called once.");

			done();
		});
	});

	assert.expect(async());
});
