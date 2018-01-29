///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.skip("RegisterEffect", function(assert) {
	var done = assert.async(1),
		effectDefaultDuration = 800;

	assert.expect(2);
	Velocity.RegisterEffect("callout.twirl", {
		defaultDuration: effectDefaultDuration,
		calls: [
			[{rotateZ: 1080}, 0.50],
			[{scaleX: 0.5}, 0.25, {easing: "spring"}],
			[{scaleX: 1}, 0.25, {easing: "spring"}]
		]
	});

	var $target1 = getTarget();
	Velocity($target1, "callout.twirl");

	setTimeout(function() {
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "rotateZ") as string), 1080, "First call's property animated.");
		assert.equal(parseFloat(Velocity.CSS.getPropertyValue($target1, "scaleX") as string), 1, "Last call's property animated.");

		done();
	}, effectDefaultDuration * 1.50);
});
