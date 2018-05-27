/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {Data, getTarget} from "../utilities";
import "./_module";

QUnit.todo("Value Functions", (assert) => {
	const testWidth = 10,
		$target1 = getTarget(),
		$target2 = getTarget();

	Velocity([$target1, $target2], {
		width(i, total) {
			return (i + 1) / total * testWidth;
		},
	});

	assert.equal(Data($target1).cache.width, parseFloat(testWidth as any) / 2, "Function value #1 passed to tween.");
	assert.equal(Data($target2).cache.width, parseFloat(testWidth as any), "Function value #2 passed to tween.");
});
