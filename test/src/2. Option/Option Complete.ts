///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Complete", function(assert) {
	async(assert, 1, function(done) {
		const $targetSet = [getTarget(), getTarget()];

		Velocity($targetSet, defaultProperties, {
			duration: asyncCheckDuration,
			complete: function() {
				assert.deepEqual(this, $targetSet, "Elements passed into callback.");
				done();
			}
		});
	});

	assert.expect(async());
});
