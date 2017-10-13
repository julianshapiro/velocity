///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.todo("Arguments", function(assert) {
	var done = assert.async(9),
		testComplete = function() {}, // Do nothing
		testDuration = 1000,
		testEasing = "easeInSine";

	assert.expect(17);

	/**********************
	 Invalid Arguments
	 **********************/

	var $target1 = getTarget();
	/* No arguments: Ensure an error isn't thrown and that the $targeted elements are returned to the chain. */
	Velocity()
		.then(function() {
			assert.notOk(true, "Calling with no arguments should reject a Promise");
		}, function() {
			assert.notOk(false, "Calling with no arguments should reject a Promise");
		})
		.then(done);
	Velocity($target1)
		.then(function() {
			assert.notOk(true, "Calling with no properties should reject a Promise");
		}, function() {
			assert.notOk(false, "Calling with no properties should reject a Promise");
		})
		.then(done);
	Velocity($target1, {})
		.then(function() {
			assert.notOk(true, "Calling with empty properties should reject a Promise");
		}, function() {
			assert.notOk(false, "Calling with empty properties should reject a Promise");
		})
		.then(done);
	Velocity($target1, {}, testDuration)
		.then(function() {
			assert.notOk(true, "Calling with empty properties + duration should reject a Promise");
		}, function() {
			assert.notOk(false, "Calling with empty properties + duration should reject a Promise");
		})
		.then(done);
	/* Invalid arguments: Ensure an error isn't thrown. */
	Velocity($target1, "fakeArg1", "fakeArg2")
		.then(function() {
			assert.notOk(true, "Calling with invalid arguments should reject a Promise");
		}, function() {
			assert.notOk(false, "Calling with invalid arguments should reject a Promise");
		})
		.then(done);

	/****************
	 Overloading
	 ****************/

	var $target3 = getTarget();
	Velocity($target3, defaultProperties, testDuration).catch().then(function() {
		assert.equal(Data($target4).opts.duration, testDuration, "Overload variation #2: Velocity(element, properties, duration)");
	}).then(done);

	var $target4 = getTarget();
	Velocity($target4, defaultProperties, testEasing).catch().then(function() {
		assert.equal(typeof Data($target4).opts.easing, "function", "Overload variation #3: Velocity(element, properties, easing)");
	}).then(done);

	var $target5 = getTarget();
	Velocity($target5, defaultProperties, function() {
		assert.ok(true, "Overload variation #4: Velocity(element, properties, complete)");
	}).then(done);

	var $target6 = getTarget();
	Velocity($target6, defaultProperties, testDuration, [0.42, 0, 0.58, 1]);
	assert.equal(Data($target6).opts.duration, testDuration, "Overload variation #5a.");
	assert.equal(Data($target6).opts.easing(0.2, 0, 1), 0.0816598562658975, "Overload variation #5b.");

	var $target7 = getTarget();
	Velocity($target7, defaultProperties, testDuration, testComplete);
	assert.equal(Data($target7).opts.duration, testDuration, "Overload variation #6a.");
	assert.equal(Data($target7).opts.complete, testComplete, "Overload variation #6b.");

	var $target8 = getTarget();
	Velocity($target8, defaultProperties, testDuration, testEasing, testComplete);
	assert.equal(Data($target8).opts.duration, testDuration, "Overload variation #7a.");
	assert.equal(typeof Data($target8).opts.easing, "function", "Overload variation #7b.");
	assert.equal(Data($target8).opts.complete, testComplete, "Overload variation #7c.");

	//	var $target9 = getTarget();
	//	Velocity($target9, defaultProperties, testOptions);
	//	assert.deepEqual(Data($target9).opts, testOptions, "Overload variation #8: options object.");

	//	var $target10 = getTarget();
	//	Velocity({elements: $target10, properties: defaultProperties, options: testOptions});
	//	assert.deepEqual(Data($target10).opts, testOptions, "Overload variation #9: single object w/ map.");

	//	var $target11 = getTarget();
	//	Velocity({elements: $target11, properties: "fadeOut", options: testOptions});
	//	assert.strictEqual(Data($target11).style.opacity.endValue, 0, "Overload variation #9: single object w/ redirect.");

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

	var $target15 = getTarget();
	Velocity($target15, defaultProperties, "fast", testEasing);
	assert.equal(Data($target15).opts.duration, 200, "Overload variation #13a.");

	var $target16 = getTarget();
	Velocity($target16, defaultProperties, "normal");
	assert.equal(Data($target16).opts.duration, 400, "Overload variation #13b.");

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
	done();
});
