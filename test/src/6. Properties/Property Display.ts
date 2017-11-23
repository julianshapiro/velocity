///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Display", function(assert) {
	var done = assert.async(5);

	Velocity(getTarget(), "style", "display", "none")
		.velocity({display: "block"}, {
			progress: once(function(elements: VelocityResult) {
				assert.equal(elements.velocity("style", "display"), "block", "Display:'block' was set immediately.");

				done();
			})
		});

	Velocity(getTarget(), "style", "display", "none")
		.velocity("style", "display", "auto")
		.then(function(elements) {
			assert.equal(elements[0].style.display, "block", "Display:'auto' was understood.");
			assert.equal(elements.velocity("style", "display"), "block", "Display:'auto' was cached as 'block'.");

			done();
		});

	Velocity(getTarget(), "style", "display", "none")
		.velocity("style", "display", "")
		.then(function(elements) {
			assert.equal(elements.velocity("style", "display"), "block", "Display:'' was reset correctly.");

			done();
		});

	Velocity(getTarget(), {display: "none"}, {
		progress: once(function(elements: VelocityResult) {
			assert.notEqual(elements.velocity("style", "display"), "none", "Display:'none' was not set immediately.");

			done();
		})
	}).then(function(elements) {
		assert.equal(elements.velocity("style", "display"), "none", "Display:'none' was set upon completion.");

		done();
	});
});
