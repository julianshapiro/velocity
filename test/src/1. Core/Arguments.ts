///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Arguments", function(assert) {
	let testComplete = function() {}, // Do nothing
		testDuration = 1000,
		testEasing = "easeInSine",
		result: VelocityResult,
		testOptions: VelocityOptions = {
			duration: 123,
			easing: testEasing,
			complete: testComplete
		};

	assert.expect(18);

	/****************
	 Overloading
	 ****************/

	result = Velocity(getTarget(), defaultProperties);
	assert.ok(result.length, "Overload variation #1a: Velocity(ELEMENT, {properties})");
	assert.ok(result.velocity.animations.length, "Overload variation #1b: Velocity(element, {PROPERTIES})");

	result = Velocity(getTarget(), defaultProperties, testDuration);
	assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #2a: Velocity(element, {properties}, DURATION<number>)");
	result = Velocity(getTarget(), defaultProperties, "slow");
	assert.equal(result.velocity.animations[0].options.duration, 600, "Overload variation #2b: Velocity(element, {properties}, DURATION<slow>)");
	result = Velocity(getTarget(), defaultProperties, "normal");
	assert.equal(result.velocity.animations[0].options.duration, 400, "Overload variation #2c: Velocity(element, {properties}, DURATION<normal>)");
	result = Velocity(getTarget(), defaultProperties, "fast");
	assert.equal(result.velocity.animations[0].options.duration, 200, "Overload variation #2d: Velocity(element, {properties}, DURATION<fast>)");

	result = Velocity(getTarget(), defaultProperties, testEasing);
	assert.equal(typeof result.velocity.animations[0].options.easing, "function", "Overload variation #3: Velocity(element, {properties}, EASING)");

	result = Velocity(getTarget(), defaultProperties, testComplete);
	assert.equal(typeof result.velocity.animations[0].options.complete, "function", "Overload variation #4: Velocity(element, {properties}, COMPLETE)");

	result = Velocity(getTarget(), defaultProperties, testDuration, [0.42, 0, 0.58, 1]);
	assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #5a: Velocity(element, {properties}, DURATION, easing)");
	assert.equal(result.velocity.animations[0].options.easing(0.2, 0, 1), 0.0816598562658975, "Overload variation #5b: Velocity(element, {properties}, duration, EASING)");

	result = Velocity(getTarget(), defaultProperties, testDuration, testComplete);
	assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #6a: Velocity(element, {properties}, DURATION, complete)");
	assert.equal(result.velocity.animations[0].options.complete, testComplete, "Overload variation #6b: Velocity(element, {properties}, duration, COMPLETE)");

	result = Velocity(getTarget(), defaultProperties, testDuration, testEasing, testComplete);
	assert.equal(result.velocity.animations[0].options.duration, testDuration, "Overload variation #7a: Velocity(element, {properties}, DURATION, easing, complete)");
	assert.equal(typeof result.velocity.animations[0].options.easing, "function", "Overload variation #7b: Velocity(element, {properties}, duration, EASING, complete)");
	assert.equal(result.velocity.animations[0].options.complete, testComplete, "Overload variation #7c: Velocity(element, {properties}, duration, easing, COMPLETE)");

	result = Velocity(getTarget(), defaultProperties, testOptions);
	assert.equal(result.velocity.animations[0].options.duration, testOptions.duration, "Overload variation #8: Velocity(element, {properties}, {OPTIONS})");

	Velocity({elements: [getTarget()], properties: defaultProperties, options: testOptions});
	assert.equal(result.velocity.animations[0].options.duration, testOptions.duration, "Overload variation #9: Velocity({elements:[elements], properties:{properties}, options:{OPTIONS})");

	Velocity({elements: [getTarget()], properties: "stop", options: testOptions});
	assert.equal(result.velocity.animations[0].options.duration, testOptions.duration, "Overload variation #10: Velocity({elements:[elements], properties:\"ACTION\", options:{OPTIONS})");

	//	var $target12 = getTarget();
	//	Velocity($target12, {opacity: [0.75, "spring", 0.25]}, testDuration);
	//	assert.equal(Data($target12).style.opacity.startValue, 0.25, "Overload variation #10a.");
	//	assert.equal(Data($target12).style.opacity.easing, "spring", "Overload variation #10b.");
	//	assert.equal(Data($target12).style.opacity.endValue, 0.75, "Overload variation #10c.");

	//	var $target13 = getTarget();
	//	Velocity($target13, {opacity: [0.75, 0.25]}, testDuration);
	//	assert.equal(Data($target13).style.opacity.startValue, 0.25, "Overload variation #11a.");
	//	assert.equal(Data($target13).style.opacity.endValue, 0.75, "Overload variation #11b.");

	//	var $target14 = getTarget();
	//	Velocity($target14, {opacity: [0.75, "spring"]}, testDuration);
	//	assert.equal(Data($target14).style.opacity.endValue, 0.75, "Overload variation #12a.");
	//	assert.equal(Data($target14).style.opacity.easing, "spring", "Overload variation #12b.");

	//	if ($) {
	//		var $target17 = getTarget();
	//		$($target17).velocity(defaultProperties, testOptions);
	//		assert.deepEqual(Data($target17).opts, testOptions, "$.fn.: Utility function variation #1: options object.");
	//
	//		var $target18 = getTarget();
	//		$($target18).velocity({properties: defaultProperties, options: testOptions});
	//		assert.deepEqual(Data($target18).opts, testOptions, "$.fn.: Utility function variation #2: single object.");
	//
	//		var $target19 = getTarget();
	//		$($target19).velocity(defaultProperties, testDuration, testEasing, testComplete);
	//		assert.equal(Data($target19).opts.duration, testDuration, "$.fn.: Utility function variation #2a.");
	//		assert.equal(Data($target19).opts.easing, testEasing, "$.fn.: Utility function variation #2b.");
	//		assert.equal(Data($target19).opts.complete, testComplete, "$.fn.: Utility function variation #2c.");
	//
	//		var $target20 = getTarget();
	//		assert.equal($($target20).length, $($target20).velocity(defaultProperties, testDuration, testEasing, testComplete).velocity(defaultProperties, testDuration, testEasing, testComplete).length, "$.fn.: Elements passed back to the call stack.");
	//		// TODO: Should check in a better way - but the prototype chain is now extended with a Promise so a standard (non-length) comparison *will* fail
	//	}
});
