///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.todo("Queue", function(assert) {
	var done = assert.async(1),
			testQueue = "custom";

	assert.expect(5);
	var $target1 = getTarget();
	assert.ok(!Data($target1) || !Data($target1).queueList || !Data($target1).queueList.hasOwnProperty(testQueue), "Custom queue is empty.");
	Velocity($target1, defaultProperties, {queue: testQueue});
	assert.ok(Data($target1).queueList && Data($target1).queueList.hasOwnProperty(testQueue) && !Data($target1).queueList[testQueue], "Custom queue was created.");
	Velocity($target1, defaultProperties, {queue: testQueue});
	assert.ok(Data($target1).queueList && Data($target1).queueList.hasOwnProperty(testQueue) && Data($target1).queueList[testQueue], "Custom queue grows.");
	Velocity($target1, defaultProperties, {queue: testQueue});

//			assert.equal(Data($target1).isAnimating, false, "Custom queue didn't auto-dequeue.");

//			Velocity.Utilities.dequeue($target1, testQueue);
//			assert.equal(Data($target1).isAnimating, true, "Dequeue custom queue.");

	Velocity($target1, "stop", testQueue);
	assert.ok(Data($target1).queueList && !Data($target1).queueList.hasOwnProperty(testQueue), "Stopped custom queue.");

	var $target2 = getTarget();
	Velocity($target2, {opacity: 0});
	Velocity($target2, {width: 10}, {queue: false});

	setTimeout(function() {
		/* Ensure that the second call starts immediately. */
		assert.notEqual(Velocity.CSS.getPropertyValue($target2, "width"), defaultStyles.width, "Parallel calls don't queue.");

		done();
	}, asyncCheckDuration);
});
