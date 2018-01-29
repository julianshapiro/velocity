///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.skip("In/Out", function(assert) {
	var done = assert.async(2),
		$target1 = getTarget(),
		$target2 = getTarget(),
		$target3 = getTarget(),
		$target4 = getTarget(),
		$target5 = getTarget(),
		$target6 = getTarget();

	Velocity($target1, "transition.bounceIn", defaultOptions.duration);

	Velocity($target2, "transition.bounceIn", {duration: defaultOptions.duration, display: "inline"});

	Velocity($target3, "transition.bounceOut", defaultOptions.duration);

	Velocity($target4, "transition.bounceOut", {duration: defaultOptions.duration, display: null});

	$target5.style.visibility = "hidden";
	Velocity($target5, "transition.bounceIn", {duration: defaultOptions.duration, visibility: "visible"});

	$target6.style.visibility = "visible";
	Velocity($target6, "transition.bounceOut", {duration: defaultOptions.duration, visibility: "hidden"});

	assert.expect(8);
	setTimeout(function() {
		assert.notEqual(Velocity.CSS.getPropertyValue($target3, "display"), 0, "Out: display not prematurely set to none.");
		assert.notEqual(Velocity.CSS.getPropertyValue($target6, "visibility"), "hidden", "Out: visibility not prematurely set to hidden.");

		done();
	}, asyncCheckDuration);

	setTimeout(function() {
		//		assert.equal(Velocity.CSS.getPropertyValue($target1, "display"), Velocity.CSS.Values.getDisplayType($target1), "In: display set to default.");
		assert.equal(Velocity.CSS.getPropertyValue($target2, "display"), "inline", "In: Custom inline value set.");

		assert.equal(Velocity.CSS.getPropertyValue($target3, "display"), 0, "Out: display set to none.");
		//		assert.equal(Velocity.CSS.getPropertyValue($target4, "display"), Velocity.CSS.Values.getDisplayType($target3), "Out: No display value set.");

		assert.equal(Velocity.CSS.getPropertyValue($target5, "visibility"), "visible", "In: visibility set to visible.");
		assert.equal(Velocity.CSS.getPropertyValue($target6, "visibility"), "hidden", "Out: visibility set to hidden.");

		done();
	}, completeCheckDuration);
});
