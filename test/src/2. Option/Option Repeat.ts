///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Repeat", function(assert) {
	async(assert, 4, function(done) {
		const testOptions = {repeat: 2, delay: 100, duration: 100},
			start = Date.now();
		let begin = 0,
			complete = 0,
			repeat = 0;

		Velocity(getTarget(), defaultProperties, {
			repeat: testOptions.repeat,
			delay: testOptions.delay,
			duration: testOptions.duration,
			begin: function(elements, animation) {
				begin++;
			},
			progress: function(elements, percentComplete, remaining, start, tweenValue) {
				if (percentComplete === 1) {
					repeat++;
				}
			},
			complete: function(elements, animation) {
				complete++;
				assert.equal(begin, 1, "Begin callback only called once.");
				assert.equal(repeat, testOptions.repeat + 1, "Animation repeated correct number of times (original plus repeats).");
				assert.close(Date.now() - start, (testOptions.delay + testOptions.duration) * (testOptions.repeat + 1), (testOptions.repeat + 1) * 16 + 32, "Repeat with 'delay' has correct duration.");
				assert.equal(complete, 1, "Complete callback only called once.");
				done();
			}
		});
	});

	assert.expect(async());
});
