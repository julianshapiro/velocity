///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("'velocity-animating' Classname", function(assert) {
	var done = assert.async(2),
			$target1 = getTarget();

	Velocity($target1, defaultProperties);

	setTimeout(function() {
		assert.equal(/velocity-animating/.test($target1.className), true, "Class added.");

		done();
	}, asyncCheckDuration);

	setTimeout(function() {
		assert.equal(/velocity-animating/.test($target1.className), false, "Class removed.");

		done();
	}, completeCheckDuration);
});
