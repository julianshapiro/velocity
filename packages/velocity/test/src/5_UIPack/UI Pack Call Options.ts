/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {completeCheckDuration, defaultOptions, getTarget} from "../utilities";
import "./_module";

QUnit.skip("Call Options", (assert) => {
	const done = assert.async(2),
		UICallOptions1 = {
			delay: 123,
			duration: defaultOptions.duration,
			easing: "spring", // Should get ignored
		},
		$target1 = getTarget();

	//assert.expect(1);
	Velocity($target1, "transition.slideLeftIn", UICallOptions1);

	setTimeout(() => {
		// Note: We can do this because transition.slideLeftIn is composed of a single call.
		//		assert.equal(Data($target1).opts.delay, UICallOptions1.delay, "Whitelisted option passed in.");
		//		assert.notEqual(Data($target1).opts.easing, UICallOptions1.easing, "Non-whitelisted option not passed in #1a.");
		//		assert.equal(!/velocity-animating/.test(Data($target1).className), true, "Duration option passed in.");

		done();
	}, completeCheckDuration);

	const UICallOptions2 = {
		stagger: 100,
		duration: defaultOptions.duration,
		backwards: true,
	};

	const $targets = [getTarget(), getTarget(), getTarget()];
	Velocity($targets, "transition.slideLeftIn", UICallOptions2);

	setTimeout(() => {
		//		assert.equal(Data($targets[0]).opts.delay, UICallOptions2.stagger * 2, "Backwards stagger delay passed in #1a.");
		//		assert.equal(Data($targets[1]).opts.delay, UICallOptions2.stagger * 1, "Backwards stagger delay passed in #1b.");
		//		assert.equal(Data($targets[2]).opts.delay, UICallOptions2.stagger * 0, "Backwards stagger delay passed in #1c.");

		done();
	}, completeCheckDuration);
});
