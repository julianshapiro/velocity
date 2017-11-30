///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Progress", function(assert) {
	async(assert, 4, function(done) {
		const $target = getTarget();

		Velocity($target, defaultProperties, {
			duration: asyncCheckDuration,
			progress: once(function(elements, percentComplete, msRemaining) {
				assert.deepEqual(elements, [$target], "Elements passed into progress.");
				assert.deepEqual(this, [$target], "Elements passed into progress as this.");
				assert.equal(percentComplete >= 0 && percentComplete <= 1, true, "'percentComplete' passed into progress.");
				assert.equal(msRemaining > asyncCheckDuration - 50, true, "'msRemaining' passed into progress.");

				done();
			})
		});
	});

	assert.expect(async());
});
