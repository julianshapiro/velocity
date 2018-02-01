///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.skip("Callbacks", function(assert) {
	var done = assert.async(2),
		$targets = [getTarget(), getTarget()];

	assert.expect(3);
	Velocity($targets, "transition.bounceIn", {
		begin: function(elements) {
			assert.deepEqual(elements, $targets, "Begin callback returned.");

			done();
		},
		complete: function(elements) {
			assert.deepEqual(elements, $targets, "Complete callback returned.");

			done();
		}
		//	}).then(function(elements) {
		//		assert.deepEqual(elements, $targets, "Promise fulfilled.");
		//
		//		done();
	});
});
