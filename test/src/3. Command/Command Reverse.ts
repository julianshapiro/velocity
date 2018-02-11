///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Reverse", function(assert) {
	var $target = getTarget(),
		opacity = $target.velocity("style", "opacity"),
		width = $target.velocity("style", "width");

	if (width === "0") {
		// Browsers don't always suffix, but Velocity does.
		width = "0px";
	}
	async(assert, 2, function(done) {
		Velocity($target, defaultProperties, {
			complete: function(elements) {
				assert.equal(elements[0].velocity("style", "opacity"), defaultProperties.opacity, "Initial property #1 set correctly. (" + defaultProperties.opacity + ")");
				assert.equal(elements[0].velocity("style", "width"), defaultProperties.width, "Initial property #2 set correctly. (" + defaultProperties.width + ")");

				done();
			}
		});
	});

	async(assert, 2, function(done) {
		Velocity($target, "reverse", {
			complete: function(elements) {
				assert.equal(elements[0].velocity("style", "opacity"), opacity, "Reversed property #1 set correctly. (" + opacity + ")");
				assert.equal(elements[0].velocity("style", "width"), width, "Reversed property #2 set correctly. (" + width + ")");

				done();
			}
		});
	});

	async(assert, 2, function(done) {
		Velocity($target, "reverse", {
			complete: function(elements) {
				assert.equal(elements[0].velocity("style", "opacity"), defaultProperties.opacity, "Chained reversed property #1 set correctly. (" + defaultProperties.opacity + ")");
				assert.equal(elements[0].velocity("style", "width"), defaultProperties.width, "Chained reversed property #2 set correctly. (" + defaultProperties.width + ")");

				done();
			}
		});
	});

	assert.expect(async());
});
