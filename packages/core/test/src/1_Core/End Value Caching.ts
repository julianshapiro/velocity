/*
 * velocity-animate (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "qunit";

import Velocity from "velocity-animate";
import {Data, defaultProperties, getTarget} from "../utilities";
import "./_module";

QUnit.test("End Value Caching", (assert) => {
	const done = assert.async(2),
		newProperties = {height: "50px", width: "250px"};

	assert.expect(4);

	/* Called after the last call is complete (stale). Ensure that the newly-set (via $.css()) properties are used. */
	Velocity(getTarget(newProperties), defaultProperties)
		.then((elements) => {
			assert.equal(Data(elements[0]).cache.width, defaultProperties.width, "Stale end value #1 wasn't pulled.");
			assert.equal(Data(elements[0]).cache.height, defaultProperties.height, "Stale end value #2 wasn't pulled.");

			done();
		});

	Velocity(getTarget(), defaultProperties)
		.velocity(newProperties)
		.then((elements) => {
			/* Chained onto a previous call (fresh). */
			assert.equal(Data(elements[0]).cache.width, newProperties.width, "Chained end value #1 was pulled.");
			assert.equal(Data(elements[0]).cache.height, newProperties.height, "Chained end value #2 was pulled.");

			done();
		});
});
