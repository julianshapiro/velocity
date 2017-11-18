///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.todo("Display", function(assert) {
	var done = assert.async(3),
		testDisplayBlank = "";

	Velocity(getTarget(), "style", "display", "none")
		.velocity({display: "block"}, {
			progress: once(function(elements: VelocityResult) {
				assert.equal(elements.velocity("style", "display"), "block", "Display:'block' was set immediately.");

				done();
			})
		});

	Velocity(getTarget(), {display: "none"}, {
		progress: once(function(elements: VelocityResult) {
			assert.notEqual(elements.velocity("style", "display"), 0, "Display:'none' was not set immediately.");

			done();
		})
	}).then(function(elements) {
		assert.equal(elements.velocity("style", "display"), "none", "Display:'none' was set upon completion.");

		done();
	});

	//	var $target3 = getTarget();
	//	Velocity($target3, {display: testDisplayBlank});
	//	setTimeout(function() {
	//		assert.equal(Velocity($target3, "style", "display"), "block", "Display:'' was set immediately.");
	//
	//		done();
	//	}, completeCheckDuration);
});
