/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {asyncCheckDuration, completeCheckDuration, defaultOptions, getPropertyValue, getTarget} from "../utilities";
import "./_module";

QUnit.skip("In/Out", (assert) => {
	const done = assert.async(2),
		$target1 = getTarget(),
		$target2 = getTarget(),
		$target3 = getTarget(),
		$target4 = getTarget(),
		$target5 = getTarget(),
		$target6 = getTarget();

	Velocity($target1, "transition.bounceIn", defaultOptions.duration);

//	Velocity($target2, "transition.bounceIn", {duration: defaultOptions.duration, display: "inline"});
//
//	Velocity($target3, "transition.bounceOut", defaultOptions.duration);
//
//	Velocity($target4, "transition.bounceOut", {duration: defaultOptions.duration, display: null});
//
//	$target5.style.visibility = "hidden";
//	Velocity($target5, "transition.bounceIn", {duration: defaultOptions.duration, visibility: "visible"});
//
//	$target6.style.visibility = "visible";
//	Velocity($target6, "transition.bounceOut", {duration: defaultOptions.duration, visibility: "hidden"});

	assert.expect(8);
	setTimeout(() => {
		assert.notEqual(getPropertyValue($target3, "display"), 0, "Out: display not prematurely set to none.");
		assert.notEqual(getPropertyValue($target6, "visibility"), "hidden", "Out: visibility not prematurely set to hidden.");

		done();
	}, asyncCheckDuration);

	setTimeout(() => {
		//		assert.equal(getPropertyValue($target1, "display"), Values.getDisplayType($target1), "In: display set to default.");
		assert.equal(getPropertyValue($target2, "display"), "inline", "In: Custom inline value set.");

		assert.equal(getPropertyValue($target3, "display"), 0, "Out: display set to none.");
		//		assert.equal(getPropertyValue($target4, "display"), Values.getDisplayType($target3), "Out: No display value set.");

		assert.equal(getPropertyValue($target5, "visibility"), "visible", "In: visibility set to visible.");
		assert.equal(getPropertyValue($target6, "visibility"), "hidden", "Out: visibility set to hidden.");

		done();
	}, completeCheckDuration);
});
