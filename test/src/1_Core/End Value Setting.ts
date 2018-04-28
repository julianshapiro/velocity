/*
 * VelocityJS.org (C) 2014-2018 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

import "@types/qunit";

import {Velocity} from "../../../index.d";
import {Data, defaultProperties, getTarget} from "../utilities";
import "./_module";

QUnit.test("End Value Setting", (assert) => {
	const done = assert.async(1);

	/* Standard properties. */
	Velocity(getTarget(), defaultProperties)
		.then((elements) => {
			assert.equal(Velocity(elements[0], "style", "width"), defaultProperties.width, "Standard end value #1 was set.");
			assert.equal(Velocity(elements[0], "style", "opacity"), defaultProperties.opacity, "Standard end value #2 was set.");

			done();
		});
});
