/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {Data, defaultProperties, getTarget} from "../utilities";
import "./_module";

QUnit.test("Queue", (assert) => {
	const done = assert.async(4),
		testQueue = "custom",
		$target = getTarget(),
		ignore = $target.velocity("style", "display"), // Force data creation
		data = Data($target);
	let anim1: boolean,
		anim2: boolean,
		anim3: boolean;

	assert.expect(7);

	assert.ok(data.queueList[testQueue] === undefined, "Custom queue is empty."); // Shouldn't exist

	$target.velocity(defaultProperties, {
		queue: testQueue,
		begin() {
			anim1 = true;
		},
		complete() {
			anim1 = false;
			assert.ok(!anim2, "Queued animation isn't started early.");

			done();
		},
	});
	assert.ok(data.queueList[testQueue] !== undefined, "Custom queue was created."); // Should exist, but be "null"

	$target.velocity(defaultProperties, {
		queue: testQueue,
		begin() {
			anim2 = true;
			assert.ok(anim1 === false, "Queued animation starts after first.");

			done();
		},
		complete() {
			anim2 = false;
		},
	});
	assert.ok(data.queueList[testQueue], "Custom queue grows."); // Should exist and point at the next animation

	$target.velocity(defaultProperties, {
		begin() {
			anim3 = true;
			assert.ok(anim1 === true, "Different queue animation starts in parallel.");

			done();
		},
		complete() {
			anim3 = false;
		},
	});

	$target.velocity(defaultProperties, {
		queue: false,
		begin() {
			assert.ok(anim1 === true, "Queue:false animation starts in parallel.");

			done();
		},
	});
});
