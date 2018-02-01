///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.skip("Packaged Effect: slideUp/Down", function(assert) {
	var done = assert.async(4),
		$target1 = getTarget(),
		$target2 = getTarget(),
		initialStyles = {
			display: "none",
			paddingTop: "123px"
		};

	$target1.style.display = initialStyles.display;
	$target1.style.paddingTop = initialStyles.paddingTop;

	Velocity($target1, "slideDown", {
		begin: function(elements) {
			assert.deepEqual(elements, [$target1], "slideDown: Begin callback returned.");

			done();
		},
		complete: function(elements) {
			assert.deepEqual(elements, [$target1], "slideDown: Complete callback returned.");
			//			assert.equal(Velocity.CSS.getPropertyValue($target1, "display"), Velocity.CSS.Values.getDisplayType($target1), "slideDown: display set to default.");
			assert.notEqual(Velocity.CSS.getPropertyValue($target1, "height"), 0, "slideDown: height set.");
			assert.equal(Velocity.CSS.getPropertyValue($target1, "paddingTop"), initialStyles.paddingTop, "slideDown: paddingTop set.");

			done();
		}
		//	}).then(function(elements) {
		//		assert.deepEqual(elements, [$target1], "slideDown: Promise fulfilled.");
		//
		//		done();
	});

	Velocity($target2, "slideUp", {
		begin: function(elements) {
			assert.deepEqual(elements, [$target2], "slideUp: Begin callback returned.");

			done();
		},
		complete: function(elements) {
			assert.deepEqual(elements, [$target2], "slideUp: Complete callback returned.");
			assert.equal(Velocity.CSS.getPropertyValue($target2, "display"), 0, "slideUp: display set to none.");
			assert.notEqual(Velocity.CSS.getPropertyValue($target2, "height"), 0, "slideUp: height reset.");
			assert.equal(Velocity.CSS.getPropertyValue($target1, "paddingTop"), initialStyles.paddingTop, "slideUp: paddingTop reset.");

			done();
		}
		//	}).then(function(elements) {
		//		assert.deepEqual(elements, [$target2], "slideUp: Promise fulfilled.");
		//
		//		done();
	});
});
