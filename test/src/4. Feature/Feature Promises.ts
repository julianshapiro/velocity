///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Promises", function(assert) {
	var done = assert.async(4),
		$target1 = getTarget();

	assert.expect(5);
	Velocity($target1, defaultProperties, 100)
		.then(function(elements) {
			assert.deepEqual(elements, [$target1], "Active call fulfilled.");

			done();
		});

	Velocity($target1, defaultProperties, 100)
		.then(function(elements) {
			assert.deepEqual(elements, [$target1], "Queued call fulfilled.");

			done();
		});

	// TODO: re-enable
	//	Velocity($target1, "stop", true).then(function(elements) {
	//		assert.deepEqual(elements, [$target1], "Stop call fulfilled.");
	//
	//		done();
	//	});

	var $target2 = getTarget(),
		$target3 = getTarget();

	Velocity([$target2, $target3], "invalid", defaultOptions)
		.catch(function(error) {
			assert.equal(error instanceof Error, true, "Invalid command caused promise rejection.");

			done();
		});

	Velocity([$target2, $target3], defaultProperties, defaultOptions)
		.then(function(elements) {
			assert.ok(elements && elements.length, "Array of Elements passed back into resolved promise.");
			assert.deepEqual(elements, [$target2, $target3], "Elements passed back into resolved promise.");

			done();
		});
});
