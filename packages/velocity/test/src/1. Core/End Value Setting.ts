///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("End Value Setting", function(assert) {
	var done = assert.async(1);

	/* Standard properties. */
	Velocity(getTarget(), defaultProperties)
		.then(function(elements) {
			assert.equal(Velocity(elements[0], "style", "width"), defaultProperties.width, "Standard end value #1 was set.");
			assert.equal(Velocity(elements[0], "style", "opacity"), defaultProperties.opacity, "Standard end value #2 was set.");

			done();
		});
});
