///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("End Value Caching", function(assert) {
	var done = assert.async(2),
		newProperties = {height: "50px", width: "250px"};

	assert.expect(4);

	/* Called after the last call is complete (stale). Ensure that the newly-set (via $.css()) properties are used. */
	Velocity(getTarget(newProperties), defaultProperties)
		.then(function(elements) {
			assert.equal(Data(elements[0]).cache.width, defaultProperties.width, "Stale end value #1 wasn't pulled.");
			assert.equal(Data(elements[0]).cache.height, defaultProperties.height, "Stale end value #2 wasn't pulled.");

			done();
		});

	Velocity(getTarget(), defaultProperties)
		.velocity(newProperties)
		.then(function(elements) {
			/* Chained onto a previous call (fresh). */
			assert.equal(Data(elements[0]).cache.width, newProperties.width, "Chained end value #1 was pulled.");
			assert.equal(Data(elements[0]).cache.height, newProperties.height, "Chained end value #2 was pulled.");

			done();
		});
});
