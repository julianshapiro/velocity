///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Loop", function(assert) {
	var done = assert.async(1),
			testOptions = {loop: 2, delay: 100, duration: 100},
			begin = 0,
			complete = 0,
			loop = 0,
			start = Date.now();

	assert.expect(4);
	Velocity(getTarget(), defaultProperties, {
		loop: testOptions.loop,
		delay: testOptions.delay,
		duration: testOptions.duration,
		begin: function(elements, animation) {
			begin++;
		},
		progress: function(elements, percentComplete, remaining, start, tweenValue, animation) {
			if (percentComplete === 1) {
				loop++;
			}
		},
		complete: function(elements, animation) {
			complete++;
			assert.equal(begin, 1, "Begin callback only called once");
			assert.equal(loop, testOptions.loop * 2, "Animation looped correct number of times (once each direction per loop)");
			assert.close(Date.now() - start, (testOptions.delay + testOptions.duration) * (testOptions.loop * 2), 4 * 16 + 32, "Loop delay is correct");
			assert.equal(complete, 1, "Complete callback only called once");
			done();
		}
	});
});
