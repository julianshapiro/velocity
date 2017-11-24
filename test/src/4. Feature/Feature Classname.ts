///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("'velocity-animating' Classname", function(assert) {
	var done = assert.async(1);

	Velocity(getTarget(), defaultProperties, {
		begin: function(elements) {
			assert.equal(/velocity-animating/.test(elements[0].className), true, "Class added.");
		},
		complete: function(elements) {
			assert.equal(/velocity-animating/.test(elements[0].className), false, "Class removed.");
		}
	}).then(done);
});
