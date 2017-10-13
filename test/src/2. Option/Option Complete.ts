///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Complete", function(assert) {
	var done = assert.async(1),
			$targetSet = [getTarget(), getTarget()];

	assert.expect(1);
	Velocity($targetSet, defaultProperties, {
		duration: asyncCheckDuration,
		complete: function() {
			assert.deepEqual(this, $targetSet, "Elements passed into callback.");
			done();
		}
	});
});
