///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("End Value Setting (Note: Browser Tab Must Have Focus Due to rAF)", function(assert) {
	var done = assert.async(1);

	/* Standard properties. */
	var $target1 = getTarget();
	Velocity($target1, defaultProperties, {});
	setTimeout(function() {
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "width") as string), defaultProperties.width, "Standard end value #1 was set.");
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "opacity") as string), defaultProperties.opacity, "Standard end value #2 was set.");

		done();
	}, completeCheckDuration);
});
