///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Queue", function(assert) {
	var done = assert.async(4),
		testQueue = "custom",
		$target = getTarget(),
		ignore = $target.velocity("style", "display"), // Force data creation
		data = Data($target),
		anim1: boolean,
		anim2: boolean,
		anim3: boolean;

	assert.expect(7);

	assert.ok(data.queueList[testQueue] === undefined, "Custom queue is empty."); // Shouldn't exist

	$target.velocity(defaultProperties, {
		queue: testQueue,
		begin: function() {
			anim1 = true;
		},
		complete: function() {
			anim1 = false;
			assert.ok(!anim2, "Queued animation isn't started early.");
			done();
		}
	});
	assert.ok(data.queueList[testQueue] !== undefined, "Custom queue was created."); // Should exist, but be "null"

	$target.velocity(defaultProperties, {
		queue: testQueue,
		begin: function() {
			anim2 = true;
			assert.ok(anim1 === false, "Queued animation starts after first.");
			done();
		},
		complete: function() {
			anim2 = false;
		}
	});
	assert.ok(data.queueList[testQueue], "Custom queue grows."); // Should exist and point at the next animation

	$target.velocity(defaultProperties, {
		begin: function() {
			anim3 = true;
			assert.ok(anim1 === true, "Different queue animation starts in parallel.");
			done();
		},
		complete: function() {
			anim3 = false;
		}
	});

	$target.velocity(defaultProperties, {
		queue: false,
		begin: function() {
			assert.ok(anim1 === true, "Queue:false animation starts in parallel.");
			done();
		}
	});
});
