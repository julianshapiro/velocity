///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Repeat", function(assert) {
	var done = assert.async(1),
			testOptions = {repeat: 2, delay: 100, duration: 100},
			begin = 0,
			complete = 0,
			repeat = 0,
			start = Date.now();

	assert.expect(4);
	Velocity(getTarget(), defaultProperties, {
		repeat: testOptions.repeat,
		delay: testOptions.delay,
		duration: testOptions.duration,
		begin: function(elements, animation) {
			begin++;
		},
		progress: function(elements, percentComplete, remaining, start, tweenValue, animation) {
			if (percentComplete === 1) {
				repeat++;
			}
		},
		complete: function(elements, animation) {
			complete++;
			assert.equal(begin, 1, "Begin callback only called once");
			assert.equal(repeat, testOptions.repeat + 1, "Animation repeated correct number of times (once each direction per loop)");
			assert.close(Date.now() - start, (testOptions.delay + testOptions.duration) * (testOptions.repeat + 1), (testOptions.repeat + 1) * 16 + 32, "Repeat delay is correct");
			assert.equal(complete, 1, "Complete callback only called once");
			done();
		}
	});
});
