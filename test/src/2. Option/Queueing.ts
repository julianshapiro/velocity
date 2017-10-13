///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Queueing", function(assert) {
	var done = assert.async(1),
		$target1 = getTarget();

	assert.expect(1);
	Velocity($target1, {opacity: 0});
	Velocity($target1, {width: 2});

	setTimeout(function() {
		/* Ensure that the second call hasn't started yet. */
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "width") as string), defaultStyles.width, "Queued calls chain.");

		done();
	}, asyncCheckDuration);
});
