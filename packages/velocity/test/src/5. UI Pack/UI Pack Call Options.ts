///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.skip("Call Options", function(assert) {
	var done = assert.async(2),
			UICallOptions1 = {
				delay: 123,
				duration: defaultOptions.duration,
				easing: "spring" // Should get ignored
			},
			$target1 = getTarget();

	//assert.expect(1);
	Velocity($target1, "transition.slideLeftIn", UICallOptions1);

	setTimeout(function() {
		// Note: We can do this because transition.slideLeftIn is composed of a single call.
//		assert.equal(Data($target1).opts.delay, UICallOptions1.delay, "Whitelisted option passed in.");
//		assert.notEqual(Data($target1).opts.easing, UICallOptions1.easing, "Non-whitelisted option not passed in #1a.");
//		assert.equal(!/velocity-animating/.test(Data($target1).className), true, "Duration option passed in.");

		done();
	}, completeCheckDuration);

	var UICallOptions2 = {
		stagger: 100,
		duration: defaultOptions.duration,
		backwards: true
	};

	var $targets = [getTarget(), getTarget(), getTarget()];
	Velocity($targets, "transition.slideLeftIn", UICallOptions2);

	setTimeout(function() {
//		assert.equal(Data($targets[0]).opts.delay, UICallOptions2.stagger * 2, "Backwards stagger delay passed in #1a.");
//		assert.equal(Data($targets[1]).opts.delay, UICallOptions2.stagger * 1, "Backwards stagger delay passed in #1b.");
//		assert.equal(Data($targets[2]).opts.delay, UICallOptions2.stagger * 0, "Backwards stagger delay passed in #1c.");

		done();
	}, completeCheckDuration);
});
