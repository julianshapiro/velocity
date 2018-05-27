/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {defaultProperties, getTarget} from "../utilities";
import "./_module";

QUnit.test("FPS Limit", async (assert) => {
	let count: number;
	const $target = getTarget(),
		frameRates = [5, 15, 30, 60],
		testFrame = (frameRate) => {
			let counter = 0;

			Velocity.defaults.fpsLimit = frameRate;
			// Test if the frame rate is assigned succesfully.
			assert.equal(frameRate, Velocity.defaults.fpsLimit, "Setting global fps limit to " + frameRate);

			return Velocity($target, defaultProperties,
				{
					duration: 1000,
					progress() {
						counter++;
					},
				})
				.then(() => counter);
		};

	assert.expect(frameRates.length * 2);
	// Test if the limit is working for 60, 30, 15 and 5 fps.
	for (const frameRate of frameRates) {
		assert.ok((count = await testFrame(frameRate)) <= frameRate + 1, `...counted ${count} frames (\xB11 frame)`);
	}
});
