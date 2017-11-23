///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Visibility", function(assert) {
	var done = assert.async(4);

	Velocity(getTarget(), "style", "visibility", "hidden")
		.velocity({visibility: "visible"}, {
			progress: once(function(elements: VelocityResult) {
				assert.equal(elements.velocity("style", "visibility"), "visible", "Visibility:'visible' was set immediately.");

				done();
			})
		});

	Velocity(getTarget(), "style", "visibility", "hidden")
		.velocity("style", "visibility", "")
		.then(function(elements) {
			// NOTE: The test elements inherit "hidden", so while illogical it
			// is in fact correct.
			assert.equal(elements.velocity("style", "visibility"), "hidden", "Visibility:'' was reset correctly.");

			done();
		});

	Velocity(getTarget(), {visibility: "hidden"}, {
		progress: once(function(elements: VelocityResult) {
			assert.notEqual(elements.velocity("style", "visibility"), "visible", "Visibility:'hidden' was not set immediately.");

			done();
		})
	}).then(function(elements) {
		assert.equal(elements.velocity("style", "visibility"), "hidden", "Visibility:'hidden' was set upon completion.");

		done();
	});
});
